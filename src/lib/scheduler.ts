// Availability config + timezone-aware slot generation. No external deps.
import type { BusyInterval } from './google-calendar';

export const TZ = process.env.SCHEDULE_TZ || 'Asia/Dhaka';
export const START_HOUR = Number(process.env.SCHEDULE_START_HOUR ?? 10); // 10:00
export const END_HOUR = Number(process.env.SCHEDULE_END_HOUR ?? 18);     // 18:00
export const SLOT_MIN = Number(process.env.SCHEDULE_SLOT_MIN ?? 30);     // step
export const DURATION_MIN = Number(process.env.SCHEDULE_DURATION_MIN ?? 30); // meeting length
const WORK_DAYS = (process.env.SCHEDULE_WORK_DAYS || '1,2,3,4,5')
    .split(',').map(Number); // 0=Sun … 6=Sat

/** Offset (minutes) of a timezone at a given instant. */
function tzOffsetMinutes(tz: string, at: Date): number {
    const utc = new Date(at.toLocaleString('en-US', { timeZone: 'UTC' }));
    const local = new Date(at.toLocaleString('en-US', { timeZone: tz }));
    return Math.round((local.getTime() - utc.getTime()) / 60000);
}

/** Convert a wall-clock time in TZ (dateStr=YYYY-MM-DD) to a UTC Date. */
export function zonedToUtc(dateStr: string, hour: number, minute: number, tz = TZ): Date {
    const naive = new Date(`${dateStr}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00Z`);
    const offset = tzOffsetMinutes(tz, naive);
    return new Date(naive.getTime() - offset * 60000);
}

/** Weekday (0=Sun … 6=Sat) of a YYYY-MM-DD date in TZ. */
export function weekdayInTz(dateStr: string, tz = TZ): number {
    const d = zonedToUtc(dateStr, 12, 0, tz); // noon avoids DST edges
    const wd = new Intl.DateTimeFormat('en-US', { timeZone: tz, weekday: 'short' }).format(d);
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(wd);
}

export function isWorkingDay(dateStr: string): boolean {
    return WORK_DAYS.includes(weekdayInTz(dateStr));
}

/** True only if startISO is a legitimate, still-open slot (day/hours/grid/future). */
export function isBookableSlot(startISO: string): boolean {
    const d = new Date(startISO);
    if (Number.isNaN(d.getTime())) return false;
    const dateStr = new Intl.DateTimeFormat('en-CA', {
        timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit',
    }).format(d); // → YYYY-MM-DD in business TZ
    // membership in the grid (busy ignored here — caller re-checks freeBusy)
    return generateSlots(dateStr, []).some((s) => s.start === startISO);
}

export type Slot = { start: string; end: string; label: string };

/** Available slots for a date, given busy intervals. */
export function generateSlots(dateStr: string, busy: BusyInterval[]): Slot[] {
    if (!isWorkingDay(dateStr)) return [];
    const now = Date.now();
    const busyRanges = busy.map(b => [new Date(b.start).getTime(), new Date(b.end).getTime()] as const);
    const slots: Slot[] = [];

    for (let h = START_HOUR; h < END_HOUR; h++) {
        for (let m = 0; m < 60; m += SLOT_MIN) {
            const start = zonedToUtc(dateStr, h, m);
            const end = new Date(start.getTime() + DURATION_MIN * 60000);
            // skip slots that run past the working window
            const endHourLocal = h + (m + DURATION_MIN) / 60;
            if (endHourLocal > END_HOUR) continue;
            if (start.getTime() <= now) continue; // no past slots
            const overlaps = busyRanges.some(([bs, be]) => start.getTime() < be && end.getTime() > bs);
            if (overlaps) continue;
            slots.push({
                start: start.toISOString(),
                end: end.toISOString(),
                label: new Intl.DateTimeFormat('en-US', {
                    timeZone: TZ, hour: 'numeric', minute: '2-digit', hour12: true,
                }).format(start),
            });
        }
    }
    return slots;
}
