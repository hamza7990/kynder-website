'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useToast } from '@/components/ui/toast';
import { toggleCoachStatusAction, deleteCoachAction } from '@/lib/actions/coaches';
import { useT } from '@/i18n/client';

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
  const t = useT();
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
          title: t('toast.statusChanged'),
          message: t('toast.coachNowStatus', {
            name,
            status: !currentStatus ? t('statuses.active') : t('statuses.inactive'),
          }),
        });
      } catch {
        showToast({
          type: 'error',
          title: t('toast.failed'),
          message: t('toast.couldNotChangeStatus'),
        });
      }
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(t('coaches.confirmDelete', { name }))) return;

    startTransition(async () => {
      try {
        const res = await deleteCoachAction(id);
        if (res.error) {
          showToast({ type: 'error', title: t('toast.actionFailed'), message: res.error });
        } else {
          setCoaches((prev) => prev.filter((c) => c.id !== id));
          showToast({
            type: 'info',
            title: t('toast.coachRemoved'),
            message: res.message || t('toast.coachDeleted', { name }),
          });
        }
      } catch {
        showToast({ type: 'error', title: t('toast.error'), message: t('toast.couldNotDelete') });
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
            placeholder={`🔍 ${t('coaches.searchPlaceholder')}`}
            className="w-full rounded-lg border border-ink-20 bg-cream py-2 ps-3 pe-8 text-small text-navy-deep focus:outline-none focus:ring-1 focus:ring-terracotta transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute end-2.5 top-2.5 text-small font-bold text-ink-60 hover:text-navy-deep"
            >
              ✕
            </button>
          )}
        </div>

        <div className="text-small font-semibold uppercase tracking-eyebrow text-ink-60">
          {t('coaches.showing', { shown: filtered.length, total: coaches.length })}
          {isPending && <span className="ms-2 text-terracotta-text animate-pulse">{t('common.syncing')}</span>}
        </div>
      </div>

      {/* Coaches Table */}
      <div className="overflow-hidden rounded-2xl border border-ink-10 bg-cream-card shadow-1">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-body">
            <thead className="border-b border-ink-10 bg-cream/60 font-sans text-small font-semibold uppercase tracking-eyebrow text-ink-70">
              <tr>
                <th className="px-6 py-4 text-start">{t('coaches.thCoach')}</th>
                <th className="px-6 py-4 text-start">{t('coaches.thRoleTitle')}</th>
                <th className="px-6 py-4 text-start">{t('coaches.thSpecialties')}</th>
                <th className="px-6 py-4 text-start">{t('coaches.thSessions')}</th>
                <th className="px-6 py-4 text-start">{t('coaches.thStatus')}</th>
                <th className="px-6 py-4 text-end">{t('coaches.thActions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-10">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-ink-60">
                    {t('coaches.noMatch')}
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
                          <div className="text-small text-ink-60">{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block rounded-md px-2.5 py-0.5 text-small font-semibold ${
                          c.role === 'ADMIN'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-info-soft text-info'
                        }`}
                      >
                        {t(`roles.${c.role}`)}
                      </span>
                      <div className="mt-1 text-small text-ink-70">
                        {c.title || t('coaches.defaultTitle')}
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
                          <span className="text-small text-ink-60">{t('coaches.generalTopics')}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-navy-deep">
                      <span className="rounded-full bg-ink-10 px-2.5 py-0.5 text-small">
                        {t('dashboard.sessionsCount', { count: c._count.bookings })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-small font-semibold ${
                          c.isActive
                            ? 'bg-success-soft text-success'
                            : 'bg-ink-10 text-ink'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            c.isActive ? 'bg-success' : 'bg-ink-40'
                          }`}
                        />
                        {c.isActive ? t('statuses.active') : t('statuses.inactive')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-end space-x-2">
                      <Link
                        href={`/admin/coaches/${c.id}`}
                        className="inline-block rounded-md border border-ink-20 bg-cream px-3 py-1.5 text-small font-semibold text-navy-deep hover:bg-cream-card btn-press transition-colors"
                      >
                        ✏️ {t('common.edit')}
                      </Link>

                      {c.role !== 'ADMIN' && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(c.id, c.isActive, c.name)}
                            className="rounded-md border border-ink-20 bg-cream px-3 py-1.5 text-small font-semibold text-ink-70 hover:bg-cream-card btn-press transition-colors"
                          >
                            {c.isActive ? `⏸️ ${t('coaches.deactivate')}` : `▶️ ${t('coaches.activate')}`}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(c.id, c.name)}
                            className="rounded-md border border-danger-soft bg-danger-soft px-3 py-1.5 text-small font-semibold text-danger hover:border-danger btn-press transition-colors"
                          >
                            🗑️ {t('common.delete')}
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
