import mongoose, { Document, Schema } from 'mongoose';

export interface IDailyFragment {
  quote: string;
  workTitle: string;
  commentary?: string;
  dateString?: string;
}

export interface ISiteSettings extends Document {
  dailyFragment: IDailyFragment;
  heroTitle: string;
  heroSubtitle: string;
  heroIntro: string;
  authorBioSummary: string;
  authorPhilosophy: string;
  socialLinks: {
    instagram?: string;
    twitter?: string;
    goodreads?: string;
    substack?: string;
  };
  literaryAgent: {
    name: string;
    agency: string;
    email: string;
  };
  pressKitUrl?: string;
  readingGuides: Array<{
    title: string;
    description: string;
    fileUrl: string;
    bookTitle: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    dailyFragment: {
      quote: {
        type: String,
        default: 'Memory is an ink that deepens with every season of rain, staining the paper until the silence speaks.'
      },
      workTitle: { type: String, default: 'The Memory of Rain' },
      commentary: {
        type: String,
        default: "From Chapter IV, as Ananya returns to her grandfather's library in Kalimpong."
      },
      dateString: { type: String, default: 'Today' }
    },
    heroTitle: { type: String, default: 'Where stories take root, characters breathe...' },
    heroSubtitle: {
      type: String,
      default: 'The Literary Universe of Ms. Jaya Roy Chowdhury'
    },
    heroIntro: {
      type: String,
      default:
        'Step across the threshold of contemporary literary heritage. Explore evocative novels, intimate character archives, reader letters, and meditative essays on craft.'
    },
    authorBioSummary: {
      type: String,
      default:
        'Ms. Jaya Roy Chowdhury is an acclaimed novelist, essayist, and chronicler of human longing and historical resonance.'
    },
    authorPhilosophy: {
      type: String,
      default:
        'Where stories take root, characters breathe, and every reader finds a little piece of themselves.'
    },
    socialLinks: {
      instagram: { type: String, default: 'https://instagram.com/jayaroychowdhury' },
      twitter: { type: String, default: 'https://twitter.com/jayaroyc' },
      goodreads: { type: String, default: 'https://goodreads.com/author/jaya_roy_chowdhury' },
      substack: { type: String, default: 'https://inkandiris.substack.com' }
    },
    literaryAgent: {
      name: { type: String, default: 'Devina Khurana' },
      agency: { type: String, default: 'Heritage & Quill Literary Agency' },
      email: { type: String, default: 'rights@heritagequill.com' }
    },
    pressKitUrl: { type: String, default: '/press-kit.pdf' },
    readingGuides: [
      {
        title: { type: String },
        description: { type: String },
        fileUrl: { type: String },
        bookTitle: { type: String }
      }
    ]
  },
  { timestamps: true }
);

export const SiteSettings = mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
