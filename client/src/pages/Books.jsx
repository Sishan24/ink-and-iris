import { Link } from 'react-router-dom';
import { useFetch, useSeo } from '../lib/hooks.js';
import { PageIntro, Spinner, ErrorNote, Empty } from '../components/ui.jsx';
import Cover from '../components/Cover.jsx';

export default function Books() {
  useSeo('Books', 'The complete catalogue of books by Jaya Roy Chowdhury.');
  const { data, loading, error } = useFetch('/books');
  return (
    <>
      <PageIntro title="Her Books">Fiction, poetry, reflections and literary studies, gathered in one place.</PageIntro>
      {loading && <Spinner />}
      {error && <ErrorNote error={error} />}
      {data && data.books.length === 0 && <Empty>The catalogue is being prepared. Please check back soon.</Empty>}
      {data && data.books.length > 0 && (
        <div className="container-page grid gap-x-8 gap-y-14 pb-24 pt-8 sm:grid-cols-2 lg:grid-cols-3">
          {data.books.map((b) => (
            <article key={b._id} className="group grid grid-cols-[8rem_1fr] gap-5 sm:grid-cols-[9rem_1fr]">
              <Link to={`/books/${b.slug}`} aria-label={b.title} className="transition-transform duration-300 group-hover:-translate-y-1">
                <Cover book={b} />
              </Link>
              <div className="flex flex-col">
                <h2 className="text-2xl leading-tight">{b.title}</h2>
                {b.genres?.length > 0 && <p className="mt-1 text-xs text-sage-deep">{b.genres.join(' · ')}</p>}
                {b.tagline && <p className="mt-2 line-clamp-4 text-sm text-forest/80">{b.tagline}</p>}
                <Link to={`/books/${b.slug}`} className="mt-auto pt-3 text-sm font-medium underline decoration-gold underline-offset-4">View book details →</Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
