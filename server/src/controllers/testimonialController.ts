import { Request, Response } from 'express';
import { Testimonial } from '../models/Testimonial.js';
import { AuthRequest } from '../middleware/auth.js';

export const testimonialController = {
  // Public: Get testimonials
  async getPublicTestimonials(req: Request, res: Response): Promise<void> {
    try {
      const { featured } = req.query;
      const query: any = {};
      if (featured === 'true') query.featured = true;

      const testimonials = await Testimonial.find(query)
        .populate('bookReferenced', 'title slug')
        .sort({ createdAt: -1 });

      res.status(200).json({ success: true, count: testimonials.length, data: testimonials });
    } catch (err: any) {
      res.status(500).json({ message: err.message || 'Error fetching praise.' });
    }
  },

  // Admin: Get all testimonials
  async getAllTestimonials(_req: AuthRequest, res: Response): Promise<void> {
    try {
      const testimonials = await Testimonial.find()
        .populate('bookReferenced', 'title slug')
        .sort({ createdAt: -1 });

      res.status(200).json({ success: true, count: testimonials.length, data: testimonials });
    } catch (err: any) {
      res.status(500).json({ message: err.message || 'Error fetching testimonials.' });
    }
  },

  // Admin: Create
  async createTestimonial(req: AuthRequest, res: Response): Promise<void> {
    try {
      const testimonial = new Testimonial(req.body);
      await testimonial.save();
      res.status(201).json({ success: true, data: testimonial });
    } catch (err: any) {
      res.status(400).json({ message: err.message || 'Error adding testimonial.' });
    }
  },

  // Admin: Update
  async updateTestimonial(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updated = await Testimonial.findByIdAndUpdate(id, req.body, { new: true });
      if (!updated) {
        res.status(404).json({ message: 'Testimonial not found.' });
        return;
      }
      res.status(200).json({ success: true, data: updated });
    } catch (err: any) {
      res.status(400).json({ message: err.message || 'Error updating testimonial.' });
    }
  },

  // Admin: Delete
  async deleteTestimonial(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await Testimonial.findByIdAndDelete(id);
      if (!deleted) {
        res.status(404).json({ message: 'Testimonial not found.' });
        return;
      }
      res.status(200).json({ success: true, message: 'Testimonial removed.' });
    } catch (err: any) {
      res.status(500).json({ message: err.message || 'Error deleting testimonial.' });
    }
  }
};
