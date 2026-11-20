import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { Media } from '../models/Media.js';
import { uploadService } from '../services/uploadService.js';
import { AuthRequest } from '../middleware/auth.js';

export const mediaController = {
  // Admin: Upload file
  async uploadFile(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ message: 'No file was uploaded.' });
        return;
      }

      const folder = (req.body.folder || 'ink-and-iris').trim();
      const uploaded = await uploadService.uploadFile(req.file.path, folder);

      const mediaDoc = new Media({
        url: uploaded.url,
        publicId: uploaded.publicId,
        filename: req.file.originalname,
        mimeType: req.file.mimetype,
        sizeBytes: uploaded.sizeBytes,
        folder,
        isCloudinary: uploaded.isCloudinary
      });

      await mediaDoc.save();

      res.status(201).json({
        success: true,
        data: mediaDoc
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message || 'Error processing media upload.' });
    }
  },

  // Admin: Get all media records
  async getAllMedia(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { folder, search } = req.query;
      const query: any = {};
      if (folder) query.folder = folder;
      if (search) query.filename = new RegExp(String(search), 'i');

      const files = await Media.find(query).sort({ createdAt: -1 });
      res.status(200).json({ success: true, count: files.length, data: files });
    } catch (err: any) {
      res.status(500).json({ message: err.message || 'Error fetching media archives.' });
    }
  },

  // Admin: Delete media record
  async deleteMedia(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const item = await Media.findById(id);
      if (!item) {
        res.status(404).json({ message: 'Media record not found.' });
        return;
      }

      // If local file, delete from disk
      if (!item.isCloudinary && item.url.startsWith('/uploads/')) {
        const localPath = path.resolve(process.cwd(), item.url.replace('/uploads/', 'uploads/'));
        if (fs.existsSync(localPath)) {
          fs.unlinkSync(localPath);
        }
      }

      await Media.findByIdAndDelete(id);
      res.status(200).json({ success: true, message: 'Media asset deleted.' });
    } catch (err: any) {
      res.status(500).json({ message: err.message || 'Error deleting media.' });
    }
  }
};
