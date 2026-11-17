/**
 * AI Composer. Designed & built by Aakash Mehra.
 *
 * A white pill to talk to an assistant. Hover or focus it and it opens into a rectangle: the
 * message gets the top row, and the bottom row holds the black plus (attach files, shown as
 * chips), the model you're talking to (the arrow opens a popover to switch), Search and Research
 * toggles, and the black circle on the right. That circle is a microphone until there's something to send, then an
 * arrow. The placeholder cycles through things you might ask, each one rising out of a blur.
 *
 * The mic is a demo: it listens for a moment, then "dictates" a message by typing it out.
 * Enter sends; Escape closes the model list, stops dictation and leaves the field. Behind it, soft
 * pink and blue brush strokes drift about.
 */
"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import {
  AnimatePresence,
  LayoutGroup,
  MotionConfig,
  motion,
} from "motion/react";
import {
  ArrowUp,
  Check,
  ChevronUp,
  FileText,
  Globe,
  Mic,
  Plus,
  Square,
  Telescope,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type AIComposerModel = { name: string; note: string };

export type AIComposerProps = {
  /** Example asks the placeholder cycles through. */
  prompts?: string[];
  models?: AIComposerModel[];
  /** What the mic "hears". */
  dictation?: string[];
  onSubmit?: (
    message: string,
    files: File[],
    options: { model: string; search: boolean; research: boolean },
  ) => void;
  className?: string;
};

const PROMPTS = [
  "Tell me what's in my mail today",
  "Summarize my meetings for tomorrow",
  "Draft a reply to Maya about Friday",
  "What did I spend on food this month?",
  "Plan a slow weekend in Kyoto",
];

const MODELS: AIComposerModel[] = [
  { name: "GPT-5", note: "Smart and fast for most things" },
  { name: "GPT-5 Thinking", note: "Thinks longer for harder asks" },
  { name: "GPT-5 mini", note: "Quick everyday answers" },
  { name: "GPT-4o", note: "Great with images and voice" },
];

const DICTATION = [
  "Can you check if Maya replied about dinner on Friday?",
  "Remind me to send the invoice to Leo before noon.",
  "What's the weather like in Lisbon this weekend?",
];

type Attachment = { id: number; file: File; url?: string };

const SPRING = { type: "spring", stiffness: 420, damping: 34 } as const;

export function AIComposer({
  prompts = PROMPTS,
  models = MODELS,
  dictation = DICTATION,
  onSubmit,
  className,
}: AIComposerProps) {
  const inputRef = useRef(null as HTMLInputElement | null);
  const fileRef = useRef(null as HTMLInputElement | null);
  const typing = useRef(0); // dictation timer
  const said = useRef(0); // which dictation line is next
  const nextId = useRef(0);

  const [text, setText] = useState("");
  const [files, setFiles] = useState([] as Attachment[]);
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const [listening, setListening] = useState(false);
  const [prompt, setPrompt] = useState(0);
  const [model, setModel] = useState(models[0]?.name ?? "");
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [research, setResearch] = useState(false);
  const [sent, setSent] = useState(null as null | { id: number; text: string });

  const hasText = text.trim().length > 0;
  const big =
    hover || focus || listening || menu || hasText || files.length > 0;

  // Cycle the placeholder while the field is empty.
  useEffect(() => {
    if (hasText || listening) return;
    const t = setInterval(
      () => setPrompt((p) => (p + 1) % prompts.length),
      3000,
    );
    return () => clearInterval(t);
  }, [hasText, listening, prompts.length]);

  useEffect(() => () => clearTimeout(typing.current), []);

  // Free image previews when they go away.
  const urls = useRef(new Set() as Set<string>);
  useEffect(() => {
    const all = urls.current;
    return () => all.forEach((u) => URL.revokeObjectURL(u));
  }, []);

  const addFiles = (e: ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []).map((file) => {
      const url = file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : undefined;
      if (url) urls.current.add(url);
      return { id: nextId.current++, file, url };
    });
    setFiles((f) => [...f, ...picked]);
    e.target.value = "";
    inputRef.current?.focus();
  };

  const removeFile = (id: number) =>
    setFiles((f) => {
      const gone = f.find((a) => a.id === id);
      if (gone?.url) {
        URL.revokeObjectURL(gone.url);
        urls.current.delete(gone.url);
      }
      return f.filter((a) => a.id !== id);
    });

  const stopListening = () => {
    clearTimeout(typing.current);
    setListening(false);
  };

  /** Demo dictation: listen for a beat, then type a line out like speech coming in. */
  const startListening = () => {
    setListening(true);
    const line = dictation[said.current++ % dictation.length];
    const base = text.trim() ? text.trimEnd() + " " : "";
    let i = 0;
    const tick = () => {
      i += 1;
      setText(base + line.slice(0, i));
      if (i < line.length) {
        // words arrive in little bursts, with a breath at spaces and commas
        const ch = line[i - 1];
        typing.current = window.setTimeout(
          tick,
          ch === " "
            ? 70 + Math.random() * 90
            : ch === ","
              ? 220
              : 22 + Math.random() * 30,
        );
      } else typing.current = window.setTimeout(() => setListening(false), 450);
    };
    typing.current = window.setTimeout(tick, 900);
  };

  const send = (e?: FormEvent) => {
    e?.preventDefault();
    if (!hasText && !files.length) return;
    if (listening) stopListening();
    onSubmit?.(
      text.trim(),
      files.map((a) => a.file),
      { model, search, research },
    );
    setSent({
      id: nextId.current++,
      text: text.trim() || `${files.length} file${files.length > 1 ? "s" : ""}`,
    });
    setText("");
    files.forEach((a) => a.url && URL.revokeObjectURL(a.url));
    setFiles([]);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== "Escape") return;
    if (menu) return setMenu(false);
    if (listening) stopListening();
    inputRef.current?.blur();
  };

  const action = listening ? "stop" : hasText || files.length ? "send" : "mic";
  const btn = 40;

  return (
    <MotionConfig reducedMotion="user">
      <div
        className={cn(
          "relative flex min-h-dvh w-full items-center justify-center px-4 font-sans text-[#111]",
          className,
        )}
        style={{ background: "#f7f5f8" }}
        onKeyDown={onKeyDown}
      >
        <Brushwork />
        {menu && (
          <div className="fixed inset-0 z-10" onClick={() => setMenu(false)} />
        )}

        <form
          onSubmit={send}
          className="relative z-20"
          style={{
            width: big ? "min(94vw, 660px)" : "min(92vw, 560px)",
          }}
        >
          {/* the last thing sent drifts up and away */}
          <AnimatePresence>
            {sent && (
              <motion.p
                key={sent.id}
                initial={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                animate={{ opacity: 0, y: -80, filter: "blur(6px)" }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                onAnimationComplete={() => setSent(null)}
                className="pointer-events-none absolute top-5 left-5 max-w-[80%] truncate text-[17px]"
              >
                {sent.text}
              </motion.p>
            )}
          </AnimatePresence>

          <LayoutGroup>
            <motion.div
              layout
              transition={SPRING}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              onClick={() => inputRef.current?.focus()}
              className="relative cursor-text bg-white"
              style={{
                borderRadius: big ? 26 : 30,
                padding: big ? 12 : 8,
                boxShadow: big
                  ? "0 0 0 1px rgb(0 0 0 / 0.05), 0 2px 4px rgb(0 0 0 / 0.04), 0 28px 56px -18px rgb(0 0 0 / 0.24)"
                  : "0 0 0 1px rgb(0 0 0 / 0.05), 0 1px 2px rgb(0 0 0 / 0.04), 0 12px 28px -12px rgb(0 0 0 / 0.16)",
                transition: "box-shadow .5s ease",
              }}
            >
              {/* attachments */}
              <AnimatePresence initial={false}>
                {files.length > 0 && (
                  <motion.ul
                    layout="position"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-wrap gap-2 px-1 pb-2"
                  >
                    <AnimatePresence initial={false}>
                      {files.map((a) => (
                        <motion.li
                          key={a.id}
                          layout
                          initial={{
                            opacity: 0,
                            scale: 0.85,
                            filter: "blur(4px)",
                          }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                            filter: "blur(0px)",
                          }}
                          exit={{
                            opacity: 0,
                            scale: 0.85,
                            filter: "blur(4px)",
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                          className="flex h-11 max-w-[220px] items-center gap-2.5 rounded-2xl bg-[#f3f3f1] pr-2 pl-1.5"
                        >
                          {a.url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={a.url}
                              alt=""
                              className="size-8 rounded-[10px] object-cover"
                            />
                          ) : (
                            <span className="grid size-8 place-items-center rounded-[10px] bg-white">
                              <FileText className="size-4 text-[#555]" />
                            </span>
                          )}
                          <span className="min-w-0 leading-tight">
                            <span className="block truncate text-[13px] font-medium">
                              {a.file.name}
                            </span>
                            <span className="block text-[11px] text-[#888]">
                              {size(a.file.size)}
                            </span>
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile(a.id);
                            }}
                            aria-label={`Remove ${a.file.name}`}
                            className="grid size-6 shrink-0 cursor-pointer place-items-center rounded-full text-[#888] transition-colors hover:bg-white hover:text-[#111]"
                          >
                            <X className="size-3.5" />
                          </button>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </motion.ul>
                )}
              </AnimatePresence>

              {/* Same elements in both shapes; only the grid changes, so the field never loses focus. */}
              <div
                className="grid items-center gap-x-2"
                style={{
                  gridTemplateColumns: "auto auto auto 1fr auto",
                  gridTemplateAreas: big
                    ? '"input input input input input" "plus model tools . action"'
                    : '"plus input input input action"',
                  rowGap: big ? 10 : 0,
                }}
              >
                {/* message, with the cycling placeholder behind it */}
                <motion.div
                  layout="position"
                  transition={SPRING}
                  className="relative min-w-0"
                  style={{ gridArea: "input" }}
                >
                  <input
                    ref={inputRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onFocus={() => setFocus(true)}
                    onBlur={() => setFocus(false)}
                    aria-label="Message"
                    autoComplete="off"
                    className="relative z-10 h-10 w-full bg-transparent px-2 text-[16px] outline-none"
                  />
                  {!text && (
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-y-0 right-0 left-2 flex items-center overflow-hidden"
                    >
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                          key={listening ? "listening" : prompt}
                          initial={{ y: 16, opacity: 0, filter: "blur(6px)" }}
                          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                          exit={{ y: -16, opacity: 0, filter: "blur(6px)" }}
                          transition={{
                            duration: 0.55,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="truncate text-[16px] text-[#9a9a96]"
                        >
                          {listening
                            ? "Listening…"
                            : prompts[prompt % prompts.length]}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                  )}
                </motion.div>

                {/* attach */}
                {/* the wrapper animates; the button only does its press, so the two never fight */}
                <motion.div
                  layout="position"
                  transition={SPRING}
                  style={{ gridArea: "plus" }}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileRef.current?.click();
                    }}
                    aria-label="Add files"
                    className="grid shrink-0 cursor-pointer place-items-center rounded-full bg-[#111] text-white transition-transform duration-200 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111]"
                    style={{ width: btn, height: btn }}
                  >
                    <Plus className="size-5" strokeWidth={2.2} />
                  </button>
                </motion.div>
                <input
                  ref={fileRef}
                  type="file"
                  multiple
                  hidden
                  onChange={addFiles}
                />

                {/* model: always mounted; when the pill is closed it's hidden and out of the grid */}
                <motion.div
                  layout="position"
                  initial={false}
                  animate={
                    big
                      ? { opacity: 1, x: 0, filter: "blur(0px)" }
                      : { opacity: 0, x: -6, filter: "blur(4px)" }
                  }
                  transition={
                    big
                      ? {
                          duration: 0.35,
                          delay: 0.08,
                          ease: [0.22, 1, 0.36, 1],
                        }
                      : { duration: 0.1 }
                  }
                  inert={!big}
                  className={cn(
                    "relative",
                    !big && "pointer-events-none absolute",
                  )}
                  style={{ gridArea: big ? "model" : undefined }}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenu((m) => !m);
                    }}
                    aria-haspopup="listbox"
                    aria-expanded={menu}
                    className="flex h-10 cursor-pointer items-center gap-1.5 rounded-full px-3 text-[14px] font-medium text-[#333] transition-colors hover:bg-[#f3f3f1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111]"
                  >
                    {model}
                    <motion.span
                      animate={{ rotate: menu ? 180 : 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                      className="grid"
                    >
                      <ChevronUp
                        className="size-4 text-[#888]"
                        strokeWidth={2.4}
                      />
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {menu && (
                      <motion.ul
                        role="listbox"
                        aria-label="Model"
                        initial={{
                          opacity: 0,
                          y: 8,
                          scale: 0.96,
                          filter: "blur(6px)",
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          filter: "blur(0px)",
                        }}
                        exit={{
                          opacity: 0,
                          y: 8,
                          scale: 0.96,
                          filter: "blur(6px)",
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 520,
                          damping: 34,
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="absolute bottom-full left-0 z-30 mb-3 w-[272px] origin-bottom-left rounded-[20px] bg-white p-1.5 shadow-[0_0_0_1px_rgb(0_0_0/0.06),0_24px_48px_-16px_rgb(0_0_0/0.3)]"
                      >
                        {models.map((m, i) => (
                          <motion.li
                            key={m.name}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.03 * i }}
                          >
                            <button
                              type="button"
                              role="option"
                              aria-selected={m.name === model}
                              onClick={() => {
                                setModel(m.name);
                                setMenu(false);
                                inputRef.current?.focus();
                              }}
                              className="flex w-full cursor-pointer items-center gap-3 rounded-[14px] px-3 py-2.5 text-left transition-colors hover:bg-[#f3f3f1] focus-visible:bg-[#f3f3f1] focus-visible:outline-none"
                            >
                              <span className="min-w-0 flex-1">
                                <span className="block text-[14px] font-medium">
                                  {m.name}
                                </span>
                                <span className="block text-[12px] text-[#888]">
                                  {m.note}
                                </span>
                              </span>
                              {m.name === model && (
                                <Check
                                  className="size-4 shrink-0"
                                  strokeWidth={2.4}
                                />
                              )}
                            </button>
                          </motion.li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* search + research toggles: mounted always, hidden while it's a pill */}
                <motion.div
                  layout="position"
                  initial={false}
                  animate={
                    big
                      ? { opacity: 1, x: 0, filter: "blur(0px)" }
                      : { opacity: 0, x: -6, filter: "blur(4px)" }
                  }
                  transition={
                    big
                      ? {
                          duration: 0.35,
                          delay: 0.12,
                          ease: [0.22, 1, 0.36, 1],
                        }
                      : { duration: 0.1 }
                  }
                  inert={!big}
                  className={cn(
                    "flex items-center gap-1.5",
                    !big && "pointer-events-none absolute",
                  )}
                  style={{ gridArea: big ? "tools" : undefined }}
                >
                  {(
                    [
                      ["search", "Search", Globe, search, setSearch],
                      [
                        "research",
                        "Research",
                        Telescope,
                        research,
                        setResearch,
                      ],
                    ] as const
                  ).map(([key, label, Icon, on, set]) => (
                    <button
                      key={key}
                      type="button"
                      aria-pressed={on}
                      onClick={(e) => {
                        e.stopPropagation();
                        set(!on);
                      }}
                      className={cn(
                        "flex h-9 cursor-pointer items-center gap-1.5 rounded-full px-3 text-[13px] font-medium transition-[background-color,color,box-shadow] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111]",
                        on
                          ? "bg-[#111] text-white"
                          : "text-[#444] shadow-[inset_0_0_0_1px_rgb(0_0_0/0.1)] hover:bg-[#f3f3f1]",
                      )}
                    >
                      <Icon className="size-4" strokeWidth={2} />
                      <span className="hidden sm:inline">{label}</span>
                    </button>
                  ))}
                </motion.div>

                {/* mic, stop or send */}
                <motion.div
                  layout="position"
                  transition={SPRING}
                  className="flex items-center gap-2.5 justify-self-end"
                  style={{ gridArea: "action" }}
                >
                  <AnimatePresence>
                    {listening && big && <Bars />}
                  </AnimatePresence>
                  <button
                    type={action === "send" ? "submit" : "button"}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (action === "stop") stopListening();
                      else if (action === "mic") startListening();
                    }}
                    aria-label={
                      action === "send"
                        ? "Send"
                        : action === "stop"
                          ? "Stop dictation"
                          : "Voice input"
                    }
                    className="relative grid shrink-0 cursor-pointer place-items-center rounded-full bg-[#111] text-white transition-transform duration-200 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111]"
                    style={{ width: btn, height: btn }}
                  >
                    {listening && (
                      <motion.span
                        aria-hidden
                        className="absolute inset-0 rounded-full bg-[#111]"
                        animate={{ scale: [1, 1.5], opacity: [0.35, 0] }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          ease: "easeOut",
                        }}
                      />
                    )}
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        key={action}
                        initial={{
                          opacity: 0,
                          scale: 0.4,
                          rotate: -45,
                          filter: "blur(4px)",
                        }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          rotate: 0,
                          filter: "blur(0px)",
                        }}
                        exit={{
                          opacity: 0,
                          scale: 0.4,
                          rotate: 45,
                          filter: "blur(4px)",
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 520,
                          damping: 28,
                        }}
                        className="relative grid place-items-center"
                      >
                        {action === "send" ? (
                          <ArrowUp className="size-5" strokeWidth={2.4} />
                        ) : action === "stop" ? (
                          <Square className="size-3.5 fill-current" />
                        ) : (
                          <Mic className="size-5" strokeWidth={2.2} />
                        )}
                      </motion.span>
                    </AnimatePresence>
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </LayoutGroup>
        </form>
      </div>
    </MotionConfig>
  );
}

/* Soft brush strokes: big blurred sweeps, then a few sharper lines on top so it reads as paint. */
const STROKES = [
  {
    d: "M10 90 C 110 20, 240 140, 390 60",
    c: "#ff9ec6",
    sw: 70,
    blur: 44,
    op: 0.6,
    x: "-12%",
    y: "6%",
    w: "72vw",
    r: -12,
    dx: 40,
    dy: 20,
    dr: 6,
    t: 24,
  },
  {
    d: "M10 50 C 140 120, 250 0, 390 80",
    c: "#8fc3ff",
    sw: 80,
    blur: 48,
    op: 0.55,
    x: "40%",
    y: "-4%",
    w: "70vw",
    r: 18,
    dx: -50,
    dy: 30,
    dr: -8,
    t: 28,
  },
  {
    d: "M10 80 C 120 0, 280 130, 390 40",
    c: "#c5b4ff",
    sw: 60,
    blur: 46,
    op: 0.45,
    x: "-6%",
    y: "58%",
    w: "64vw",
    r: 10,
    dx: 60,
    dy: -24,
    dr: 7,
    t: 30,
  },
  {
    d: "M10 40 C 150 130, 250 10, 390 100",
    c: "#ffb7d6",
    sw: 70,
    blur: 42,
    op: 0.55,
    x: "48%",
    y: "62%",
    w: "62vw",
    r: -16,
    dx: -40,
    dy: -30,
    dr: -6,
    t: 26,
  },
  {
    d: "M10 70 C 130 10, 260 120, 390 50",
    c: "#a8d4ff",
    sw: 50,
    blur: 40,
    op: 0.5,
    x: "18%",
    y: "34%",
    w: "56vw",
    r: -4,
    dx: 30,
    dy: 26,
    dr: 5,
    t: 34,
  },
  {
    d: "M10 60 C 120 110, 270 10, 390 70",
    c: "#ff8fbd",
    sw: 14,
    blur: 9,
    op: 0.45,
    x: "6%",
    y: "22%",
    w: "50vw",
    r: -20,
    dx: 50,
    dy: 14,
    dr: 8,
    t: 22,
  },
  {
    d: "M10 70 C 140 0, 260 130, 390 40",
    c: "#7db6ff",
    sw: 12,
    blur: 8,
    op: 0.45,
    x: "52%",
    y: "18%",
    w: "44vw",
    r: 22,
    dx: -36,
    dy: 24,
    dr: -7,
    t: 25,
  },
  {
    d: "M10 50 C 130 120, 250 0, 390 90",
    c: "#b9a6ff",
    sw: 10,
    blur: 7,
    op: 0.4,
    x: "30%",
    y: "74%",
    w: "46vw",
    r: -8,
    dx: 40,
    dy: -18,
    dr: 6,
    t: 27,
  },
  {
    d: "M10 80 C 150 20, 240 120, 390 30",
    c: "#ffa6cb",
    sw: 9,
    blur: 7,
    op: 0.4,
    x: "62%",
    y: "48%",
    w: "36vw",
    r: 14,
    dx: -30,
    dy: -20,
    dr: -5,
    t: 23,
  },
];

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

function Brushwork() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {STROKES.map((s, i) => (
        // each stroke is its own blurred layer, so drifting it is just a cheap transform
        <motion.div
          key={i}
          className="absolute will-change-transform"
          style={{
            left: s.x,
            top: s.y,
            width: s.w,
            opacity: s.op,
            filter: `blur(${s.blur}px)`,
          }}
          initial={{ rotate: s.r }}
          animate={{
            x: [0, s.dx, 0],
            y: [0, s.dy, 0],
            rotate: [s.r, s.r + s.dr, s.r],
          }}
          transition={{ duration: s.t, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg
            viewBox="0 0 400 140"
            className="block h-auto w-full overflow-visible"
          >
            <path
              d={s.d}
              fill="none"
              stroke={s.c}
              strokeWidth={s.sw}
              strokeLinecap="round"
            />
          </svg>
        </motion.div>
      ))}
      <div
        className="absolute inset-0 opacity-[0.22] mix-blend-soft-light"
        style={{ backgroundImage: GRAIN }}
      />
    </div>
  );
}

/** Voice bars beside the mic while it "listens". */
function Bars() {
  const bars = [0.5, 0.9, 0.6, 1, 0.7, 0.45, 0.85, 0.55];
  return (
    <motion.span
      aria-hidden
      className="flex h-6 items-center gap-[3px]"
      initial={{ opacity: 0, x: 6, filter: "blur(4px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, x: 6, filter: "blur(4px)" }}
    >
      {bars.map((h, i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full bg-[#111]"
          style={{ height: 20 }}
          animate={{ scaleY: [0.2, h, 0.3, h * 0.7, 0.2] }}
          transition={{
            duration: 0.9 + (i % 4) * 0.15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.05,
          }}
        />
      ))}
    </motion.span>
  );
}

const size = (b: number) =>
  b < 1024
    ? `${b} B`
    : b < 1048576
      ? `${Math.round(b / 1024)} KB`
      : `${(b / 1048576).toFixed(1)} MB`;
