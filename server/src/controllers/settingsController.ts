import { Request, Response } from 'express';
import { SiteSettings } from '../models/SiteSettings.js';
import { AuthRequest } from '../middleware/auth.js';

export const settingsController = {
  // Public: Get global settings and daily fragment
  async getSettings(_req: Request, res: Response): Promise<void> {
    try {
      let settings = await SiteSettings.findOne();
      if (!settings) {
        settings = new SiteSettings();
        await settings.save();
      }
      res.status(200).json({ success: true, data: settings });
    } catch (err: any) {
      res.status(500).json({ message: err.message || 'Error fetching site settings.' });
    }
  },

  // Admin: Update site settings
  async updateSettings(req: AuthRequest, res: Response): Promise<void> {
    try {
      let settings = await SiteSettings.findOne();
      if (!settings) {
        settings = new SiteSettings(req.body);
      } else {
        Object.assign(settings, req.body);
      }

      await settings.save();
      res.status(200).json({
        success: true,
        message: 'Literary portal settings updated successfully.',
        data: settings
      });
    } catch (err: any) {
      res.status(400).json({ message: err.message || 'Error updating settings.' });
    }
  }
};
