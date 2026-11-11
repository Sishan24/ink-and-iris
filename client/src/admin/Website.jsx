import { useState, useEffect } from 'react';
import { Spinner, Field } from '../components/ui.jsx';
import { AdminHead, Notice, ImageField, useAdminContent } from './shared.jsx';

export default function Website() {
  const { content, save, error } = useAdminContent();
  const [f, setF] = useState(null);
  const [note, setNote] = useState({ kind: 'ok', text: '' });
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (content && !f) setF(structuredClone(content)); }, [content, f]);
  if (error) return <Notice kind="err">{error}</Notice>;
  if (!f) return <Spinner />;

  const set = (path, value) => {
    const next = structuredClone(f);
    const keys = path.split('.');
    let o = next;
    keys.slice(0, -1).forEach((k) => { o = o[k]; });
    o[keys.at(-1)] = value;
    setF(next);
  };
  const input = (path, label, opts = {}) => {
    const value = path.split('.').reduce((o, k) => o?.[k], f) ?? '';
    const id = `w-${path}`;
    return (
      <Field label={label} htmlFor={id} hint={opts.hint}>
        {opts.rows ? <textarea id={id} rows={opts.rows} className="field" value={value} onChange={(e) => set(path, e.target.value)} /> : <input id={id} className="field" value={value} onChange={(e) => set(path, e.target.value)} />}
      </Field>
    );
  };

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await save(f);
      setNote({ kind: 'ok', text: 'Changes saved. They are live on the website now.' });
    } catch (err) {
      setNote({ kind: 'err', text: err.message });
    } finally {
      setBusy(false);
    }
  }

  const setQuote = (i, k, v) => set('quotes', f.quotes.map((q, n) => (n === i ? { ...q, [k]: v } : q)));

  return (
    <form onSubmit={submit} className="max-w-3xl space-y-8">
      <AdminHead title="Homepage & Author"><button className="btn btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</button></AdminHead>
      <Notice kind={note.kind}>{note.text}</Notice>

      <section className="card space-y-4 p-6">
        <h2 className="text-2xl">Homepage introduction</h2>
        {input('hero.kicker', 'Line above the title')}
        {input('hero.title', 'Title')}
        {input('hero.tagline', 'Tagline')}
        {input('hero.intro', 'Introduction', { rows: 2 })}
      </section>

      <section className="card space-y-4 p-6">
        <h2 className="text-2xl">Note from the author (homepage)</h2>
        {input('authorNote.heading', 'Heading')}
        {input('authorNote.body', 'Note', { rows: 5, hint: 'Leave a blank line between paragraphs.' })}
      </section>

      <section className="card space-y-4 p-6">
        <h2 className="text-2xl">Author page</h2>
        <ImageField label="Author photograph" folder="author" shape="arch" value={f.authorProfile.photo} onChange={(v) => set('authorProfile.photo', v)} />
        {input('authorProfile.name', 'Name')}
        {input('authorProfile.role', 'Descriptor', { hint: 'For example: Author · Educationist · Poet' })}
        {input('authorProfile.statement', 'Introductory statement')}
        {input('authorProfile.bio', 'Full biography', { rows: 9, hint: 'Leave a blank line between paragraphs.' })}
        {input('authorProfile.journey', 'Literary journey', { rows: 6 })}
        {input('authorProfile.approach', 'Approach to storytelling', { rows: 5 })}
        {input('authorProfile.quote.text', 'Selected quotation', { rows: 2 })}
        {input('authorProfile.quote.attribution', 'Quotation source')}
        {input('instagramUrl', 'Instagram link', { hint: 'Full link, for example https://www.instagram.com/…' })}
      </section>

      <section className="card space-y-4 p-6">
        <h2 className="text-2xl">Rotating literary thoughts</h2>
        <p className="text-sm text-forest/75">Only add thoughts the author has approved. The homepage section appears once there is at least one.</p>
        {f.quotes.map((q, i) => (
          <div key={i} className="space-y-2 rounded-xl border border-parchment p-4">
            <textarea aria-label={`Thought ${i + 1}`} rows={2} className="field" value={q.text} onChange={(e) => setQuote(i, 'text', e.target.value)} />
            <input aria-label={`Source of thought ${i + 1}`} className="field" placeholder="Source (optional)" value={q.attribution || ''} onChange={(e) => setQuote(i, 'attribution', e.target.value)} />
            <button type="button" className="text-sm text-rose-deep underline" onClick={() => set('quotes', f.quotes.filter((_, n) => n !== i))}>Remove</button>
          </div>
        ))}
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => set('quotes', [...f.quotes, { text: '', attribution: 'Jaya Roy Chowdhury' }])}>Add a thought</button>
      </section>

      <div><button className="btn btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</button></div>
    </form>
  );
}
