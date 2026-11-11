import { Link } from 'react-router-dom';
import Cover from './Cover.jsx';

export default function BookCard({ book, className = '' }) {
  return (
    <article className={`group flex flex-col ${className}`}>
      <Link to={`/books/${book.slug}`} aria-label={book.title} className="block transition-transform duration-300 group-hover:-translate-y-1">
        <Cover book={book} />
      </Link>
      <h3 className="mt-4 text-2xl">{book.title}</h3>
      {book.tagline && <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-forest/75">{book.tagline}</p>}
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <Link to={`/books/${book.slug}`} className="font-medium underline decoration-gold underline-offset-4">
          Read more
        </Link>
        {book.amazonUrl && (
          <a href={book.amazonUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-gold-deep underline underline-offset-4">
            Buy on Amazon
          </a>
        )}
      </div>
    </article>
  );
}
