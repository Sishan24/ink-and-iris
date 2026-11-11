import { useEffect, useState, useCallback } from 'react';
import { api } from './api.js';

/** Loads GET `path`. Pass null to skip. Returns { data, loading, error, reload }. */
export function useFetch(path) {
  const [state, setState] = useState({ data: null, loading: Boolean(path), error: null });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!path) return undefined;
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));
    api
      .get(path)
      .then((data) => !cancelled && setState({ data, loading: false, error: null }))
      .catch((error) => !cancelled && setState({ data: null, loading: false, error }));
    return () => {
      cancelled = true;
    };
  }, [path, tick]);

  const reload = useCallback(() => setTick((t) => t + 1), []);
  return { ...state, reload };
}

export function useSeo(title, description) {
  useEffect(() => {
    document.title = title ? `${title} · Through the Golden Glades` : 'Through the Golden Glades · Jaya Roy Chowdhury';
    if (description) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement('meta');
        tag.name = 'description';
        document.head.appendChild(tag);
      }
      tag.content = description.slice(0, 160);
    }
  }, [title, description]);
}
