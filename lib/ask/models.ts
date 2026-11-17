/** The Ask AI models and error codes. No dependencies, so the client can import it. */

/** The models in the panel's picker. The name is what people see; the id goes to the API. */
export const ASK_MODELS = [
  { id: "claude-opus-5-5", name: "Claude Opus 5.5", note: "Most capable, for hard questions" },
  { id: "claude-sonnet-5-5", name: "Claude Sonnet 5.5", note: "Fast and smart, good default" },
  { id: "claude-haiku-5-5", name: "Claude Haiku 5.5", note: "Quickest answers" },
] as const;
export type AskModelId = (typeof ASK_MODELS)[number]["id"];
export const DEFAULT_MODEL: AskModelId = "claude-sonnet-5-5";

/** Error codes the route sends back, so the panel can say something useful. */
export type AskErrorCode = "not_connected" | "bad_key" | "bad_request" | "rate_limited" | "upstream";
