/**
 * Saved Ask AI chats. They live in this browser only (localStorage), newest first.
 * The pure helpers are tested in chat-history.test.ts; load and save never throw.
 */

export type ChatMode = "ask" | "persona";

export type SavedMessage =
  | { role: "user"; text: string }
  | { role: "assistant"; text: string; stopped?: boolean; error?: string; setup?: boolean };

export interface SavedChat {
  id: string;
  /** "ask": questions about the page. "persona": a chat with the person on the details page. */
  mode: ChatMode;
  /** Who the chat was with, for persona chats. */
  person?: { name: string; job: string };
  title: string;
  /** Milliseconds since 1970, last time a message was added. */
  updated: number;
  messages: SavedMessage[];
}

const KEY = "paradigm.ask.chats.v1";
/** Older chats beyond this are dropped, so storage stays small. */
export const MAX_CHATS = 50;

export function newChatId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `c${Date.now()}${Math.random().toString(36).slice(2)}`;
}

/** The first question, on one line and cut to about 60 characters. */
export function titleOf(messages: SavedMessage[]) {
  const first = messages.find((m) => m.role === "user")?.text.replace(/\s+/g, " ").trim() ?? "";
  if (!first) return "New chat";
  return first.length > 60 ? first.slice(0, 57).trimEnd() + "…" : first;
}

/** Puts `chat` first, replacing any older copy with the same id, and keeps at most MAX_CHATS. */
export function upsertChat(chats: SavedChat[], chat: SavedChat): SavedChat[] {
  return [chat, ...chats.filter((c) => c.id !== chat.id)].slice(0, MAX_CHATS);
}

export function removeChat(chats: SavedChat[], id: string): SavedChat[] {
  return chats.filter((c) => c.id !== id);
}

/** "Just now", "5 min ago", "3 h ago", "Yesterday", or a date like "12 Nov". */
export function whenOf(updated: number, now = Date.now()) {
  const mins = Math.floor((now - updated) / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} h ago`;
  if (hours < 48) return "Yesterday";
  return new Date(updated).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function isChat(x: unknown): x is SavedChat {
  const c = x as SavedChat;
  return !!c && typeof c.id === "string" && (c.mode === "ask" || c.mode === "persona") && typeof c.title === "string" && typeof c.updated === "number" && Array.isArray(c.messages);
}

export function loadChats(): SavedChat[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    const list = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(list) ? list.filter(isChat).sort((a, b) => b.updated - a.updated) : [];
  } catch {
    return [];
  }
}

export function saveChats(chats: SavedChat[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(chats));
  } catch {
    // Private mode or full storage: chats just don't persist.
  }
}

/* ---------- A tiny store over localStorage, for useSyncExternalStore ---------- */

const EMPTY: SavedChat[] = [];
let cache: SavedChat[] | null = null;
const listeners = new Set<() => void>();

/** The saved chats, read once from storage and then kept in memory. */
export function getChats(): SavedChat[] {
  if (typeof window === "undefined") return EMPTY;
  cache ??= loadChats();
  return cache;
}

/** What the server renders: no chats, so the first browser render matches it. */
export const getServerChats = () => EMPTY;

/** Replaces the saved chats, writes them to storage and tells every subscriber. */
export function setChats(next: SavedChat[]) {
  cache = next;
  saveChats(next);
  listeners.forEach((l) => l());
}

export function subscribeChats(l: () => void) {
  listeners.add(l);
  // Another tab changed them: read again.
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return;
    cache = loadChats();
    l();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
}
