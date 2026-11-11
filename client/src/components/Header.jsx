import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import SearchBar from './SearchBar.jsx';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/author', label: 'The Author' },
  { to: '/books', label: 'Books' },
  { to: '/characters', label: 'Characters' },
  { to: '/speak', label: 'Speak to the Author' },
];

const linkClass = ({ isActive }) =>
  `rounded-full px-3 py-2 text-sm transition-colors hover:bg-parchment/70 ${isActive ? 'bg-parchment/80 font-medium' : ''}`;

export default function Header() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  const account = user
    ? { to: user.role === 'admin' ? '/admin' : '/dashboard', label: user.role === 'admin' ? 'Admin' : 'My account' }
    : { to: '/signin', label: 'Sign In' };

  return (
    <header className="sticky top-0 z-40 border-b border-parchment bg-ivory/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="font-serif text-xl font-semibold leading-none sm:text-2xl">
          Through the Golden Glades
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
          <NavLink to={account.to} className={linkClass}>
            {account.label}
          </NavLink>
        </nav>

        <div className="flex items-center gap-1">
          <SearchBar />
          {!user && (
            <Link to="/join" className="btn btn-primary btn-sm ml-1 hidden sm:inline-flex">
              Join the Readers’ Circle
            </Link>
          )}
          <button
            type="button"
            className="rounded-full p-2 hover:bg-parchment/70 lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((o) => !o)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" /> : <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-parchment bg-ivory lg:hidden">
          <div className="container-page flex flex-col gap-1 py-4">
            {[...links, account].map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => `rounded-xl px-3 py-3 text-base ${isActive ? 'bg-parchment/80 font-medium' : ''}`}>
                {l.label}
              </NavLink>
            ))}
            {!user && (
              <Link to="/join" className="btn btn-primary mt-2">
                Join the Readers’ Circle
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
