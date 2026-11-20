import { Request, Response } from 'express';
import slugify from 'slugify';
import { Book } from '../models/Book.js';

export const bookController = {
  // Public: Get all books with filters
  async getAllBooks(req: Request, res: Response): Promise<void> {
    try {
      const { status, genre, search, featured } = req.query;
      const query: any = {};

      if (status && status !== 'all') {
        query.status = status;
      }
      if (genre) {
        query.genre = genre;
      }
      if (featured === 'true') {
        query.featured = true;
      }
      if (search) {
        const searchRegex = new RegExp(String(search), 'i');
        query.$or = [
          { title: searchRegex },
          { subtitle: searchRegex },
          { synopsis: searchRegex },
          { themes: searchRegex }
        ];
      }

      const books = await Book.find(query)
        .populate('associatedCharacters', 'name slug portraitUrl archetype')
        .sort({ publicationDate: -1, createdAt: -1 });

      res.status(200).json({ success: true, count: books.length, data: books });
    } catch (err: any) {
      res.status(500).json({ message: err.message || 'Error retrieving books.' });
    }
  },

  // Public: Get single book by slug
  async getBookBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;
      const book = await Book.findOne({ slug })
        .populate('associatedCharacters');

      if (!book) {
        res.status(404).json({ message: 'Book not found in the archives.' });
        return;
      }

      res.status(200).json({ success: true, data: book });
    } catch (err: any) {
      res.status(500).json({ message: err.message || 'Error retrieving book.' });
    }
  },

  // Admin: Create book
  async createBook(req: Request, res: Response): Promise<void> {
    try {
      const bookData = req.body;
      if (!bookData.slug) {
        bookData.slug = slugify(bookData.title, { lower: true, strict: true });
      }

      // Check slug uniqueness
      const existing = await Book.findOne({ slug: bookData.slug });
      if (existing) {
        bookData.slug = `${bookData.slug}-${Date.now().toString().slice(-4)}`;
      }

      const newBook = new Book(bookData);
      await newBook.save();

      res.status(201).json({ success: true, data: newBook });
    } catch (err: any) {
      res.status(400).json({ message: err.message || 'Error creating book record.' });
    }
  },

  // Admin: Update book
  async updateBook(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (updateData.title && !updateData.slug) {
        updateData.slug = slugify(updateData.title, { lower: true, strict: true });
      }

      const updated = await Book.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
      });

      if (!updated) {
        res.status(404).json({ message: 'Book not found.' });
        return;
      }

      res.status(200).json({ success: true, data: updated });
    } catch (err: any) {
      res.status(400).json({ message: err.message || 'Error updating book.' });
    }
  },

  // Admin: Delete book
  async deleteBook(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await Book.findByIdAndDelete(id);
      if (!deleted) {
        res.status(404).json({ message: 'Book not found.' });
        return;
      }
      res.status(200).json({ success: true, message: 'Book removed from catalogue.' });
    } catch (err: any) {
      res.status(500).json({ message: err.message || 'Error deleting book.' });
    }
  }
};
