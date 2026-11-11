import { env } from '../config/env.js';
import { escapeHtml } from './http.js';

export async function sendEmail({ to, subject, html, text, replyTo }) {
  if (!env.resendKey) {
    // Development convenience: no Resend key, so print the email instead of sending it.
    console.log(`\n──── [dev email] ────\nTo: ${to}\nSubject: ${subject}\n\n${text}\n─────────────────────\n`);
    return;
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.resendKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: env.emailFrom, to: [to], subject, html, text, ...(replyTo ? { reply_to: replyTo } : {}) }),
  });
  if (!res.ok) throw new Error(`Resend error ${res.status}: ${await res.text()}`);
}

const wrap = (inner) => `
<div style="background:#F8F5EF;padding:32px 16px;font-family:Helvetica,Arial,sans-serif;color:#293A35">
  <div style="max-width:480px;margin:0 auto;background:#ffffff;border:1px solid #E8DFC9;border-radius:16px;padding:32px">
    <p style="font-family:Georgia,serif;font-size:22px;margin:0 0 20px;color:#293A35">Through the Golden Glades</p>
    ${inner}
    <p style="font-size:12px;color:#71816D;margin:28px 0 0">Jaya Roy Chowdhury · Author</p>
  </div>
</div>`;

export function otpEmail({ name, code, minutes }) {
  return {
    subject: `${code} is your sign-in code`,
    text: `Hello ${name || 'reader'},\n\nYour code is ${code}. It works once and expires in ${minutes} minutes.\n\nIf you didn't ask for it, you can ignore this email.`,
    html: wrap(`
      <p style="margin:0 0 16px">Hello ${escapeHtml(name || 'reader')},</p>
      <p style="margin:0 0 12px">Your sign-in code is:</p>
      <p style="font-size:34px;letter-spacing:8px;font-weight:700;margin:0 0 16px">${code}</p>
      <p style="margin:0;font-size:14px;color:#555">It works once and expires in ${minutes} minutes. If you didn't ask for it, you can ignore this email.</p>`),
  };
}

export function newMessageEmail(m) {
  return {
    subject: `New message from ${m.name}: ${m.subject}`,
    text: `From: ${m.name} <${m.email}>\nSubject: ${m.subject}\n\n${m.message}\n\nReply from the admin portal under Messages.`,
    html: wrap(`
      <p style="margin:0 0 8px"><strong>${escapeHtml(m.name)}</strong> &lt;${escapeHtml(m.email)}&gt;</p>
      <p style="margin:0 0 16px;color:#71816D">${escapeHtml(m.subject)}</p>
      <p style="white-space:pre-wrap;margin:0 0 16px">${escapeHtml(m.message)}</p>
      <p style="font-size:14px;color:#555;margin:0">Reply from the admin portal under Messages.</p>`),
  };
}

export function replyEmail({ name, body, original }) {
  return {
    subject: `Re: ${original.subject}`,
    text: `Dear ${name},\n\n${body}\n\n— Jaya Roy Chowdhury\n\n> ${original.message.replace(/\n/g, '\n> ')}`,
    html: wrap(`
      <p style="margin:0 0 16px">Dear ${escapeHtml(name)},</p>
      <p style="white-space:pre-wrap;margin:0 0 20px">${escapeHtml(body)}</p>
      <p style="margin:0 0 20px">— Jaya Roy Chowdhury</p>
      <p style="white-space:pre-wrap;margin:0;font-size:13px;color:#777;border-left:3px solid #E8DFC9;padding-left:12px">${escapeHtml(original.message)}</p>`),
  };
}
