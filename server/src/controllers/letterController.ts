import { Request, Response } from 'express';
import { ReaderLetter } from '../models/ReaderLetter.js';
import { emailService } from '../services/emailService.js';
import { AuthRequest } from '../middleware/auth.js';

export const letterController = {
  // Public: Submit a reader letter
  async submitLetter(req: Request, res: Response): Promise<void> {
    try {
      const {
        senderName,
        senderEmail,
        isAnonymous,
        bookReferenced,
        subject,
        message,
        consentToPublish
      } = req.body;

      if (!senderName || !senderEmail || !subject || !message) {
        res.status(400).json({ message: 'Name, email, subject, and message are required.' });
        return;
      }

      const letter = new ReaderLetter({
        senderName: senderName.trim(),
        senderEmail: senderEmail.toLowerCase().trim(),
        isAnonymous: Boolean(isAnonymous),
        bookReferenced: bookReferenced || undefined,
        subject: subject.trim(),
        message: message.trim(),
        consentToPublish: Boolean(consentToPublish),
        status: 'pending'
      });

      await letter.save();

      // Dispatch receipt to reader
      await emailService.sendReaderLetterReceipt(letter.senderEmail, letter.senderName, letter.subject);

      res.status(201).json({
        success: true,
        message: 'Your letter has arrived safely at Ms. Jaya Roy Chowdhury’s desk. Thank you for your reflections.'
      });
    } catch (err: any) {
      res.status(400).json({ message: err.message || 'Error submitting letter.' });
    }
  },

  // Public: Curated published letters
  async getPublicLetters(_req: Request, res: Response): Promise<void> {
    try {
      // Only approved letters where consentToPublish was granted
      const letters = await ReaderLetter.find({
        status: 'approved',
        consentToPublish: true
      })
        .populate('bookReferenced', 'title slug coverImage')
        .sort({ createdAt: -1 });

      const sanitized = letters.map((l) => ({
        id: l._id,
        senderName: l.isAnonymous ? 'A Reader in Reflection' : l.senderName,
        subject: l.subject,
        message: l.message,
        bookReferenced: l.bookReferenced,
        authorReply: l.authorReply,
        repliedAt: l.repliedAt,
        createdAt: l.createdAt,
        featured: l.featured
      }));

      res.status(200).json({ success: true, count: sanitized.length, data: sanitized });
    } catch (err: any) {
      res.status(500).json({ message: err.message || 'Error fetching public correspondence.' });
    }
  },

  // Admin: View all letters in inbox
  async getAllLetters(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { status, search } = req.query;
      const query: any = {};

      if (status && status !== 'all') {
        query.status = status;
      }

      if (search) {
        const searchRegex = new RegExp(String(search), 'i');
        query.$or = [
          { senderName: searchRegex },
          { senderEmail: searchRegex },
          { subject: searchRegex },
          { message: searchRegex }
        ];
      }

      const letters = await ReaderLetter.find(query)
        .populate('bookReferenced', 'title slug')
        .sort({ createdAt: -1 });

      res.status(200).json({ success: true, count: letters.length, data: letters });
    } catch (err: any) {
      res.status(500).json({ message: err.message || 'Error fetching correspondence inbox.' });
    }
  },

  // Admin: Update status / approval
  async updateLetterStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status, featured } = req.body;

      const letter = await ReaderLetter.findById(id);
      if (!letter) {
        res.status(404).json({ message: 'Letter not found.' });
        return;
      }

      if (status === 'approved' && !letter.consentToPublish) {
        res.status(400).json({
          message: 'Cannot approve for public display because the reader did not grant publishing consent.'
        });
        return;
      }

      if (status) letter.status = status;
      if (typeof featured === 'boolean') letter.featured = featured;

      await letter.save();

      res.status(200).json({ success: true, data: letter });
    } catch (err: any) {
      res.status(400).json({ message: err.message || 'Error updating letter status.' });
    }
  },

  // Admin: Author replies to letter
  async replyToLetter(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { reply, sendEmail } = req.body;

      if (!reply || reply.trim() === '') {
        res.status(400).json({ message: 'Reply content cannot be empty.' });
        return;
      }

      const letter = await ReaderLetter.findById(id);
      if (!letter) {
        res.status(404).json({ message: 'Letter not found.' });
        return;
      }

      letter.authorReply = reply.trim();
      letter.repliedAt = new Date();
      if (letter.status === 'pending') {
        letter.status = 'replied';
      }

      await letter.save();

      if (sendEmail) {
        await emailService.sendAuthorReplyToReader(
          letter.senderEmail,
          letter.senderName,
          letter.subject,
          letter.authorReply
        );
      }

      res.status(200).json({
        success: true,
        message: 'Author reflection saved and dispatched.',
        data: letter
      });
    } catch (err: any) {
      res.status(400).json({ message: err.message || 'Error responding to letter.' });
    }
  },

  // Admin: Delete letter
  async deleteLetter(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await ReaderLetter.findByIdAndDelete(id);
      if (!deleted) {
        res.status(404).json({ message: 'Letter not found.' });
        return;
      }
      res.status(200).json({ success: true, message: 'Letter removed.' });
    } catch (err: any) {
      res.status(500).json({ message: err.message || 'Error deleting letter.' });
    }
  }
};
