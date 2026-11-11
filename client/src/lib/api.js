const BASE = import.meta.env.VITE_API_URL || '';

async function request(path, { method = 'GET', body, form } = {}) {
  const res = await fetch(`${BASE}/api${path}`, {
    method,
    credentials: 'include',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: form || (body ? JSON.stringify(body) : undefined),
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    /* empty body */
  }
  if (!res.ok) {
    const err = new Error(data?.message || 'Something went wrong. Please try again.');
    err.status = res.status;
    err.fields = data?.fields;
    throw err;
  }
  return data;
}

export const api = {
  get: (p) => request(p),
  post: (p, body) => request(p, { method: 'POST', body: body ?? {} }),
  put: (p, body) => request(p, { method: 'PUT', body }),
  patch: (p, body) => request(p, { method: 'PATCH', body }),
  del: (p) => request(p, { method: 'DELETE' }),
  async upload(file, folder) {
    const form = new FormData();
    form.append('folder', folder);
    form.append('image', file);
    return (await request('/admin/upload', { method: 'POST', form })).image;
  },
};
