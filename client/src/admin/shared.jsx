import { useRef, useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api.js';

export function AdminHead({ title, children }) {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-4xl">{title}</h1>
      <div className="flex gap-2">{children}</div>
    </div>
  );
}

export const Notice = ({ kind = 'ok', children }) =>
  children ? (
    <p role={kind === 'err' ? 'alert' : 'status'} className={`rounded-xl px-4 py-3 text-sm ${kind === 'err' ? 'bg-rose/15 text-rose-deep' : 'bg-sage/15 text-sage-deep'}`}>
      {children}
    </p>
  ) : null;

export const Toggle = ({ checked, onChange, label }) => (
  <label className="flex cursor-pointer items-center gap-3 text-sm">
    <input type="checkbox" className="h-5 w-5 accent-[#293A35]" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    {label}
  </label>
);

export function ImageField({ label, value, onChange, folder, shape = 'cover' }) {
  const ref = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function pick(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      onChange(await api.upload(file, folder));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  }

  return (
    <div>
      <span className="label">{label}</span>
      <div className="flex items-center gap-4">
        <div className={`flex shrink-0 items-center justify-center overflow-hidden border border-parchment bg-parchment/50 text-xs text-forest/60 ${shape === 'cover' ? 'h-24 w-16 rounded-md' : 'h-24 w-20 rounded-t-full rounded-b-lg'}`}>
          {value?.url ? <img src={value.url} alt="" className="h-full w-full object-cover" /> : 'No image'}
        </div>
        <div className="space-y-2">
          <input ref={ref} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" id={`up-${folder}-${label}`} onChange={pick} />
          <label htmlFor={`up-${folder}-${label}`} className="btn btn-ghost btn-sm cursor-pointer">{busy ? 'Uploading…' : value?.url ? 'Replace image' : 'Upload image'}</label>
          {value?.url && <button type="button" className="ml-2 text-xs text-rose-deep underline" onClick={() => onChange(null)}>Remove</button>}
          <p className="hint">JPG, PNG or WebP, up to 5 MB.</p>
        </div>
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

/** Loads the full site content once and saves it back in one piece. */
export function useAdminContent() {
  const [content, setContent] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    api.get('/admin/content').then((d) => setContent(d.content)).catch((e) => setError(e.message));
  }, []);
  const save = useCallback(
    async (next) => {
      const { _id, __v, key, createdAt, updatedAt, ...body } = next;
      const { content: saved } = await api.put('/admin/content', body);
      setContent(saved);
      return saved;
    },
    []
  );
  return { content, setContent, save, error };
}
