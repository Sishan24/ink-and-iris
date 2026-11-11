import { Link, useOutletContext } from 'react-router-dom';
import { useFetch, useSeo } from '../lib/hooks.js';
import { paragraphs } from '../lib/format.js';
import Portrait from '../components/Portrait.jsx';
import { Spinner } from '../components/ui.jsx';

export default function Author() {
  const { content } = useOutletContext();
  const { data } = useFetch('/books');
  const p = content?.authorProfile;
  useSeo('The Author', p?.statement);
  if (!p) return <Spinner />;

  return (
    <div className="container-page section">
      <div className="grid items-center gap-10 md:grid-cols-[0.8fr_1.2fr]">
        <Portrait person={{ name: p.name, photo: p.photo }} className="mx-auto max-w-sm" />
        <div>
          {p.role && <p className="text-sm text-sage-deep">{p.role}</p>}
          <h1 className="mt-2 text-5xl sm:text-7xl">{p.name}</h1>
          {p.statement && <p className="mt-5 font-serif text-2xl italic text-rose-deep sm:text-3xl">{p.statement}</p>}
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-2xl">
        {paragraphs(p.bio).map((t) => (
          <p key={t.slice(0, 24)} className="serif-body mb-6">{t}</p>
        ))}

        {p.journey && (
          <>
            <h2 className="mb-4 mt-14 text-3xl sm:text-4xl">Her literary journey</h2>
            {paragraphs(p.journey).map((t) => <p key={t.slice(0, 24)} className="serif-body mb-6">{t}</p>)}
          </>
        )}

        {data?.books?.length > 0 && (
          <>
            <h2 className="mb-4 mt-14 text-3xl sm:text-4xl">Published works</h2>
            <ul className="divide-y divide-parchment border-y border-parchment">
              {data.books.map((b) => (
                <li key={b._id}>
                  <Link to={`/books/${b.slug}`} className="flex items-baseline justify-between gap-4 py-3 hover:text-gold-deep">
                    <span className="font-serif text-xl">{b.title}</span>
                    <span className="text-sm text-forest/70">{b.publishedOn}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}

        {p.approach && (
          <>
            <h2 className="mb-4 mt-14 text-3xl sm:text-4xl">Her approach to storytelling</h2>
            {paragraphs(p.approach).map((t) => <p key={t.slice(0, 24)} className="serif-body mb-6">{t}</p>)}
          </>
        )}

        {p.quote?.text && (
          <blockquote className="mt-14 border-l-2 border-gold pl-6">
            <p className="font-serif text-3xl italic">“{p.quote.text}”</p>
            {p.quote.attribution && <footer className="mt-2 text-sm text-forest/70">{p.quote.attribution}</footer>}
          </blockquote>
        )}

        <div className="mt-14 flex flex-wrap gap-3">
          {content.instagramUrl && (
            <a href={content.instagramUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">Follow on Instagram</a>
          )}
          <Link to="/speak" className="btn btn-primary">Speak to the Author</Link>
        </div>
      </div>
    </div>
  );
}
