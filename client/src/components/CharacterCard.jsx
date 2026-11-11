import { Link } from 'react-router-dom';
import Portrait from './Portrait.jsx';

export default function CharacterCard({ character }) {
  const books = (character.bookIds || []).filter((b) => b && b.title);
  return (
    <Link to={`/characters/${character.slug}`} className="group block">
      <div className="relative">
        <Portrait person={character} className="transition-transform duration-300 group-hover:-translate-y-1" />
        {character.about && (
          <div className="arch pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-forest/90 via-forest/40 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
            <p className="line-clamp-4 text-sm leading-relaxed text-ivory">{character.about}</p>
          </div>
        )}
      </div>
      <h3 className="mt-3 text-2xl">{character.name}</h3>
      {books.length > 0 && <p className="text-sm text-forest/70">{books.map((b) => b.title).join(', ')}</p>}
    </Link>
  );
}
