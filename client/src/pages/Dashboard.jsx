import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useFetch, useSeo } from '../lib/hooks.js';
import { api } from '../lib/api.js';
import { formatDate } from '../lib/format.js';
import { Spinner, Field } from '../components/ui.jsx';
import Cover from '../components/Cover.jsx';
import Portrait from '../components/Portrait.jsx';

export default function Dashboard() {
  useSeo('My account');
  const { user, setUser, logout } = useAuth();
  const { data, loading } = useFetch('/reader/dashboard');
  const navigate = useNavigate();
  const [name, setName] = useState(user.name);
  const [msg, setMsg] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function saveName(e) {
    e.preventDefault();
    try {
      const { user: u } = await api.patch('/auth/me', { name });
      setUser(u);
      setMsg('Your name has been updated.');
    } catch (err) {
      setMsg(err.message);
    }
  }

  async function deleteAccount() {
    try {
      await api.del('/auth/me');
      setUser(null);
      navigate('/', { replace: true });
    } catch (err) {
      setMsg(err.message);
    }
  }

  return (
    <div className="container-page section">
      <h1 className="text-5xl sm:text-6xl">Welcome, {user.name.split(' ')[0]}.</h1>
      <p className="mt-3 text-forest/80">Member of the Readers’ Circle{data?.memberSince ? ` since ${formatDate(data.memberSince)}` : ''}.</p>

      {loading ? <Spinner /> : (
        <>
          <section className="mt-12" aria-labelledby="explored">
            <h2 id="explored" className="text-3xl">Books you have explored</h2>
            {data.booksExplored.length === 0 ? (
              <p className="mt-3 text-forest/75">Books you open while signed in appear here. <Link to="/books" className="underline underline-offset-4">Browse the books</Link></p>
            ) : (
              <div className="mt-6 grid grid-cols-3 gap-5 sm:grid-cols-4 lg:grid-cols-6">
                {data.booksExplored.map((b) => (
                  <Link key={b._id} to={`/books/${b.slug}`} className="block"><Cover book={b} /><p className="mt-2 text-sm">{b.title}</p></Link>
                ))}
              </div>
            )}
          </section>

          <section className="mt-14" aria-labelledby="favs">
            <h2 id="favs" className="text-3xl">Favourite characters</h2>
            {data.favouriteCharacters.length === 0 ? (
              <p className="mt-3 text-forest/75">Open a character and choose “Save to favourites”.</p>
            ) : (
              <div className="mt-6 grid grid-cols-3 gap-5 sm:grid-cols-4 lg:grid-cols-6">
                {data.favouriteCharacters.map((c) => (
                  <Link key={c._id} to={`/characters/${c.slug}`} className="block"><Portrait person={c} /><p className="mt-2 text-sm">{c.name}</p></Link>
                ))}
              </div>
            )}
          </section>
        </>
      )}

      <section className="mt-14 max-w-md" aria-labelledby="settings">
        <h2 id="settings" className="text-3xl">Account settings</h2>
        <form onSubmit={saveName} className="card mt-6 space-y-4 p-6">
          <Field label="Full name" htmlFor="n"><input id="n" className="field" value={name} onChange={(e) => setName(e.target.value)} /></Field>
          <Field label="Email address" htmlFor="e" hint="Your email is how you sign in, so it can’t be changed here."><input id="e" className="field opacity-70" value={user.email} readOnly /></Field>
          {msg && <p role="status" className="text-sm text-sage-deep">{msg}</p>}
          <div className="flex flex-wrap gap-3">
            <button className="btn btn-primary btn-sm">Save changes</button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={async () => { await logout(); navigate('/'); }}>Sign out</button>
          </div>
        </form>
        <div className="mt-6">
          {confirmDelete ? (
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span>Delete your account and everything saved with it?</span>
              <button className="btn btn-danger btn-sm" onClick={deleteAccount}>Yes, delete my account</button>
              <button className="btn btn-ghost btn-sm" onClick={() => setConfirmDelete(false)}>Keep it</button>
            </div>
          ) : (
            <button className="text-sm text-rose-deep underline underline-offset-4" onClick={() => setConfirmDelete(true)}>Delete my account</button>
          )}
        </div>
      </section>
    </div>
  );
}
