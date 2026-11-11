import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';

export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [results, setResults] = useState(null);
  const inputRef = useRef(null);
  const boxRef = useRef(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (q.trim().length < 2) {
      setResults(null);
      return undefined;
    }
    const t = setTimeout(() => api.get(`/search?q=${encodeURIComponent(q.trim())}`).then(setResults).catch(() => setResults(null)), 250);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    const close = (e) => {
      if (e.key === 'Escape' || (e.type === 'mousedown' && boxRef.current && !boxRef.current.contains(e.target))) setOpen(false);
    };
    document.addEventListener('keydown', close);
    document.addEventListener('mousedown', close);
    return () => {
      document.removeEventListener('keydown', close);
      document.removeEventListener('mousedown', close);
    };
  }, []);

  const done = () => {
    setOpen(false);
    setQ('');
    setResults(null);
  };
  const empty = results && !results.books.length && !results.characters.length;

  return (
    <div ref={boxRef} className="relative">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-label="Search books and characters" aria-expanded={open} className="rounded-full p-2 hover:bg-parchment/70">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" strokeLinecap="round" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-12 z-50 w-[min(22rem,calc(100vw-2.5rem))] rounded-2xl border border-parchment bg-ivory p-3 shadow-soft">
          <label htmlFor="site-search" className="sr-only">
            Search books and characters
          </label>
          <input id="site-search" ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search books and characters" className="field" autoComplete="off" />
          {results && (
            <div className="mt-3 max-h-72 overflow-auto text-sm">
              {results.books.length > 0 && <p className="px-2 pb-1 text-xs text-forest/70">Books</p>}
              {results.books.map((b) => (
                <Link key={b._id} to={`/books/${b.slug}`} onClick={done} className="block rounded-lg px-2 py-2 hover:bg-parchment/60">
                  {b.title}
                </Link>
              ))}
              {results.characters.length > 0 && <p className="px-2 pb-1 pt-2 text-xs text-forest/70">Characters</p>}
              {results.characters.map((c) => (
                <Link key={c._id} to={`/characters/${c.slug}`} onClick={done} className="block rounded-lg px-2 py-2 hover:bg-parchment/60">
                  {c.name}
                </Link>
              ))}
              {empty && <p className="px-2 py-2 text-forest/70">Nothing found for “{q}”. Try a different word.</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
