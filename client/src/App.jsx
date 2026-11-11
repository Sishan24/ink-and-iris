import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Layout from './components/Layout.jsx';
import { Spinner } from './components/ui.jsx';
import Home from './pages/Home.jsx';
import Author from './pages/Author.jsx';
import Books from './pages/Books.jsx';
import BookDetail from './pages/BookDetail.jsx';
import Characters from './pages/Characters.jsx';
import CharacterDetail from './pages/CharacterDetail.jsx';
import Speak from './pages/Speak.jsx';
import AuthPage from './pages/AuthPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Privacy from './pages/Privacy.jsx';
import NotFound from './pages/NotFound.jsx';

// The admin portal is a separate bundle: ordinary visitors never download it.
const AdminApp = lazy(() => import('./admin/AdminApp.jsx'));

function Guard({ admin = false, children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
  if (admin && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="author" element={<Author />} />
        <Route path="books" element={<Books />} />
        <Route path="books/:slug" element={<BookDetail />} />
        <Route path="characters" element={<Characters />} />
        <Route path="characters/:slug" element={<CharacterDetail />} />
        <Route path="speak" element={<Speak />} />
        <Route path="join" element={<AuthPage mode="join" />} />
        <Route path="signin" element={<AuthPage mode="signin" />} />
        <Route path="dashboard" element={<Guard><Dashboard /></Guard>} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route
        path="admin/*"
        element={
          <Guard admin>
            <Suspense fallback={<Spinner />}>
              <AdminApp />
            </Suspense>
          </Guard>
        }
      />
    </Routes>
  );
}
