// Deprecated: LinkedIn tools were merged into the main MCP server at
// /api/mcp (see route.ts) on 2026-08-04, so there's only one connector
// to add instead of two. This route is intentionally left inert.

export async function GET(): Promise<Response> {
  return new Response(
    JSON.stringify({
      error: "This endpoint has moved. LinkedIn tools are now part of the main /api/mcp server.",
    }),
    { status: 410, headers: { "Content-Type": "application/json" } }
  );
}

export async function POST(): Promise<Response> {
  return GET();
}
