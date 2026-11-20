import { Request, Response } from 'express';
import slugify from 'slugify';
import { Character } from '../models/Character.js';

export const characterController = {
  // Public: Get all characters with filtering
  async getAllCharacters(req: Request, res: Response): Promise<void> {
    try {
      const { bookId, archetype, search, featured } = req.query;
      const query: any = {};

      if (bookId) query.book = bookId;
      if (archetype) query.archetype = archetype;
      if (featured === 'true') query.featured = true;

      if (search) {
        const searchRegex = new RegExp(String(search), 'i');
        query.$or = [
          { name: searchRegex },
          { archetype: searchRegex },
          { background: searchRegex },
          { personalityTraits: searchRegex }
        ];
      }

      const characters = await Character.find(query)
        .populate('book', 'title slug coverImage')
        .populate('relationships.relatedCharacter', 'name slug portraitUrl archetype')
        .sort({ name: 1 });

      res.status(200).json({ success: true, count: characters.length, data: characters });
    } catch (err: any) {
      res.status(500).json({ message: err.message || 'Error fetching characters.' });
    }
  },

  // Public: Visual relationship network data
  async getRelationshipNetwork(_req: Request, res: Response): Promise<void> {
    try {
      const characters = await Character.find()
        .populate('book', 'title slug')
        .populate('relationships.relatedCharacter', 'name slug portraitUrl');

      const nodes = characters.map((c) => ({
        id: c._id.toString(),
        name: c.name,
        slug: c.slug,
        portraitUrl: c.portraitUrl,
        archetype: c.archetype,
        book: (c.book as any)?.title || 'Unassigned'
      }));

      const links: any[] = [];
      const linkSet = new Set<string>();

      characters.forEach((c) => {
        c.relationships.forEach((rel) => {
          if (rel.relatedCharacter) {
            const sourceId = c._id.toString();
            const targetId = (rel.relatedCharacter as any)._id?.toString() || rel.relatedCharacter.toString();
            const pairKey = [sourceId, targetId].sort().join('--');
            
            if (!linkSet.has(pairKey)) {
              linkSet.add(pairKey);
              links.push({
                source: sourceId,
                target: targetId,
                type: rel.relationType,
                notes: rel.notes
              });
            }
          }
        });
      });

      res.status(200).json({ success: true, data: { nodes, links } });
    } catch (err: any) {
      res.status(500).json({ message: err.message || 'Error compiling relationship graph.' });
    }
  },

  // Public: Get character by slug
  async getCharacterBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;
      const character = await Character.findOne({ slug })
        .populate('book')
        .populate('relationships.relatedCharacter', 'name slug portraitUrl archetype');

      if (!character) {
        res.status(404).json({ message: 'Character not found.' });
        return;
      }

      res.status(200).json({ success: true, data: character });
    } catch (err: any) {
      res.status(500).json({ message: err.message || 'Error retrieving character.' });
    }
  },

  // Admin: Create character
  async createCharacter(req: Request, res: Response): Promise<void> {
    try {
      const charData = req.body;
      if (!charData.slug) {
        charData.slug = slugify(charData.name, { lower: true, strict: true });
      }

      const existing = await Character.findOne({ slug: charData.slug });
      if (existing) {
        charData.slug = `${charData.slug}-${Date.now().toString().slice(-4)}`;
      }

      const character = new Character(charData);
      await character.save();

      res.status(201).json({ success: true, data: character });
    } catch (err: any) {
      res.status(400).json({ message: err.message || 'Error creating character.' });
    }
  },

  // Admin: Update character
  async updateCharacter(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (updateData.name && !updateData.slug) {
        updateData.slug = slugify(updateData.name, { lower: true, strict: true });
      }

      const updated = await Character.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
      });

      if (!updated) {
        res.status(404).json({ message: 'Character not found.' });
        return;
      }

      res.status(200).json({ success: true, data: updated });
    } catch (err: any) {
      res.status(400).json({ message: err.message || 'Error updating character.' });
    }
  },

  // Admin: Delete character
  async deleteCharacter(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await Character.findByIdAndDelete(id);
      if (!deleted) {
        res.status(404).json({ message: 'Character not found.' });
        return;
      }
      res.status(200).json({ success: true, message: 'Character removed.' });
    } catch (err: any) {
      res.status(500).json({ message: err.message || 'Error deleting character.' });
    }
  }
};
