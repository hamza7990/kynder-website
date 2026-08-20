'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useToast } from '@/components/ui/toast';
import { toggleCoachStatusAction, deleteCoachAction } from '@/lib/actions/coaches';

interface Coach {
  id: string;
  name: string;
  email: string;
  role: string;
  title: string | null;
  avatar: string | null;
  specialties: string | null;
  isActive: boolean;
  _count: { bookings: number };
}

export function LiveCoachesList({ initialCoaches }: { initialCoaches: Coach[] }) {
  const { showToast } = useToast();
  const [coaches, setCoaches] = useState(initialCoaches);
  const [search, setSearch] = useState('');
  const [isPending, startTransition] = useTransition();

  const filtered = coaches.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.title && c.title.toLowerCase().includes(search.toLowerCase())) ||
      (c.specialties && c.specialties.toLowerCase().includes(search.toLowerCase()))
  );

  const handleToggleStatus = (id: string, currentStatus: boolean, name: string) => {
    startTransition(async () => {
      try {
        await toggleCoachStatusAction(id, currentStatus);
        setCoaches((prev) =>
          prev.map((c) => (c.id === id ? { ...c, isActive: !currentStatus } : c))
        );
        showToast({
          type: 'success',
          title: 'Status Changed',
          message: `${name} is now ${!currentStatus ? 'Active' : 'Inactive'}`,
        });
      } catch {
        showToast({
          type: 'error',
          title: 'Failed',
          message: 'Could not change coach status.',
        });
      }
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name}?`)) return;

    startTransition(async () => {
      try {
        const res = await deleteCoachAction(id);
        if (res.error) {
          showToast({ type: 'error', title: 'Action Failed', message: res.error });
        } else {
          setCoaches((prev) => prev.filter((c) => c.id !== id));
          showToast({
            type: 'info',
            title: 'Coach Removed',
            message: res.message || `${name} was deleted.`,
          });
        }
      } catch {
        showToast({ type: 'error', title: 'Error', message: 'Could not delete coach.' });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Live Search & Filter Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-ink-10 bg-cream-card p-4 shadow-1">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Search coach by name, email, specialty..."
            className="w-full rounded-lg border border-ink-20 bg-cream py-2 pl-3 pr-8 text-small text-navy-deep focus:outline-none focus:ring-1 focus:ring-terracotta transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-2.5 text-xs font-bold text-ink-60 hover:text-navy-deep"
            >
              ✕
            </button>
          )}
        </div>

        <div className="text-xs font-semibold uppercase tracking-eyebrow text-ink-60">
          Showing {filtered.length} of {coaches.length} Mentors
          {isPending && <span className="ml-2 text-terracotta-text animate-pulse">Syncing...</span>}
        </div>
      </div>

      {/* Coaches Table */}
      <div className="overflow-hidden rounded-2xl border border-ink-10 bg-cream-card shadow-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-body">
            <thead className="border-b border-ink-10 bg-cream/60 font-sans text-xs font-semibold uppercase tracking-eyebrow text-ink-70">
              <tr>
                <th className="px-6 py-4">Coach</th>
                <th className="px-6 py-4">Role & Title</th>
                <th className="px-6 py-4">Specialties</th>
                <th className="px-6 py-4">Sessions</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Interactive Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-10">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-ink-60">
                    No coaches match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-cream/40 transition-colors duration-fast"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {c.avatar ? (
                          <img
                            src={c.avatar}
                            alt={c.name}
                            className="h-10 w-10 rounded-full object-cover shadow-1 hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy font-bold text-cream">
                            {c.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-navy-deep">{c.name}</div>
                          <div className="text-xs text-ink-60">{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block rounded-md px-2.5 py-0.5 text-xs font-semibold ${
                          c.role === 'ADMIN'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {c.role}
                      </span>
                      <div className="mt-1 text-xs text-ink-70">
                        {c.title || 'Leadership Coach'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex max-w-xs flex-wrap gap-1">
                        {c.specialties ? (
                          c.specialties.split(',').map((s) => (
                            <span
                              key={s}
                              className="rounded-full bg-cream px-2 py-0.5 text-[11px] text-navy-deep border border-ink-10 font-medium"
                            >
                              {s.trim()}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-ink-60">General Topics</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-navy-deep">
                      <span className="rounded-full bg-navy/10 px-2.5 py-0.5 text-xs">
                        {c._count.bookings} sessions
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          c.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            c.isActive ? 'bg-green-600' : 'bg-gray-400'
                          }`}
                        />
                        {c.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        href={`/admin/coaches/${c.id}`}
                        className="inline-block rounded-md border border-ink-20 bg-cream px-3 py-1.5 text-xs font-semibold text-navy-deep hover:bg-cream-card btn-press transition-colors"
                      >
                        ✏️ Edit
                      </Link>

                      {c.role !== 'ADMIN' && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(c.id, c.isActive, c.name)}
                            className="rounded-md border border-ink-20 bg-cream px-3 py-1.5 text-xs font-semibold text-ink-70 hover:bg-cream-card btn-press transition-colors"
                          >
                            {c.isActive ? '⏸️ Deactivate' : '▶️ Activate'}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(c.id, c.name)}
                            className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 btn-press transition-colors"
                          >
                            🗑️ Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
