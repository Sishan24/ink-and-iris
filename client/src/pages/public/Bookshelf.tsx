import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, ArrowRight, Tag, BookMarked } from 'lucide-react';
import api from '../../api/client';
import { IBook } from '../../types';

export const Bookshelf: React.FC = () => {
  const [books, setBooks] = useState<IBook[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (selectedStatus !== 'all') queryParams.append('status', selectedStatus);
        if (searchQuery.trim()) queryParams.append('search', searchQuery.trim());

        const res = await api.get(`/books?${queryParams.toString()}`);
        if (res.data?.success) {
          setBooks(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching bookshelf:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, [selectedStatus, searchQuery]);

  const statusFilters = [
    { label: 'All Volumes', value: 'all' },
    { label: 'Published Works', value: 'published' },
    { label: 'Coming Soon', value: 'coming_soon' },
    { label: 'In Progress', value: 'work_in_progress' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs uppercase tracking-[0.25em] text-forest font-semibold block">
          The Complete Catalogue
        </span>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-burgundy tracking-tight">
          The Bookshelf
        </h1>
        <p className="font-reading text-base sm:text-lg text-charcoal/80 italic leading-relaxed">
          From the monsoons of North Bengal to wartime Calcutta, explore the complete published novels, forthcoming novellas, and works currently taking shape upon the writing desk.
        </p>
      </div>

      {/* Controls: Search and Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-y border-brass/30 py-4">
        {/* Status tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {statusFilters.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setSelectedStatus(tab.value)}
              className={`px-3.5 py-1.5 text-xs uppercase tracking-wider font-medium transition-all ${
                selectedStatus === tab.value
                  ? 'bg-burgundy text-ivory font-semibold'
                  : 'bg-parchment/60 text-charcoal/80 hover:bg-parchment'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, theme, or keyword..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-ivory border border-brass/50 text-charcoal placeholder-charcoal/40 focus:outline-none focus:border-burgundy"
          />
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brass" />
        </div>
      </div>

      {/* Books Grid */}
      {isLoading ? (
        <div className="py-24 text-center font-reading text-burgundy text-lg">
          Opening the archives...
        </div>
      ) : books.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-parchment/30 border border-brass/30 p-8">
          <BookMarked size={32} className="mx-auto text-brass opacity-60" />
          <h3 className="font-display text-2xl text-charcoal">No volumes match your inquiry</h3>
          <p className="font-reading text-sm text-charcoal/60">
            Adjust your search query or status filter to browse other works.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {books.map((book) => (
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
                  <div
                    className={`absolute top-3 right-3 text-[10px] uppercase tracking-widest px-2.5 py-1 ${
                      book.status === 'published'
                        ? 'bg-burgundy text-ivory'
                        : book.status === 'coming_soon'
                        ? 'bg-forest text-ivory'
                        : 'bg-brass text-charcoal font-semibold'
                    }`}
                  >
                    {book.status === 'published'
                      ? 'Published'
                      : book.status === 'coming_soon'
                      ? 'Coming Soon'
                      : 'Work in Progress'}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <span className="text-[10px] uppercase tracking-widest text-forest font-semibold">
                    {book.genre}
                  </span>
                  <h2 className="font-display text-2xl font-bold text-burgundy leading-snug group-hover:text-forest transition-colors">
                    <Link to={`/books/${book.slug}`}>{book.title}</Link>
                  </h2>
                  {book.subtitle && (
                    <p className="font-editorial text-xs text-charcoal/70 italic -mt-1">
                      {book.subtitle}
                    </p>
                  )}
                  <p className="font-reading text-xs text-charcoal/80 line-clamp-3 leading-relaxed pt-1">
                    {book.synopsis}
                  </p>

                  {/* Themes */}
                  {book.themes && book.themes.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {book.themes.slice(0, 3).map((theme, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 text-[10px] bg-parchment/70 border border-brass/30 px-2 py-0.5 text-charcoal/70 font-sans"
                        >
                          <Tag size={9} className="text-brass" />
                          {theme}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="px-6 pb-6 pt-3 border-t border-brass/20 flex items-center justify-between">
                <Link
                  to={`/books/${book.slug}`}
                  className="text-xs font-semibold text-burgundy hover:underline flex items-center gap-1"
                >
                  Read Excerpts &amp; Notes <ArrowRight size={12} />
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
      )}
    </div>
  );
};
