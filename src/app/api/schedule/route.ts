import { NextResponse } from 'next/server';
import { createMeetEvent, getBusy, isCalendarConfigured } from '@/lib/google-calendar';
import { TZ, DURATION_MIN, isBookableSlot } from '@/lib/scheduler';
import { sendMail, isMailerConfigured, escapeHtml, brandedEmail } from '@/lib/mailer';
import { rateLimit, clientIp } from '@/lib/rate-limit';

export const runtime = 'nodejs';

const MAX = { name: 100, email: 200, notes: 1000 };

function isValidEmail(v: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

// POST /api/schedule  { name, email, start (ISO), notes?, company? (honeypot) }
export async function POST(request: Request) {
    if (!isCalendarConfigured()) {
        return NextResponse.json({ error: 'Scheduling is not configured.' }, { status: 503 });
    }

    const ip = clientIp(request);
    // Rate limit: max 5 booking attempts per IP per 15 min.
    if (!(await rateLimit(`sched:${ip}`, 5, 15 * 60_000))) {
        return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    let body: { name?: string; email?: string; start?: string; notes?: string; company?: string };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid body.' }, { status: 400 });
    }

    // Honeypot: bots fill hidden fields. Pretend success, book nothing.
    if ((body.company || '').trim()) {
        console.warn(`[schedule] honeypot tripped ip=${ip}`);
        return NextResponse.json({ ok: true, when: '', meetLink: null }, { status: 200 });
    }

    const name = (body.name || '').trim();
    const email = (body.email || '').trim();
    const start = (body.start || '').trim();
    const notes = (body.notes || '').trim();

    if (!name || !email || !start) {
        return NextResponse.json({ error: 'Name, email, and a time slot are required.' }, { status: 400 });
    }
    if (name.length > MAX.name || email.length > MAX.email || notes.length > MAX.notes) {
        return NextResponse.json({ error: 'Input too long.' }, { status: 400 });
    }
    if (!isValidEmail(email)) {
        return NextResponse.json({ error: 'Please provide a valid email.' }, { status: 400 });
    }
    // Slot must be a real, open slot — not an arbitrary time.
    if (!isBookableSlot(start)) {
        return NextResponse.json({ error: 'That time slot is no longer valid.' }, { status: 400 });
    }
    // Per-email cap: max 2 bookings per day.
    if (!(await rateLimit(`sched-email:${email.toLowerCase()}`, 2, 24 * 60 * 60_000))) {
        return NextResponse.json({ error: 'Booking limit reached for this email.' }, { status: 429 });
    }
    const startDate = new Date(start);
    const endDate = new Date(startDate.getTime() + DURATION_MIN * 60000);

    try {
        // Re-check the slot is still free (avoid double-booking races).
        const busy = await getBusy(startDate.toISOString(), endDate.toISOString());
        if (busy.length > 0) {
            return NextResponse.json({ error: 'That slot was just taken — please pick another.' }, { status: 409 });
        }

        const ev = await createMeetEvent({
            summary: `Call with ${name}`,
            description: `Booked via portfolio.\nFrom: ${name} <${email}>${notes ? `\n\nNotes:\n${notes}` : ''}`,
            startISO: startDate.toISOString(),
            endISO: endDate.toISOString(),
            timeZone: TZ,
            attendeeEmail: email,
            attendeeName: name,
        });

        const when = new Intl.DateTimeFormat('en-US', {
            timeZone: TZ, dateStyle: 'full', timeStyle: 'short',
        }).format(startDate);

        // Notify the owner via the configured mailer (best-effort).
        if (isMailerConfigured()) {
            const rows = [
                { label: 'With', value: `${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;` },
                { label: 'When', value: `${escapeHtml(when)} <span style="color:#9ca3af">(${escapeHtml(TZ)})</span>` },
            ];
            if (notes) rows.push({ label: 'Notes', value: escapeHtml(notes) });
            try {
                await sendMail({
                    replyTo: `"${name}" <${email}>`,
                    subject: `New call booked: ${name} — ${when}`,
                    text: `${name} <${email}> booked a call.\nWhen: ${when} (${TZ})\nMeet: ${ev.meetLink || '(in calendar)'}\n${notes ? `Notes: ${notes}\n` : ''}`,
                    html: brandedEmail({
                        preheader: `${name} booked a call for ${when}`,
                        heading: 'New call booked',
                        intro: `${escapeHtml(name)} just scheduled a call with you.`,
                        rows,
                        button: ev.meetLink ? { label: 'Join Google Meet', href: ev.meetLink } : undefined,
                        footnote: 'Booked via the alamin-md.xyz scheduler · reply to reach them directly.',
                    }),
                });
            } catch (e) { console.error('schedule: owner email failed', e); }
        }

        // Tracking — structured log (shows up in Vercel logs).
        console.log(JSON.stringify({
            evt: 'booking.created', ts: new Date().toISOString(),
            ip, email, when, tz: TZ, meet: Boolean(ev.meetLink),
        }));

        return NextResponse.json({ ok: true, when, meetLink: ev.meetLink, htmlLink: ev.htmlLink }, { status: 200 });
    } catch (error) {
        console.error('schedule: booking failed', error);
        return NextResponse.json({ error: 'Could not book the call. Please try another time.' }, { status: 502 });
    }
}
