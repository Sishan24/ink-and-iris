import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Quote, Sparkles, Heart, Users } from 'lucide-react';
import api from '../../api/client';
import { ICharacter } from '../../types';

export const CharacterDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [character, setCharacter] = useState<ICharacter | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCharacter = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/characters/${slug}`);
        if (res.data?.success) {
          setCharacter(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching character detail:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) fetchCharacter();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center font-reading text-burgundy text-lg">
        Consulting the dramatis personae...
      </div>
    );
  }

  if (!character) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="font-display text-3xl text-burgundy">Character Not Found</h2>
        <p className="font-reading text-charcoal/70">
          This figure has not entered the public archives or their dossier is private.
        </p>
        <Link to="/characters" className="text-xs uppercase tracking-widest text-forest font-semibold underline">
          &larr; Return to Character Directory
        </Link>
      </div>
    );
  }

  const bookData = typeof character.book === 'object' ? (character.book as any) : null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
      {/* Back link */}
      <div>
        <Link
          to="/characters"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-forest font-semibold hover:text-burgundy transition-colors"
        >
          <ArrowLeft size={14} /> Back to Between the Pages
        </Link>
      </div>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
        {/* Portrait Column */}
        <div className="md:col-span-5 space-y-4">
          <div className="p-3 bg-parchment/70 border border-brass/50 shadow-md">
            <img
              src={character.portraitUrl}
              alt={character.name}
              className="w-full h-auto object-cover grayscale contrast-110"
            />
          </div>

          <div className="p-4 bg-ivory border border-brass/30 text-center space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-brass font-editorial block">
              Archetypal Designation
            </span>
            <p className="font-display text-lg font-bold text-burgundy">
              {character.archetype}
            </p>
          </div>

          {bookData && (
            <div className="p-4 bg-parchment/40 border border-brass/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-charcoal/50 block">
                  Original Manifestation
                </span>
                <Link
                  to={`/books/${bookData.slug}`}
                  className="font-display font-bold text-sm text-forest hover:text-burgundy hover:underline"
                >
                  {bookData.title}
                </Link>
              </div>
              <BookOpen size={16} className="text-brass" />
            </div>
          )}
        </div>

        {/* Dossier Information */}
        <div className="md:col-span-7 space-y-8">
          <div className="space-y-2 border-b border-brass/30 pb-4">
            <span className="text-xs uppercase tracking-[0.25em] text-forest font-semibold block">
              Character Dossier
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-burgundy tracking-tight">
              {character.name}
            </h1>
            <p className="font-editorial text-sm text-charcoal/70 uppercase tracking-widest">
              {character.archetype}
            </p>
          </div>

          {/* Background */}
          <div className="space-y-2">
            <h3 className="font-editorial text-xs uppercase tracking-widest text-forest font-semibold">
              Origins &amp; Trajectory
            </h3>
            <p className="font-reading text-base text-charcoal/90 leading-relaxed">
              {character.background}
            </p>
          </div>

          {/* Motivations */}
          <div className="p-5 bg-parchment/50 border-l-3 border-forest space-y-2">
            <h3 className="font-editorial text-xs uppercase tracking-widest text-forest font-semibold flex items-center gap-1.5">
              <Sparkles size={13} /> Deepest Psychological Motivation
            </h3>
            <p className="font-reading text-sm text-charcoal/85 italic leading-relaxed">
              {character.motivations}
            </p>
          </div>

          {/* Personality Traits */}
          {character.personalityTraits && character.personalityTraits.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-editorial text-xs uppercase tracking-widest text-forest font-semibold">
                Temperament &amp; Traits
              </h3>
              <div className="flex flex-wrap gap-2">
                {character.personalityTraits.map((trait, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-ivory border border-brass/40 px-3 py-1 text-charcoal/80 font-sans"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Memorable Quotes */}
      {character.memorableQuotes && character.memorableQuotes.length > 0 && (
        <section className="space-y-4 pt-8 border-t border-brass/30">
          <h3 className="font-display text-2xl font-bold text-burgundy flex items-center gap-2">
            <Quote size={20} className="text-brass" /> Memorable Words &amp; Utterances
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {character.memorableQuotes.map((quote, idx) => (
              <blockquote
                key={idx}
                className="p-6 bg-[#FAF7F2] border border-brass/40 deckled-shadow font-reading text-base text-charcoal/85 italic leading-relaxed"
              >
                "{quote}"
              </blockquote>
            ))}
          </div>
        </section>
      )}

      {/* Interconnected Relationships */}
      {character.relationships && character.relationships.length > 0 && (
        <section className="space-y-6 pt-8 border-t border-brass/30">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-forest font-semibold block">
              The Intimate Network
            </span>
            <h3 className="font-display text-2xl font-bold text-burgundy">
              Interpersonal Relationships
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {character.relationships.map((rel, idx) => {
              const relChar = rel.relatedCharacter;
              if (!relChar) return null;

              return (
                <div
                  key={idx}
                  className="paper-card p-5 flex items-start gap-4"
                >
                  <img
                    src={relChar.portraitUrl}
                    alt={relChar.name}
                    className="w-14 h-14 rounded-full object-cover grayscale border border-brass/40 shrink-0"
                  />
                  <div className="space-y-1">
                    <Link
                      to={`/characters/${relChar.slug}`}
                      className="font-display font-bold text-lg text-burgundy hover:text-forest transition-colors"
                    >
                      {relChar.name}
                    </Link>
                    <span className="text-[11px] font-editorial text-forest uppercase tracking-wider font-semibold block">
                      {rel.relationType}
                    </span>
                    {rel.notes && (
                      <p className="font-reading text-xs text-charcoal/70 italic leading-relaxed pt-1">
                        "{rel.notes}"
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
