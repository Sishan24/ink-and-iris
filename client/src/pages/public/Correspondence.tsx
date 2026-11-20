import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Mail, Send, CheckCircle2, ShieldCheck, Heart, BookOpen, AlertCircle } from 'lucide-react';
import api from '../../api/client';
import { IBook, IReaderLetter } from '../../types';
import { useToast } from '../../context/ToastContext';

export const Correspondence: React.FC = () => {
  const [searchParams] = useSearchParams();
  const bookParam = searchParams.get('book');

  const [books, setBooks] = useState<IBook[]>([]);
  const [publicLetters, setPublicLetters] = useState<IReaderLetter[]>([]);
  const [isLoadingLetters, setIsLoadingLetters] = useState<boolean>(true);

  // Form State
  const [senderName, setSenderName] = useState<string>('');
  const [senderEmail, setSenderEmail] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [selectedBook, setSelectedBook] = useState<string>(bookParam || '');
  const [subject, setSubject] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [consentToPublish, setConsentToPublish] = useState<boolean>(false);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);
  const { success, error } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksRes, lettersRes] = await Promise.all([
          api.get('/books'),
          api.get('/letters/public')
        ]);
        if (booksRes.data?.success) setBooks(booksRes.data.data);
        if (lettersRes.data?.success) setPublicLetters(lettersRes.data.data);
      } catch (err) {
        console.error('Error fetching correspondence data:', err);
      } finally {
        setIsLoadingLetters(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !senderEmail.trim() || !subject.trim() || !message.trim()) {
      error('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/letters', {
        senderName: senderName.trim(),
        senderEmail: senderEmail.trim(),
        isAnonymous,
        bookReferenced: selectedBook || undefined,
        subject: subject.trim(),
        message: message.trim(),
        consentToPublish
      });

      if (res.data?.success) {
        setSubmittedSuccess(true);
        success('Your letter has arrived safely at Ms. Jaya Roy Chowdhury’s desk.');
        setSenderName('');
        setSenderEmail('');
        setSubject('');
        setMessage('');
        setIsAnonymous(false);
        setConsentToPublish(false);
      }
    } catch (err: any) {
      error(err.response?.data?.message || 'Error delivering your letter.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs uppercase tracking-[0.25em] text-forest font-semibold block">
          Epistolary Dialogue &bull; Reader Correspondence
        </span>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-burgundy tracking-tight">
          The Reader's Correspondence
        </h1>
        <p className="font-reading text-base sm:text-lg text-charcoal/80 italic leading-relaxed">
          "A book is only half-written by its author; the second half is penned in the secret heart of the reader." Ms. Jaya Roy Chowdhury invites your reflections, queries, and personal memories.
        </p>
      </div>

      {/* Two Column Section: Form on Left, Guidelines on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Letter Submission Form */}
        <div className="lg:col-span-7 bg-[#FAF7F2] border border-brass/40 p-8 sm:p-10 deckled-shadow">
          <div className="border-b border-brass/30 pb-4 mb-6">
            <h2 className="font-display text-2xl font-bold text-burgundy flex items-center gap-2">
              <Mail size={20} className="text-forest" /> Post a Letter to the Author's Desk
            </h2>
            <p className="font-reading text-xs text-charcoal/70 italic mt-1">
              Letters arrive directly in the author’s private administrative reading room.
            </p>
          </div>

          {submittedSuccess ? (
            <div className="p-8 text-center space-y-4 bg-ivory border border-forest/40">
              <CheckCircle2 size={40} className="mx-auto text-forest" />
              <h3 className="font-display text-2xl font-bold text-burgundy">
                Your Letter is in Flight
              </h3>
              <p className="font-reading text-sm text-charcoal/80 italic leading-relaxed">
                Thank you for honoring this literary space with your thoughts. Ms. Jaya Roy Chowdhury reads all correspondence personally. A confirmation receipt has been dispatched to your email.
              </p>
              <button
                onClick={() => setSubmittedSuccess(false)}
                className="mt-4 px-6 py-2 bg-burgundy text-ivory text-xs uppercase tracking-widest font-semibold"
              >
                Send Another Reflection
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-charcoal/70 font-semibold block">
                    Your Name / Pen Name <span className="text-burgundy">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="e.g. Sreemoyi Sen"
                    className="w-full px-3 py-2 text-sm bg-ivory border border-brass/50 text-charcoal focus:outline-none focus:border-burgundy"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-charcoal/70 font-semibold block">
                    Your Email Address <span className="text-burgundy">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    placeholder="For private receipts and replies"
                    className="w-full px-3 py-2 text-sm bg-ivory border border-brass/50 text-charcoal focus:outline-none focus:border-burgundy"
                  />
                </div>
              </div>

              {/* Anonymous toggle */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="anonymousCheck"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded-none border-brass text-burgundy focus:ring-0"
                />
                <label htmlFor="anonymousCheck" className="text-xs text-charcoal/80 cursor-pointer">
                  Display as <em>"A Reader in Reflection"</em> (protect my real name publicly)
                </label>
              </div>

              {/* Book of Reference */}
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-charcoal/70 font-semibold block">
                  Book of Reference (Optional)
                </label>
                <select
                  value={selectedBook}
                  onChange={(e) => setSelectedBook(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-ivory border border-brass/50 text-charcoal focus:outline-none focus:border-burgundy"
                >
                  <option value="">General Literary Reflection</option>
                  {books.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-charcoal/70 font-semibold block">
                  Letter Subject <span className="text-burgundy">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Memory of rain in my grandmother's house"
                  className="w-full px-3 py-2 text-sm bg-ivory border border-brass/50 text-charcoal focus:outline-none focus:border-burgundy"
                />
              </div>

              {/* Message */}
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-charcoal/70 font-semibold block">
                  Your Letter <span className="text-burgundy">*</span>
                </label>
                <textarea
                  required
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Pen your thoughts, memories, questions, or resonant passages..."
                  className="w-full px-3 py-2.5 text-sm font-reading bg-ivory border border-brass/50 text-charcoal focus:outline-none focus:border-burgundy leading-relaxed"
                />
              </div>

              {/* Explicit Publishing Consent Checkbox */}
              <div className="p-4 bg-parchment/60 border border-brass/40 space-y-2">
                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="consentCheck"
                    checked={consentToPublish}
                    onChange={(e) => setConsentToPublish(e.target.checked)}
                    className="mt-1 rounded-none border-brass text-burgundy focus:ring-0"
                  />
                  <label htmlFor="consentCheck" className="text-xs text-charcoal/90 leading-relaxed cursor-pointer font-medium">
                    I grant permission for my letter (or excerpt) to be curated and publicly displayed in the Ink &amp; Iris Correspondence archives, alongside the author's response.
                  </label>
                </div>
                <p className="text-[10px] text-charcoal/60 pl-6 italic">
                  Note: If unchecked, your letter remains strictly private and will never be published on this website.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-burgundy hover:bg-burgundy-dark text-ivory text-xs uppercase tracking-widest font-semibold transition-colors flex items-center justify-center gap-2 border border-burgundy disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Sealing Letter...</span>
                ) : (
                  <>
                    <Send size={14} /> Send Letter to Ms. Jaya Roy Chowdhury
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Epistolary Ethos & Privacy Guarantee */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 bg-parchment/50 border border-brass/40 space-y-4">
            <span className="font-editorial text-xs uppercase tracking-widest text-forest font-semibold block">
              Ethos of the Desk
            </span>
            <h3 className="font-display text-2xl font-bold text-burgundy">
              A Protected Sanctuary for Reader Voices
            </h3>
            <p className="font-reading text-sm text-charcoal/80 leading-relaxed">
              In our accelerated digital era, letters have become an endangered art form. This portal is maintained as an intimate writing desk rather than a noisy comment section.
            </p>

            <ul className="space-y-3 pt-2 text-xs text-charcoal/80 font-reading">
              <li className="flex items-start gap-2">
                <ShieldCheck size={16} className="text-forest shrink-0 mt-0.5" />
                <span><strong>No Public Postings Without Consent:</strong> Letters are never published without your explicit authorization above.</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck size={16} className="text-forest shrink-0 mt-0.5" />
                <span><strong>Author Curation:</strong> All public displays undergo thoughtful editorial curation by Ms. Roy Chowdhury.</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck size={16} className="text-forest shrink-0 mt-0.5" />
                <span><strong>Epistolary Replies:</strong> Selected letters receive formal replies posted back to your email or featured below.</span>
              </li>
            </ul>
          </div>

          <div className="p-6 bg-ivory border border-brass/40 text-center space-y-2">
            <span className="font-editorial text-[10px] uppercase tracking-widest text-brass block">
              Direct Contact for Rights &amp; Press
            </span>
            <p className="text-xs text-charcoal/70">
              For literary rights, media interviews, and festival invitations, please contact the author's agent directly at:
            </p>
            <p className="font-mono text-xs text-burgundy font-medium">
              rights@heritagequill.com
            </p>
          </div>
        </div>
      </div>

      {/* Publicly Curated Letters Stream */}
      <section className="space-y-8 pt-12 border-t border-brass/30">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] text-forest font-semibold block">
            Public Archives &bull; Selected Correspondence
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-burgundy">
            Letters &amp; Author Responses
          </h2>
          <p className="font-reading text-xs text-charcoal/70 italic">
            Reflections shared by readers with publishing consent, followed by responses from Ms. Jaya Roy Chowdhury.
          </p>
        </div>

        {isLoadingLetters ? (
          <div className="py-12 text-center font-reading text-burgundy text-sm">
            Retrieving curated correspondence...
          </div>
        ) : publicLetters.length === 0 ? (
          <div className="py-12 text-center text-sm text-charcoal/60 italic">
            No public letters currently displayed. Be the first to share your reflection.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {publicLetters.map((l) => (
              <article
                key={l.id || l._id}
                className="paper-card p-6 sm:p-8 space-y-5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-brass/20 pb-3">
                    <span className="font-editorial text-xs text-forest font-semibold uppercase tracking-wider">
                      From: {l.senderName}
                    </span>
                    {l.bookReferenced && (
                      <span className="text-[10px] bg-parchment px-2 py-0.5 border border-brass/30 text-charcoal/70">
                        Re: {(l.bookReferenced as any).title || 'Volume'}
                      </span>
                    )}
                  </div>

                  <h3 className="font-display text-xl font-bold text-burgundy">
                    "{l.subject}"
                  </h3>

                  <p className="font-reading text-xs sm:text-sm text-charcoal/85 leading-relaxed italic">
                    "{l.message}"
                  </p>
                </div>

                {l.authorReply && (
                  <div className="pt-4 border-t border-brass/30 bg-[#F5EFE6] p-4 space-y-1.5 border-l-2 border-burgundy">
                    <span className="text-[10px] uppercase tracking-widest text-burgundy font-semibold block">
                      Ms. Jaya Roy Chowdhury's Reflection:
                    </span>
                    <p className="font-reading text-xs text-forest italic leading-relaxed">
                      "{l.authorReply}"
                    </p>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
