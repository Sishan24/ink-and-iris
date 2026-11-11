import { Link } from 'react-router-dom';
import { useFetch } from '../lib/hooks.js';
import { formatDate } from '../lib/format.js';
import { Spinner, ErrorNote } from '../components/ui.jsx';
import { AdminHead } from './shared.jsx';

const Stat = ({ value, label, to }) => (
  <Link to={to} className="card block p-5 transition-transform hover:-translate-y-0.5">
    <p className="font-serif text-5xl">{value}</p>
    <p className="mt-1 text-sm text-forest/75">{label}</p>
  </Link>
);

export default function Overview() {
  const { data, loading, error } = useFetch('/admin/stats');
  if (loading) return <Spinner />;
  if (error) return <ErrorNote error={error} />;
  const max = Math.max(1, ...data.series.map((s) => s.count));

  return (
    <>
      <AdminHead title="Overview" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat value={data.totalReaders} label="Registered readers" to="/admin/readers" />
        <Stat value={data.newThisMonth} label="New readers this month" to="/admin/readers" />
        <Stat value={`${data.publishedBooks}/${data.totalBooks}`} label="Books published" to="/admin/books" />
        <Stat value={data.unreadMessages} label="Unread messages" to="/admin/messages" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="card p-6" aria-labelledby="growth">
          <h2 id="growth" className="text-2xl">Readership growth</h2>
          <p className="text-sm text-forest/70">New verified readers per month</p>
          <div className="mt-6 flex h-40 items-end gap-3" role="img" aria-label={`New readers by month: ${data.series.map((s) => `${s.label} ${s.count}`).join(', ')}`}>
            {data.series.map((s) => (
              <div key={s.label + s.year} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                <span className="text-xs">{s.count}</span>
                <div className="w-full rounded-t-md bg-sage" style={{ height: `${Math.max(4, (s.count / max) * 100)}%` }} />
                <span className="text-xs text-forest/70">{s.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="card p-6" aria-labelledby="recent">
          <h2 id="recent" className="text-2xl">Recent messages</h2>
          {data.recentMessages.length === 0 ? (
            <p className="mt-4 text-sm text-forest/70">No messages yet.</p>
          ) : (
            <ul className="mt-4 divide-y divide-parchment">
              {data.recentMessages.map((m) => (
                <li key={m._id} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <span><span className={m.status === 'unread' ? 'font-bold' : ''}>{m.name}</span><span className="block text-forest/70">{m.subject}</span></span>
                  <span className="shrink-0 text-xs text-forest/60">{formatDate(m.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
          <Link to="/admin/messages" className="mt-4 inline-block text-sm underline underline-offset-4">Open inbox</Link>
        </section>
      </div>
    </>
  );
}
