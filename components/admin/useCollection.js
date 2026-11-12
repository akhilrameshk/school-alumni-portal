'use client';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Loads a list from /api/admin/<name> and gives save() and remove() helpers.
export default function useCollection(url) {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    setLoading(true);
    const res = await fetch(url);
    if (res.status === 401) { router.replace('/admin/login'); return; }
    if (!res.ok) { setError('Could not load the list'); setLoading(false); return; }
    setItems(await res.json());
    setError('');
    setLoading(false);
  }, [url, router]);

  useEffect(() => { reload(); }, [reload]);

  const save = async (id, body) => {
    const res = await fetch(id ? `${url}/${id}` : url, {
      method: id ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Could not save');
    await reload();
    return data;
  };
  const remove = async (id) => {
    const res = await fetch(`${url}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Could not delete');
    await reload();
  };
  return { items, loading, error, reload, save, remove };
}
