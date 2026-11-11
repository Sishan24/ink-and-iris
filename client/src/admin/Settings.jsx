import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../lib/api.js';
import { Spinner, Field } from '../components/ui.jsx';
import { AdminHead, Notice, useAdminContent } from './shared.jsx';

export default function Settings() {
  const { user, setUser } = useAuth();
  const { content, save, error } = useAdminContent();
  const [email, setEmail] = useState('');
  const [name, setName] = useState(user.name);
  const [note, setNote] = useState({ kind: 'ok', text: '' });

  useEffect(() => { if (content) setEmail(content.contactEmail || ''); }, [content]);
  if (error) return <Notice kind="err">{error}</Notice>;
  if (!content) return <Spinner />;

  async function saveAll(e) {
    e.preventDefault();
    try {
      await save({ ...content, contactEmail: email });
      if (name !== user.name) setUser((await api.patch('/auth/me', { name })).user);
      setNote({ kind: 'ok', text: 'Settings saved.' });
    } catch (err) {
      setNote({ kind: 'err', text: err.message });
    }
  }

  return (
    <form onSubmit={saveAll} className="max-w-xl space-y-6">
      <AdminHead title="Settings" />
      <section className="card space-y-4 p-6">
        <h2 className="text-2xl">Message notifications</h2>
        <Field label="Email for new-message alerts" htmlFor="ce" hint="Readers never see this address. If left empty, alerts go to the admin sign-in email.">
          <input id="ce" type="email" className="field" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
      </section>
      <section className="card space-y-4 p-6">
        <h2 className="text-2xl">Your account</h2>
        <Field label="Display name" htmlFor="dn"><input id="dn" className="field" value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label="Sign-in email" htmlFor="se" hint="Admin access is tied to this address. It is set on the server."><input id="se" className="field opacity-70" value={user.email} readOnly /></Field>
      </section>
      <Notice kind={note.kind}>{note.text}</Notice>
      <button className="btn btn-primary">Save settings</button>
    </form>
  );
}
