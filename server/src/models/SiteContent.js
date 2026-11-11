import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({ url: String, publicId: { type: String, default: '' } }, { _id: false });

const siteContentSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'main', unique: true },
    hero: { kicker: String, title: String, tagline: String, intro: String },
    authorNote: { heading: String, body: String },
    authorProfile: {
      name: String,
      role: String,
      statement: String,
      bio: String,
      journey: String,
      approach: String,
      photo: { type: imageSchema, default: null },
      quote: { text: String, attribution: String },
    },
    quotes: [{ _id: false, text: String, attribution: String }],
    instagramUrl: { type: String, default: '' },
    contactEmail: { type: String, default: '' }, // private: never sent to the public site
  },
  { timestamps: true, minimize: false }
);

export const SiteContent = mongoose.model('SiteContent', siteContentSchema);

// Only facts confirmed from the author's published biography are used here.
// Everything is editable from the admin portal ("Website" module).
export const defaultContent = {
  hero: {
    kicker: 'Welcome to the world of',
    title: 'Through the Golden Glades',
    tagline: 'Where stories find their way into the heart.',
    intro: 'Explore the books, characters and literary imagination of Jaya Roy Chowdhury.',
  },
  authorNote: {
    heading: 'Between Words and Worlds',
    body:
      'Jaya Roy Chowdhury has spent more than four decades in education, and a lifetime reading and thinking about what stories do to us. Her writing moves between fiction, poetry and literary reflection.',
  },
  authorProfile: {
    name: 'Jaya Roy Chowdhury',
    role: 'Author · Educationist · Poet',
    statement: 'Writing that looks beyond the familiar.',
    bio:
      'Jaya Roy Chowdhury is an educationist with more than four decades of experience, having worked with leading educational institutions in India and abroad.\n\nShe holds a postgraduate degree in English, specialising in American Literature, and has written both academic and non-academic books. An avid reader and thinker, she writes poetry and reflects on life through her work.',
    journey: '',
    approach: '',
    photo: null,
    quote: { text: '', attribution: '' },
  },
  quotes: [],
  instagramUrl: '',
  contactEmail: '',
};

export async function getContent() {
  return SiteContent.findOneAndUpdate(
    { key: 'main' },
    { $setOnInsert: { ...defaultContent } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}
