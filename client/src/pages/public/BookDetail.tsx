import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  BookOpen,
  ArrowLeft,
  ExternalLink,
  Users,
  Feather,
  Mail,
  Calendar,
  Layers,
  BookMarked
} from 'lucide-react';
import api from '../../api/client';
import { IBook } from '../../types';

export const BookDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [book, setBook] = useState<IBook | null>(null);
  const [activeExcerptIndex, setActiveExcerptIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBook = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/books/${slug}`);
        if (res.data?.success) {
          setBook(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching book:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) fetchBook();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center font-reading text-burgundy text-lg">
        Retrieving manuscript archives...
      </div>
    );
  }

  if (!book) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="font-display text-3xl text-burgundy">Volume Not Found</h2>
        <p className="font-reading text-charcoal/70">
          The requested book record does not exist or has been archived.
        </p>
        <Link to="/books" className="text-xs uppercase tracking-widest text-forest font-semibold underline">
          &larr; Return to The Bookshelf
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Back link */}
      <div>
        <Link
          to="/books"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-forest font-semibold hover:text-burgundy transition-colors"
        >
          <ArrowLeft size={14} /> Back to The Bookshelf
        </Link>
      </div>

      {/* Main Book Header and Dossier */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14">
        {/* Cover image column */}
        <div className="md:col-span-5 space-y-6">
          <div className="p-3 bg-parchment/60 border border-brass/40 shadow-lg">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Alternate gallery images */}
          {book.galleryImages && book.galleryImages.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {book.galleryImages.map((imgUrl, idx) => (
                <div key={idx} className="border border-brass/30 p-1 bg-ivory">
                  <img
                    src={imgUrl}
                    alt={`${book.title} detail ${idx + 1}`}
                    className="w-full h-28 object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Acquisition & Purchase links */}
          {book.purchaseLinks && book.purchaseLinks.length > 0 && (
            <div className="p-5 bg-parchment/40 border border-brass/30 space-y-3">
              <h4 className="font-editorial text-xs uppercase tracking-widest text-forest font-semibold">
                Acquire This Volume
              </h4>
              <div className="space-y-2">
                {book.purchaseLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-3.5 py-2.5 bg-ivory border border-brass/40 text-xs font-medium text-charcoal hover:text-burgundy hover:border-burgundy transition-all"
                  >
                    <span>{link.store}</span>
                    <ExternalLink size={12} className="text-brass" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Book Details column */}
        <div className="md:col-span-7 space-y-8">
          <div className="space-y-2 border-b border-brass/30 pb-6">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-[0.2em] text-forest font-semibold">
                {book.genre}
              </span>
              <span className="text-brass">•</span>
              <span className="text-xs uppercase tracking-widest text-burgundy font-semibold">
                {book.status === 'published' ? 'Published Work' : book.status === 'coming_soon' ? 'Forthcoming' : 'Work in Progress'}
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl font-bold text-burgundy tracking-tight">
              {book.title}
            </h1>

            {book.subtitle && (
              <p className="font-editorial text-lg text-charcoal/70 italic">
                {book.subtitle}
              </p>
            )}
          </div>

          {/* Synopsis */}
          <div className="space-y-3">
            <h3 className="font-editorial text-xs uppercase tracking-widest text-forest font-semibold">
              Synopsis &amp; Themes
            </h3>
            <p className="font-reading text-base text-charcoal/90 leading-relaxed">
              {book.synopsis}
            </p>

            {book.themes && book.themes.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {book.themes.map((t, i) => (
                  <span
                    key={i}
                    className="text-xs bg-parchment/70 border border-brass/30 px-2.5 py-1 text-charcoal/70 font-sans"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Publishing Metadata Dossier */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-[#FAF7F2] border border-brass/30 text-xs">
            {book.publisher && (
              <div>
                <span className="text-charcoal/50 uppercase text-[10px] block">Publisher</span>
                <span className="font-medium text-charcoal">{book.publisher}</span>
              </div>
            )}
            {book.publicationDate && (
              <div>
                <span className="text-charcoal/50 uppercase text-[10px] block">Publication Date</span>
                <span className="font-medium text-charcoal">
                  {new Date(book.publicationDate).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long'
                  })}
                </span>
              </div>
            )}
            {book.isbn && (
              <div>
                <span className="text-charcoal/50 uppercase text-[10px] block">ISBN</span>
                <span className="font-medium text-charcoal font-mono">{book.isbn}</span>
              </div>
            )}
            {book.pageCount && (
              <div>
                <span className="text-charcoal/50 uppercase text-[10px] block">Length</span>
                <span className="font-medium text-charcoal">{book.pageCount} Pages</span>
              </div>
            )}
          </div>

          {/* Author Notes */}
          {book.authorNotes && (
            <div className="p-6 bg-parchment/50 border-l-3 border-burgundy space-y-2">
              <span className="font-editorial text-xs uppercase tracking-widest text-burgundy font-semibold flex items-center gap-1.5">
                <Feather size={13} /> Author’s Reflection — Ms. Jaya Roy Chowdhury
              </span>
              <p className="font-reading text-sm text-charcoal/80 italic leading-relaxed">
                "{book.authorNotes}"
              </p>
            </div>
          )}

          {/* Prompt to write reader letter */}
          <div className="pt-2">
            <Link
              to={`/correspondence?book=${book._id}`}
              className="inline-flex items-center gap-2 px-5 py-3 bg-burgundy hover:bg-burgundy-dark text-ivory text-xs uppercase tracking-widest font-semibold transition-colors"
            >
              <Mail size={14} /> Send a Reader Letter Regarding This Book
            </Link>
          </div>
        </div>
      </div>

      {/* Selected Excerpts Reader */}
      {book.excerpts && book.excerpts.length > 0 && (
        <section className="space-y-6 pt-8 border-t border-brass/30">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-forest font-semibold block">
                Reading Room Chamber
              </span>
              <h2 className="font-display text-3xl font-bold text-burgundy">
                Selected Excerpts
              </h2>
            </div>

            {/* Excerpt tabs if multiple */}
            {book.excerpts.length > 1 && (
              <div className="flex gap-2">
                {book.excerpts.map((exc, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveExcerptIndex(idx)}
                    className={`px-3 py-1.5 text-xs font-editorial uppercase tracking-wider transition-colors ${
                      activeExcerptIndex === idx
                        ? 'bg-burgundy text-ivory font-semibold'
                        : 'bg-parchment/60 text-charcoal/70 hover:bg-parchment'
                    }`}
                  >
                    Passage {idx + 1}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-8 sm:p-12 bg-[#FAF7F2] border border-brass/40 deckled-shadow space-y-4">
            <h3 className="font-display text-2xl font-bold text-forest">
              {book.excerpts[activeExcerptIndex]?.title}
            </h3>
            <div className="font-reading text-base sm:text-lg text-charcoal/90 leading-relaxed whitespace-pre-line drop-cap">
              {book.excerpts[activeExcerptIndex]?.text}
            </div>
          </div>
        </section>
      )}

      {/* Associated Characters */}
      {book.associatedCharacters && book.associatedCharacters.length > 0 && (
        <section className="space-y-6 pt-8 border-t border-brass/30">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-forest font-semibold block">
                Dramatis Personae
              </span>
              <h2 className="font-display text-3xl font-bold text-burgundy">
                Associated Characters
              </h2>
            </div>
            <Link
              to="/characters"
              className="text-xs uppercase tracking-widest font-semibold text-forest hover:text-burgundy"
            >
              All Characters &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {book.associatedCharacters.map((char) => (
              <Link
                key={char._id}
                to={`/characters/${char.slug}`}
                className="paper-card p-4 flex items-center gap-4 group hover:-translate-y-0.5 transition-transform"
              >
                <img
                  src={char.portraitUrl}
                  alt={char.name}
                  className="w-16 h-16 rounded-full object-cover grayscale contrast-110 border border-brass/40 shrink-0"
                />
                <div>
                  <h4 className="font-display text-lg font-bold text-burgundy group-hover:text-forest transition-colors">
                    {char.name}
                  </h4>
                  <p className="font-editorial text-[10px] uppercase tracking-wider text-charcoal/60">
                    {char.archetype}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
