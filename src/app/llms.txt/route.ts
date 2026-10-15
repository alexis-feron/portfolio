import { buildLlmsTxt } from "@/lib/agents/llms";

// Built from local content only, so it is rendered once at build time.
export const dynamic = "force-static";

export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
