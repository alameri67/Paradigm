import Anthropic from "@anthropic-ai/sdk";
import type { AskErrorCode } from "@/lib/ask/models";
import { PERSONA_PROMPT, SYSTEM_PROMPT, userTurn } from "@/lib/ask/prompt";
import { AskRequestSchema } from "@/lib/ask/schema";

/** Marks the start of an error that happens after the answer has begun streaming. The panel strips it. */
const STREAM_ERROR = "\u001e";

function fail(code: AskErrorCode, status: number, message: string) {
  return Response.json({ error: { code, message } }, { status });
}

function failFrom(err: unknown) {
  if (err instanceof Anthropic.AuthenticationError || err instanceof Anthropic.PermissionDeniedError)
    return fail("bad_key", 502, "The Anthropic API key was turned down. Check that it's right and still active.");
  if (err instanceof Anthropic.RateLimitError) return fail("rate_limited", 429, "Too many questions at once. Wait a moment and try again.");
  if (err instanceof Anthropic.BadRequestError) return fail("bad_request", 400, "The question couldn't be sent. Try asking it a different way.");
  if (err instanceof Anthropic.APIError) return fail("upstream", 502, "Claude couldn't answer just now. Try again in a moment.");
  return fail("upstream", 502, "Claude couldn't answer just now. Try again in a moment.");
}

/**
 * POST /api/ask: answers a question about what's on screen, streamed back as plain text.
 * The key comes only from ANTHROPIC_API_KEY. Without it, this says so and answers nothing.
 */
export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return fail("not_connected", 503, "Ask AI isn't connected yet. Add an Anthropic API key to turn it on.");
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("bad_request", 400, "The question couldn't be read.");
  }
  const parsed = AskRequestSchema.safeParse(body);
  if (!parsed.success) return fail("bad_request", 400, "The question couldn't be read.");
  const { question, model, history, screen, mode } = parsed.data;
  const persona = mode === "persona" && !!screen.details;

  const client = new Anthropic({ apiKey });
  const stream = client.beta.messages.stream(
    {
      model,
      max_tokens: 16000,
      system: [{ type: "text", text: persona ? PERSONA_PROMPT : SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
      messages: [...history, { role: "user", content: userTurn(screen, question) }],
      // Short answers from facts already on screen: Opus gets a bit more room to think.
      output_config: { effort: model === "claude-opus-5-5" ? "medium" : "low" },
      // If a model declines for policy reasons, let the API retry on its default fallback.
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
    },
    { signal: req.signal },
  );

  // Wait for the first event, so a bad key or a rate limit comes back as a proper error, not a broken stream.
  const events = stream[Symbol.asyncIterator]();
  let first: Awaited<ReturnType<typeof events.next>>;
  try {
    first = await events.next();
  } catch (err) {
    return failFrom(err);
  }

  const enc = new TextEncoder();
  let pending: typeof first | null = first;
  let wrote = false;
  const body$ = new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        for (;;) {
          const r = pending ?? (await events.next());
          pending = null;
          if (r.done) {
            const msg = await stream.finalMessage();
            if (msg.stop_reason === "refusal") {
              controller.enqueue(enc.encode(`${STREAM_ERROR}${wrote ? "The answer stopped partway." : "Claude can't help with that one. Try asking it another way."}`));
            } else if (msg.stop_reason === "max_tokens") {
              controller.enqueue(enc.encode(`${STREAM_ERROR}The answer ran long and was cut off.`));
            }
            controller.close();
            return;
          }
          const ev = r.value;
          if (ev.type === "content_block_delta" && ev.delta.type === "text_delta" && ev.delta.text) {
            controller.enqueue(enc.encode(ev.delta.text));
            wrote = true;
            return;
          }
        }
      } catch {
        controller.enqueue(enc.encode(`${STREAM_ERROR}The answer stopped partway. Try again.`));
        controller.close();
      }
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(body$, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", "X-Accel-Buffering": "no" },
  });
}
