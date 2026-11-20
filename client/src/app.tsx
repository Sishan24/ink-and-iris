import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { LiteraryShell } from './components/layout/LiteraryShell';
import { AdminLayout } from './components/layout/AdminLayout';
import { Home } from './pages/public/Home';
import { Bookshelf } from './pages/public/Bookshelf';
import { BookDetail } from './pages/public/BookDetail';
import { Characters } from './pages/public/Characters';
import { CharacterDetail } from './pages/public/CharacterDetail';
import { Journal } from './pages/public/Journal';
import { JournalDetail } from './pages/public/JournalDetail';
import { Correspondence } from './pages/public/Correspondence';
import { ReadingRoom } from './pages/public/ReadingRoom';
import { Gatherings } from './pages/public/Gatherings';
import { About } from './pages/public/About';

const NotFound: React.FC = () => (
  <div className="max-w-xl mx-auto py-24 text-center">
    <h1 className="text-4xl font-serif mb-4">This page drifted out of orbit</h1>
    <p className="mb-6">The chapter you are looking for could not be found.</p>
    <Link to="/" className="underline">Return home</Link>
  </div>
);

const AdminHome: React.FC = () => (
  <div className="p-8">
    <h1 className="text-2xl font-serif">The Author's Atelier</h1>
    <p className="mt-2">Admin pages are coming next.</p>
  </div>
);

const App: React.FC = () => (
  <Routes>
    <Route element={<LiteraryShell />}>
      <Route path="/" element={<Home />} />
      <Route path="/books" element={<Bookshelf />} />
      <Route path="/books/:slug" element={<BookDetail />} />
      <Route path="/characters" element={<Characters />} />
      <Route path="/characters/:slug" element={<CharacterDetail />} />
      <Route path="/journal" element={<Journal />} />
      <Route path="/journal/:slug" element={<JournalDetail />} />
      <Route path="/correspondence" element={<Correspondence />} />
      <Route path="/reading-room" element={<ReadingRoom />} />
      <Route path="/gatherings" element={<Gatherings />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<NotFound />} />
    </Route>

    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<AdminHome />} />
    </Route>
  </Routes>
);

export default App;