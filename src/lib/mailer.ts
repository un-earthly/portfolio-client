import nodemailer from 'nodemailer';

const { GMAIL_USER, GMAIL_APP_PASSWORD, CONTACT_TO } = process.env;

/** Where notifications land. Defaults to the sending account's own inbox. */
export const NOTIFY_TO = CONTACT_TO || GMAIL_USER;

export function isMailerConfigured(): boolean {
    return Boolean(GMAIL_USER && GMAIL_APP_PASSWORD);
}

export function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/**
 * Render a branded, table-based transactional email (email-client safe, inline
 * styles, light theme for deliverability). Returns an HTML string.
 */
export function brandedEmail(opts: {
    preheader?: string;
    heading: string;
    intro?: string;
    rows?: { label: string; value: string }[];
    button?: { label: string; href: string };
    footnote?: string;
}): string {
    // Subtle node-graph motif (matches the site). Rendered as a header
    // background-image data-URI; clients that strip it fall back to solid navy.
    const headerSvg =
        `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="64" viewBox="0 0 480 64">` +
        `<g stroke="#22d3ee" stroke-opacity="0.25" stroke-width="1">` +
        `<line x1="300" y1="18" x2="350" y2="44"/><line x1="350" y1="44" x2="402" y2="20"/>` +
        `<line x1="402" y1="20" x2="448" y2="46"/><line x1="350" y1="44" x2="312" y2="52"/>` +
        `<line x1="402" y1="20" x2="420" y2="10"/></g>` +
        `<g fill="#22d3ee" fill-opacity="0.45">` +
        `<circle cx="300" cy="18" r="2.5"/><circle cx="350" cy="44" r="3"/><circle cx="402" cy="20" r="2.5"/>` +
        `<circle cx="448" cy="46" r="2"/><circle cx="312" cy="52" r="2"/><circle cx="420" cy="10" r="2"/></g>` +
        `</svg>`;
    const headerBg = `data:image/svg+xml,${encodeURIComponent(headerSvg)}`;

    // Faint dot grid tiled behind the whole email (stripped by Gmail → plain grey).
    const bodySvg =
        `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">` +
        `<circle cx="2" cy="2" r="1" fill="#0b1120" fill-opacity="0.05"/></svg>`;
    const bodyBg = `data:image/svg+xml,${encodeURIComponent(bodySvg)}`;

    const rows = (opts.rows ?? [])
        .map(
            (r) => `<tr>
        <td style="padding:6px 0;color:#6b7280;font-size:13px;width:90px;vertical-align:top">${r.label}</td>
        <td style="padding:6px 0;color:#111827;font-size:14px;font-weight:600">${r.value}</td>
      </tr>`
        )
        .join('');

    return `<!doctype html><html><body style="margin:0;background:#f3f4f6 url('${bodyBg}') repeat;padding:24px 0">
  ${opts.preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0">${opts.preheader}</div>` : ''}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:transparent">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif">
        <tr><td style="background:#0b1120 url('${headerBg}') no-repeat right center;padding:18px 28px">
          <span style="font-size:22px;font-weight:800;letter-spacing:-0.5px;color:#f8fafc">MD<span style="color:#22d3ee">.</span></span>
        </td></tr>
        <tr><td style="padding:28px">
          <h1 style="margin:0 0 ${opts.intro ? '6' : '16'}px;font-size:19px;color:#111827">${opts.heading}</h1>
          ${opts.intro ? `<p style="margin:0 0 16px;font-size:14px;color:#6b7280;line-height:1.5">${opts.intro}</p>` : ''}
          ${rows ? `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-top:1px solid #f0f0f0;border-bottom:1px solid #f0f0f0;margin:4px 0 18px">${rows}</table>` : ''}
          ${opts.button ? `<a href="${opts.button.href}" style="display:inline-block;background:#0891b2;color:#ffffff;font-weight:700;font-size:14px;text-decoration:none;padding:11px 22px;border-radius:8px">${opts.button.label}</a>` : ''}
        </td></tr>
        <tr><td style="padding:14px 28px;background:#fafafa;border-top:1px solid #f0f0f0">
          <p style="margin:0;font-size:11px;color:#9ca3af">${opts.footnote ?? 'Sent from the alamin-md.xyz scheduler.'}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

let transporter: nodemailer.Transporter | null = null;

/** Lazily build a singleton Gmail transporter. Throws if not configured. */
export function getTransporter(): nodemailer.Transporter {
    if (!isMailerConfigured()) {
        throw new Error('Mailer not configured: set GMAIL_USER and GMAIL_APP_PASSWORD.');
    }
    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
        });
    }
    return transporter;
}

type SendArgs = {
    to?: string;
    subject: string;
    text: string;
    html: string;
    replyTo?: string;
};

/** Send a mail from the portfolio Gmail account. */
export async function sendMail({ to, subject, text, html, replyTo }: SendArgs) {
    return getTransporter().sendMail({
        from: `"Portfolio" <${GMAIL_USER}>`,
        to: to || NOTIFY_TO,
        replyTo,
        subject,
        text,
        html,
    });
}
