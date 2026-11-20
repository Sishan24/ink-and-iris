import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Feather, Award, Mail, Download, Heart, ArrowRight } from 'lucide-react';
import api from '../../api/client';
import { ISiteSettings } from '../../types';

export const About: React.FC = () => {
  const [settings, setSettings] = useState<ISiteSettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        if (res.data?.success) setSettings(res.data.data);
      } catch (err) {
        console.error('Error fetching settings for about page:', err);
      }
    };
    fetchSettings();
  }, []);

  const timelineMilestones = [
    {
      year: '1998',
      title: 'First Field Notebooks in Kalimpong',
      description: 'Began cataloging oral traditions, river songs, and colonial botany records across the tea gardens of Kurseong and Darjeeling.'
    },
    {
      year: '2012',
      title: 'Publication of Debut Essays & Translations',
      description: 'Translated obscure nineteenth-century Bengali women diarists, winning the National Heritage Translation Fellowship.'
    },
    {
      year: '2021',
      title: 'Whispers Across the Hooghly Published',
      description: 'Her monumental historical novel exploring 1942 wartime Calcutta river trade was published to international critical acclaim.'
    },
    {
      year: '2023',
      title: 'The Memory of Rain Released Worldwide',
      description: 'Awarded the Bengal Literary Laureate Prize and shortlisted for major South Asian fiction honors; translated into twelve languages.'
    },
    {
      year: '2026',
      title: 'Ink & Iris Digital Literary Universe',
      description: 'Inauguration of this dedicated digital sanctuary to unify manuscripts, character archives, and reader correspondence.'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs uppercase tracking-[0.25em] text-forest font-semibold block">
          The Author &amp; Her Heritage
        </span>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-burgundy tracking-tight">
          About Ms. Jaya Roy Chowdhury
        </h1>
        <p className="font-reading text-base sm:text-lg text-charcoal/80 italic leading-relaxed">
          Novelist, essayist, and archivist of generational memory.
        </p>
      </div>

      {/* Main Biography Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-5 relative">
          <div className="p-3 bg-parchment/80 border border-brass/50 shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800"
              alt="Ms. Jaya Roy Chowdhury"
              className="w-full h-auto object-cover grayscale contrast-125 sepia-[0.1]"
            />
          </div>
          <div className="mt-3 p-3 bg-ivory border border-brass/30 text-center">
            <span className="font-editorial text-[10px] uppercase tracking-widest text-forest font-semibold block">
              Portrait at her Writing Studio
            </span>
            <span className="font-reading text-xs text-charcoal/60 italic">
              Ballygunge Circular Road, Kolkata
            </span>
          </div>
        </div>

        <div className="md:col-span-7 space-y-5">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-burgundy leading-tight">
            "A novel is a house built to shelter what time insists on washing away."
          </h2>

          <div className="font-reading text-base text-charcoal/85 leading-relaxed space-y-4">
            <p>
              Born in Kolkata into a family of jurists and naturalists, Ms. Jaya Roy Chowdhury grew up surrounded by high-ceilinged libraries, damp monsoons, and the rhythmic clatter of trams outside her grandfather's courtyard house.
            </p>
            <p>
              Her literary work sits at the intersection of historical rigor and deep poetic interiority. Rather than grand political chronicles, her stories examine the quiet, private choices made by women, conservators, and exiled families who found themselves caught in the gears of twentieth-century Asian history.
            </p>
            <p>
              Her prose has been praised by critics for its "tactile acoustic richness"—a cadence forged through decades of listening to falling rain, creaking teak floorboards, and the unrecorded dialects of boatmen along the Hooghly river.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              to="/books"
              className="px-6 py-3 bg-burgundy hover:bg-burgundy-dark text-ivory text-xs uppercase tracking-widest font-semibold transition-colors"
            >
              Explore Published Works
            </Link>
            <Link
              to="/correspondence"
              className="px-6 py-3 bg-forest hover:bg-forest-light text-ivory text-xs uppercase tracking-widest font-semibold transition-colors"
            >
              Send Personal Correspondence
            </Link>
          </div>
        </div>
      </div>

      {/* Guiding Creative Philosophy Card */}
      <section className="p-8 sm:p-14 bg-[#FAF7F2] border border-brass/40 deckled-shadow text-center space-y-6">
        <span className="font-editorial text-xs uppercase tracking-[0.25em] text-forest font-semibold block">
          The Guiding Creative Philosophy
        </span>
        <blockquote className="font-display text-3xl sm:text-4xl text-burgundy italic max-w-3xl mx-auto leading-relaxed">
          "{settings?.authorPhilosophy || 'Where stories take root, characters breathe, and every reader finds a little piece of themselves.'}"
        </blockquote>
        <p className="font-reading text-sm text-charcoal/70 italic max-w-xl mx-auto">
          Every piece of prose in this sanctuary is dedicated to the belief that books are not consumer artifacts, but enduring spiritual conversations between souls across space and time.
        </p>
      </section>

      {/* Literary Journey & Timeline */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-[0.2em] text-forest font-semibold block">
            Milestones of the Craft
          </span>
          <h3 className="font-display text-3xl font-bold text-burgundy">
            The Literary Timeline
          </h3>
        </div>

        <div className="relative border-l-2 border-brass/40 ml-4 md:ml-32 space-y-10 pl-6 sm:pl-8">
          {timelineMilestones.map((m, idx) => (
            <div key={idx} className="relative group">
              {/* Dot marker */}
              <span className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full bg-ivory border-2 border-burgundy group-hover:scale-125 transition-transform" />

              <span className="font-editorial text-xs font-bold text-burgundy tracking-widest uppercase block">
                {m.year}
              </span>
              <h4 className="font-display text-2xl font-bold text-charcoal mt-0.5">
                {m.title}
              </h4>
              <p className="font-reading text-sm text-charcoal/75 leading-relaxed mt-1 max-w-2xl">
                {m.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Literary Representation & Rights Contact */}
      <section className="p-8 sm:p-10 bg-ivory border border-brass/50 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-3">
          <span className="font-editorial text-xs uppercase tracking-widest text-forest font-semibold block">
            Rights &amp; Literary Agency
          </span>
          <h3 className="font-display text-2xl font-bold text-burgundy">
            Representation &amp; Inquiries
          </h3>
          <p className="font-reading text-xs text-charcoal/80 leading-relaxed">
            For translation rights, theatrical/film adaptations, foreign editions, and festival appearances, please direct inquiries to the author’s primary literary agency:
          </p>
          <div className="pt-2 text-xs text-charcoal space-y-1">
            <p><strong>{settings?.literaryAgent?.name || 'Devina Khurana'}</strong></p>
            <p className="text-charcoal/70">{settings?.literaryAgent?.agency || 'Heritage & Quill Literary Agency'}</p>
            <p className="font-mono text-burgundy">{settings?.literaryAgent?.email || 'rights@heritagequill.com'}</p>
          </div>
        </div>

        <div className="p-6 bg-parchment/50 border border-brass/30 space-y-3 text-center md:text-left">
          <span className="font-editorial text-[10px] uppercase tracking-widest text-brass block">
            Press &amp; Media Kit
          </span>
          <h4 className="font-display text-xl font-bold text-burgundy">
            Author Photographs &amp; Official Bio
          </h4>
          <p className="font-reading text-xs text-charcoal/70">
            High-resolution press portraits, approved biography blurbs in varying lengths, and book jackets for media and festival programs.
          </p>
          <button
            onClick={() => alert('Press kit packet downloaded (curated author photographs and bibliography dossier).')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-burgundy hover:bg-burgundy-dark text-ivory text-xs uppercase tracking-widest font-semibold transition-colors"
          >
            <Download size={13} /> Download Media Kit
          </button>
        </div>
      </section>
    </div>
  );
};
