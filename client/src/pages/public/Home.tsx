import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Users, Feather, Mail, ArrowRight, Quote, Sparkles, BookMarked, Calendar } from 'lucide-react';
import api from '../../api/client';
import { IBook, ICharacter, IJournalPost, IReaderLetter, ITestimonial, ISiteSettings } from '../../types';

export const Home: React.FC = () => {
  const [settings, setSettings] = useState<ISiteSettings | null>(null);
  const [featuredBooks, setFeaturedBooks] = useState<IBook[]>([]);
  const [spotlightCharacter, setSpotlightCharacter] = useState<ICharacter | null>(null);
  const [recentPosts, setRecentPosts] = useState<IJournalPost[]>([]);
  const [publicLetters, setPublicLetters] = useState<IReaderLetter[]>([]);
  const [testimonials, setTestimonials] = useState<ITestimonial[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [settingsRes, booksRes, charsRes, journalRes, lettersRes, testimonialsRes] = await Promise.all([
          api.get('/settings').catch(() => ({ data: { data: null } })),
          api.get('/books?featured=true').catch(() => ({ data: { data: [] } })),
          api.get('/characters?featured=true').catch(() => ({ data: { data: [] } })),
          api.get('/journal?status=published').catch(() => ({ data: { data: [] } })),
          api.get('/letters/public').catch(() => ({ data: { data: [] } })),
          api.get('/testimonials/public?featured=true').catch(() => ({ data: { data: [] } }))
        ]);

        if (settingsRes.data?.data) setSettings(settingsRes.data.data);
        if (booksRes.data?.data) setFeaturedBooks(booksRes.data.data);
        if (charsRes.data?.data?.length) setSpotlightCharacter(charsRes.data.data[0]);
        if (journalRes.data?.data) setRecentPosts(journalRes.data.data.slice(0, 3));
        if (lettersRes.data?.data) setPublicLetters(lettersRes.data.data.slice(0, 2));
        if (testimonialsRes.data?.data) setTestimonials(testimonialsRes.data.data);
      } catch (err) {
        console.error('Error fetching home contents', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const dailyFragment = settings?.dailyFragment || {
    quote: 'Memory is an ink that deepens with every season of rain, staining the paper until the silence speaks.',
    workTitle: 'The Memory of Rain',
    commentary: 'From Chapter IV, as Ananya returns to her grandfather’s library in Kalimpong.',
    dateString: 'Fragment of the Day'
  };

  return (
    <div className="space-y-24 pb-24 overflow-hidden">
      {/* 1. IMMERSIVE HERO SECTION */}
      <section className="relative pt-16 pb-20 md:pt-28 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Subtle background ambient blur */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-parchment/40 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="text-center max-w-4xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-brass/40 bg-parchment/40 text-xs uppercase tracking-[0.25em] text-forest font-editorial"
          >
            <span>Contemporary Literary Heritage</span>
            <span className="w-1 h-1 rounded-full bg-brass" />
            <span>Bengal &amp; The Diaspora</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="font-display text-4xl sm:text-6xl md:text-7xl font-bold text-burgundy tracking-tight leading-[1.08]"
          >
            {settings?.heroTitle || 'Where stories take root, characters breathe, and every reader finds a little piece of themselves.'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-reading text-lg sm:text-xl text-charcoal/80 max-w-2xl mx-auto leading-relaxed italic"
          >
            {settings?.heroIntro || 'Step across the threshold into the novels, character archives, reader letters, and meditative essays of author Ms. Jaya Roy Chowdhury.'}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="pt-6 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              to="/books"
              className="px-6 py-3.5 bg-burgundy hover:bg-burgundy-dark text-ivory text-xs uppercase tracking-widest font-semibold transition-all border border-burgundy shadow-sm flex items-center gap-2"
            >
              <BookOpen size={15} /> Explore The Bookshelf
            </Link>
            <Link
              to="/characters"
              className="px-6 py-3.5 bg-transparent hover:bg-parchment/50 text-charcoal text-xs uppercase tracking-widest font-semibold transition-all border border-brass/60 flex items-center gap-2"
            >
              <Users size={15} /> Character Directory
            </Link>
            <Link
              to="/correspondence"
              className="px-6 py-3.5 bg-forest hover:bg-forest-light text-ivory text-xs uppercase tracking-widest font-semibold transition-all border border-forest flex items-center gap-2"
            >
              <Mail size={15} /> Write to Author
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. THE DAILY FRAGMENT */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="relative p-8 md:p-12 bg-[#FAF7F2] border border-brass/40 deckled-shadow text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-brass text-xs uppercase tracking-widest font-editorial">
            <Sparkles size={14} />
            <span>{dailyFragment.dateString || 'Daily Fragment'}</span>
            <Sparkles size={14} />
          </div>

          <blockquote className="font-display text-2xl md:text-3xl text-burgundy font-medium leading-snug italic max-w-2xl mx-auto">
            "{dailyFragment.quote}"
          </blockquote>

          <div className="pt-2 text-xs uppercase tracking-wider text-charcoal/70">
            <span className="font-editorial font-semibold text-forest">— {dailyFragment.workTitle}</span>
            {dailyFragment.commentary && (
              <span className="block mt-1 font-reading text-charcoal/60 lowercase italic">
                {dailyFragment.commentary}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* 3. AUTHOR INTRODUCTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-5 relative">
            <div className="p-3 bg-parchment/80 border border-brass/50 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=700"
                alt="Ms. Jaya Roy Chowdhury"
                className="w-full h-auto object-cover grayscale contrast-125 sepia-[0.15]"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-burgundy text-ivory px-4 py-2 text-[11px] font-editorial uppercase tracking-widest shadow border border-brass/30">
              Ms. Jaya Roy Chowdhury
            </div>
          </div>

          <div className="md:col-span-7 space-y-5">
            <span className="text-xs uppercase tracking-[0.25em] text-forest font-semibold block">
              The Author &amp; Her Canvas
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-burgundy leading-tight">
              An intimate chronicler of monsoon silence and historical longings.
            </h2>
            <p className="font-reading text-base sm:text-lg text-charcoal/80 leading-relaxed">
              Ms. Jaya Roy Chowdhury was born in Kolkata and spent formative years in the mist-veiled plantations of North Bengal. Her novels probe the silences inherited across generations, the unwritten archives of female courage, and the indelible relationship between land, river, and human memory.
            </p>
            <p className="font-reading text-sm text-charcoal/70 italic border-l-2 border-brass pl-4">
              "To write is to listen to the room after the piano has stopped playing. It is in that vibrating silence that the true story waits."
            </p>
            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-burgundy hover:text-burgundy-dark underline underline-offset-4"
              >
                Read Biography &amp; Literary Timeline <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED BOOKS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-brass/30 pb-4 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-forest font-semibold block">
              The Published Body of Work
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-burgundy">
              The Bookshelf
            </h2>
          </div>
          <Link
            to="/books"
            className="text-xs uppercase tracking-widest font-semibold text-burgundy hover:text-burgundy-dark flex items-center gap-1.5"
          >
            View Complete Catalogue &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredBooks.map((book) => (
            <article
              key={book._id}
              className="paper-card flex flex-col justify-between group transition-transform duration-200 hover:-translate-y-1"
            >
              <div>
                <div className="relative aspect-[3/4] overflow-hidden bg-parchment/60 border-b border-brass/30">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 bg-burgundy/90 text-ivory text-[10px] uppercase tracking-widest px-2.5 py-1">
                    {book.status === 'published' ? 'Published' : book.status === 'coming_soon' ? 'Coming Soon' : 'Work in Progress'}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <span className="text-[10px] uppercase tracking-widest text-forest font-semibold">
                    {book.genre}
                  </span>
                  <h3 className="font-display text-2xl font-bold text-burgundy leading-snug group-hover:text-forest transition-colors">
                    <Link to={`/books/${book.slug}`}>{book.title}</Link>
                  </h3>
                  {book.subtitle && (
                    <p className="font-editorial text-xs text-charcoal/70 italic -mt-1">
                      {book.subtitle}
                    </p>
                  )}
                  <p className="font-reading text-xs text-charcoal/80 line-clamp-3 leading-relaxed pt-1">
                    {book.synopsis}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-3 border-t border-brass/20 flex items-center justify-between">
                <Link
                  to={`/books/${book.slug}`}
                  className="text-xs font-semibold text-burgundy hover:underline flex items-center gap-1"
                >
                  Explore Book <ArrowRight size={12} />
                </Link>
                {book.pageCount && (
                  <span className="text-[10px] text-charcoal/60 uppercase">
                    {book.pageCount} Pages
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 5. CHARACTER SPOTLIGHT & LITERARY UNIVERSE */}
      {spotlightCharacter && (
        <section className="bg-parchment/70 border-y border-brass/40 py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-4 flex justify-center">
                <div className="p-2 bg-ivory border border-brass/50 shadow-md max-w-xs">
                  <img
                    src={spotlightCharacter.portraitUrl}
                    alt={spotlightCharacter.name}
                    className="w-full h-80 object-cover grayscale contrast-110"
                  />
                  <div className="p-3 text-center bg-ivory">
                    <h4 className="font-display text-xl font-bold text-burgundy">{spotlightCharacter.name}</h4>
                    <p className="font-editorial text-[10px] uppercase tracking-widest text-forest">
                      {spotlightCharacter.archetype}
                    </p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-8 space-y-4">
                <span className="text-xs uppercase tracking-[0.25em] text-burgundy font-semibold block">
                  Character Spotlight &bull; Between the Pages
                </span>
                <h3 className="font-display text-3xl sm:text-4xl font-bold text-charcoal">
                  Meet the figures who inhabit Ms. Roy Chowdhury’s literary cosmology.
                </h3>
                {spotlightCharacter.memorableQuotes?.length > 0 && (
                  <blockquote className="font-reading text-lg text-forest italic border-l-2 border-forest pl-4 py-1">
                    "{spotlightCharacter.memorableQuotes[0]}"
                  </blockquote>
                )}
                <p className="font-reading text-sm text-charcoal/80 leading-relaxed">
                  {spotlightCharacter.background}
                </p>
                <div className="pt-2 flex flex-wrap gap-4">
                  <Link
                    to={`/characters/${spotlightCharacter.slug}`}
                    className="px-5 py-2.5 bg-burgundy hover:bg-burgundy-dark text-ivory text-xs uppercase tracking-widest font-semibold transition-colors"
                  >
                    View Character Dossier
                  </Link>
                  <Link
                    to="/characters"
                    className="px-5 py-2.5 bg-ivory hover:bg-parchment text-charcoal text-xs uppercase tracking-widest font-semibold border border-brass/50 transition-colors"
                  >
                    View Relationship Network &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 6. LATEST FROM THE INK JOURNAL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-brass/30 pb-4 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-forest font-semibold block">
              Essays, Reflections &amp; Craft
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-burgundy">
              The Ink Journal
            </h2>
          </div>
          <Link
            to="/journal"
            className="text-xs uppercase tracking-widest font-semibold text-burgundy hover:text-burgundy-dark flex items-center gap-1.5"
          >
            All Journal Essays &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recentPosts.map((post) => (
            <article key={post._id} className="paper-card flex flex-col justify-between group">
              <div>
                <div className="aspect-[16/10] overflow-hidden bg-parchment/60 border-b border-brass/30">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 space-y-2">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-brass font-medium">
                    <span>{post.category}</span>
                    <span>{post.readingTimeMinutes} min read</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-burgundy group-hover:text-forest transition-colors leading-snug">
                    <Link to={`/journal/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="font-reading text-xs text-charcoal/70 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>
              <div className="p-6 pt-0">
                <Link
                  to={`/journal/${post.slug}`}
                  className="text-xs uppercase tracking-wider font-semibold text-forest hover:text-burgundy flex items-center gap-1"
                >
                  Read Essay <ArrowRight size={12} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 7. SELECTED READER CORRESPONDENCE & PRAISE */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] text-forest font-semibold block">
            An Epistolary Exchange
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-burgundy">
            Letters From The Reading Room
          </h2>
          <p className="font-reading text-sm text-charcoal/70 italic max-w-lg mx-auto">
            Excerpts of reader reflections selected with consent, paired with personal responses from the author’s desk.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {publicLetters.map((letter) => (
            <div
              key={letter.id || letter._id}
              className="p-6 sm:p-8 bg-ivory border border-brass/50 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between border-b border-brass/20 pb-3">
                <span className="font-editorial text-xs text-forest font-semibold uppercase tracking-wider">
                  From: {letter.senderName}
                </span>
                <span className="text-[10px] text-charcoal/50 uppercase tracking-widest">
                  Letter of Reflection
                </span>
              </div>
              <h4 className="font-display text-lg font-bold text-burgundy">
                "{letter.subject}"
              </h4>
              <p className="font-reading text-xs text-charcoal/80 leading-relaxed italic">
                "{letter.message}"
              </p>

              {letter.authorReply && (
                <div className="pt-4 mt-4 border-t border-brass/20 bg-parchment/40 p-4 space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-burgundy font-semibold block">
                    Response from Ms. Jaya Roy Chowdhury:
                  </span>
                  <p className="font-reading text-xs text-forest italic leading-relaxed">
                    "{letter.authorReply}"
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center pt-2">
          <Link
            to="/correspondence"
            className="inline-flex items-center gap-2 px-6 py-3 bg-burgundy hover:bg-burgundy-dark text-ivory text-xs uppercase tracking-widest font-semibold transition-colors"
          >
            <Mail size={14} /> Send Your Letter to Ms. Roy Chowdhury
          </Link>
        </div>
      </section>

      {/* 8. CRITICAL ACCLAIM RIBBON */}
      {testimonials.length > 0 && (
        <section className="bg-charcoal text-parchment py-16 border-y border-brass/40">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
            <Quote size={28} className="mx-auto text-brass opacity-60" />
            <blockquote className="font-display text-2xl sm:text-3xl text-ivory italic max-w-3xl mx-auto leading-relaxed">
              "{testimonials[0].quote}"
            </blockquote>
            <p className="font-editorial text-xs uppercase tracking-[0.25em] text-brass">
              — {testimonials[0].attribution} ({testimonials[0].source})
            </p>
          </div>
        </section>
      )}
    </div>
  );
};
