// Deprecated 2026-08-10: LinkedIn tooling removed from the MCP server and
// GitHub Actions scheduler. This route is intentionally left inert.
// Safe to delete this file (and the corresponding cron/route.ts) once ready.

export async function GET(): Promise<Response> {
  return new Response(
    JSON.stringify({ error: "LinkedIn cron endpoint has been removed." }),
    { status: 410, headers: { "Content-Type": "application/json" } }
  );
}

export async function POST(): Promise<Response> {
  return GET();
}
