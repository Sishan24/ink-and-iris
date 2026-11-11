import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import { csv } from '../lib/format.js';
import { Spinner, Field } from '../components/ui.jsx';
import { AdminHead, Notice, Toggle, ImageField } from './shared.jsx';

const blank = { name: '', bookIds: [], portrait: null, about: '', personality: '', story: '', relatedCharacters: [], isPublished: false, order: 0 };
const ids = (arr) => (arr || []).map((x) => (typeof x === 'string' ? x : x._id));

function CheckList({ legend, items, value, onChange, empty }) {
  const toggle = (id) => onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);
  return (
    <fieldset>
      <legend className="label">{legend}</legend>
      {items.length === 0 ? <p className="hint">{empty}</p> : (
        <div className="flex flex-wrap gap-2">
          {items.map((i) => (
            <label key={i._id} className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm ${value.includes(i._id) ? 'border-forest bg-forest text-ivory' : 'border-forest/25'}`}>
              <input type="checkbox" className="sr-only" checked={value.includes(i._id)} onChange={() => toggle(i._id)} />
              {i.title || i.name}
            </label>
          ))}
        </div>
      )}
    </fieldset>
  );
}

function CharacterForm({ character, books, characters, onDone, onCancel }) {
  const [f, setF] = useState(character ? { ...blank, ...character, bookIds: ids(character.bookIds), relatedCharacters: ids(character.relatedCharacters), personality: (character.personality || []).join(', ') } : blank);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const body = { ...f, personality: csv(f.personality) };
    ['_id', 'slug', 'createdAt', 'updatedAt', '__v'].forEach((k) => delete body[k]);
    try {
      if (character) await api.put(`/admin/characters/${character._id}`, body);
      else await api.post('/admin/characters', body);
      onDone();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={save} className="card max-w-3xl space-y-5 p-6">
      <h2 className="text-3xl">{character ? 'Edit character' : 'Add a character'}</h2>
      <Field label="Name" htmlFor="cn"><input id="cn" className="field" value={f.name} onChange={set('name')} required /></Field>
      <CheckList legend="Appears in" items={books} value={f.bookIds} onChange={(v) => setF({ ...f, bookIds: v })} empty="Add a book first." />
      <ImageField label="Approved portrait" folder="portraits" shape="arch" value={f.portrait} onChange={(v) => setF({ ...f, portrait: v })} />
      <Field label="About" htmlFor="ca" hint="A short introduction to the character."><textarea id="ca" rows={4} className="field" value={f.about} onChange={set('about')} /></Field>
      <Field label="Personality" htmlFor="cp" hint="Author-approved traits, separated by commas."><input id="cp" className="field" value={f.personality} onChange={set('personality')} /></Field>
      <Field label="Role in the story" htmlFor="cs"><textarea id="cs" rows={6} className="field" value={f.story} onChange={set('story')} /></Field>
      <CheckList legend="Related characters" items={characters.filter((c) => c._id !== character?._id)} value={f.relatedCharacters} onChange={(v) => setF({ ...f, relatedCharacters: v })} empty="No other characters yet." />
      <div className="flex flex-wrap items-center gap-6">
        <Toggle label="Published on the website" checked={f.isPublished} onChange={(v) => setF({ ...f, isPublished: v })} />
        <label className="flex items-center gap-2 text-sm">Order<input type="number" className="field w-20 !py-2" value={f.order} onChange={set('order')} /></label>
      </div>
      <Notice kind="err">{error}</Notice>
      <div className="flex gap-3">
        <button className="btn btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Save character'}</button>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default function CharactersAdmin() {
  const [characters, setCharacters] = useState(null);
  const [books, setBooks] = useState([]);
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState('');
  const load = () => Promise.all([api.get('/admin/characters'), api.get('/admin/books')]).then(([c, b]) => { setCharacters(c.characters); setBooks(b.books); }).catch((e) => setMsg(e.message));
  useEffect(() => { load(); }, []);

  async function remove(c) {
    if (!window.confirm(`Delete ${c.name}?`)) return;
    await api.del(`/admin/characters/${c._id}`);
    setMsg(`${c.name} was deleted.`);
    load();
  }

  if (editing) return <CharacterForm character={editing._id ? editing : null} books={books} characters={characters || []} onCancel={() => setEditing(null)} onDone={() => { setEditing(null); setMsg('Character saved.'); load(); }} />;

  return (
    <>
      <AdminHead title="Characters"><button className="btn btn-primary" onClick={() => setEditing({})}>Add a character</button></AdminHead>
      <Notice>{msg}</Notice>
      {!characters ? <Spinner /> : (
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {characters.map((c) => (
            <li key={c._id} className="card flex items-center gap-4 p-4">
              <div className="h-20 w-16 shrink-0 overflow-hidden rounded-t-full rounded-b-lg bg-parchment">{c.portrait?.url && <img src={c.portrait.url} alt="" className="h-full w-full object-cover" />}</div>
              <div className="min-w-0 flex-1">
                <p className="font-serif text-2xl leading-tight">{c.name}</p>
                <p className="truncate text-sm text-forest/70">{(c.bookIds || []).map((b) => b.title).join(', ') || 'Not linked to a book'}</p>
                <p className="mt-1 text-xs">{c.isPublished ? 'Published' : 'Draft'}</p>
                <div className="mt-2 flex gap-3 text-sm">
                  <button className="underline underline-offset-4" onClick={() => setEditing(c)}>Edit</button>
                  <button className="text-rose-deep underline underline-offset-4" onClick={() => remove(c)}>Delete</button>
                </div>
              </div>
            </li>
          ))}
          {characters.length === 0 && <li className="text-forest/70">No characters yet. Add one to begin the gallery.</li>}
        </ul>
      )}
    </>
  );
}
