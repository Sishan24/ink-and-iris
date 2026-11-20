import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Search, Network, BookOpen, Quote, ArrowRight } from 'lucide-react';
import api from '../../api/client';
import { ICharacter } from '../../types';

export const Characters: React.FC = () => {
  const [characters, setCharacters] = useState<ICharacter[]>([]);
  const [relationshipNetwork, setRelationshipNetwork] = useState<{ nodes: any[]; links: any[] } | null>(null);
  const [showNetworkView, setShowNetworkView] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCharacters = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (searchQuery.trim()) queryParams.append('search', searchQuery.trim());

        const [charsRes, networkRes] = await Promise.all([
          api.get(`/characters?${queryParams.toString()}`),
          api.get('/characters/network').catch(() => ({ data: { data: null } }))
        ]);

        if (charsRes.data?.success) setCharacters(charsRes.data.data);
        if (networkRes.data?.success) setRelationshipNetwork(networkRes.data.data);
      } catch (err) {
        console.error('Error fetching characters:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacters();
  }, [searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs uppercase tracking-[0.25em] text-forest font-semibold block">
          Dramatis Personae &bull; Character Directory
        </span>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-burgundy tracking-tight">
          Between the Pages
        </h1>
        <p className="font-reading text-base sm:text-lg text-charcoal/80 italic leading-relaxed">
          Step into the inner lives of those who wander the rain-soaked estates, river barges, and archive rooms of Ms. Jaya Roy Chowdhury's fiction.
        </p>
      </div>

      {/* Controls & View Toggle */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-y border-brass/30 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNetworkView(false)}
            className={`px-3.5 py-1.5 text-xs uppercase tracking-wider font-medium transition-all ${
              !showNetworkView
                ? 'bg-burgundy text-ivory font-semibold'
                : 'bg-parchment/60 text-charcoal/80 hover:bg-parchment'
            }`}
          >
            Character Directory
          </button>
          <button
            onClick={() => setShowNetworkView(true)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs uppercase tracking-wider font-medium transition-all ${
              showNetworkView
                ? 'bg-forest text-ivory font-semibold'
                : 'bg-parchment/60 text-charcoal/80 hover:bg-parchment'
            }`}
          >
            <Network size={13} /> Relationship Map
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search characters, archetypes, traits..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-ivory border border-brass/50 text-charcoal placeholder-charcoal/40 focus:outline-none focus:border-burgundy"
          />
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brass" />
        </div>
      </div>

      {/* Visual Relationship Network View */}
      {showNetworkView && relationshipNetwork ? (
        <section className="p-8 sm:p-12 bg-[#FAF7F2] border border-brass/40 deckled-shadow space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h3 className="font-display text-2xl font-bold text-burgundy">
              The Literary Web of Alliances &amp; Longings
            </h3>
            <p className="font-reading text-xs text-charcoal/70 italic">
              A topological map of emotional attachments, clandestine comrades, and ancestral secrets connecting our characters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {relationshipNetwork.links.map((link, idx) => {
              const sourceNode = relationshipNetwork.nodes.find((n) => n.id === link.source);
              const targetNode = relationshipNetwork.nodes.find((n) => n.id === link.target);

              if (!sourceNode || !targetNode) return null;

              return (
                <div
                  key={idx}
                  className="p-5 bg-ivory border border-brass/30 shadow-sm flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-center justify-between">
                    {/* Source Character */}
                    <Link to={`/characters/${sourceNode.slug}`} className="text-center group">
                      <img
                        src={sourceNode.portraitUrl}
                        alt={sourceNode.name}
                        className="w-14 h-14 rounded-full object-cover border border-brass/40 mx-auto grayscale group-hover:grayscale-0 transition-all"
                      />
                      <span className="font-display font-bold text-xs text-burgundy block mt-1">
                        {sourceNode.name}
                      </span>
                    </Link>

                    {/* Relationship Badge */}
                    <div className="flex flex-col items-center px-2 text-center">
                      <span className="h-[1px] w-12 bg-brass block mb-1" />
                      <span className="text-[10px] font-editorial text-forest uppercase tracking-wider font-semibold px-2 py-0.5 bg-parchment/80 border border-brass/30">
                        {link.type}
                      </span>
                      <span className="h-[1px] w-12 bg-brass block mt-1" />
                    </div>

                    {/* Target Character */}
                    <Link to={`/characters/${targetNode.slug}`} className="text-center group">
                      <img
                        src={targetNode.portraitUrl}
                        alt={targetNode.name}
                        className="w-14 h-14 rounded-full object-cover border border-brass/40 mx-auto grayscale group-hover:grayscale-0 transition-all"
                      />
                      <span className="font-display font-bold text-xs text-burgundy block mt-1">
                        {targetNode.name}
                      </span>
                    </Link>
                  </div>

                  {link.notes && (
                    <p className="font-reading text-xs text-charcoal/70 italic text-center border-t border-brass/10 pt-2">
                      "{link.notes}"
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      {/* Directory Grid */}
      {isLoading ? (
        <div className="py-24 text-center font-reading text-burgundy text-lg">
          Summoning character dossiers...
        </div>
      ) : characters.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-parchment/30 border border-brass/30 p-8">
          <Users size={32} className="mx-auto text-brass opacity-60" />
          <h3 className="font-display text-2xl text-charcoal">No character matches this query</h3>
          <p className="font-reading text-sm text-charcoal/60">
            Clear your search term to see all dramatis personae.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {characters.map((char) => (
            <article
              key={char._id}
              className="paper-card flex flex-col justify-between group transition-transform duration-200 hover:-translate-y-1"
            >
              <div>
                <div className="relative aspect-[4/3] overflow-hidden bg-parchment/60 border-b border-brass/30">
                  <img
                    src={char.portraitUrl}
                    alt={char.name}
                    className="w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute bottom-2 left-2 bg-charcoal/90 text-ivory text-[10px] uppercase tracking-widest px-2.5 py-1">
                    {char.archetype}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <h2 className="font-display text-2xl font-bold text-burgundy group-hover:text-forest transition-colors">
                    <Link to={`/characters/${char.slug}`}>{char.name}</Link>
                  </h2>

                  {char.book && typeof char.book === 'object' && (
                    <p className="font-editorial text-xs text-forest flex items-center gap-1.5 -mt-1 font-semibold">
                      <BookOpen size={12} />
                      <span>{(char.book as any).title}</span>
                    </p>
                  )}

                  {char.memorableQuotes && char.memorableQuotes.length > 0 && (
                    <blockquote className="font-reading text-xs text-charcoal/80 italic border-l-2 border-brass pl-3 py-0.5 line-clamp-2">
                      "{char.memorableQuotes[0]}"
                    </blockquote>
                  )}

                  <p className="font-reading text-xs text-charcoal/70 line-clamp-3 leading-relaxed pt-1">
                    {char.background}
                  </p>

                  {/* Personality Traits */}
                  {char.personalityTraits && char.personalityTraits.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {char.personalityTraits.slice(0, 3).map((trait, i) => (
                        <span
                          key={i}
                          className="text-[10px] bg-parchment/70 border border-brass/30 px-2 py-0.5 text-charcoal/70 font-sans"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="px-6 pb-6 pt-3 border-t border-brass/20 flex items-center justify-between">
                <Link
                  to={`/characters/${char.slug}`}
                  className="text-xs font-semibold text-burgundy hover:underline flex items-center gap-1"
                >
                  View Complete Dossier <ArrowRight size={12} />
                </Link>
                {char.relationships && char.relationships.length > 0 && (
                  <span className="text-[10px] text-forest uppercase font-medium">
                    {char.relationships.length} Relation{char.relationships.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
