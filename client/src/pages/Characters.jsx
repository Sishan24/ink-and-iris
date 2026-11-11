import { useSearchParams } from 'react-router-dom';
import { useFetch, useSeo } from '../lib/hooks.js';
import { PageIntro, Spinner, ErrorNote, Empty } from '../components/ui.jsx';
import CharacterCard from '../components/CharacterCard.jsx';

export default function Characters() {
  useSeo('Characters', 'Meet the personalities, journeys and stories that bring each book to life.');
  const [params, setParams] = useSearchParams();
  const book = params.get('book') || '';
  const { data: books } = useFetch('/books');
  const { data, loading, error } = useFetch(`/characters${book ? `?book=${encodeURIComponent(book)}` : ''}`);

  const pill = (active) => `rounded-full border px-4 py-2 text-sm transition-colors ${active ? 'border-forest bg-forest text-ivory' : 'border-forest/25 hover:bg-parchment/70'}`;

  return (
    <>
      <PageIntro title="Beyond the Pages">Meet the personalities, journeys and stories that bring each book to life.</PageIntro>

      {books?.books?.length > 1 && (
        <div className="container-page mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter characters by book">
          <button type="button" className={pill(!book)} aria-pressed={!book} onClick={() => setParams({})}>All books</button>
          {books.books.map((b) => (
            <button key={b._id} type="button" className={pill(book === b.slug)} aria-pressed={book === b.slug} onClick={() => setParams({ book: b.slug })}>
              {b.title}
            </button>
          ))}
        </div>
      )}

      {loading && <Spinner />}
      {error && <ErrorNote error={error} />}
      {data && data.characters.length === 0 && <Empty>No characters here yet. They are being introduced soon.</Empty>}
      {data && data.characters.length > 0 && (
        <div className="container-page grid grid-cols-2 gap-6 pb-24 pt-10 sm:grid-cols-3 lg:grid-cols-4">
          {data.characters.map((c) => <CharacterCard key={c._id} character={c} />)}
        </div>
      )}
    </>
  );
}
