import { describe, expect, it } from "vitest";
import { MAX_CHATS, removeChat, titleOf, upsertChat, whenOf, type SavedChat } from "./chat-history";

const chat = (id: string, updated = 0): SavedChat => ({ id, mode: "ask", title: id, updated, messages: [] });

describe("chat history", () => {
  it("titles a chat by its first question, cut short", () => {
    expect(titleOf([])).toBe("New chat");
    expect(titleOf([{ role: "user", text: "  Why are\nfarmers calm?  " }])).toBe("Why are farmers calm?");
    const long = titleOf([{ role: "user", text: "x".repeat(100) }]);
    expect(long.length).toBeLessThanOrEqual(58);
    expect(long.endsWith("…")).toBe(true);
  });

  it("puts the updated chat first without duplicating it", () => {
    const list = upsertChat([chat("a"), chat("b")], chat("b", 5));
    expect(list.map((c) => c.id)).toEqual(["b", "a"]);
    expect(list[0].updated).toBe(5);
  });

  it("keeps at most MAX_CHATS", () => {
    const many = Array.from({ length: MAX_CHATS }, (_, i) => chat(String(i)));
    expect(upsertChat(many, chat("new"))).toHaveLength(MAX_CHATS);
    expect(upsertChat(many, chat("new"))[0].id).toBe("new");
  });

  it("deletes by id", () => {
    expect(removeChat([chat("a"), chat("b")], "a").map((c) => c.id)).toEqual(["b"]);
  });

  it("says when, in words", () => {
    const now = 1_700_000_000_000;
    expect(whenOf(now - 10_000, now)).toBe("Just now");
    expect(whenOf(now - 5 * 60_000, now)).toBe("5 min ago");
    expect(whenOf(now - 3 * 3_600_000, now)).toBe("3 h ago");
    expect(whenOf(now - 30 * 3_600_000, now)).toBe("Yesterday");
  });
});
