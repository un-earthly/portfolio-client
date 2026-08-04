import { Server } from "@modelcontextprotocol/sdk/server";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type Tool,
} from "@modelcontextprotocol/sdk/types";
import {
  createDraft,
  deletePost,
  getMyLinkedInProfile,
  getPost,
  linkedinConfigured,
  listPosts,
  publishStoredPost,
  updatePost,
} from "@/lib/linkedin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ── MCP Tools ────────────────────────────────────────────────────────────────

const TOOLS: Tool[] = [
  {
    name: "draft_post",
    description: "Create a new LinkedIn post draft. Does not publish anything — just stores the draft for review.",
    inputSchema: {
      type: "object",
      properties: {
        content: { type: "string", description: "Full post text as it should appear on LinkedIn" },
      },
      required: ["content"],
    },
  },
  {
    name: "list_posts",
    description: "List LinkedIn posts (drafts, scheduled, published, or failed), newest first.",
    inputSchema: {
      type: "object",
      properties: {
        status: { type: "string", enum: ["draft", "scheduled", "published", "failed"] },
      },
    },
  },
  {
    name: "get_post",
    description: "Get a single post by id.",
    inputSchema: {
      type: "object",
      properties: { id: { type: "string" } },
      required: ["id"],
    },
  },
  {
    name: "update_post",
    description: "Edit the content of an existing draft or scheduled post.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string" },
        content: { type: "string" },
      },
      required: ["id", "content"],
    },
  },
  {
    name: "delete_post",
    description: "Delete a post (draft, scheduled, or otherwise). Does not affect anything already live on LinkedIn.",
    inputSchema: {
      type: "object",
      properties: { id: { type: "string" } },
      required: ["id"],
    },
  },
  {
    name: "schedule_post",
    description:
      "Mark a draft as scheduled for a future time. Actual publishing happens via the cron worker when scheduled_at is reached.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string" },
        scheduled_at: { type: "string", description: "ISO 8601 datetime, e.g. 2026-08-05T09:00:00Z" },
      },
      required: ["id", "scheduled_at"],
    },
  },
  {
    name: "unschedule_post",
    description: "Revert a scheduled post back to draft status.",
    inputSchema: {
      type: "object",
      properties: { id: { type: "string" } },
      required: ["id"],
    },
  },
  {
    name: "publish_post",
    description: "Publish a post to LinkedIn immediately, regardless of its current status.",
    inputSchema: {
      type: "object",
      properties: { id: { type: "string" } },
      required: ["id"],
    },
  },
  {
    name: "get_my_profile",
    description:
      "Fetch your own LinkedIn profile info (name, headline, picture) live from LinkedIn. Confirms the access token is still valid.",
    inputSchema: { type: "object", properties: {} },
  },
];

// ── Build MCP Server ─────────────────────────────────────────────────────────

function createMcpServer(): Server {
  const server = new Server(
    { name: "linkedin-manager", version: "1.0.0" },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

  server.setRequestHandler(CallToolRequestSchema, async (req) => {
    const { name, arguments: args = {} } = req.params;

    try {
      switch (name) {
        case "draft_post": {
          const post = await createDraft(args.content as string);
          return { content: [{ type: "text", text: JSON.stringify(post, null, 2) }] };
        }

        case "list_posts": {
          const posts = await listPosts(args.status as never);
          return { content: [{ type: "text", text: JSON.stringify({ count: posts.length, posts }, null, 2) }] };
        }

        case "get_post": {
          const post = await getPost(args.id as string);
          if (!post) {
            return { content: [{ type: "text", text: `Post "${args.id}" not found.` }], isError: true };
          }
          return { content: [{ type: "text", text: JSON.stringify(post, null, 2) }] };
        }

        case "update_post": {
          const post = await updatePost(args.id as string, { content: args.content as string });
          if (!post) {
            return { content: [{ type: "text", text: `Post "${args.id}" not found.` }], isError: true };
          }
          return { content: [{ type: "text", text: JSON.stringify(post, null, 2) }] };
        }

        case "delete_post": {
          const ok = await deletePost(args.id as string);
          if (!ok) {
            return { content: [{ type: "text", text: `Post "${args.id}" not found.` }], isError: true };
          }
          return { content: [{ type: "text", text: `Deleted: ${args.id as string}` }] };
        }

        case "schedule_post": {
          const post = await updatePost(args.id as string, {
            status: "scheduled",
            scheduled_at: args.scheduled_at as string,
          });
          if (!post) {
            return { content: [{ type: "text", text: `Post "${args.id}" not found.` }], isError: true };
          }
          return { content: [{ type: "text", text: JSON.stringify(post, null, 2) }] };
        }

        case "unschedule_post": {
          const post = await updatePost(args.id as string, { status: "draft", scheduled_at: undefined });
          if (!post) {
            return { content: [{ type: "text", text: `Post "${args.id}" not found.` }], isError: true };
          }
          return { content: [{ type: "text", text: JSON.stringify(post, null, 2) }] };
        }

        case "publish_post": {
          const post = await getPost(args.id as string);
          if (!post) {
            return { content: [{ type: "text", text: `Post "${args.id}" not found.` }], isError: true };
          }
          if (!linkedinConfigured()) {
            return {
              content: [
                {
                  type: "text",
                  text: "LinkedIn is not configured yet. Set LINKEDIN_ACCESS_TOKEN and LINKEDIN_PERSON_URN in Vercel.",
                },
              ],
              isError: true,
            };
          }
          const published = await publishStoredPost(post);
          return { content: [{ type: "text", text: JSON.stringify(published, null, 2) }] };
        }

        case "get_my_profile": {
          const profile = await getMyLinkedInProfile();
          return { content: [{ type: "text", text: JSON.stringify(profile, null, 2) }] };
        }

        default:
          return { content: [{ type: "text", text: `Unknown tool: ${name}` }], isError: true };
      }
    } catch (err) {
      return {
        content: [{ type: "text", text: `Error: ${(err as Error).message}` }],
        isError: true,
      };
    }
  });

  return server;
}

// ── Route handler ─────────────────────────────────────────────────────────────

async function handleMcp(req: Request): Promise<Response> {
  if (!process.env.GITHUB_TOKEN) {
    return new Response(JSON.stringify({ error: "GITHUB_TOKEN not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });

  const server = createMcpServer();
  await server.connect(transport);

  return transport.handleRequest(req);
}

export async function POST(req: Request): Promise<Response> {
  return handleMcp(req);
}

export async function GET(): Promise<Response> {
  return new Response(JSON.stringify({ error: "Use POST for MCP requests" }), {
    status: 405,
    headers: { "Content-Type": "application/json", Allow: "POST" },
  });
}

export async function DELETE(): Promise<Response> {
  return new Response(JSON.stringify({ error: "Use POST for MCP requests" }), {
    status: 405,
    headers: { "Content-Type": "application/json", Allow: "POST" },
  });
}
