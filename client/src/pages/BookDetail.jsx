import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useFetch, useSeo } from '../lib/hooks.js';
import { api } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { paragraphs } from '../lib/format.js';
import { Spinner, ErrorNote } from '../components/ui.jsx';
import Cover from '../components/Cover.jsx';
import Portrait from '../components/Portrait.jsx';

function ReadingProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      setPct(Math.min(100, (h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)) * 100));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className="fixed left-0 top-16 z-30 h-0.5 w-full bg-transparent" aria-hidden="true">
      <div className="h-full bg-gold" style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function BookDetail() {
  const { slug } = useParams();
  const { data, loading, error } = useFetch(`/books/${slug}`);
  const { user } = useAuth();
  const book = data?.book;
  useSeo(book?.title, book?.tagline || book?.synopsis);

  useEffect(() => {
    if (user && book) api.post(`/reader/explored/${book.slug}`).catch(() => {});
  }, [user, book]);

  if (loading) return <Spinner />;
  if (error) return <ErrorNote error={error} />;

  const meta = [
    ['Publisher', book.publisher],
    ['Published', book.publishedOn],
    ['ISBN', book.isbn],
    ['Pages', book.pages || ''],
  ].filter(([, v]) => v);

  return (
    <article className="container-page section">
      <ReadingProgress />
      <div className="grid gap-12 md:grid-cols-[0.8fr_1.2fr]">
        <div className="mx-auto w-full max-w-xs md:sticky md:top-28 md:self-start">
          <Cover book={book} priority />
        </div>

        <div>
          <h1 className="text-5xl sm:text-6xl">{book.title}</h1>
          {book.subtitle && <p className="mt-2 font-serif text-2xl italic text-rose-deep">{book.subtitle}</p>}
          <p className="mt-2 text-forest/75">By Jaya Roy Chowdhury</p>

          {meta.length > 0 && (
            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 border-y border-parchment py-4 text-sm sm:grid-cols-4">
              {meta.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-forest/65">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          )}

          {book.synopsis && <div className="mt-8">{paragraphs(book.synopsis).map((p) => <p key={p.slice(0, 24)} className="serif-body mb-5">{p}</p>)}</div>}

          {(book.genres?.length > 0 || book.themes?.length > 0) && (
            <div className="mt-6 flex flex-wrap gap-2">
              {book.genres.map((g) => <span key={g} className="pill">{g}</span>)}
              {book.themes.map((t) => <span key={t} className="pill border-sage/40">{t}</span>)}
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            {book.amazonUrl && <a href={book.amazonUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Buy on Amazon</a>}
            {book.otherLinks?.map((l) => (
              <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">{l.label}</a>
            ))}
            {data.characters.length > 0 && <Link to={`/characters?book=${book.slug}`} className="btn btn-ghost">View Characters</Link>}
          </div>
        </div>
      </div>

      {data.characters.length > 0 && (
        <section className="mt-20" aria-labelledby="related-chars">
          <h2 id="related-chars" className="text-3xl sm:text-4xl">Meet the characters</h2>
          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-6">
            {data.characters.map((c) => (
              <Link key={c._id} to={`/characters/${c.slug}`} className="group block">
                <Portrait person={c} className="transition-transform duration-300 group-hover:-translate-y-1" />
                <p className="mt-2 font-serif text-xl">{c.name}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {data.others.length > 0 && (
        <section className="mt-20" aria-labelledby="other-books">
          <h2 id="other-books" className="text-3xl sm:text-4xl">Other books by the author</h2>
          <div className="mt-8 grid grid-cols-3 gap-5 sm:grid-cols-4 lg:grid-cols-6">
            {data.others.map((b) => (
              <Link key={b._id} to={`/books/${b.slug}`} className="block transition-transform hover:-translate-y-1">
                <Cover book={b} />
                <p className="mt-2 text-sm leading-snug">{b.title}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
