import { useEffect, useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { useFetch, useSeo } from '../lib/hooks.js';
import { paragraphs } from '../lib/format.js';
import Cover from '../components/Cover.jsx';
import Portrait from '../components/Portrait.jsx';
import BookCard from '../components/BookCard.jsx';
import CharacterCard from '../components/CharacterCard.jsx';

function QuoteRotator({ quotes }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (quotes.length < 2) return undefined;
    const t = setInterval(() => setI((n) => (n + 1) % quotes.length), 9000);
    return () => clearInterval(t);
  }, [quotes.length]);
  const q = quotes[i % quotes.length];
  return (
    <section className="bg-forest text-ivory" aria-label="A literary thought">
      <div className="container-page section text-center">
        <blockquote aria-live="polite" className="mx-auto max-w-3xl">
          <p className="font-serif text-3xl italic leading-snug sm:text-5xl">“{q.text}”</p>
          {q.attribution && <footer className="mt-6 text-sm text-ivory/75">{q.attribution}</footer>}
        </blockquote>
        {quotes.length > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {quotes.map((_, n) => (
              <button key={n} type="button" onClick={() => setI(n)} aria-label={`Show thought ${n + 1}`} aria-current={n === i} className={`h-2.5 w-2.5 rounded-full ${n === i ? 'bg-gold' : 'bg-ivory/30'}`} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default function Home() {
  const { content } = useOutletContext();
  const { data: bookData } = useFetch('/books');
  const { data: charData } = useFetch('/characters');
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  useSeo(null, content?.hero?.intro);

  const books = bookData?.books || [];
  const featured = books.find((b) => b.isFeatured) || books[0];
  const characters = (charData?.characters || []).slice(0, 6);
  const hero = content?.hero;
  const note = content?.authorNote;

  return (
    <>
      {/* Hero */}
      <section className="overflow-hidden">
        <div className="container-page grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="settle text-sm tracking-[0.2em] text-sage-deep" style={{ animationDelay: '0ms' }}>
              {hero?.kicker?.toUpperCase()}
            </p>
            <h1 className="settle mt-4 text-6xl leading-[0.98] sm:text-8xl" style={{ animationDelay: '120ms' }}>
              {hero?.title}
            </h1>
            <p className="settle mt-6 font-serif text-2xl italic text-rose-deep sm:text-3xl" style={{ animationDelay: '240ms' }}>
              {hero?.tagline}
            </p>
            <p className="settle mt-4 max-w-lg text-lg text-forest/80" style={{ animationDelay: '320ms' }}>
              {hero?.intro}
            </p>
            <div className="settle mt-8 flex flex-wrap gap-3" style={{ animationDelay: '420ms' }}>
              <Link to="/books" className="btn btn-primary">Explore the Books →</Link>
              <Link to="/author" className="btn btn-ghost">Meet the Author</Link>
            </div>
          </div>

          <div className="settle relative mx-auto w-full max-w-sm" style={{ animationDelay: '300ms' }}>
            <div className="arch absolute -right-4 -top-4 h-full w-full border border-gold/70" aria-hidden="true" />
            <div className="arch relative flex aspect-[3/4] items-end justify-center bg-parchment px-10 pb-10 pt-16">
              <Link to={featured ? `/books/${featured.slug}` : '/books'} className="block w-full -rotate-2 transition-transform hover:rotate-0" aria-label={featured ? `Open ${featured.title}` : 'Browse books'}>
                <Cover book={featured || { title: 'Through the Golden Glades' }} priority />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* A note from the author */}
      <section className="bg-parchment/45">
        <div className="container-page section grid items-center gap-10 md:grid-cols-[0.7fr_1.3fr]">
          <Portrait person={{ name: content?.authorProfile?.name, photo: content?.authorProfile?.photo }} className="mx-auto max-w-xs" />
          <div>
            <h2 className="text-4xl sm:text-5xl">{note?.heading}</h2>
            {paragraphs(note?.body).map((p) => (
              <p key={p.slice(0, 20)} className="serif-body mt-5 max-w-xl">{p}</p>
            ))}
            <Link to="/author" className="mt-6 inline-block font-medium underline decoration-gold underline-offset-4">Read her story</Link>
          </div>
        </div>
      </section>

      {/* Books */}
      {books.length > 0 && (
        <section className="section">
          <div className="container-page">
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-4xl sm:text-5xl">Discover the books</h2>
              <Link to="/books" className="hidden text-sm font-medium underline decoration-gold underline-offset-4 sm:block">All books</Link>
            </div>
          </div>
          <div className="container-page mt-10">
            <div className="-mx-5 flex snap-x gap-7 overflow-x-auto px-5 pb-4 sm:mx-0 sm:px-0" tabIndex={0} aria-label="Books, scroll sideways">
              {books.map((b) => (
                <BookCard key={b._id} book={b} className="w-48 shrink-0 snap-start sm:w-56" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Characters */}
      {characters.length > 0 && (
        <section className="section bg-parchment/45">
          <div className="container-page">
            <h2 className="text-4xl sm:text-5xl">The Characters Who Stay With Us</h2>
            <p className="mt-3 max-w-xl text-forest/80">Choose a face to find the story it belongs to.</p>
            <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
              {characters.map((c) => (
                <CharacterCard key={c._id} character={c} />
              ))}
            </div>
            <Link to="/characters" className="btn btn-ghost mt-10">Meet everyone</Link>
          </div>
        </section>
      )}

      {content?.quotes?.length > 0 && <QuoteRotator quotes={content.quotes} />}

      {/* Speak to the author */}
      <section className="section">
        <div className="container-page grid items-center gap-8 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="text-4xl sm:text-5xl">A Conversation Begins with a Word.</h2>
            <p className="mt-4 max-w-lg text-lg text-forest/80">Ask about a book, share what a story meant to you, or write about an invitation.</p>
          </div>
          <div className="md:text-right">
            <Link to="/speak" className="btn btn-primary">Speak to the Author</Link>
          </div>
        </div>
      </section>

      {/* Readers' Circle */}
      <section className="bg-sage-deep text-ivory">
        <div className="container-page section text-center">
          <h2 className="text-4xl sm:text-5xl">Join the Readers’ Circle</h2>
          <p className="mx-auto mt-3 max-w-md text-ivory/85">A little closer to the worlds within the pages.</p>
          <form
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              navigate(`/join${email ? `?email=${encodeURIComponent(email)}` : ''}`);
            }}
          >
            <label htmlFor="circle-email" className="sr-only">Email address</label>
            <input id="circle-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="field flex-1" autoComplete="email" />
            <button className="btn btn-light">Continue</button>
          </form>
        </div>
      </section>
    </>
  );
}
