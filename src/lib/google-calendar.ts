// Minimal Google Calendar REST client (no googleapis dependency).
// Auth: OAuth2 refresh token for a personal Gmail account — required so that
// booked events can auto-generate a Google Meet link (conferenceData).
const {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REFRESH_TOKEN,
    GOOGLE_CALENDAR_ID,
} = process.env;

export const CALENDAR_ID = GOOGLE_CALENDAR_ID || 'primary';

export function isCalendarConfigured(): boolean {
    return Boolean(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET && GOOGLE_REFRESH_TOKEN);
}

// short-lived access-token cache
let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
    if (!isCalendarConfigured()) throw new Error('Google Calendar is not configured.');
    if (cachedToken && cachedToken.expiresAt > Date.now() + 30_000) return cachedToken.value;

    const res = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            client_id: GOOGLE_CLIENT_ID!,
            client_secret: GOOGLE_CLIENT_SECRET!,
            refresh_token: GOOGLE_REFRESH_TOKEN!,
            grant_type: 'refresh_token',
        }),
    });
    if (!res.ok) throw new Error(`Token refresh failed: ${res.status} ${await res.text()}`);
    const data = (await res.json()) as { access_token: string; expires_in: number };
    cachedToken = { value: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
    return data.access_token;
}

export type BusyInterval = { start: string; end: string };

/** Busy intervals on the calendar between two ISO instants. */
export async function getBusy(timeMin: string, timeMax: string): Promise<BusyInterval[]> {
    const token = await getAccessToken();
    const res = await fetch('https://www.googleapis.com/calendar/v3/freeBusy', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ timeMin, timeMax, items: [{ id: CALENDAR_ID }] }),
    });
    if (!res.ok) throw new Error(`freeBusy failed: ${res.status} ${await res.text()}`);
    const data = (await res.json()) as { calendars: Record<string, { busy: BusyInterval[] }> };
    return data.calendars[CALENDAR_ID]?.busy ?? [];
}

export type CreatedEvent = { htmlLink: string; meetLink: string | null; start: string };

/** Create a timed event with a Google Meet link and an invited attendee. */
export async function createMeetEvent(opts: {
    summary: string;
    description: string;
    startISO: string;
    endISO: string;
    timeZone: string;
    attendeeEmail: string;
    attendeeName: string;
}): Promise<CreatedEvent> {
    const token = await getAccessToken();
    const body = {
        summary: opts.summary,
        description: opts.description,
        start: { dateTime: opts.startISO, timeZone: opts.timeZone },
        end: { dateTime: opts.endISO, timeZone: opts.timeZone },
        attendees: [{ email: opts.attendeeEmail, displayName: opts.attendeeName }],
        conferenceData: {
            createRequest: {
                requestId: `meet-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                conferenceSolutionKey: { type: 'hangoutsMeet' },
            },
        },
    };
    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
        CALENDAR_ID
    )}/events?conferenceDataVersion=1&sendUpdates=all`;
    const res = await fetch(url, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`event insert failed: ${res.status} ${await res.text()}`);
    const ev = (await res.json()) as {
        htmlLink: string;
        hangoutLink?: string;
        start: { dateTime: string };
    };
    return { htmlLink: ev.htmlLink, meetLink: ev.hangoutLink ?? null, start: ev.start.dateTime };
}
