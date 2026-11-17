"use client";

/**
 * Lets a page open the Ask AI panel in "chat with this person" mode. The details page calls
 * openPersonaChat(); the panel listens with onPersonaChat(). No provider needed.
 */
const listeners = new Set<() => void>();

export function openPersonaChat() {
  listeners.forEach((l) => l());
}

/** Call `l` whenever a page asks to chat with the person on screen. Returns the unsubscribe. */
export function onPersonaChat(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}
