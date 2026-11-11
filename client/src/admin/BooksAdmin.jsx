import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import { csv } from '../lib/format.js';
import { Spinner, Field } from '../components/ui.jsx';
import { AdminHead, Notice, Toggle, ImageField } from './shared.jsx';

const blank = { title: '', subtitle: '', tagline: '', synopsis: '', coverImage: null, publisher: '', publishedOn: '', isbn: '', pages: '', genres: '', themes: '', amazonUrl: '', otherLinks: [], isPublished: false, isFeatured: false, order: 0 };

function BookForm({ book, onDone, onCancel }) {
  const [f, setF] = useState(book ? { ...blank, ...book, pages: book.pages ?? '', genres: (book.genres || []).join(', '), themes: (book.themes || []).join(', ') } : blank);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const body = { ...f, pages: f.pages === '' ? null : Number(f.pages), genres: csv(f.genres), themes: csv(f.themes), otherLinks: f.otherLinks.filter((l) => l.label && l.url) };
    delete body._id; delete body.slug; delete body.createdAt; delete body.updatedAt; delete body.__v;
    try {
      if (book) await api.put(`/admin/books/${book._id}`, body);
      else await api.post('/admin/books', body);
      onDone();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const setLink = (i, k, v) => setF({ ...f, otherLinks: f.otherLinks.map((l, n) => (n === i ? { ...l, [k]: v } : l)) });

  return (
    <form onSubmit={save} className="card max-w-3xl space-y-5 p-6">
      <h2 className="text-3xl">{book ? 'Edit book' : 'Add a book'}</h2>
      <Field label="Title" htmlFor="t"><input id="t" className="field" value={f.title} onChange={set('title')} required /></Field>
      <Field label="Subtitle (optional)" htmlFor="st"><input id="st" className="field" value={f.subtitle} onChange={set('subtitle')} /></Field>
      <Field label="Short introduction" htmlFor="tg" hint="One or two sentences shown on book cards."><textarea id="tg" rows={2} className="field" value={f.tagline} onChange={set('tagline')} /></Field>
      <Field label="Synopsis" htmlFor="sy" hint="Leave a blank line between paragraphs."><textarea id="sy" rows={8} className="field" value={f.synopsis} onChange={set('synopsis')} /></Field>
      <ImageField label="Book cover" folder="covers" value={f.coverImage} onChange={(v) => setF({ ...f, coverImage: v })} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Publisher" htmlFor="pb"><input id="pb" className="field" value={f.publisher} onChange={set('publisher')} /></Field>
        <Field label="Published (as you want it shown)" htmlFor="po"><input id="po" className="field" placeholder="December 2022" value={f.publishedOn} onChange={set('publishedOn')} /></Field>
        <Field label="ISBN" htmlFor="is"><input id="is" className="field" value={f.isbn} onChange={set('isbn')} /></Field>
        <Field label="Pages" htmlFor="pg"><input id="pg" type="number" min="0" className="field" value={f.pages} onChange={set('pages')} /></Field>
        <Field label="Genres" htmlFor="gn" hint="Separate with commas."><input id="gn" className="field" value={f.genres} onChange={set('genres')} /></Field>
        <Field label="Themes" htmlFor="th" hint="Separate with commas."><input id="th" className="field" value={f.themes} onChange={set('themes')} /></Field>
      </div>
      <Field label="Amazon link" htmlFor="am" hint="Paste the full link, starting with https://"><input id="am" type="url" className="field" value={f.amazonUrl} onChange={set('amazonUrl')} /></Field>

      <fieldset>
        <legend className="label">Other places to buy</legend>
        {f.otherLinks.map((l, i) => (
          <div key={i} className="mb-2 flex gap-2">
            <input aria-label="Store name" className="field w-40" placeholder="Flipkart" value={l.label} onChange={(e) => setLink(i, 'label', e.target.value)} />
            <input aria-label="Store link" type="url" className="field" placeholder="https://" value={l.url} onChange={(e) => setLink(i, 'url', e.target.value)} />
            <button type="button" className="text-sm text-rose-deep underline" onClick={() => setF({ ...f, otherLinks: f.otherLinks.filter((_, n) => n !== i) })}>Remove</button>
          </div>
        ))}
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setF({ ...f, otherLinks: [...f.otherLinks, { label: '', url: '' }] })}>Add a store</button>
      </fieldset>

      <div className="flex flex-wrap items-center gap-6">
        <Toggle label="Published on the website" checked={f.isPublished} onChange={(v) => setF({ ...f, isPublished: v })} />
        <Toggle label="Feature on the homepage" checked={f.isFeatured} onChange={(v) => setF({ ...f, isFeatured: v })} />
        <label className="flex items-center gap-2 text-sm">Order<input type="number" className="field w-20 !py-2" value={f.order} onChange={set('order')} /></label>
      </div>
      <Notice kind="err">{error}</Notice>
      <div className="flex gap-3">
        <button className="btn btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Save book'}</button>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default function BooksAdmin() {
  const [books, setBooks] = useState(null);
  const [editing, setEditing] = useState(null); // null = list, {} = new, book = edit
  const [msg, setMsg] = useState('');
  const load = () => api.get('/admin/books').then((d) => setBooks(d.books)).catch((e) => setMsg(e.message));
  useEffect(() => { load(); }, []);

  async function togglePublish(b) {
    const { _id, slug, createdAt, updatedAt, __v, ...body } = b;
    await api.put(`/admin/books/${b._id}`, { ...body, isPublished: !b.isPublished });
    load();
  }
  async function remove(b) {
    if (!window.confirm(`Delete “${b.title}”? Its characters stay, but lose this book link.`)) return;
    await api.del(`/admin/books/${b._id}`);
    setMsg(`“${b.title}” was deleted.`);
    load();
  }

  if (editing) return <BookForm book={editing._id ? editing : null} onCancel={() => setEditing(null)} onDone={() => { setEditing(null); setMsg('Book saved.'); load(); }} />;

  return (
    <>
      <AdminHead title="Books"><button className="btn btn-primary" onClick={() => setEditing({})}>Add a book</button></AdminHead>
      <Notice>{msg}</Notice>
      {!books ? <Spinner /> : (
        <ul className="mt-4 space-y-3">
          {books.map((b) => (
            <li key={b._id} className="card flex flex-wrap items-center gap-4 p-4">
              <div className="h-20 w-14 shrink-0 overflow-hidden rounded bg-parchment">{b.coverImage?.url && <img src={b.coverImage.url} alt="" className="h-full w-full object-cover" />}</div>
              <div className="min-w-0 flex-1">
                <p className="font-serif text-2xl leading-tight">{b.title}</p>
                <p className="text-sm text-forest/70">{[b.publisher, b.publishedOn].filter(Boolean).join(' · ') || 'Details to be added'}{b.amazonUrl ? '' : ' · No Amazon link yet'}</p>
              </div>
              <span className={`pill ${b.isPublished ? 'border-sage text-sage-deep' : ''}`}>{b.isPublished ? 'Published' : 'Draft'}</span>
              <div className="flex gap-3 text-sm">
                <button className="underline underline-offset-4" onClick={() => togglePublish(b)}>{b.isPublished ? 'Unpublish' : 'Publish'}</button>
                <button className="underline underline-offset-4" onClick={() => setEditing(b)}>Edit</button>
                <button className="text-rose-deep underline underline-offset-4" onClick={() => remove(b)}>Delete</button>
              </div>
            </li>
          ))}
          {books.length === 0 && <li className="text-forest/70">No books yet. Add the first one.</li>}
        </ul>
      )}
    </>
  );
}
