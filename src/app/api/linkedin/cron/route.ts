import { CRON_SECRET, listPosts, publishStoredPost } from "@/lib/linkedin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Publishes any "scheduled" LinkedIn post whose scheduled_at has passed.
 * Triggered externally (GitHub Actions cron) rather than Vercel Cron, since
 * Vercel Hobby plans only allow once-daily cron invocations.
 *
 * Auth: Authorization: Bearer <CRON_SECRET>
 */
async function handleCron(req: Request): Promise<Response> {
  if (!CRON_SECRET) {
    return Response.json({ error: "CRON_SECRET not configured on the server" }, { status: 500 });
  }

  const auth = req.headers.get("authorization") ?? "";
  const token = auth.replace(/^Bearer\s+/i, "");
  if (token !== CRON_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const due = (await listPosts("scheduled")).filter(
    (p) => p.scheduled_at && new Date(p.scheduled_at).getTime() <= Date.now()
  );

  const results = [];
  for (const post of due) {
    try {
      const published = await publishStoredPost(post);
      results.push({ id: post.id, ok: true, li_post_urn: published.li_post_urn });
    } catch (err) {
      results.push({ id: post.id, ok: false, error: (err as Error).message });
    }
  }

  return Response.json({ checked: due.length, results });
}

export async function POST(req: Request): Promise<Response> {
  return handleCron(req);
}

export async function GET(req: Request): Promise<Response> {
  return handleCron(req);
}
