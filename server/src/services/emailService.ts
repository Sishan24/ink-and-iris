import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const fromEmail = process.env.EMAIL_FROM || 'Ink & Iris <noreply@inkandiris.com>';

export const emailService = {
  async sendOtpEmail(to: string, otp: string): Promise<boolean> {
    console.log(`\n========================================`);
    console.log(`[EMAIL DISPATCH] OTP For Admin Login`);
    console.log(`To: ${to}`);
    console.log(`Security OTP Code: [ ${otp} ] (Valid for 15 minutes)`);
    console.log(`========================================\n`);

    if (!resend) {
      return true;
    }

    try {
      await resend.emails.send({
        from: fromEmail,
        to,
        subject: `Your Ink & Iris Security Verification Code: ${otp}`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 580px; margin: 0 auto; padding: 32px; background-color: #F4EFE5; color: #302C2A; border: 1px solid #B49A68;">
            <h1 style="color: #632F3D; font-size: 26px; border-bottom: 1px solid #B49A68; padding-bottom: 12px; margin-top: 0;">Ink & Iris</h1>
            <p style="font-size: 16px; line-height: 1.6;">Dear Author,</p>
            <p style="font-size: 16px; line-height: 1.6;">You have requested authentication for your private author studio. Please use the verification code below:</p>
            <div style="text-align: center; margin: 28px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #632F3D; background: #E6D9C5; padding: 12px 24px; border: 1px dashed #632F3D;">${otp}</span>
            </div>
            <p style="font-size: 14px; color: #555;">This code will expire in 15 minutes. If you did not initiate this request, please disregard this transmission.</p>
            <p style="font-size: 14px; margin-top: 32px; font-style: italic; color: #632F3D;">— The Digital Literary Sanctuary of Ms. Jaya Roy Chowdhury</p>
          </div>
        `
      });
      return true;
    } catch (err) {
      console.error('Failed to send Resend email:', err);
      return false;
    }
  },

  async sendReaderLetterReceipt(to: string, senderName: string, subject: string): Promise<boolean> {
    console.log(`[EMAIL DISPATCH] Reader Letter Receipt to: ${to} (Subject: ${subject})`);
    if (!resend) return true;

    try {
      await resend.emails.send({
        from: fromEmail,
        to,
        subject: `Letter Received: ${subject} — Ink & Iris`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 580px; margin: 0 auto; padding: 32px; background-color: #F4EFE5; color: #302C2A; border: 1px solid #B49A68;">
            <h1 style="color: #632F3D; font-size: 24px; border-bottom: 1px solid #B49A68; padding-bottom: 12px; margin-top: 0;">Ink & Iris</h1>
            <p style="font-size: 16px; line-height: 1.6;">Dear ${senderName},</p>
            <p style="font-size: 16px; line-height: 1.6;">Your letter regarding <em>"${subject}"</em> has arrived safely at Ms. Jaya Roy Chowdhury's correspondence desk.</p>
            <p style="font-size: 15px; line-height: 1.6; color: #444;">Every reader's reflection is cherished. If your letter is selected to be shared with fellow readers in our public correspondence archives, it will appear with your chosen attribution.</p>
            <p style="font-size: 14px; margin-top: 32px; font-style: italic; color: #632F3D;">With warmest literary regards,<br/>Ms. Jaya Roy Chowdhury</p>
          </div>
        `
      });
      return true;
    } catch (err) {
      console.error('Failed to send reader letter receipt:', err);
      return false;
    }
  },

  async sendAuthorReplyToReader(to: string, senderName: string, subject: string, reply: string): Promise<boolean> {
    console.log(`[EMAIL DISPATCH] Author reply to reader: ${to}`);
    if (!resend) return true;

    try {
      await resend.emails.send({
        from: fromEmail,
        to,
        subject: `Response from Ms. Jaya Roy Chowdhury: Re: ${subject}`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 580px; margin: 0 auto; padding: 32px; background-color: #F4EFE5; color: #302C2A; border: 1px solid #B49A68;">
            <h1 style="color: #632F3D; font-size: 24px; border-bottom: 1px solid #B49A68; padding-bottom: 12px; margin-top: 0;">Ink & Iris</h1>
            <p style="font-size: 16px; line-height: 1.6;">Dear ${senderName},</p>
            <div style="font-size: 16px; line-height: 1.8; color: #263D35; background: #E6D9C5; padding: 20px; border-left: 3px solid #632F3D; margin: 20px 0;">
              ${reply.replace(/\n/g, '<br/>')}
            </div>
            <p style="font-size: 14px; margin-top: 32px; font-style: italic; color: #632F3D;">With affection,<br/>Jaya Roy Chowdhury</p>
          </div>
        `
      });
      return true;
    } catch (err) {
      console.error('Failed to dispatch reply email:', err);
      return false;
    }
  }
};
