import { Link } from 'react-router-dom';
import { useSeo } from '../lib/hooks.js';

export default function NotFound() {
  useSeo('Page not found');
  return (
    <div className="container-page section text-center">
      <p className="font-serif text-8xl text-gold-deep" aria-hidden="true">404</p>
      <h1 className="mt-4 text-4xl sm:text-5xl">This page is a path that was never written.</h1>
      <p className="mx-auto mt-4 max-w-md text-forest/80">The page you wanted isn’t here. The books and characters are, though.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link to="/" className="btn btn-primary">Back to the beginning</Link>
        <Link to="/books" className="btn btn-ghost">Browse the books</Link>
      </div>
    </div>
  );
}
