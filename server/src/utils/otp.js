import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { VerificationCode } from '../models/VerificationCode.js';
import { sendEmail, otpEmail } from './email.js';
import { HttpError } from './http.js';

export const OTP_MINUTES = 10;
const RESEND_COOLDOWN_MS = 30 * 1000;
const MAX_ATTEMPTS = 5;

/** Creates a fresh single-use code and emails it. Silent no-op inside the resend cooldown. */
export async function issueCode(email, name) {
  const recent = await VerificationCode.findOne({
    email,
    createdAt: { $gt: new Date(Date.now() - RESEND_COOLDOWN_MS) },
  });
  if (recent) return;

  const code = String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');
  await VerificationCode.deleteMany({ email }); // only one live code per email
  await VerificationCode.create({
    email,
    codeHash: await bcrypt.hash(code, 8),
    expiresAt: new Date(Date.now() + OTP_MINUTES * 60 * 1000),
  });
  const mail = otpEmail({ name, code, minutes: OTP_MINUTES });
  await sendEmail({ to: email, ...mail });
}

/** Throws unless the code is valid. A valid code is deleted, so it can never be reused. */
export async function consumeCode(email, code) {
  const invalid = new HttpError(400, 'That code is incorrect or has expired. Request a new one and try again.');
  const record = await VerificationCode.findOne({ email });
  if (!record || record.expiresAt < new Date()) throw invalid;

  if (record.attempts >= MAX_ATTEMPTS) {
    await record.deleteOne();
    throw invalid;
  }
  const ok = await bcrypt.compare(code, record.codeHash);
  if (!ok) {
    record.attempts += 1;
    await record.save();
    throw invalid;
  }
  await record.deleteOne();
}
