import { NextResponse } from 'next/server';
import { getBusy, isCalendarConfigured } from '@/lib/google-calendar';
import { generateSlots, isWorkingDay, zonedToUtc, TZ } from '@/lib/scheduler';
import { rateLimit, clientIp } from '@/lib/rate-limit';

export const runtime = 'nodejs';

// GET /api/schedule/slots?date=YYYY-MM-DD  → available slots for that day
export async function GET(request: Request) {
    if (!isCalendarConfigured()) {
        return NextResponse.json({ error: 'Scheduling is not configured.' }, { status: 503 });
    }
    // Protect the Google quota: 60 lookups per IP per 5 min.
    if (!(await rateLimit(`slots:${clientIp(request)}`, 60, 5 * 60_000))) {
        return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
    }
    const date = new URL(request.url).searchParams.get('date') || '';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return NextResponse.json({ error: 'Invalid date.' }, { status: 400 });
    }
    if (!isWorkingDay(date)) {
        return NextResponse.json({ slots: [], tz: TZ }, { status: 200 });
    }

    try {
        // query busy across the whole local day
        const dayStart = zonedToUtc(date, 0, 0).toISOString();
        const dayEnd = zonedToUtc(date, 23, 59).toISOString();
        const busy = await getBusy(dayStart, dayEnd);
        const slots = generateSlots(date, busy);
        return NextResponse.json({ slots, tz: TZ }, { status: 200 });
    } catch (error) {
        console.error('slots: failed', error);
        return NextResponse.json({ error: 'Failed to load availability.' }, { status: 502 });
    }
}
