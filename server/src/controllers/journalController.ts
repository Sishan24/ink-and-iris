import { Request, Response } from 'express';
import slugify from 'slugify';
import { JournalPost } from '../models/JournalPost.js';
import { AuthRequest } from '../middleware/auth.js';

export const journalController = {
  // Public: Get published posts (Admin sees drafts if requested)
  async getAllPosts(req: Request, res: Response): Promise<void> {
    try {
      const { category, tag, search, status } = req.query;
      const query: any = {};

      // Only show published to public unless status explicitly requested by authorized caller
      if (status && status !== 'all') {
        query.status = status;
      } else if (!status) {
        query.status = 'published';
      }

      if (category && category !== 'all') {
        query.category = category;
      }

      if (tag) {
        query.tags = tag;
      }

      if (search) {
        const searchRegex = new RegExp(String(search), 'i');
        query.$or = [
          { title: searchRegex },
          { excerpt: searchRegex },
          { content: searchRegex },
          { tags: searchRegex }
        ];
      }

      const posts = await JournalPost.find(query)
        .populate('relatedBooks', 'title slug coverImage')
        .sort({ publishedAt: -1, createdAt: -1 });

      res.status(200).json({ success: true, count: posts.length, data: posts });
    } catch (err: any) {
      res.status(500).json({ message: err.message || 'Error fetching journal posts.' });
    }
  },

  // Public: Get single post by slug
  async getPostBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;
      const post = await JournalPost.findOne({ slug })
        .populate('relatedBooks', 'title slug coverImage genre synopsis');

      if (!post) {
        res.status(404).json({ message: 'Journal post not found.' });
        return;
      }

      // Increment view count asynchronously
      post.views = (post.views || 0) + 1;
      await post.save();

      res.status(200).json({ success: true, data: post });
    } catch (err: any) {
      res.status(500).json({ message: err.message || 'Error fetching journal post.' });
    }
  },

  // Admin: Create post
  async createPost(req: AuthRequest, res: Response): Promise<void> {
    try {
      const postData = req.body;
      if (!postData.slug) {
        postData.slug = slugify(postData.title, { lower: true, strict: true });
      }

      const existing = await JournalPost.findOne({ slug: postData.slug });
      if (existing) {
        postData.slug = `${postData.slug}-${Date.now().toString().slice(-4)}`;
      }

      // Estimate reading time if not supplied (approx 200 words per minute)
      if (!postData.readingTimeMinutes && postData.content) {
        const words = postData.content.split(/\s+/).length;
        postData.readingTimeMinutes = Math.max(1, Math.ceil(words / 200));
      }

      const post = new JournalPost(postData);
      await post.save();

      res.status(201).json({ success: true, data: post });
    } catch (err: any) {
      res.status(400).json({ message: err.message || 'Error creating journal post.' });
    }
  },

  // Admin: Update post
  async updatePost(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (updateData.title && !updateData.slug) {
        updateData.slug = slugify(updateData.title, { lower: true, strict: true });
      }

      if (updateData.content && !updateData.readingTimeMinutes) {
        const words = updateData.content.split(/\s+/).length;
        updateData.readingTimeMinutes = Math.max(1, Math.ceil(words / 200));
      }

      const updated = await JournalPost.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
      });

      if (!updated) {
        res.status(404).json({ message: 'Journal post not found.' });
        return;
      }

      res.status(200).json({ success: true, data: updated });
    } catch (err: any) {
      res.status(400).json({ message: err.message || 'Error updating post.' });
    }
  },

  // Admin: Delete post
  async deletePost(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await JournalPost.findByIdAndDelete(id);
      if (!deleted) {
        res.status(404).json({ message: 'Journal post not found.' });
        return;
      }
      res.status(200).json({ success: true, message: 'Journal post removed.' });
    } catch (err: any) {
      res.status(500).json({ message: err.message || 'Error deleting post.' });
    }
  }
};
