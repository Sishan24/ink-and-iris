import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Feather,
  Mail,
  Quote,
  Calendar,
  Image as ImageIcon,
  Settings,
  LogOut,
  ExternalLink,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';

export const AdminLayout: React.FC = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [pendingLetterCount, setPendingLetterCount] = useState<number>(0);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    const fetchBadge = async () => {
      if (isAuthenticated) {
        try {
          const res = await api.get('/admin/dashboard-stats');
          if (res.data?.data?.metrics?.pendingLetters !== undefined) {
            setPendingLetterCount(res.data.data.metrics.pendingLetters);
          }
        } catch {
          // ignore badge error
        }
      }
    };
    fetchBadge();
  }, [isAuthenticated, location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-parchment flex items-center justify-center font-reading text-burgundy text-lg">
        Entering Author Studio...
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Books', path: '/admin/books', icon: BookOpen },
    { label: 'Characters', path: '/admin/characters', icon: Users },
    { label: 'Ink Journal', path: '/admin/journal', icon: Feather },
    {
      label: 'Correspondence',
      path: '/admin/correspondence',
      icon: Mail,
      badge: pendingLetterCount > 0 ? pendingLetterCount : undefined
    },
    { label: 'Praise & Quotes', path: '/admin/testimonials', icon: Quote },
    { label: 'Gatherings', path: '/admin/events', icon: Calendar },
    { label: 'Media Library', path: '/admin/media', icon: ImageIcon },
    { label: 'Settings & Fragment', path: '/admin/settings', icon: Settings }
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#F6F2EC] flex flex-col md:flex-row font-sans text-charcoal">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-charcoal text-ivory px-4 py-3 flex items-center justify-between border-b border-brass/30">
        <div className="flex items-center gap-2">
          <span className="font-display text-xl text-ivory font-bold">Ink &amp; Iris</span>
          <span className="text-[10px] text-brass uppercase tracking-widest">Studio</span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="text-ivory hover:text-brass"
        >
          {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 z-40 h-screen w-64 bg-charcoal text-parchment flex flex-col justify-between border-r border-brass/30 transition-transform duration-200 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Studio Brand */}
          <div className="p-6 border-b border-brass/20">
            <Link to="/admin" className="block">
              <span className="font-display text-2xl text-ivory font-bold tracking-tight block">
                Ink &amp; Iris
              </span>
              <span className="font-editorial text-[10px] tracking-[0.25em] text-brass uppercase block mt-0.5">
                Author Studio Desk
              </span>
            </Link>

            <div className="mt-4 pt-4 border-t border-parchment/10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-burgundy text-ivory flex items-center justify-center font-display font-bold text-sm border border-brass/40 shrink-0">
                JRC
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-ivory truncate">{user?.name || 'Ms. Jaya Roy Chowdhury'}</p>
                <p className="text-[10px] text-brass capitalize">{user?.role || 'Author'}</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === '/admin'
                  ? location.pathname === '/admin'
                  : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 text-xs font-medium tracking-wide transition-colors ${
                    isActive
                      ? 'bg-burgundy text-ivory font-semibold'
                      : 'text-parchment/80 hover:bg-charcoal-muted/30 hover:text-ivory'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} className={isActive ? 'text-ivory' : 'text-brass'} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="bg-brass text-charcoal font-bold text-[10px] px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-brass/20 space-y-2">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 text-xs text-parchment/80 hover:text-ivory hover:bg-charcoal-muted/30 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink size={14} className="text-brass" /> View Public Site
            </span>
            <ChevronRight size={12} />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-300 hover:text-red-200 hover:bg-red-950/40 transition-colors text-left"
          >
            <LogOut size={14} /> Exit Studio
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
