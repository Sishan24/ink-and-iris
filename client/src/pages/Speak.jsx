import { useState } from 'react';
import { api } from '../lib/api.js';
import { useSeo } from '../lib/hooks.js';
import { Field } from '../components/ui.jsx';

export default function Speak() {
  useSeo('Speak to the Author', 'Send a message to Jaya Roy Chowdhury.');
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', website: '' });
  const [state, setState] = useState({ busy: false, done: false, error: '', fields: {} });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setState({ busy: true, done: false, error: '', fields: {} });
    try {
      await api.post('/messages', form);
      setState({ busy: false, done: true, error: '', fields: {} });
    } catch (err) {
      setState({ busy: false, done: false, error: err.message, fields: err.fields || {} });
    }
  }

  return (
    <div className="container-page section grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <h1 className="text-5xl sm:text-6xl">A Conversation Begins with a Word.</h1>
        <p className="mt-6 max-w-md text-lg text-forest/85">Every reader arrives with a thought, a question, or perhaps a story of their own.</p>
        <p className="mt-4 max-w-md text-lg text-forest/85">If something in these pages has stayed with you, Jaya would be delighted to hear from you.</p>
        <p className="mt-8 max-w-md text-sm text-forest/70">Questions about books, reader feedback, literary thoughts and invitations are all welcome.</p>
      </div>

      {state.done ? (
        <div className="card self-start p-8" role="status">
          <h2 className="text-3xl">Your message is on its way.</h2>
          <p className="mt-3 text-forest/80">Thank you for writing. The author reads every message and will reply to the email address you gave.</p>
          <button className="btn btn-ghost mt-6" onClick={() => { setForm({ name: '', email: '', subject: '', message: '', website: '' }); setState({ busy: false, done: false, error: '', fields: {} }); }}>
            Write another message
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="card space-y-5 p-6 sm:p-8" noValidate>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Your name" htmlFor="name" error={state.fields.name}>
              <input id="name" className="field" value={form.name} onChange={set('name')} autoComplete="name" required />
            </Field>
            <Field label="Your email" htmlFor="email" error={state.fields.email}>
              <input id="email" type="email" className="field" value={form.email} onChange={set('email')} autoComplete="email" required />
            </Field>
          </div>
          <Field label="Subject" htmlFor="subject" error={state.fields.subject}>
            <input id="subject" className="field" value={form.subject} onChange={set('subject')} required />
          </Field>
          <Field label="Your message" htmlFor="message" error={state.fields.message}>
            <textarea id="message" rows={7} className="field" value={form.message} onChange={set('message')} required />
          </Field>
          {/* Honeypot: hidden from people, tempting to bots */}
          <div className="absolute -left-[9999px]" aria-hidden="true">
            <label>Website<input tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} /></label>
          </div>
          {state.error && !Object.keys(state.fields).length && <p role="alert" className="error">{state.error}</p>}
          <button className="btn btn-primary" disabled={state.busy}>{state.busy ? 'Sending…' : 'Send message'}</button>
        </form>
      )}
    </div>
  );
}
