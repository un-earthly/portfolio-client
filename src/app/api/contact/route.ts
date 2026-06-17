import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Nodemailer needs the Node.js runtime (not Edge).
export const runtime = 'nodejs';

const { GMAIL_USER, GMAIL_APP_PASSWORD, CONTACT_TO } = process.env;

// Where the notification lands. Defaults to the sending account's own inbox.
const TO_ADDRESS = CONTACT_TO || GMAIL_USER;

function isValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

export async function POST(request: Request) {
    if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
        console.error('Contact form: GMAIL_USER / GMAIL_APP_PASSWORD are not configured.');
        return NextResponse.json(
            { error: 'Email service is not configured.' },
            { status: 500 }
        );
    }

    let body: { name?: string; email?: string; subject?: string; message?: string };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const name = (body.name || '').trim();
    const email = (body.email || '').trim();
    const subject = (body.subject || '').trim();
    const message = (body.message || '').trim();

    if (!name || !email || !message) {
        return NextResponse.json(
            { error: 'Name, email, and message are required.' },
            { status: 400 }
        );
    }
    if (!isValidEmail(email)) {
        return NextResponse.json({ error: 'Please provide a valid email.' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
    });

    const safe = {
        name: escapeHtml(name),
        email: escapeHtml(email),
        subject: escapeHtml(subject || '(no subject)'),
        message: escapeHtml(message).replace(/\n/g, '<br />'),
    };

    try {
        await transporter.sendMail({
            // Gmail rewrites "from" to the authenticated account; replyTo lets you
            // hit "Reply" in your inbox and respond straight to the visitor.
            from: `"Portfolio Contact" <${GMAIL_USER}>`,
            to: TO_ADDRESS,
            replyTo: `"${name}" <${email}>`,
            subject: subject ? `Portfolio: ${subject}` : `New message from ${name}`,
            text: `From: ${name} <${email}>\nSubject: ${subject || '(none)'}\n\n${message}`,
            html: `
                <div style="font-family:system-ui,sans-serif;line-height:1.6;color:#111">
                    <h2 style="margin:0 0 12px">New portfolio message</h2>
                    <p style="margin:0 0 4px"><strong>From:</strong> ${safe.name} &lt;${safe.email}&gt;</p>
                    <p style="margin:0 0 12px"><strong>Subject:</strong> ${safe.subject}</p>
                    <div style="padding:12px 16px;background:#f4f4f5;border-radius:8px">${safe.message}</div>
                </div>
            `,
        });

        return NextResponse.json({ ok: true }, { status: 200 });
    } catch (error) {
        console.error('Contact form: failed to send email.', error);
        return NextResponse.json({ error: 'Failed to send message.' }, { status: 502 });
    }
}
