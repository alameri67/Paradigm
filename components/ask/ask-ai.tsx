"use client";

import { GlowButton } from "@/components/ui/glow-controls";
import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { ArrowLeft, History, Plus, Sparkles, SquarePen, Trash2, X } from "lucide-react";
import { AIComposer } from "@/components/ui/ai-composer";
import { withBold } from "@/components/workers/bullets";
import { ASK_MODELS, DEFAULT_MODEL, type AskErrorCode, type AskModelId } from "@/lib/ask/models";
import { useScreen } from "@/lib/ask/screen-store";
import { onPersonaChat } from "@/lib/ask/chat-store";
import { getChats, getServerChats, newChatId, removeChat, setChats, subscribeChats, titleOf, upsertChat, whenOf, type ChatMode, type SavedChat, type SavedMessage } from "@/lib/ask/chat-history";

/** Paradigm's defaults for the composer. */
const PROMPTS = [
  "Why are lineworkers less worried than buyers?",
  "What do the most worried farmers do in AGI by 2028?",
  "Which group matters most for worry here?",
];
/** Starter questions when chatting with the person on the details page. */
const PERSONA_PROMPTS = ["What worries you most about AI?", "What will you do first?", "What would actually help you?"];
const MODELS = ASK_MODELS.map((m) => ({ name: m.name, note: m.note }));
const idOf = (name: string) => ASK_MODELS.find((m) => m.name === name)?.id ?? DEFAULT_MODEL;
const nameOf = (id: AskModelId) => ASK_MODELS.find((m) => m.id === id)!.name;

/** Must match STREAM_ERROR in app/api/ask/route.ts. */
const STREAM_ERROR = "\u001e";

type Message =
  | { id: number; role: "user"; text: string }
  | { id: number; role: "assistant"; text: string; status: "streaming" | "done" | "stopped"; error?: { code: AskErrorCode | "network"; message: string } };

/** An answer as short paragraphs and bullets. Lines starting with "-", "*" or "•" become bullets; **words** go bold. */
function Answer({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  let items: string[] = [];
  let para: string[] = [];
  const flushList = () => {
    if (items.length)
      blocks.push(
        <ul key={blocks.length}>
          {items.map((t, i) => (
            <li key={i}>{withBold(t)}</li>
          ))}
        </ul>,
      );
    items = [];
  };
  const flushPara = () => {
    if (para.length) blocks.push(<p key={blocks.length}>{withBold(para.join(" "))}</p>);
    para = [];
  };
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    const bullet = /^([-*•]|\d+[.)])\s+(.*)$/.exec(line);
    if (bullet) {
      flushPara();
      items.push(bullet[2]);
    } else if (!line) {
      flushPara();
      flushList();
    } else {
      flushList();
      para.push(line.replace(/^#+\s*/, ""));
    }
  }
  flushPara();
  flushList();
  return <>{blocks}</>;
}

/** A message as saved in history, and back. */
function toSaved(m: Message): SavedMessage {
  return m.role === "user"
    ? { role: "user", text: m.text }
    : { role: "assistant", text: m.text, ...(m.status === "stopped" ? { stopped: true } : {}), ...(m.error ? { error: m.error.message, setup: m.error.code === "not_connected" } : {}) };
}
function fromSaved(m: SavedMessage, id: number): Message {
  return m.role === "user"
    ? { id, role: "user", text: m.text }
    : { id, role: "assistant", text: m.text, status: m.stopped ? "stopped" : "done", ...(m.error ? { error: { code: m.setup ? "not_connected" : "upstream", message: m.error } } : {}) };
}

type Intent = "type" | "files";

/**
 * The composer's collapsed white pill, sitting at the top right: black plus and a cycling placeholder.
 * Clicking, focusing or typing in it opens the panel with the composer focused and the words carried over.
 * The plus opens the panel's file picker.
 * On narrow screens, and once the page scrolls, it shrinks to an "Ask AI" button in the liquid glass style
 * of the selected chips on the details page.
 */
function AskBar({
  hidden,
  onOpen,
  restore,
}: {
  hidden: boolean;
  onOpen: (text: string, intent: Intent) => void;
  /** Goes up by one each time the panel closes, to take focus back without reopening. */
  restore: number;
}) {
  const [text, setText] = useState("");
  const [prompt, setPrompt] = useState(0);
  const [narrow, setNarrow] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const iconRef = useRef<HTMLButtonElement>(null);
  const quiet = useRef(false); // focus coming back from the panel shouldn't reopen it
  const iconOnly = narrow || scrolled;

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 560px)");
    const onMq = () => setNarrow(mq.matches);
    const onScroll = () => setScrolled(window.scrollY > 48);
    onMq();
    onScroll();
    mq.addEventListener("change", onMq);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      mq.removeEventListener("change", onMq);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (text || hidden) return;
    const t = setInterval(() => setPrompt((p) => (p + 1) % PROMPTS.length), 3000);
    return () => clearInterval(t);
  }, [text, hidden]);

  useEffect(() => {
    if (!restore) return;
    quiet.current = true;
    (iconOnly ? iconRef.current : inputRef.current)?.focus();
    quiet.current = false;
    // Only when the panel closes, not when the shape changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restore]);

  const open = (t: string, intent: Intent = "type") => {
    onOpen(t, intent);
    setText("");
  };

  return (
    <div className={"ask-bar" + (iconOnly ? " is-icon" : "")} data-hidden={hidden || undefined}>
      {iconOnly ? (
        <GlowButton ref={iconRef} active className="ask-bar-chip" aria-haspopup="dialog" onClick={() => open("")}>
          <Sparkles size={16} strokeWidth={2} aria-hidden="true" />
          Ask AI
        </GlowButton>
      ) : (
        <>
          <button type="button" className="ask-bar-btn ask-bar-plus" aria-label="Ask AI about a file" onClick={() => open("", "files")}>
            <Plus size={18} strokeWidth={2.2} aria-hidden="true" />
          </button>
          <div className="ask-bar-field">
            <input
              ref={inputRef}
              value={text}
              aria-label="Ask AI about this page"
              aria-haspopup="dialog"
              autoComplete="off"
              onChange={(e) => open(e.target.value)}
              onFocus={() => !quiet.current && open(text)}
              onClick={() => open(text)}
            />
            {!text && (
              <div className="ask-bar-ph" aria-hidden="true">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={prompt}
                    initial={{ y: 14, opacity: 0, filter: "blur(6px)" }}
                    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                    exit={{ y: -14, opacity: 0, filter: "blur(6px)" }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {PROMPTS[prompt % PROMPTS.length]}
                  </motion.span>
                </AnimatePresence>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/**
 * The Ask AI bar at the top right, and the panel it opens on the right-hand side.
 * Questions go to /api/ask with the chosen model and the facts the page has published.
 * Chats are saved in this browser: the header starts a new one or opens the list to pick up or delete an old one.
 */
export function AskAI() {
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [model, setModel] = useState<AskModelId>(DEFAULT_MODEL);
  const [messages, setMessages] = useState<Message[]>([]);
  // "ask": questions about the page. "persona": a chat with the person on the details page.
  const [mode, setMode] = useState<ChatMode>("ask");
  // The saved chat on screen (null until its first question), and who a persona chat is with.
  const [chatId, setChatId] = useState<string | null>(null);
  const [chatPerson, setChatPerson] = useState<SavedChat["person"]>();
  const chats = useSyncExternalStore(subscribeChats, getChats, getServerChats);
  const [view, setView] = useState<"chat" | "history">("chat");
  const [confirming, setConfirming] = useState<string | null>(null);
  const screen = useScreen();
  const [draft, setDraft] = useState("");
  const intent = useRef<Intent>("type");
  const [restore, setRestore] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);
  const inFlight = useRef<AbortController | null>(null);
  const wasOpen = useRef(false);
  // Set when a question is asked, so the chat is saved once its answer is in (and not when an old chat is only opened).
  const dirty = useRef(false);

  const close = useCallback(() => setOpen(false), []);
  const person = screen?.page === "details" ? screen.details : undefined;

  /** Clears the conversation. The next question starts a new saved chat. */
  const startNew = useCallback((as: ChatMode, with_?: SavedChat["person"]) => {
    inFlight.current?.abort();
    setMessages([]);
    setChatId(null);
    setMode(as);
    setChatPerson(with_);
    setView("chat");
  }, []);

  // Asking about the page and chatting with a person are separate chats, and so is each person.
  const openWith = useCallback(
    (text: string, how: Intent, as: ChatMode = "ask") => {
      const who = person ? { name: person.name, job: person.job } : undefined;
      if (as !== mode || (as === "persona" && chatPerson && chatPerson.name !== who?.name)) startNew(as, as === "persona" ? who : undefined);
      setDraft(text);
      intent.current = how;
      setOpen(true);
    },
    [mode, chatPerson, person, startNew],
  );

  // The details page's "Chat with …" button.
  useEffect(() => onPersonaChat(() => openWith("", "type", "persona")), [openWith]);

  // Focus: into the message field on open (cursor at the end), back to the bar on close.
  // The bar's plus carries on in the panel: the file picker opens.
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => {
        const root = panelRef.current;
        const input = root?.querySelector<HTMLInputElement>('input[aria-label="Message"]');
        input?.focus();
        input?.setSelectionRange(input.value.length, input.value.length);
        if (intent.current === "files") root?.querySelector<HTMLInputElement>('input[type="file"]')?.click();
        intent.current = "type";
      }, 60);
      wasOpen.current = true;
      return () => clearTimeout(t);
    }
    if (wasOpen.current) setRestore((n) => n + 1);
  }, [open]);

  // Escape closes the delete question, then the chat list, then the panel (the composer closes its model list first).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (panelRef.current?.querySelector('[role="listbox"]')) return;
      if (confirming) return setConfirming(null);
      if (view === "history") return setView("chat");
      close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, confirming, view]);

  // Keep the newest words in view.
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, view]);

  // Save the chat once an answer has finished (or failed, or was stopped).
  useEffect(() => {
    if (!dirty.current || !chatId || !messages.length) return;
    if (messages.some((m) => m.role === "assistant" && m.status === "streaming")) return;
    dirty.current = false;
    const saved = messages.map(toSaved);
    const chat: SavedChat = { id: chatId, mode, ...(chatPerson ? { person: chatPerson } : {}), title: titleOf(saved), updated: Date.now(), messages: saved };
    setChats(upsertChat(getChats(), chat));
  }, [messages, chatId, mode, chatPerson]);

  // Stop any answer still coming in when the page goes away.
  useEffect(() => () => inFlight.current?.abort(), []);

  const openChat = (c: SavedChat) => {
    inFlight.current?.abort();
    dirty.current = false;
    setMessages(c.messages.map((m, i) => fromSaved(m, i)));
    nextId.current = c.messages.length;
    setChatId(c.id);
    setMode(c.mode);
    setChatPerson(c.person);
    setView("chat");
  };

  const deleteChat = (id: string) => {
    setChats(removeChat(getChats(), id));
    setConfirming(null);
    if (id === chatId) startNew(mode, chatPerson);
    setView("history");
  };

  /** A new chat of the same kind: with the person on screen, or about the page when there's no one to talk to. */
  const newChat = () => (mode === "persona" && person ? startNew("persona", { name: person.name, job: person.job }) : startNew("ask"));

  const patch = (id: number, f: (m: Extract<Message, { role: "assistant" }>) => Partial<Extract<Message, { role: "assistant" }>>) =>
    setMessages((ms) => ms.map((m) => (m.id === id && m.role === "assistant" ? { ...m, ...f(m) } : m)));

  // A persona chat continues only while the same person is on screen.
  const chatting = mode === "persona" && !!person && (!chatPerson || chatPerson.name === person.name);
  const away = mode === "persona" && !chatting;
  const first = (chatPerson?.name ?? person?.name ?? "").split(" ")[0];

  const ask = async (question: string) => {
    const q = question.trim();
    if (!q || away) return;
    // A new question stops the answer still coming in.
    inFlight.current?.abort();
    if (!chatId) {
      setChatId(newChatId());
      if (mode === "persona" && person && !chatPerson) setChatPerson({ name: person.name, job: person.job });
    }
    dirty.current = true;
    // The conversation so far: only questions that got an answer with words in it.
    const history: { role: "user" | "assistant"; content: string }[] = [];
    messages.forEach((m, i) => {
      const next = messages[i + 1];
      if (m.role === "user" && next?.role === "assistant" && next.text.trim())
        history.push({ role: "user", content: m.text }, { role: "assistant", content: next.text });
    });
    const userId = nextId.current++;
    const id = nextId.current++;
    setMessages((ms) => [
      ...ms.map((m) => (m.role === "assistant" && m.status === "streaming" ? { ...m, status: "stopped" as const } : m)),
      { id: userId, role: "user", text: q },
      { id, role: "assistant", text: "", status: "streaming" },
    ]);
    const ctrl = new AbortController();
    inFlight.current = ctrl;
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: ctrl.signal,
        body: JSON.stringify({
          question: q,
          model,
          history,
          mode: chatting ? "persona" : "ask",
          screen: screen ?? {
            page: typeof window !== "undefined" && window.location.pathname.startsWith("/details") ? "details" : "summary",
            scenario: { name: "Unknown", when: "", description: "The page was still loading." },
            jobs: [],
          },
        }),
      });
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null);
        const code: AskErrorCode = data?.error?.code ?? "upstream";
        const message =
          code === "not_connected"
            ? "Ask AI isn't connected yet. Add an Anthropic API key to turn it on."
            : (data?.error?.message ?? "Claude couldn't answer just now. Try again in a moment.");
        patch(id, () => ({ status: "done", error: { code, message } }));
        return;
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let text = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        text += dec.decode(value, { stream: true });
        const cut = text.indexOf(STREAM_ERROR);
        patch(id, () => ({ text: cut < 0 ? text : text.slice(0, cut) }));
      }
      const cut = text.indexOf(STREAM_ERROR);
      patch(id, () =>
        cut < 0
          ? { status: "done" }
          : { status: "done", text: text.slice(0, cut), error: { code: "upstream", message: text.slice(cut + 1) } },
      );
    } catch (err) {
      if (ctrl.signal.aborted) return;
      void err;
      patch(id, () => ({
        status: "done",
        error: { code: "network", message: "Couldn't reach Ask AI. Check your connection and try again." },
      }));
    } finally {
      if (inFlight.current === ctrl) inFlight.current = null;
    }
  };

  const where =
    view === "history"
      ? chats.length
        ? `${chats.length} saved in this browser`
        : "Saved in this browser"
      : away && chatPerson
        ? `${chatPerson.name}, ${chatPerson.job.toLowerCase()}`
        : screen?.page === "details"
          ? screen.details
            ? `${screen.details.name}, ${screen.details.job.toLowerCase()} · ${screen.scenario.name}`
            : `Details · ${screen.scenario.name}`
          : screen
            ? `Summary · ${screen.scenario.name}`
            : "Loading what's on screen…";
  const title = view === "history" ? "Chats" : mode === "persona" && first ? `Chat with ${first}` : "Ask AI";

  return (
    <MotionConfig reducedMotion="user">
      <AskBar hidden={open} onOpen={openWith} restore={restore} />

      <AnimatePresence>
        {open && (
          <motion.div
            id="ask-panel"
            ref={panelRef}
            className="ask-panel"
            role="dialog"
            aria-labelledby={titleId}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 40 }}
          >
            <header className="ask-head">
              {view === "history" && (
                <button type="button" className="ask-x" aria-label="Back to the chat" onClick={() => setView("chat")}>
                  <ArrowLeft size={18} strokeWidth={2} />
                </button>
              )}
              <div className="ask-head-text">
                <h2 className="ask-title" id={titleId}>
                  {title}
                </h2>
                <p className="ask-where">{where}</p>
              </div>
              <button type="button" className="ask-x" aria-label="New chat" title="New chat" onClick={newChat}>
                <SquarePen size={18} strokeWidth={2} />
              </button>
              <button
                type="button"
                className={"ask-x" + (view === "history" ? " on" : "")}
                aria-label="Chat history"
                title="Chat history"
                aria-pressed={view === "history"}
                onClick={() => {
                  setConfirming(null);
                  setView((v) => (v === "history" ? "chat" : "history"));
                }}
              >
                <History size={18} strokeWidth={2} />
              </button>
              <button type="button" className="ask-x" aria-label="Close Ask AI" title="Close" onClick={close}>
                <X size={18} strokeWidth={2} />
              </button>
            </header>

            {view === "history" ? (
              <div className="ask-log ask-history">
                {chats.length === 0 ? (
                  <div className="ask-intro">
                    <p>No saved chats yet.</p>
                    <p className="fg2">Each chat is saved here once it gets its first answer. Chats stay in this browser only.</p>
                  </div>
                ) : (
                  <ul className="ask-chats">
                    {chats.map((c) => (
                      <li key={c.id} className={"ask-chat" + (c.id === chatId ? " on" : "")}>
                        {confirming === c.id ? (
                          <div className="ask-chat-confirm" role="group" aria-label={`Delete “${c.title}”?`}>
                            <span>Delete this chat?</span>
                            <button type="button" className="ask-chat-del-yes" onClick={() => deleteChat(c.id)} autoFocus>
                              Delete
                            </button>
                            <button type="button" className="ask-chat-del-no" onClick={() => setConfirming(null)}>
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <>
                            <button type="button" className="ask-chat-open" onClick={() => openChat(c)}>
                              <span className="ask-chat-title">{c.title}</span>
                              <span className="ask-chat-meta">
                                {c.mode === "persona" && c.person ? `Chat with ${c.person.name.split(" ")[0]}` : "Ask AI"} · {whenOf(c.updated)}
                              </span>
                            </button>
                            <button type="button" className="ask-chat-del" aria-label={`Delete “${c.title}”`} title="Delete" onClick={() => setConfirming(c.id)}>
                              <Trash2 size={16} strokeWidth={2} />
                            </button>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <div className="ask-log" ref={logRef} aria-live="polite" aria-busy={messages.some((m) => m.role === "assistant" && m.status === "streaming")}>
                {messages.length === 0 ? (
                  chatting && person ? (
                    <div className="ask-intro">
                      <p>
                        You&apos;re talking with {person.name}, {person.job.toLowerCase()}, about {screen?.scenario.name}. {first} answers from
                        their own interview.
                      </p>
                      <p className="fg2">
                        {first} is made up: a simulated person, played by an AI model. Change the scenario on the page and {first} talks about that
                        one instead.
                      </p>
                    </div>
                  ) : (
                    <div className="ask-intro">
                      <p>Ask about what you&apos;re looking at. Answers come only from what this page shows.</p>
                      <p className="fg2">Everyone here is simulated, so answers describe made-up people, not survey data. Attached files don&apos;t change answers yet.</p>
                    </div>
                  )
                ) : (
                  messages.map((m) =>
                    m.role === "user" ? (
                      <div key={m.id} className="ask-q">
                        <span className="ask-sr">You asked: </span>
                        {m.text}
                      </div>
                    ) : (
                      <div key={m.id} className="ask-a">
                        <span className="ask-sr">{mode === "persona" ? `${first}: ` : "Answer: "}</span>
                        {m.text ? <Answer text={m.text} /> : null}
                        {m.status === "streaming" && !m.text && (
                          <p className="ask-thinking" role="status">
                            Thinking…
                          </p>
                        )}
                        {m.status === "stopped" && <p className="ask-note">Stopped.</p>}
                        {m.error && <p className={"ask-note" + (m.error.code === "not_connected" ? " ask-note-setup" : " ask-note-err")}>{m.error.message}</p>}
                      </div>
                    ),
                  )
                )}
              </div>
            )}

            {view === "chat" &&
              (away ? (
                <div className="ask-away">
                  <p>
                    {first} isn&apos;t on screen now. Open {first}&apos;s details page to carry on this chat, or start a new one.
                  </p>
                  <GlowButton size="sm" onClick={newChat}>
                    <SquarePen size={14} strokeWidth={2} aria-hidden="true" />
                    New chat
                  </GlowButton>
                </div>
              ) : (
                <div className="ask-foot">
                  <AIComposer
                    key={chatId ?? "new"}
                    variant="panel"
                    extras={false}
                    prompts={chatting ? PERSONA_PROMPTS : PROMPTS}
                    models={MODELS}
                    defaultText={draft}
                    model={nameOf(model)}
                    onModelChange={(name) => setModel(idOf(name))}
                    onSubmit={(text) => void ask(text)}
                  />
                </div>
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
