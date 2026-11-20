import { Response } from 'express';
import { Book } from '../models/Book.js';
import { Character } from '../models/Character.js';
import { JournalPost } from '../models/JournalPost.js';
import { ReaderLetter } from '../models/ReaderLetter.js';
import { Event } from '../models/Event.js';
import { Testimonial } from '../models/Testimonial.js';
import { AuthRequest } from '../middleware/auth.js';

export const adminController = {
  async getDashboardStats(_req: AuthRequest, res: Response): Promise<void> {
    try {
      const [
        totalBooks,
        publishedBooks,
        wipBooks,
        totalCharacters,
        totalPosts,
        draftPosts,
        pendingLetters,
        totalLetters,
        upcomingEvents,
        totalTestimonials,
        recentPendingLetters,
        recentPosts
      ] = await Promise.all([
        Book.countDocuments(),
        Book.countDocuments({ status: 'published' }),
        Book.countDocuments({ status: 'work_in_progress' }),
        Character.countDocuments(),
        JournalPost.countDocuments(),
        JournalPost.countDocuments({ status: 'draft' }),
        ReaderLetter.countDocuments({ status: 'pending' }),
        ReaderLetter.countDocuments(),
        Event.countDocuments({ status: 'upcoming', date: { $gte: new Date() } }),
        Testimonial.countDocuments(),
        ReaderLetter.find({ status: 'pending' }).sort({ createdAt: -1 }).limit(5),
        JournalPost.find().sort({ createdAt: -1 }).limit(5).select('title slug status category publishedAt views')
      ]);

      res.status(200).json({
        success: true,
        data: {
          metrics: {
            totalBooks,
            publishedBooks,
            wipBooks,
            totalCharacters,
            totalPosts,
            draftPosts,
            pendingLetters,
            totalLetters,
            upcomingEvents,
            totalTestimonials
          },
          recentPendingLetters,
          recentPosts
        }
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message || 'Error fetching dashboard metrics.' });
    }
  }
};
