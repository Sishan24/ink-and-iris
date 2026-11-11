import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import { formatDate } from '../lib/format.js';
import { Spinner } from '../components/ui.jsx';
import { AdminHead, Notice } from './shared.jsx';

export default function Readers() {
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const t = setTimeout(() => {
      api.get(`/admin/readers?page=${page}&q=${encodeURIComponent(q)}`).then(setData).catch((e) => setError(e.message));
    }, 200);
    return () => clearTimeout(t);
  }, [q, page]);

  async function toggle(r) {
    const status = r.status === 'active' ? 'suspended' : 'active';
    try {
      const { reader } = await api.patch(`/admin/readers/${r._id}`, { status });
      setData((d) => ({ ...d, readers: d.readers.map((x) => (x._id === r._id ? reader : x)) }));
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <>
      <AdminHead title="Readers">
        <span className="self-center text-sm text-forest/70">{data ? `${data.total} in total` : ''}</span>
      </AdminHead>
      <label htmlFor="rq" className="sr-only">Search readers</label>
      <input id="rq" className="field mb-4 max-w-sm" placeholder="Search by name or email" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
      <Notice kind="err">{error}</Notice>
      {!data ? <Spinner /> : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="border-b border-parchment text-forest/70">
              <tr><th className="p-4 font-medium">Name</th><th className="p-4 font-medium">Email</th><th className="p-4 font-medium">Joined</th><th className="p-4 font-medium">Verified</th><th className="p-4 font-medium">Status</th><th className="p-4"><span className="sr-only">Actions</span></th></tr>
            </thead>
            <tbody>
              {data.readers.map((r) => (
                <tr key={r._id} className="border-b border-parchment/60 last:border-0">
                  <td className="p-4">{r.name}</td>
                  <td className="p-4">{r.email}</td>
                  <td className="p-4">{formatDate(r.createdAt)}</td>
                  <td className="p-4">{r.isVerified ? 'Yes' : 'Pending'}</td>
                  <td className="p-4">{r.status === 'active' ? 'Active' : 'Suspended'}</td>
                  <td className="p-4 text-right"><button className="text-xs underline underline-offset-4" onClick={() => toggle(r)}>{r.status === 'active' ? 'Suspend' : 'Reactivate'}</button></td>
                </tr>
              ))}
              {data.readers.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-forest/70">No readers found.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
      {data && data.pages > 1 && (
        <div className="mt-4 flex items-center gap-3 text-sm">
          <button className="btn btn-ghost btn-sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
          <span>Page {data.page} of {data.pages}</span>
          <button className="btn btn-ghost btn-sm" disabled={page >= data.pages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      )}
    </>
  );
}
