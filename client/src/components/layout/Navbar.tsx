import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Feather, Compass, BookOpen, Users, Mail, BookMarked, Calendar, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const navLinks = [
    { name: 'The Bookshelf', path: '/books', icon: BookOpen },
    { name: 'Between the Pages', path: '/characters', icon: Users },
    { name: 'Correspondence', path: '/correspondence', icon: Mail },
    { name: 'The Ink Journal', path: '/journal', icon: Feather },
    { name: 'Reading Room', path: '/reading-room', icon: BookMarked },
    { name: 'Gatherings', path: '/gatherings', icon: Calendar },
    { name: 'About', path: '/about', icon: Compass }
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-ivory/95 backdrop-blur-md border-b border-brass/30 transition-all">
      {/* Top micro banner */}
      <div className="bg-parchment/60 border-b border-brass/20 text-charcoal/80 text-[11px] uppercase tracking-widest py-1 px-4 text-center font-sans flex items-center justify-between">
        <span className="hidden sm:inline-block italic text-forest">
          "Where stories take root, characters breathe..."
        </span>
        <span className="mx-auto sm:mx-0">
          The Literary Sanctuary of Ms. Jaya Roy Chowdhury
        </span>
        <div className="hidden sm:flex items-center gap-3">
          {isAuthenticated ? (
            <Link
              to="/admin"
              className="text-burgundy font-medium hover:underline flex items-center gap-1"
            >
              <UserCheck size={12} /> Studio Desk
            </Link>
          ) : (
            <Link
              to="/admin/login"
              className="text-charcoal/70 hover:text-burgundy transition-colors"
            >
              Author Portal
            </Link>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/" className="group flex flex-col justify-center">
            <span className="font-display text-3xl sm:text-4xl tracking-tight text-burgundy font-semibold group-hover:text-burgundy-dark transition-colors flex items-center gap-2">
              <span>Ink &amp; Iris</span>
              <span className="w-1.5 h-1.5 rounded-full bg-brass inline-block group-hover:scale-125 transition-transform" />
            </span>
            <span className="font-editorial text-[11px] tracking-[0.25em] uppercase text-forest font-medium -mt-1">
              Ms. Jaya Roy Chowdhury
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm tracking-wide transition-all relative py-1 font-medium ${
                    active
                      ? 'text-burgundy font-semibold'
                      : 'text-charcoal/80 hover:text-burgundy'
                  }`}
                >
                  {link.name}
                  {active && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-burgundy rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Write Letter CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              to="/correspondence"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wider font-medium text-ivory bg-burgundy hover:bg-burgundy-dark transition-colors border border-burgundy shadow-sm"
            >
              <Mail size={13} />
              <span>Send a Letter</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-charcoal hover:text-burgundy focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-ivory border-b border-brass/40 px-4 pt-3 pb-6 shadow-lg animate-fadeIn">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 text-base font-medium rounded-none border-l-2 transition-colors ${
                    active
                      ? 'border-burgundy text-burgundy bg-parchment/60 font-semibold'
                      : 'border-transparent text-charcoal/80 hover:border-brass hover:text-burgundy'
                  }`}
                >
                  <Icon size={16} className={active ? 'text-burgundy' : 'text-brass'} />
                  <span>{link.name}</span>
                </Link>
              );
            })}

            <div className="pt-4 border-t border-brass/30 flex flex-col gap-2">
              <Link
                to="/correspondence"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-xs uppercase tracking-wider font-medium text-ivory bg-burgundy border border-burgundy"
              >
                Send a Letter to the Author
              </Link>
              <Link
                to={isAuthenticated ? '/admin' : '/admin/login'}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-xs uppercase tracking-wider text-charcoal/70 hover:text-burgundy"
              >
                {isAuthenticated ? 'Enter Author Studio' : 'Author Portal Login'}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
