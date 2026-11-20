import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Share2, BookOpen, Check, Feather } from 'lucide-react';
import api from '../../api/client';
import { IJournalPost } from '../../types';
import { useToast } from '../../context/ToastContext';

export const JournalDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<IJournalPost | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { success } = useToast();

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/journal/${slug}`);
        if (res.data?.success) {
          setPost(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching journal post:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) fetchPost();
  }, [slug]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    success('Essay link copied to clipboard.');
    setTimeout(() => setCopiedLink(false), 3000);
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center font-reading text-burgundy text-lg">
        Turning the journal leaf...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="font-display text-3xl text-burgundy">Essay Not Found</h2>
        <p className="font-reading text-charcoal/70">
          This manuscript page has been withdrawn or archived.
        </p>
        <Link to="/journal" className="text-xs uppercase tracking-widest text-forest font-semibold underline">
          &larr; Return to The Ink Journal
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Back button & share toolbar */}
      <div className="flex items-center justify-between border-b border-brass/30 pb-4">
        <Link
          to="/journal"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-forest font-semibold hover:text-burgundy transition-colors"
        >
          <ArrowLeft size={14} /> Back to The Ink Journal
        </Link>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-charcoal/80 hover:text-burgundy transition-colors"
        >
          {copiedLink ? <Check size={14} className="text-forest" /> : <Share2 size={14} />}
          <span>{copiedLink ? 'Link Copied' : 'Share Essay'}</span>
        </button>
      </div>

      {/* Article Header */}
      <header className="space-y-4 text-center max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-3 text-xs uppercase tracking-widest text-brass font-editorial">
          <span>{post.category}</span>
          <span>&bull;</span>
          <span className="flex items-center gap-1">
            <Clock size={12} /> {post.readingTimeMinutes} min read
          </span>
          {post.publishedAt && (
            <>
              <span>&bull;</span>
              <span>
                {new Date(post.publishedAt).toLocaleDateString(undefined, {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </>
          )}
        </div>

        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-burgundy tracking-tight leading-[1.1]">
          {post.title}
        </h1>

        <p className="font-reading text-lg text-charcoal/80 italic max-w-2xl mx-auto leading-relaxed pt-2">
          {post.excerpt}
        </p>
      </header>

      {/* Featured Image */}
      <div className="p-3 bg-parchment/60 border border-brass/40 deckled-shadow">
        <img
          src={post.featuredImage}
          alt={post.title}
          className="w-full h-[400px] object-cover"
        />
      </div>

      {/* Article Content */}
      <div className="prose prose-lg max-w-none font-reading text-charcoal/90 leading-relaxed space-y-6 pt-4">
        {post.content.split('\n\n').map((paragraph, idx) => {
          const trimmed = paragraph.trim();
          if (!trimmed) return null;

          if (trimmed.startsWith('# ')) {
            return (
              <h2 key={idx} className="font-display text-3xl font-bold text-burgundy pt-6 pb-2">
                {trimmed.replace('# ', '')}
              </h2>
            );
          }

          if (trimmed.startsWith('### ')) {
            return (
              <h3 key={idx} className="font-display text-2xl font-bold text-forest pt-4 pb-1">
                {trimmed.replace('### ', '')}
              </h3>
            );
          }

          if (trimmed.startsWith('> ')) {
            return (
              <blockquote
                key={idx}
                className="p-6 bg-[#FAF7F2] border-l-4 border-burgundy font-display text-2xl text-charcoal italic leading-relaxed my-6 shadow-sm"
              >
                {trimmed.replace('> ', '').replace(/"/g, '')}
              </blockquote>
            );
          }

          // Regular paragraph with drop-cap on first standard paragraph
          const isFirstPara = idx === 1 || (idx === 0 && !trimmed.startsWith('#'));
          return (
            <p
              key={idx}
              className={`text-base sm:text-lg leading-relaxed ${isFirstPara ? 'drop-cap' : ''}`}
            >
              {trimmed}
            </p>
          );
        })}
      </div>

      {/* Author Sign-off */}
      <div className="pt-8 border-t border-brass/40 flex flex-col sm:flex-row items-center justify-between gap-6 bg-parchment/40 p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <img
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200"
            alt="Ms. Jaya Roy Chowdhury"
            className="w-16 h-16 rounded-full object-cover border border-brass/50 grayscale"
          />
          <div>
            <span className="font-editorial text-[10px] uppercase tracking-widest text-brass block">
              Authored By
            </span>
            <h4 className="font-display text-xl font-bold text-burgundy">
              Ms. Jaya Roy Chowdhury
            </h4>
            <p className="font-reading text-xs text-charcoal/70 italic">
              Novelist, essayist, and archivist of Bengal memory.
            </p>
          </div>
        </div>

        <Link
          to="/correspondence"
          className="px-5 py-2.5 bg-burgundy hover:bg-burgundy-dark text-ivory text-xs uppercase tracking-widest font-semibold transition-colors shrink-0"
        >
          Send Author Reflections
        </Link>
      </div>

      {/* Associated Books if any */}
      {post.relatedBooks && post.relatedBooks.length > 0 && (
        <section className="space-y-4 pt-6">
          <span className="font-editorial text-xs uppercase tracking-widest text-forest font-semibold block">
            Companion Volumes
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {post.relatedBooks.map((b) => (
              <Link
                key={b._id}
                to={`/books/${b.slug}`}
                className="paper-card p-4 flex items-center gap-4 group hover:-translate-y-0.5 transition-transform"
              >
                <img
                  src={b.coverImage}
                  alt={b.title}
                  className="w-14 h-20 object-cover border border-brass/30 shrink-0"
                />
                <div>
                  <h5 className="font-display font-bold text-lg text-burgundy group-hover:text-forest transition-colors">
                    {b.title}
                  </h5>
                  <span className="text-[10px] uppercase text-charcoal/60">Explore Volume &rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
};
