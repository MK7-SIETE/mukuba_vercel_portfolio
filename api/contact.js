/**
 * ═══════════════════════════════════════════════════════════
 * VERCEL SERVERLESS CONTACT API — api/contact.js
 * Betsaleel Mukuba Portfolio
 *
 * Features:
 *  - Receives contact form POST (JSON)
 *  - Sends email notification to portfolio owner (mukuba950@gmail.com)
 *  - Sends auto-reply to the visitor with branded HTML template
 *  - Rate limiting via in-memory store (per IP)
 *  - Input validation and sanitisation
 *
 * Setup: Set these in Vercel Dashboard → Settings → Environment Variables:
 *   GMAIL_USER     = mukuba950@gmail.com
 *   GMAIL_PASS     = your_gmail_app_password  (NOT your normal password)
 *   OWNER_EMAIL    = mukuba950@gmail.com
 *
 * FREE BACKEND ALTERNATIVES (if you need a persistent server):
 *   • Railway  (https://railway.app)  — FREE $5 credit/month, deploy Node.js in seconds
 *   • Render   (https://render.com)   — FREE tier, Node.js web service
 *   Both support environment variables and can run this same contact.js as an Express server
 *
 * To get a Gmail App Password:
 *   1. Google Account → Security → 2-Step Verification (enable)
 *   2. Google Account → Security → App Passwords
 *   3. Select "Mail" + "Other" → Generate → copy 16-char code
 * ═══════════════════════════════════════════════════════════
 */

const nodemailer = require('nodemailer');

/* ── Rate limiter (in-memory, resets on cold start) ── */
const rateLimitMap = new Map();
const RATE_LIMIT   = 3;   // max requests
const RATE_WINDOW  = 60 * 60 * 1000; // per hour (ms)

function isRateLimited(ip) {
  const now    = Date.now();
  const record = rateLimitMap.get(ip) || { count: 0, resetAt: now + RATE_WINDOW };
  if (now > record.resetAt) { record.count = 0; record.resetAt = now + RATE_WINDOW; }
  record.count++;
  rateLimitMap.set(ip, record);
  return record.count > RATE_LIMIT;
}

/* ── Sanitise text (strip HTML tags) ── */
function sanitise(str = '') {
  return String(str).replace(/<[^>]*>/g, '').trim().substring(0, 2000);
}

/* ── Validate email format ── */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ── Build owner notification email HTML ── */
function buildOwnerEmail({ name, email, subject, message }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>New Portfolio Message</title>
</head>
<body style="margin:0;padding:0;background:#F4F6F9;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#F4F6F9;">
    <tr><td align="center" style="padding:40px 16px;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:580px;">

        <!-- HEADER -->
        <tr><td style="background:#0F172A;border-radius:12px 12px 0 0;padding:24px 40px;">
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td>
                <div style="font-size:20px;font-weight:900;color:#FFFFFF;letter-spacing:3px;">BM<span style="color:#3B82F6;">.</span></div>
                <div style="font-size:9px;color:rgba(255,255,255,0.35);letter-spacing:2px;text-transform:uppercase;margin-top:2px;">Portfolio</div>
              </td>
              <td align="right">
                <div style="display:inline-block;background:#1E3A5F;border:1px solid #2563EB;border-radius:6px;padding:6px 14px;">
                  <span style="font-size:10px;color:#60A5FA;font-weight:700;letter-spacing:1px;text-transform:uppercase;">&#9993; New Message</span>
                </div>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- BODY -->
        <tr><td style="background:#FFFFFF;padding:40px 40px;">

          <p style="font-size:12px;color:#94A3B8;text-transform:uppercase;letter-spacing:1.5px;margin:0 0 4px 0;">Contact Form Submission</p>
          <p style="font-size:22px;font-weight:700;color:#0F172A;margin:0 0 28px 0;">Someone reached out</p>

          <!-- Fields -->
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border:1px solid #E2E8F0;border-radius:10px;overflow:hidden;margin-bottom:24px;">
            <tr>
              <td style="padding:14px 20px;border-bottom:1px solid #F1F5F9;background:#F8FAFC;">
                <span style="font-size:9px;color:#94A3B8;text-transform:uppercase;letter-spacing:2px;display:block;margin-bottom:4px;">Name</span>
                <span style="font-size:15px;font-weight:600;color:#0F172A;">${name}</span>
              </td>
            </tr>
            <tr>
              <td style="padding:14px 20px;border-bottom:1px solid #F1F5F9;">
                <span style="font-size:9px;color:#94A3B8;text-transform:uppercase;letter-spacing:2px;display:block;margin-bottom:4px;">Email</span>
                <a href="mailto:${email}" style="font-size:15px;color:#2563EB;text-decoration:none;font-weight:500;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:14px 20px;background:#F8FAFC;">
                <span style="font-size:9px;color:#94A3B8;text-transform:uppercase;letter-spacing:2px;display:block;margin-bottom:4px;">Subject</span>
                <span style="font-size:15px;font-weight:600;color:#0F172A;">${subject || 'General Enquiry'}</span>
              </td>
            </tr>
          </table>

          <!-- Message -->
          <p style="font-size:9px;color:#94A3B8;text-transform:uppercase;letter-spacing:2px;margin:0 0 10px 0;">Message</p>
          <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-left:3px solid #2563EB;border-radius:8px;padding:20px;font-size:14px;color:#334155;line-height:1.85;white-space:pre-wrap;margin-bottom:28px;">${message}</div>

          <!-- Reply CTA -->
          <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject || 'Your enquiry')}"
             style="display:inline-block;padding:13px 28px;background:#1D4ED8;color:#FFFFFF;border-radius:8px;font-size:13px;font-weight:700;text-decoration:none;">
            Reply to ${name} &rarr;
          </a>

        </td></tr>

        <!-- FOOTER -->
        <tr><td style="background:#F8FAFC;border-radius:0 0 12px 12px;padding:16px 40px;border-top:1px solid #E2E8F0;text-align:center;">
          <p style="font-size:10px;color:#CBD5E1;margin:0;">Automated notification from your portfolio &nbsp;&middot;&nbsp; Do not forward</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/* ── Build auto-reply email HTML ── */
function buildAutoReplyEmail({ name, subject }) {
  const GITHUB_ICON   = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPjxwYXRoIGQ9Ik0xMiAwQzUuMzcgMCAwIDUuMzcgMCAxMmMwIDUuMzEgMy40MzUgOS43OTUgOC4yMDUgMTEuMzg1LjYuMTA1LjgyNS0uMjU1LjgyNS0uNTcgMC0uMjg1LS4wMTUtMS4yMy0uMDE1LTIuMjM1LTMuMDE1LjU1NS0zLjc5NS0uNzM1LTQuMDM1LTEuNDEtLjEzNS0uMzQ1LS43Mi0xLjQxLTEuMjMtMS42OTUtLjQyLS4yMjUtMS4wMi0uNzgtLjAxNS0uNzk1Ljk0NS0uMDE1IDEuNjIuODcgMS44NDUgMS4yMyAxLjA4IDEuODE1IDIuODA1IDEuMzA1IDMuNDk1Ljk5LjEwNS0uNzguNDItMS4zMDUuNzY1LTEuNjA1LTIuNjctLjMtNS40Ni0xLjMzNS01LjQ2LTUuOTI1IDAtMS4zMDUuNDY1LTIuMzg1IDEuMjMtMy4yMjUtLjEyLS4zLS41NC0xLjUzLjEyLTMuMTggMCAwIDEuMDA1LS4zMTUgMy4zIDEuMjMuOTYtLjI3IDEuOTgtLjQwNSAzLS40MDVzMi4wNC4xMzUgMyAuNDA1YzIuMjk1LTEuNTYgMy4zLTEuMjMgMy4zLTEuMjMuNjYgMS42NS4yNCAyLjg4LjEyIDMuMTguNzY1Ljg0IDEuMjMgMS45MDUgMS4yMyAzLjIyNSAwIDQuNjA1LTIuODA1IDUuNjI1LTUuNDc1IDUuOTI1LjQzNS4zNzUuODEgMS4wOTUuODEgMi4yMiAwIDEuNjA1LS4wMTUgMi44OTUtLjAxNSAzLjMgMCAuMzE1LjIyNS42OS44MjUuNTdBMTIuMDIgMTIuMDIgMCAwIDAgMjQgMTJjMC02LjYzLTUuMzctMTItMTItMTJ6Ii8+PC9zdmc+";
  const LINKEDIN_ICON = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPjxwYXRoIGQ9Ik0yMC40NDcgMjAuNDUyaC0zLjU1NHYtNS41NjljMC0xLjMyOC0uMDI3LTMuMDM3LTEuODUyLTMuMDM3LTEuODUzIDAtMi4xMzYgMS40NDUtMi4xMzYgMi45Mzl2NS42NjdIOS4zNTFWOWgzLjQxNHYxLjU2MWguMDQ2Yy40NzctLjkgMS42MzctMS44NSAzLjM3LTEuODUgMy42MDEgMCA0LjI2NyAyLjM3IDQuMjY3IDUuNDU1djYuMjg2ek01LjMzNyA3LjQzM2EyLjA2MiAyLjA2MiAwIDAgMS0yLjA2My0yLjA2NSAyLjA2NCAyLjA2NCAwIDEgMSAyLjA2MyAyLjA2NXptMS43ODIgMTMuMDE5SDMuNTU1VjloMy41NjR2MTEuNDUyek0yMi4yMjUgMEgxLjc3MUMuNzkyIDAgMCAuNzc0IDAgMS43Mjl2MjAuNTQyQzAgMjMuMjI3Ljc5MiAyNCAxLjc3MSAyNGgyMC40NTFDMjMuMiAyNCAyNCAyMy4yMjcgMjQgMjIuMjcxVjEuNzI5QzI0IC43NzQgMjMuMiAwIDIyLjIyMiAwaC4wMDN6Ii8+PC9zdmc+";
  const WHATSAPP_ICON = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPjxwYXRoIGQ9Ik0xNy40NzIgMTQuMzgyYy0uMjk3LS4xNDktMS43NTgtLjg2Ny0yLjAzLS45NjctLjI3My0uMDk5LS40NzEtLjE0OC0uNjcuMTUtLjE5Ny4yOTctLjc2Ny45NjYtLjk0IDEuMTY0LS4xNzMuMTk5LS4zNDcuMjIzLS42NDQuMDc1LS4yOTctLjE1LTEuMjU1LS40NjMtMi4zOS0xLjQ3NS0uODgzLS43ODgtMS40OC0xLjc2MS0xLjY1My0yLjA1OS0uMTczLS4yOTctLjAxOC0uNDU4LjEzLS42MDYuMTM0LS4xMzMuMjk4LS4zNDcuNDQ2LS41Mi4xNDktLjE3NC4xOTgtLjI5OC4yOTgtLjQ5Ny4wOTktLjE5OC4wNS0uMzcxLS4wMjUtLjUyLS4wNzUtLjE0OS0uNjY5LTEuNjEyLS45MTYtMi4yMDctLjI0Mi0uNTc5LS40ODctLjUtLjY2OS0uNTEtLjE3My0uMDA4LS4zNzEtLjAxLS41Ny0uMDEtLjE5OCAwLS41Mi4wNzQtLjc5Mi4zNzItLjI3Mi4yOTctMS4wNCAxLjAxNi0xLjA0IDIuNDc5IDAgMS40NjIgMS4wNjUgMi44NzUgMS4yMTMgMy4wNzQuMTQ5LjE5OCAyLjA5NiAzLjIgNS4wNzcgNC40ODcuNzA5LjMwNiAxLjI2Mi40ODkgMS42OTQuNjI1LjcxMi4yMjcgMS4zNi4xOTUgMS44NzEuMTE4LjU3MS0uMDg1IDEuNzU4LS43MTkgMi4wMDYtMS40MTMuMjQ4LS42OTQuMjQ4LTEuMjg5LjE3My0xLjQxMy0uMDc0LS4xMjQtLjI3Mi0uMTk4LS41Ny0uMzQ3bS01LjQyMSA3LjQwM2gtLjAwNGE5Ljg3IDkuODcgMCAwIDEtNS4wMzEtMS4zNzhsLS4zNjEtLjIxNC0zLjc0MS45ODIuOTk4LTMuNjQ4LS4yMzUtLjM3NGE5Ljg2IDkuODYgMCAwIDEtMS41MS01LjI2Yy4wMDEtNS40NSA0LjQzNi05Ljg4NCA5Ljg4OC05Ljg4NCAyLjY0IDAgNS4xMjIgMS4wMyA2Ljk4OCAyLjg5OGE5LjgyNSA5LjgyNSAwIDAgMSAyLjg5MyA2Ljk5NGMtLjAwMyA1LjQ1LTQuNDM3IDkuODg0LTkuODg1IDkuODg0bTguNDEzLTE4LjI5N0ExMS44MTUgMTEuODE1IDAgMCAwIDEyLjA1IDBDNS40OTUgMCAuMTYgNS4zMzUuMTU3IDExLjg5MmMwIDIuMDk2LjU0NyA0LjE0MiAxLjU4OCA1Ljk0NUwuMDU3IDI0bDYuMzA1LTEuNjU0YTExLjg4MiAxMS44ODIgMCAwIDAgNS42ODMgMS40NDhoLjAwNWM2LjU1NCAwIDExLjg5LTUuMzM1IDExLjg5My0xMS44OTNhMTEuODIxIDExLjgyMSAwIDAgMC0zLjQ4LTguNDEzeiIvPjwvc3ZnPg==";
  const year = new Date().getFullYear();
  const dateStr = new Date().toLocaleDateString('en-GB', {day:'numeric', month:'short', year:'numeric'});

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>We received your message</title>
</head>
<body style="margin:0;padding:0;background:#F4F6F9;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#F4F6F9;">
    <tr><td align="center" style="padding:40px 16px;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:580px;">

        <!-- HEADER -->
        <tr><td style="background:#0F172A;border-radius:12px 12px 0 0;padding:32px 40px;text-align:center;">
          <div style="font-size:9px;color:rgba(255,255,255,0.35);letter-spacing:4px;text-transform:uppercase;margin-bottom:10px;">Portfolio</div>
          <div style="font-size:28px;font-weight:900;color:#FFFFFF;letter-spacing:4px;">BM<span style="color:#3B82F6;">.</span></div>
          <div style="width:40px;height:2px;background:#3B82F6;margin:14px auto 0;border-radius:2px;"></div>
        </td></tr>

        <!-- STATUS BAR -->
        <tr><td style="background:#1E293B;padding:12px 40px;">
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td>
                <table cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td style="width:8px;height:8px;background:#22C55E;border-radius:50%;"></td>
                    <td style="padding-left:8px;font-size:11px;color:#94A3B8;">Message successfully received</td>
                  </tr>
                </table>
              </td>
              <td align="right"><span style="font-size:10px;color:#475569;">${dateStr}</span></td>
            </tr>
          </table>
        </td></tr>

        <!-- BODY -->
        <tr><td style="background:#FFFFFF;padding:44px 40px;">

          <p style="font-size:22px;font-weight:700;color:#0F172A;margin:0 0 4px 0;">Hi ${name},</p>
          <p style="font-size:12px;color:#94A3B8;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;margin:0 0 24px 0;">Confirmation of Receipt</p>

          <p style="font-size:15px;color:#334155;line-height:1.85;margin:0 0 16px 0;">
            Thank you for reaching out. I have received your message regarding
            <strong style="color:#1D4ED8;">&ldquo;${subject || 'your enquiry'}&rdquo;</strong>
            and will respond personally.
          </p>
          <p style="font-size:15px;color:#334155;line-height:1.85;margin:0 0 32px 0;">
            You can expect a reply within <strong style="color:#0F172A;">24&nbsp;hours</strong>.
          </p>

          <!-- Stats row -->
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:36px;border:1px solid #E2E8F0;border-radius:10px;">
            <tr>
              <td width="50%" style="padding:18px 24px;border-right:1px solid #E2E8F0;text-align:center;">
                <div style="font-size:9px;color:#94A3B8;text-transform:uppercase;letter-spacing:2px;margin-bottom:6px;">Avg. Response</div>
                <div style="font-size:22px;font-weight:800;color:#1D4ED8;">24 hrs</div>
              </td>
              <td width="50%" style="padding:18px 24px;text-align:center;">
                <div style="font-size:9px;color:#94A3B8;text-transform:uppercase;letter-spacing:2px;margin-bottom:6px;">Based In</div>
                <div style="font-size:14px;font-weight:700;color:#0F172A;">Lusaka, Zambia</div>
              </td>
            </tr>
          </table>

          <!-- Connect section -->
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:20px;">
            <tr>
              <td style="border-top:1px solid #E2E8F0;font-size:1px;line-height:1px;">&nbsp;</td>
            </tr>
          </table>
          <p style="font-size:10px;color:#94A3B8;text-transform:uppercase;letter-spacing:2px;margin:0 0 14px 0;">Connect with me</p>

          <!-- Social buttons with embedded icons -->
          <table cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:36px;">
            <tr>
              <td style="padding-right:10px;">
                <a href="https://github.com/MK7-SIETE" target="_blank"
                   style="display:inline-block;padding:10px 16px;background:#24292E;border-radius:7px;font-size:12px;font-weight:700;color:#FFFFFF;text-decoration:none;">
                  <img src="${GITHUB_ICON}" width="13" height="13" alt="GitHub" style="vertical-align:middle;margin-right:6px;margin-top:-2px;"/>GitHub
                </a>
              </td>
              <td style="padding-right:10px;">
                <a href="https://linkedin.com/in/betsaleel-mukuba" target="_blank"
                   style="display:inline-block;padding:10px 16px;background:#0A66C2;border-radius:7px;font-size:12px;font-weight:700;color:#FFFFFF;text-decoration:none;">
                  <img src="${LINKEDIN_ICON}" width="13" height="13" alt="LinkedIn" style="vertical-align:middle;margin-right:6px;margin-top:-2px;"/>LinkedIn
                </a>
              </td>
              <td>
                <a href="https://wa.me/260969508654" target="_blank"
                   style="display:inline-block;padding:10px 16px;background:#25D366;border-radius:7px;font-size:12px;font-weight:700;color:#FFFFFF;text-decoration:none;">
                  <img src="${WHATSAPP_ICON}" width="13" height="13" alt="WhatsApp" style="vertical-align:middle;margin-right:6px;margin-top:-2px;"/>WhatsApp
                </a>
              </td>
            </tr>
          </table>

          <!-- Signature -->
          <table cellpadding="0" cellspacing="0" role="presentation" style="border-top:1px solid #F1F5F9;width:100%;">
            <tr>
              <td style="padding-top:28px;">
                <table cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td style="padding-right:14px;vertical-align:middle;">
                      <div style="width:46px;height:46px;background:linear-gradient(135deg,#1D4ED8,#0891B2);border-radius:10px;text-align:center;line-height:46px;font-size:20px;font-weight:900;color:#FFFFFF;">B</div>
                    </td>
                    <td style="vertical-align:middle;">
                      <div style="font-size:15px;font-weight:700;color:#0F172A;">Betsaleel Mukuba</div>
                      <div style="font-size:11px;color:#3B82F6;margin-top:2px;">Software Engineer &nbsp;&middot;&nbsp; Full Stack Developer</div>
                      <div style="font-size:11px;color:#94A3B8;margin-top:4px;">Lusaka, Zambia &nbsp;&middot;&nbsp; +260 96 950 8654</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

        </td></tr>

        <!-- FOOTER -->
        <tr><td style="background:#F8FAFC;border-radius:0 0 12px 12px;padding:18px 40px;border-top:1px solid #E2E8F0;text-align:center;">
          <p style="font-size:11px;color:#94A3B8;margin:0 0 4px 0;">&copy; ${year} Betsaleel Mukuba &nbsp;&middot;&nbsp; Lusaka, Zambia</p>
          <p style="font-size:10px;color:#CBD5E1;margin:0;">This is an automated reply. Please do not respond to this email.</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/* ══════════════════════════════════════
   MAIN HANDLER
══════════════════════════════════════ */
module.exports = async function handler(req, res) {
  /* CORS */
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')  return res.status(405).json({ error: 'Method not allowed' });

  /* Rate limit */
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress || 'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  /* Parse body */
  const { name, email, subject, message } = req.body || {};

  /* Validate */
  const cleanName    = sanitise(name);
  const cleanEmail   = sanitise(email);
  const cleanSubject = sanitise(subject);
  const cleanMessage = sanitise(message);

  if (!cleanName || cleanName.length < 2)        return res.status(400).json({ error: 'Please enter your full name.' });
  if (!cleanEmail || !isValidEmail(cleanEmail))   return res.status(400).json({ error: 'Please enter a valid email address.' });
  if (!cleanMessage || cleanMessage.length < 10)  return res.status(400).json({ error: 'Message must be at least 10 characters.' });

  /* SMTP transporter — Gmail App Password */
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,  // Gmail App Password (16 chars)
    },
  });

  try {
    /* 1️⃣  Notify owner */
    await transporter.sendMail({
      from:    `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
      to:      process.env.OWNER_EMAIL || 'mukuba950@gmail.com',
      replyTo: cleanEmail,
      subject: `[Portfolio] ${cleanSubject || 'New Contact Message'} — from ${cleanName}`,
      html:    buildOwnerEmail({ name: cleanName, email: cleanEmail, subject: cleanSubject, message: cleanMessage }),
    });

    /* 2️⃣  Auto-reply to visitor */
    await transporter.sendMail({
      from:    `"Betsaleel Mukuba" <${process.env.GMAIL_USER}>`,
      to:      cleanEmail,
      subject: `Thanks for reaching out, ${cleanName}! 👋`,
      html:    buildAutoReplyEmail({ name: cleanName, subject: cleanSubject }),
    });

    return res.status(200).json({ success: true, message: 'Message sent! I\'ll reply within 24 hours.' });

  } catch (error) {
    console.error('Email error:', error);
    return res.status(500).json({ error: 'Failed to send message. Please try emailing directly: mukuba950@gmail.com' });
  }
};
