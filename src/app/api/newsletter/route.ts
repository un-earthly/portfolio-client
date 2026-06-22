import { NextResponse } from 'next/server';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import { sendMail, isMailerConfigured, escapeHtml, brandedEmail } from '@/lib/mailer';

export const runtime = 'nodejs';

const REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

function isValidEmail(v: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

/** Add an email to the subscriber set in Upstash. Returns true if newly added. */
async function storeSubscriber(email: string): Promise<boolean | null> {
    if (!REST_URL || !REST_TOKEN) return null; // not configured
    try {
        const res = await fetch(`${REST_URL}/sadd/newsletter:subscribers/${encodeURIComponent(email)}`, {
            headers: { Authorization: `Bearer ${REST_TOKEN}` },
            signal: AbortSignal.timeout(4000),
        });
        if (!res.ok) return null;
        const data = (await res.json()) as { result: number };
        return data.result === 1; // 1 = newly added, 0 = already present
    } catch {
        return null;
    }
}

// POST /api/newsletter  { email, company? (honeypot) }
export async function POST(request: Request) {
    const ip = clientIp(request);
    if (!(await rateLimit(`news:${ip}`, 5, 10 * 60_000))) {
        return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
    }

    let body: { email?: string; company?: string };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid body.' }, { status: 400 });
    }

    if ((body.company || '').trim()) {
        return NextResponse.json({ ok: true }, { status: 200 }); // honeypot
    }

    const email = (body.email || '').trim().toLowerCase();
    if (!email || !isValidEmail(email) || email.length > 200) {
        return NextResponse.json({ error: 'Please enter a valid email.' }, { status: 400 });
    }

    const added = await storeSubscriber(email);
    if (added === false) {
        return NextResponse.json({ ok: true, already: true }, { status: 200 });
    }

    // Notify owner (best-effort); don't fail the request if mail is down.
    if (isMailerConfigured()) {
        try {
            await sendMail({
                subject: `New newsletter subscriber`,
                text: `New subscriber: ${email}`,
                html: brandedEmail({
                    heading: 'New subscriber',
                    intro: 'Someone just joined your newsletter.',
                    rows: [{ label: 'Email', value: escapeHtml(email) }],
                }),
            });
        } catch { /* ignore */ }
    }

    console.log(JSON.stringify({ evt: 'newsletter.subscribed', ts: new Date().toISOString(), email }));
    return NextResponse.json({ ok: true }, { status: 200 });
}
