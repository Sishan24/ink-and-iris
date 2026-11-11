import { Link } from 'react-router-dom';

export default function Footer({ instagramUrl }) {
  return (
    <footer className="bg-forest text-ivory">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-serif text-3xl">Through the Golden Glades</p>
          <p className="mt-2 max-w-xs text-sm text-ivory/75">The official literary home of Jaya Roy Chowdhury.</p>
        </div>
        <nav aria-label="Footer" className="flex flex-col gap-2 text-sm">
          <Link to="/author" className="hover:underline">The Author</Link>
          <Link to="/books" className="hover:underline">Books</Link>
          <Link to="/characters" className="hover:underline">Characters</Link>
          <Link to="/speak" className="hover:underline">Speak to the Author</Link>
        </nav>
        <div className="flex flex-col gap-2 text-sm">
          <Link to="/join" className="hover:underline">Join the Readers’ Circle</Link>
          {instagramUrl && (
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
              Instagram
            </a>
          )}
          <Link to="/privacy" className="hover:underline">Privacy policy</Link>
        </div>
      </div>
      <div className="border-t border-ivory/15 py-5 text-center text-xs text-ivory/70">
        © {new Date().getFullYear()} Jaya Roy Chowdhury. All rights reserved.
      </div>
    </footer>
  );
}
