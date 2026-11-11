import { initials } from '../lib/format.js';

// Arch-shaped portrait: the site's one signature shape, borrowed from a window onto a glade.
export default function Portrait({ person, className = '' }) {
  const src = person?.portrait?.url || person?.photo?.url;
  return (
    <div className={`arch aspect-[3/4] w-full overflow-hidden bg-parchment ${className}`}>
      {src ? (
        <img src={src} alt={person?.name ? `Portrait of ${person.name}` : ''} loading="lazy" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center font-serif text-5xl text-gold-deep" aria-hidden="true">
          {initials(person?.name)}
        </div>
      )}
    </div>
  );
}
