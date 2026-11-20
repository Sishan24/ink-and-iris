import React from 'react';
import { Link } from 'react-router-dom';
import { Feather, Mail, ArrowUpRight, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-charcoal text-parchment/90 border-t border-brass/40 pt-16 pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Column 1: Identity */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-display text-3xl tracking-tight text-ivory font-semibold flex items-center gap-2">
                Ink &amp; Iris
                <span className="w-1.5 h-1.5 rounded-full bg-brass inline-block" />
              </span>
              <span className="font-editorial text-[10px] tracking-[0.25em] uppercase text-brass block">
                Ms. Jaya Roy Chowdhury
              </span>
            </Link>
            <p className="font-reading text-sm text-parchment/80 leading-relaxed italic">
              "Where stories take root, characters breathe, and every reader finds a little piece of themselves."
            </p>
            <div className="pt-2 text-xs text-parchment/60">
              A curated digital sanctuary for literature, archival memory, and reader dialogue.
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="space-y-3">
            <h4 className="font-editorial text-xs tracking-widest uppercase text-brass font-semibold">
              The Universe
            </h4>
            <ul className="space-y-2 text-sm text-parchment/80">
              <li>
                <Link to="/books" className="hover:text-ivory transition-colors">
                  The Bookshelf
                </Link>
              </li>
              <li>
                <Link to="/characters" className="hover:text-ivory transition-colors">
                  Between the Pages (Characters)
                </Link>
              </li>
              <li>
                <Link to="/journal" className="hover:text-ivory transition-colors">
                  The Ink Journal (Essays &amp; Craft)
                </Link>
              </li>
              <li>
                <Link to="/reading-room" className="hover:text-ivory transition-colors">
                  The Reading Room &amp; Guides
                </Link>
              </li>
              <li>
                <Link to="/gatherings" className="hover:text-ivory transition-colors">
                  Gatherings &amp; Appearances
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-ivory transition-colors">
                  About Ms. Jaya Roy Chowdhury
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Correspondence & Rights */}
          <div className="space-y-3">
            <h4 className="font-editorial text-xs tracking-widest uppercase text-brass font-semibold">
              Dialogue &amp; Representation
            </h4>
            <div className="text-sm space-y-2 text-parchment/80 leading-relaxed">
              <p>
                <strong className="text-ivory font-medium">Reader Reflections:</strong><br />
                Ms. Roy Chowdhury reads all personal correspondence.
              </p>
              <Link
                to="/correspondence"
                className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-brass hover:text-ivory transition-colors font-medium"
              >
                <Mail size={12} /> Post a letter to the desk &rarr;
              </Link>
              <div className="pt-2 border-t border-parchment/10 text-xs">
                <span className="text-brass">Literary Agency:</span><br />
                Devina Khurana<br />
                <span className="text-parchment/60">Heritage &amp; Quill Literary Agency</span><br />
                <span className="text-parchment/60">rights@heritagequill.com</span>
              </div>
            </div>
          </div>

          {/* Column 4: Stay Attuned */}
          <div className="space-y-3">
            <h4 className="font-editorial text-xs tracking-widest uppercase text-brass font-semibold">
              The Literary Dispatch
            </h4>
            <p className="text-xs text-parchment/80 leading-relaxed font-reading">
              Receive seasonal dispatches, manuscript updates, and private reading guides directly from the author’s writing room.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing to the author dispatch.'); }} className="space-y-2">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your epistolary address..."
                  required
                  className="w-full px-3 py-2 text-xs bg-charcoal-muted/30 border border-brass/40 text-ivory placeholder-parchment/40 focus:outline-none focus:border-brass"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-burgundy hover:bg-burgundy-light text-ivory text-xs uppercase tracking-wider transition-colors shrink-0 font-medium"
                >
                  Join
                </button>
              </div>
              <span className="text-[10px] text-parchment/50 block">
                Strictly confidential. No commercial intrusions.
              </span>
            </form>
          </div>
        </div>

        {/* Bottom divider and copyright */}
        <div className="pt-8 border-t border-brass/20 flex flex-col sm:flex-row items-center justify-between text-xs text-parchment/60 gap-4">
          <div className="flex items-center gap-2">
            <span>&copy; {new Date().getFullYear()} Ms. Jaya Roy Chowdhury. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-ivory transition-colors">
              Author Biography
            </Link>
            <Link to="/admin/login" className="hover:text-ivory transition-colors">
              Author Administrative Studio
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
