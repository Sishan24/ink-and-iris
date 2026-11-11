import { useEffect, useState, useCallback } from 'react';
import { api } from '../lib/api.js';
import { formatDateTime } from '../lib/format.js';
import { Spinner } from '../components/ui.jsx';
import { AdminHead, Notice } from './shared.jsx';

const tabs = [['', 'Inbox'], ['unread', 'Unread'], ['read', 'Read'], ['replied', 'Replied'], ['archived', 'Archived']];
const label = { unread: 'Unread', read: 'Read', replied: 'Replied', archived: 'Archived' };

export default function Messages() {
  const [status, setStatus] = useState('');
  const [data, setData] = useState(null);
  const [sel, setSel] = useState(null);
  const [reply, setReply] = useState('');
  const [note, setNote] = useState({ kind: 'ok', text: '' });
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    api.get(`/admin/messages${status ? `?status=${status}` : ''}`).then(setData).catch((e) => setNote({ kind: 'err', text: e.message }));
  }, [status]);
  useEffect(() => { setData(null); setSel(null); load(); }, [load]);

  const patch = (m) => {
    setSel(m);
    setData((d) => ({ ...d, messages: d.messages.map((x) => (x._id === m._id ? m : x)) }));
  };

  async function open(m) {
    setSel(m);
    setReply('');
    setNote({ kind: 'ok', text: '' });
    if (m.status === 'unread') patch((await api.patch(`/admin/messages/${m._id}`, { status: 'read' })).message);
  }
  async function setState(s) {
    patch((await api.patch(`/admin/messages/${sel._id}`, { status: s })).message);
    if (s === 'archived' && status !== 'archived') { setData((d) => ({ ...d, messages: d.messages.filter((x) => x._id !== sel._id) })); setSel(null); }
  }
  async function send(e) {
    e.preventDefault();
    setBusy(true);
    try {
      patch((await api.post(`/admin/messages/${sel._id}/reply`, { body: reply })).message);
      setReply('');
      setNote({ kind: 'ok', text: `Reply sent to ${sel.email}.` });
    } catch (err) {
      setNote({ kind: 'err', text: err.message });
    } finally {
      setBusy(false);
    }
  }
  async function remove() {
    if (!window.confirm('Delete this message permanently?')) return;
    await api.del(`/admin/messages/${sel._id}`);
    setData((d) => ({ ...d, messages: d.messages.filter((x) => x._id !== sel._id) }));
    setSel(null);
  }

  return (
    <>
      <AdminHead title="Messages" />
      <div className="mb-5 flex flex-wrap gap-2" role="tablist" aria-label="Message filters">
        {tabs.map(([v, l]) => (
          <button key={v} role="tab" aria-selected={status === v} onClick={() => setStatus(v)} className={`rounded-full border px-4 py-1.5 text-sm ${status === v ? 'border-forest bg-forest text-ivory' : 'border-forest/25'}`}>{l}</button>
        ))}
      </div>

      {!data ? <Spinner /> : (
        <div className="grid gap-5 lg:grid-cols-[22rem_1fr]">
          <ul className="card max-h-[70vh] divide-y divide-parchment overflow-auto">
            {data.messages.map((m) => (
              <li key={m._id}>
                <button onClick={() => open(m)} aria-current={sel?._id === m._id} className={`block w-full px-4 py-3 text-left hover:bg-parchment/40 ${sel?._id === m._id ? 'bg-parchment/60' : ''}`}>
                  <span className="flex items-center justify-between gap-2">
                    <span className={`truncate text-sm ${m.status === 'unread' ? 'font-bold' : ''}`}>{m.name}</span>
                    <span className="shrink-0 text-xs text-forest/60">{label[m.status]}</span>
                  </span>
                  <span className="block truncate text-sm text-forest/75">{m.subject}</span>
                </button>
              </li>
            ))}
            {data.messages.length === 0 && <li className="p-6 text-center text-sm text-forest/70">Nothing here.</li>}
          </ul>

          <div className="card min-h-[16rem] p-6">
            {!sel ? <p className="text-forest/70">Select a message to read it.</p> : (
              <>
                <h2 className="text-3xl">{sel.subject}</h2>
                <p className="mt-1 text-sm text-forest/75">{sel.name} · <a className="underline" href={`mailto:${sel.email}`}>{sel.email}</a> · {formatDateTime(sel.createdAt)}</p>
                <p className="mt-5 whitespace-pre-wrap text-base leading-relaxed">{sel.message}</p>

                <div className="mt-6 flex flex-wrap gap-2 border-t border-parchment pt-4">
                  {sel.status !== 'unread' && <button className="btn btn-ghost btn-sm" onClick={() => setState('unread')}>Mark unread</button>}
                  {sel.status === 'unread' && <button className="btn btn-ghost btn-sm" onClick={() => setState('read')}>Mark read</button>}
                  {sel.status !== 'archived' && <button className="btn btn-ghost btn-sm" onClick={() => setState('archived')}>Archive</button>}
                  {sel.status === 'archived' && <button className="btn btn-ghost btn-sm" onClick={() => setState('read')}>Restore</button>}
                  <button className="btn btn-danger btn-sm" onClick={remove}>Delete</button>
                </div>

                <form onSubmit={send} className="mt-6 space-y-3">
                  <label htmlFor="reply" className="label">Reply by email</label>
                  <textarea id="reply" rows={5} className="field" value={reply} onChange={(e) => setReply(e.target.value)} placeholder={`Dear ${sel.name.split(' ')[0]},`} />
                  <Notice kind={note.kind}>{note.text}</Notice>
                  <button className="btn btn-primary" disabled={busy || reply.trim().length < 2}>{busy ? 'Sending…' : 'Send reply'}</button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
