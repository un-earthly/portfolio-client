// Sliding/fixed-window rate limiter.
// Uses Upstash Redis (REST) for a GLOBAL limit across serverless instances when
// UPSTASH_REDIS_REST_URL/TOKEN are set; otherwise falls back to a per-instance
// in-memory map (best-effort).
const REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const useRedis = Boolean(REST_URL && REST_TOKEN);

// ── in-memory fallback ──────────────────────────────────────────────────────
const hits = new Map<string, number[]>();
function memoryLimit(key: string, max: number, windowMs: number): boolean {
    const now = Date.now();
    const arr = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    if (arr.length >= max) { hits.set(key, arr); return false; }
    arr.push(now);
    hits.set(key, arr);
    return true;
}

// ── Upstash REST (fixed window via INCR + EXPIRE NX) ────────────────────────
async function redisLimit(key: string, max: number, windowMs: number): Promise<boolean> {
    const sec = Math.ceil(windowMs / 1000);
    try {
        const res = await fetch(`${REST_URL}/pipeline`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${REST_TOKEN}`, 'Content-Type': 'application/json' },
            body: JSON.stringify([
                ['INCR', key],
                ['EXPIRE', key, String(sec), 'NX'],
            ]),
            signal: AbortSignal.timeout(3000),
        });
        if (!res.ok) return true; // fail open — never block on limiter outage
        const data = (await res.json()) as { result: number }[];
        const count = Number(data?.[0]?.result ?? 0);
        return count <= max;
    } catch {
        return true; // fail open
    }
}

/** Returns true if allowed, false if the limit is exceeded. */
export async function rateLimit(key: string, max: number, windowMs: number): Promise<boolean> {
    return useRedis ? redisLimit(key, max, windowMs) : memoryLimit(key, max, windowMs);
}

/** Best-effort client IP from common proxy headers. */
export function clientIp(req: Request): string {
    const xff = req.headers.get('x-forwarded-for');
    if (xff) return xff.split(',')[0].trim();
    return req.headers.get('x-real-ip') || 'unknown';
}
