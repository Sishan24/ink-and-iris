// Usage:  npm run seed         → admin account + default site content + the author's known titles (unpublished)
//         npm run seed:demo    → also publishes placeholder content so you can see the finished site
import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Book } from '../models/Book.js';
import { Character } from '../models/Character.js';
import { getContent, SiteContent } from '../models/SiteContent.js';
import { slugify } from '../utils/http.js';

const demo = process.argv.includes('--demo');
const PLACEHOLDER = 'Synopsis awaiting the author’s approval.';

// Titles found in public listings. Details are intentionally minimal until the author confirms them.
const books = [
  { title: 'Anahita’s Wanderlust', tagline: 'A journey across lives, memories, encounters and the mysteries of existence.', publisher: 'Namya Press', publishedOn: 'December 2022', isbn: '9789355459688', pages: 125, isFeatured: true },
  { title: 'Dewy Dells Hazy Hills', publisher: 'True Dreamster', publishedOn: 'November 2020' },
  { title: 'Inscriptions' },
  { title: 'Of Kings and Queens and Saints and Rogues' },
  { title: 'Anecdotes' },
  { title: 'Birnam Wood to Dunsinane Hill', publisher: 'Namya Press', isbn: '9789355458612' },
  { title: 'Through Golden Glades', publisher: 'Namya Press' },
];

const characters = ['Anahita', 'Madhavi', 'Dev', 'Sharmishtha', 'Puru'];

async function run() {
  if (!env.adminEmail) throw new Error('Set ADMIN_EMAIL in server/.env before seeding.');
  await connectDB();

  await User.findOneAndUpdate(
    { email: env.adminEmail },
    { $set: { role: 'admin', isVerified: true, status: 'active' }, $setOnInsert: { name: env.adminName } },
    { upsert: true }
  );
  console.log(`Admin account ready: ${env.adminEmail}`);

  await getContent();
  if (demo) {
    await SiteContent.updateOne(
      { key: 'main', 'quotes.0': { $exists: false } },
      { $set: { quotes: [{ text: 'An author-approved literary thought appears here.', attribution: 'Jaya Roy Chowdhury' }, { text: 'Another approved reflection can rotate in beside it.', attribution: 'Jaya Roy Chowdhury' }] } }
    );
  }

  const bookDocs = [];
  for (const [i, b] of books.entries()) {
    const slug = slugify(b.title);
    const doc = await Book.findOneAndUpdate(
      { slug },
      { $setOnInsert: { synopsis: PLACEHOLDER, genres: [], themes: [], order: i, isPublished: demo, ...b } },
      { upsert: true, new: true }
    );
    bookDocs.push(doc);
  }
  console.log(`${books.length} books ready (${demo ? 'published for demo' : 'unpublished — publish them from the admin portal'})`);

  if (demo) {
    const anahita = bookDocs[0];
    for (const [i, name] of characters.entries()) {
      await Character.findOneAndUpdate(
        { slug: slugify(name) },
        { $setOnInsert: { name, bookIds: [anahita._id], about: 'Description awaiting the author’s approval.', isPublished: true, order: i } },
        { upsert: true }
      );
    }
    console.log(`${characters.length} placeholder characters added to ${anahita.title}`);
  }

  await mongoose.disconnect();
  console.log('Done.');
}

run().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
