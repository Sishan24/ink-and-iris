import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ICharacterRelationship {
  relatedCharacter: Types.ObjectId;
  relationType: string; // e.g. "Confidante", "Estranged Sibling", "Lover", "Rival", "Patron"
  notes?: string;
}

export interface ICharacter extends Document {
  name: string;
  slug: string;
  portraitUrl: string;
  archetype: string;
  book: Types.ObjectId;
  background: string;
  personalityTraits: string[];
  motivations: string;
  memorableQuotes: string[];
  relationships: ICharacterRelationship[];
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CharacterSchema = new Schema<ICharacter>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    portraitUrl: { type: String, required: true },
    archetype: { type: String, required: true },
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    background: { type: String, required: true },
    personalityTraits: [{ type: String }],
    motivations: { type: String, required: true },
    memorableQuotes: [{ type: String }],
    relationships: [
      {
        relatedCharacter: { type: Schema.Types.ObjectId, ref: 'Character' },
        relationType: { type: String, required: true },
        notes: { type: String }
      }
    ],
    featured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Character = mongoose.model<ICharacter>('Character', CharacterSchema);
