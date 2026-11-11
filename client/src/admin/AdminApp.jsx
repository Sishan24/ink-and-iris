import { useState } from 'react';
import { NavLink, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Overview from './Overview.jsx';
import Readers from './Readers.jsx';
import BooksAdmin from './BooksAdmin.jsx';
import CharactersAdmin from './CharactersAdmin.jsx';
import Messages from './Messages.jsx';
import Website from './Website.jsx';
import Settings from './Settings.jsx';

const nav = [
  ['', 'Overview'],
  ['readers', 'Readers'],
  ['books', 'Books'],
  ['characters', 'Characters'],
  ['messages', 'Messages'],
  ['website', 'Homepage & Author'],
  ['settings', 'Settings'],
];

export default function AdminApp() {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const links = (
    <nav aria-label="Admin" className="flex flex-col gap-1">
      {nav.map(([to, label]) => (
        <NavLink key={to} to={`/admin/${to}`} end={to === ''} onClick={() => setOpen(false)} className={({ isActive }) => `rounded-xl px-4 py-2.5 text-sm ${isActive ? 'bg-ivory text-forest font-medium' : 'text-ivory/85 hover:bg-ivory/10'}`}>
          {label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-ivory lg:grid lg:grid-cols-[15rem_1fr]">
      <aside className="hidden bg-forest p-5 text-ivory lg:block">
        <p className="font-serif text-2xl leading-tight">Golden Glades</p>
        <p className="mb-6 text-xs text-ivory/70">Author’s control room</p>
        {links}
        <div className="mt-8 flex flex-col gap-2 text-sm">
          <Link to="/" className="text-ivory/80 underline underline-offset-4">View website</Link>
          <button className="text-left text-ivory/80 underline underline-offset-4" onClick={async () => { await logout(); navigate('/'); }}>Sign out</button>
        </div>
      </aside>

      <div className="lg:hidden">
        <div className="flex items-center justify-between bg-forest px-5 py-3 text-ivory">
          <span className="font-serif text-xl">Control room</span>
          <button className="rounded-full border border-ivory/40 px-4 py-1.5 text-sm" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'}</button>
        </div>
        {open && (
          <div className="bg-forest px-5 pb-5 text-ivory">
            {links}
            <div className="mt-4 flex gap-4 text-sm">
              <Link to="/" className="underline">View website</Link>
              <button className="underline" onClick={async () => { await logout(); navigate('/'); }}>Sign out</button>
            </div>
          </div>
        )}
      </div>

      <main className="min-w-0 p-5 sm:p-8 lg:p-10">
        <Routes>
          <Route index element={<Overview />} />
          <Route path="readers" element={<Readers />} />
          <Route path="books" element={<BooksAdmin />} />
          <Route path="characters" element={<CharactersAdmin />} />
          <Route path="messages" element={<Messages />} />
          <Route path="website" element={<Website />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </main>
    </div>
  );
}
