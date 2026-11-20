import React, { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, MapPin, Video, ExternalLink, Clock } from 'lucide-react';
import api from '../../api/client';
import { IEvent } from '../../types';

export const Gatherings: React.FC = () => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'upcoming' | 'past'>('upcoming');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/events?status=${selectedFilter}`);
        if (res.data?.success) {
          setEvents(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching gatherings:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [selectedFilter]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs uppercase tracking-[0.25em] text-forest font-semibold block">
          Lectures &bull; Readings &bull; Literary Festivals
        </span>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-burgundy tracking-tight">
          Gatherings &amp; Appearances
        </h1>
        <p className="font-reading text-base sm:text-lg text-charcoal/80 italic leading-relaxed">
          Upcoming keynote addresses, panel dialogues, bookstore readings, and virtual masterclasses with Ms. Jaya Roy Chowdhury.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center border-b border-brass/30 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedFilter('upcoming')}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-medium transition-all ${
              selectedFilter === 'upcoming'
                ? 'bg-burgundy text-ivory font-semibold'
                : 'bg-parchment/60 text-charcoal/80 hover:bg-parchment'
            }`}
          >
            Upcoming Engagements
          </button>
          <button
            onClick={() => setSelectedFilter('past')}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-medium transition-all ${
              selectedFilter === 'past'
                ? 'bg-burgundy text-ivory font-semibold'
                : 'bg-parchment/60 text-charcoal/80 hover:bg-parchment'
            }`}
          >
            Past Archives
          </button>
        </div>
      </div>

      {/* Events List */}
      {isLoading ? (
        <div className="py-24 text-center font-reading text-burgundy text-lg">
          Consulting the literary calendar...
        </div>
      ) : events.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-parchment/30 border border-brass/30 p-8 max-w-xl mx-auto">
          <CalendarIcon size={32} className="mx-auto text-brass opacity-60" />
          <h3 className="font-display text-2xl text-charcoal">No engagements scheduled</h3>
          <p className="font-reading text-sm text-charcoal/60">
            Ms. Roy Chowdhury is currently in seclusion working on forthcoming manuscripts. Check back soon for announcements.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {events.map((event) => {
            const eventDate = new Date(event.date);
            return (
              <article
                key={event._id}
                className="paper-card p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:border-brass"
              >
                {/* Date stamp box */}
                <div className="flex md:flex-col items-center justify-center p-4 bg-parchment/80 border border-brass/40 w-full md:w-32 shrink-0 text-center gap-2 md:gap-0">
                  <span className="font-editorial text-xs uppercase tracking-widest text-forest font-semibold block">
                    {eventDate.toLocaleDateString(undefined, { month: 'short' })}
                  </span>
                  <span className="font-display text-3xl sm:text-4xl font-bold text-burgundy block">
                    {eventDate.getDate()}
                  </span>
                  <span className="text-[11px] text-charcoal/60 font-sans block">
                    {eventDate.getFullYear()}
                  </span>
                </div>

                {/* Event info */}
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] uppercase tracking-widest text-forest font-semibold px-2 py-0.5 bg-ivory border border-forest/30">
                      {event.eventType}
                    </span>
                    {event.timeString && (
                      <span className="text-[11px] text-charcoal/60 flex items-center gap-1 font-sans">
                        <Clock size={11} className="text-brass" /> {event.timeString}
                      </span>
                    )}
                  </div>

                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-burgundy leading-tight">
                    {event.title}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-charcoal/70">
                    {event.isVirtual ? (
                      <span className="flex items-center gap-1 text-forest font-medium">
                        <Video size={13} /> Virtual Masterclass / Global Broadcast
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <MapPin size={13} className="text-brass shrink-0" />
                        <span>{event.venue}, {event.location}</span>
                      </span>
                    )}
                  </div>

                  <p className="font-reading text-xs sm:text-sm text-charcoal/80 leading-relaxed pt-1">
                    {event.description}
                  </p>
                </div>

                {/* RSVP / Registration CTA */}
                {selectedFilter === 'upcoming' && (
                  <div className="shrink-0 pt-2 md:pt-0">
                    {event.registrationUrl ? (
                      <a
                        href={event.registrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-burgundy hover:bg-burgundy-dark text-ivory text-xs uppercase tracking-widest font-semibold transition-colors border border-burgundy shadow-sm"
                      >
                        <span>RSVP / Details</span>
                        <ExternalLink size={12} />
                      </a>
                    ) : event.virtualLink ? (
                      <a
                        href={event.virtualLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-forest hover:bg-forest-light text-ivory text-xs uppercase tracking-widest font-semibold transition-colors"
                      >
                        <Video size={12} />
                        <span>Join Session</span>
                      </a>
                    ) : null}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
