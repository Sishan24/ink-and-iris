import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useFetch, useSeo } from '../lib/hooks.js';
import { api } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { paragraphs } from '../lib/format.js';
import { Spinner, ErrorNote } from '../components/ui.jsx';
import Portrait from '../components/Portrait.jsx';
import Cover from '../components/Cover.jsx';

export default function CharacterDetail() {
  const { slug } = useParams();
  const { data, loading, error } = useFetch(`/characters/${slug}`);
  const { user } = useAuth();
  const [fav, setFav] = useState(false);
  const c = data?.character;
  useSeo(c?.name, c?.about);

  useEffect(() => {
    if (!user || !c) return;
    api.get('/reader/favourites').then(({ ids }) => setFav(ids.includes(c._id))).catch(() => {});
  }, [user, c]);

  if (loading) return <Spinner />;
  if (error) return <ErrorNote error={error} />;

  return (
    <article className="container-page section">
      <div className="grid gap-12 md:grid-cols-[0.85fr_1.15fr]">
        <div className="mx-auto w-full max-w-sm md:sticky md:top-28 md:self-start">
          <Portrait person={c} />
          {c.bookIds?.map((b) => (
            <Link key={b._id} to={`/books/${b.slug}`} className="mt-5 flex items-center gap-3 rounded-2xl border border-parchment p-3 hover:bg-parchment/50">
              <Cover book={b} className="!w-12 shrink-0" />
              <span className="text-sm"><span className="block text-forest/65">Appears in</span><span className="font-serif text-lg">{b.title}</span></span>
            </Link>
          ))}
        </div>

        <div>
          <h1 className="text-5xl sm:text-7xl">{c.name}</h1>
          {c.about && <div className="mt-6">{paragraphs(c.about).map((p) => <p key={p.slice(0, 24)} className="serif-body mb-5">{p}</p>)}</div>}

          {c.personality?.length > 0 && (
            <>
              <h2 className="mb-3 mt-10 text-2xl">Personality</h2>
              <div className="flex flex-wrap gap-2">{c.personality.map((t) => <span key={t} className="pill">{t}</span>)}</div>
            </>
          )}

          {c.story && (
            <>
              <h2 className="mb-3 mt-10 text-2xl">Story</h2>
              {paragraphs(c.story).map((p) => <p key={p.slice(0, 24)} className="serif-body mb-5">{p}</p>)}
            </>
          )}

          {c.relatedCharacters?.length > 0 && (
            <>
              <h2 className="mb-4 mt-10 text-2xl">Related characters</h2>
              <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
                {c.relatedCharacters.map((r) => (
                  <Link key={r._id} to={`/characters/${r.slug}`} className="block">
                    <Portrait person={r} />
                    <p className="mt-1 text-sm">{r.name}</p>
                  </Link>
                ))}
              </div>
            </>
          )}

          {user && (
            <button
              type="button"
              className="btn btn-ghost mt-10"
              aria-pressed={fav}
              onClick={async () => setFav((await api.post(`/reader/favourites/${c.slug}`)).favourite)}
            >
              {fav ? 'Saved to your favourites' : 'Save to favourites'}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
