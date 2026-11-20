import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookMarked, Download, Quote, Sparkles, Compass, BookOpen } from 'lucide-react';
import api from '../../api/client';
import { IBook, ISiteSettings } from '../../types';

export const ReadingRoom: React.FC = () => {
  const [books, setBooks] = useState<IBook[]>([]);
  const [settings, setSettings] = useState<ISiteSettings | null>(null);
  const [activeTab, setActiveTab] = useState<'guides' | 'passages' | 'influences'>('guides');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksRes, settingsRes] = await Promise.all([
          api.get('/books'),
          api.get('/settings').catch(() => ({ data: { data: null } }))
        ]);
        if (booksRes.data?.success) setBooks(booksRes.data.data);
        if (settingsRes.data?.data) setSettings(settingsRes.data.data);
      } catch (err) {
        console.error('Error fetching reading room contents:', err);
      }
    };

    fetchData();
  }, []);

  const readingGuides = settings?.readingGuides || [
    {
      title: 'The Memory of Rain — Book Club & Reading Guide',
      description: 'A curated 12-page discussion guide featuring character maps, discussion questions on memory and inheritance, and archival notes.',
      fileUrl: '/guides/memory-of-rain-guide.pdf',
      bookTitle: 'The Memory of Rain'
    },
    {
      title: 'Rivers & Rebellion: Historical Companion to Hooghly',
      description: 'Historical context, maps of wartime Calcutta in 1942, and an interview with the author on maritime archaeology.',
      fileUrl: '/guides/hooghly-companion.pdf',
      bookTitle: 'Whispers Across the Hooghly'
    }
  ];

  const literaryInfluences = [
    {
      title: 'Pather Panchali (Song of the Little Road)',
      author: 'Bibhutibhushan Bandyopadhyay',
      reflection: 'The quintessential scripture of rural Bengal. Its observation of wild ferns, rain dripping through bamboo leaves, and the innocence of childhood shaped my entire prose sensorium.'
    },
    {
      title: 'To the Lighthouse',
      author: 'Virginia Woolf',
      reflection: 'Taught me that time does not move in hours or calendar pages, but in the slow decay of empty summer rooms and the brushstrokes of an unfinished canvas.'
    },
    {
      title: 'The Shadow Lines',
      author: 'Amitav Ghosh',
      reflection: 'The benchmark for memory novels in South Asia. Demonstrating how borders drawn on maps are mere illusions compared to the emotional geography of shared tragedies.'
    },
    {
      title: 'Austerlitz',
      author: 'W.G. Sebald',
      reflection: 'A masterwork of melancholic archival retrieval. The way photographs, train stations, and architectural facades preserve European trauma inspired my use of botanical manuscripts.'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs uppercase tracking-[0.25em] text-forest font-semibold block">
          Quiet Chamber &bull; Deep Engagement
        </span>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-burgundy tracking-tight">
          The Reading Room
        </h1>
        <p className="font-reading text-base sm:text-lg text-charcoal/80 italic leading-relaxed">
          A dedicated sanctuary for readers, book clubs, and students. Access downloadable discussion guides, curated excerpts, and Ms. Jaya Roy Chowdhury's personal literary recommendations.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex justify-center border-b border-brass/30 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('guides')}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-medium transition-all ${
              activeTab === 'guides'
                ? 'bg-burgundy text-ivory font-semibold'
                : 'bg-parchment/60 text-charcoal/80 hover:bg-parchment'
            }`}
          >
            Reading Guides &amp; Club Folios
          </button>
          <button
            onClick={() => setActiveTab('passages')}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-medium transition-all ${
              activeTab === 'passages'
                ? 'bg-burgundy text-ivory font-semibold'
                : 'bg-parchment/60 text-charcoal/80 hover:bg-parchment'
            }`}
          >
            Curated Passages
          </button>
          <button
            onClick={() => setActiveTab('influences')}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-medium transition-all ${
              activeTab === 'influences'
                ? 'bg-burgundy text-ivory font-semibold'
                : 'bg-parchment/60 text-charcoal/80 hover:bg-parchment'
            }`}
          >
            Author's Library Recommendations
          </button>
        </div>
      </div>

      {/* TAB 1: GUIDES */}
      {activeTab === 'guides' && (
        <section className="space-y-8 animate-fadeIn">
          <div className="max-w-2xl mx-auto text-center space-y-2">
            <h3 className="font-display text-2xl font-bold text-burgundy">
              Downloadable Companions for Book Clubs &amp; Inquiries
            </h3>
            <p className="font-reading text-xs text-charcoal/70 italic">
              These guides include historical maps, discussion questions on memory and colonial archives, and author reflections tailored for reading groups.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {readingGuides.map((guide, idx) => (
              <div
                key={idx}
                className="paper-card p-6 sm:p-8 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <span className="text-[10px] font-editorial uppercase tracking-widest text-forest font-semibold block">
                    Companion to: {guide.bookTitle}
                  </span>
                  <h4 className="font-display text-2xl font-bold text-burgundy">
                    {guide.title}
                  </h4>
                  <p className="font-reading text-xs text-charcoal/80 leading-relaxed">
                    {guide.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-brass/20 flex items-center justify-between">
                  <a
                    href={guide.fileUrl}
                    download
                    onClick={(e) => {
                      e.preventDefault();
                      alert(`Initiating download for ${guide.title}. (Sample reading companion prepared for readers).`);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-burgundy hover:bg-burgundy-dark text-ivory text-xs uppercase tracking-widest font-semibold transition-colors"
                  >
                    <Download size={13} /> Download Guide (PDF)
                  </a>
                  <span className="text-[10px] text-charcoal/50 uppercase">Free Reader Asset</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 2: PASSAGES */}
      {activeTab === 'passages' && (
        <section className="space-y-10 animate-fadeIn">
          {books.flatMap((b) => (b.excerpts || []).map((exc, i) => ({ ...exc, bookTitle: b.title, slug: b.slug }))).map((passage, idx) => (
            <div
              key={idx}
              className="p-8 sm:p-10 bg-[#FAF7F2] border border-brass/40 deckled-shadow space-y-4"
            >
              <div className="flex items-center justify-between border-b border-brass/20 pb-3">
                <span className="font-editorial text-xs text-forest uppercase tracking-widest font-semibold">
                  From: {passage.bookTitle}
                </span>
                <Link
                  to={`/books/${passage.slug}`}
                  className="text-xs uppercase tracking-wider text-burgundy hover:underline flex items-center gap-1 font-semibold"
                >
                  <BookOpen size={12} /> View Volume
                </Link>
              </div>

              <h4 className="font-display text-2xl font-bold text-burgundy">
                "{passage.title}"
              </h4>

              <div className="font-reading text-base text-charcoal/90 leading-relaxed drop-cap">
                {passage.text}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* TAB 3: INFLUENCES */}
      {activeTab === 'influences' && (
        <section className="space-y-8 animate-fadeIn">
          <div className="max-w-2xl mx-auto text-center space-y-2">
            <h3 className="font-display text-2xl font-bold text-burgundy">
              From Ms. Jaya Roy Chowdhury's Personal Library
            </h3>
            <p className="font-reading text-xs text-charcoal/70 italic">
              Works that have acted as beacons, mirrors, and compasses throughout her decades of writing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {literaryInfluences.map((inf, idx) => (
              <div key={idx} className="paper-card p-6 sm:p-8 space-y-3">
                <span className="text-[10px] font-editorial uppercase tracking-widest text-brass block">
                  Author Recommendation #{idx + 1}
                </span>
                <h4 className="font-display text-2xl font-bold text-burgundy">
                  {inf.title}
                </h4>
                <p className="font-editorial text-xs text-forest uppercase tracking-wider font-semibold">
                  By {inf.author}
                </p>
                <p className="font-reading text-xs text-charcoal/80 leading-relaxed italic pt-2 border-t border-brass/20">
                  "{inf.reflection}"
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
