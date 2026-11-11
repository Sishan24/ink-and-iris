// Book cover. When no cover has been uploaded yet, a typographic cover stands in.
const THEMES = [
  'bg-forest text-ivory border-gold/70',
  'bg-sage-deep text-ivory border-parchment/70',
  'bg-rose-deep text-ivory border-parchment/70',
  'bg-parchment text-forest border-gold-deep/60',
];

export default function Cover({ book, className = '', priority = false }) {
  if (book?.coverImage?.url) {
    return (
      <img
        src={book.coverImage.url}
        alt={`Cover of ${book.title}`}
        loading={priority ? 'eager' : 'lazy'}
        className={`aspect-[2/3] w-full rounded-lg object-cover shadow-soft ${className}`}
      />
    );
  }
  const title = book?.title || 'Untitled';
  const theme = THEMES[[...title].reduce((a, c) => a + c.charCodeAt(0), 0) % THEMES.length];
  return (
    <div
      role="img"
      aria-label={`Cover of ${title}`}
      className={`flex aspect-[2/3] w-full flex-col items-center justify-between rounded-lg p-5 text-center shadow-soft ${theme} ${className}`}
    >
      <span className="mt-2 h-px w-10 bg-current opacity-50" />
      <span className="font-serif text-2xl font-medium leading-tight sm:text-3xl">{title}</span>
      <span className="text-[0.7rem] tracking-widest opacity-80">JAYA ROY CHOWDHURY</span>
    </div>
  );
}
