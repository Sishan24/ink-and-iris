import { Request, Response } from 'express';
import { Event } from '../models/Event.js';
import { AuthRequest } from '../middleware/auth.js';

export const eventController = {
  // Public: Get events (upcoming vs past)
  async getPublicEvents(req: Request, res: Response): Promise<void> {
    try {
      const { status } = req.query;
      const query: any = {};

      if (status === 'upcoming') {
        query.status = 'upcoming';
        query.date = { $gte: new Date(new Date().setHours(0, 0, 0, 0)) };
      } else if (status === 'past') {
        query.$or = [
          { status: 'past' },
          { date: { $lt: new Date(new Date().setHours(0, 0, 0, 0)) } }
        ];
      }

      const events = await Event.find(query).sort({ date: status === 'past' ? -1 : 1 });
      res.status(200).json({ success: true, count: events.length, data: events });
    } catch (err: any) {
      res.status(500).json({ message: err.message || 'Error fetching gatherings.' });
    }
  },

  // Admin: Get all events
  async getAllEvents(_req: AuthRequest, res: Response): Promise<void> {
    try {
      const events = await Event.find().sort({ date: -1 });
      res.status(200).json({ success: true, count: events.length, data: events });
    } catch (err: any) {
      res.status(500).json({ message: err.message || 'Error fetching events.' });
    }
  },

  // Admin: Create event
  async createEvent(req: AuthRequest, res: Response): Promise<void> {
    try {
      const event = new Event(req.body);
      await event.save();
      res.status(201).json({ success: true, data: event });
    } catch (err: any) {
      res.status(400).json({ message: err.message || 'Error creating event.' });
    }
  },

  // Admin: Update event
  async updateEvent(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updated = await Event.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
      if (!updated) {
        res.status(404).json({ message: 'Event not found.' });
        return;
      }
      res.status(200).json({ success: true, data: updated });
    } catch (err: any) {
      res.status(400).json({ message: err.message || 'Error updating event.' });
    }
  },

  // Admin: Delete event
  async deleteEvent(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await Event.findByIdAndDelete(id);
      if (!deleted) {
        res.status(404).json({ message: 'Event not found.' });
        return;
      }
      res.status(200).json({ success: true, message: 'Event removed.' });
    } catch (err: any) {
      res.status(500).json({ message: err.message || 'Error deleting event.' });
    }
  }
};
