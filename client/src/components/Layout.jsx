import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import { useFetch } from '../lib/hooks.js';

export default function Layout() {
  const { pathname } = useLocation();
  const { data } = useFetch('/content');
  useEffect(() => window.scrollTo(0, 0), [pathname]);

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-forest focus:px-4 focus:py-2 focus:text-ivory">
        Skip to content
      </a>
      <Header />
      <main id="main" className="min-h-[70vh]">
        <Outlet context={{ content: data?.content }} />
      </main>
      <Footer instagramUrl={data?.content?.instagramUrl} />
    </>
  );
}
