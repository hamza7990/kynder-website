'use client';

import { useState, useTransition } from 'react';
import { useToast } from '@/components/ui/toast';
import { updateBookingStatusAction, assignCoachAction } from '@/lib/actions/bookings';
import { useT } from '@/i18n/client';
import { formatDateTime } from '@/lib/format';

interface BookingItem {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string | null;
  topicSlug: string;
  topicTitle: string | null;
  coachId: string | null;
  coach?: { id: string; name: string; email: string } | null;
  date: Date | string;
  duration: number;
  status: string;
  notes: string | null;
}

interface CoachItem {
  id: string;
  name: string;
  role: string;
}

interface LiveBookingsListProps {
  initialBookings: BookingItem[];
  coaches: CoachItem[];
  userRole?: 'ADMIN' | 'COACH';
}

export function LiveBookingsList({
  initialBookings,
  coaches,
  userRole = 'ADMIN',
}: LiveBookingsListProps) {
  const { showToast } = useToast();
  const t = useT();
  const [bookings, setBookings] = useState(initialBookings);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = bookings.filter((b) => {
    const matchesStatus = filterStatus === 'ALL' || b.status === filterStatus;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      b.clientName.toLowerCase().includes(q) ||
      b.clientEmail.toLowerCase().includes(q) ||
      (b.topicTitle && b.topicTitle.toLowerCase().includes(q)) ||
      (b.coach && b.coach.name.toLowerCase().includes(q));

    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = (bookingId: string, newStatus: string) => {
    startTransition(async () => {
      try {
        await updateBookingStatusAction(bookingId, newStatus);
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
        );
        showToast({
          type: 'success',
          title: t('toast.statusUpdated'),
          message: t('toast.bookingSetTo', { status: t(`statuses.${newStatus}`) }),
        });
      } catch {
        showToast({
          type: 'error',
          title: t('toast.updateFailed'),
          message: t('toast.couldNotUpdateStatus'),
        });
      }
    });
  };

  const handleCoachAssign = (bookingId: string, coachId: string) => {
    startTransition(async () => {
      try {
        await assignCoachAction(bookingId, coachId);
        const assignedCoach = coaches.find((c) => c.id === coachId) || null;
        setBookings((prev) =>
          prev.map((b) =>
            b.id === bookingId
              ? {
                  ...b,
                  coachId: coachId || null,
                  coach: assignedCoach ? { id: assignedCoach.id, name: assignedCoach.name, email: '' } : null,
                }
              : b
          )
        );
        showToast({
          type: 'success',
          title: t('toast.coachAssigned'),
          message: assignedCoach ? t('toast.assignedTo', { name: assignedCoach.name }) : t('toast.unassigned'),
        });
      } catch {
        showToast({
          type: 'error',
          title: t('toast.assignmentFailed'),
          message: t('toast.couldNotAssign'),
        });
      }
    });
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast({
      type: 'info',
      title: t('toast.copied'),
      message: text,
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const statuses = ['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

  return (
    <div className="space-y-6">
      {/* Interactive Filter & Search Bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-xl border border-ink-10 bg-cream-card p-4 shadow-1">
        {/* Status Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`rounded-lg px-3.5 py-1.5 text-small font-semibold btn-press transition-colors ${
                filterStatus === s
                  ? 'bg-navy-deep text-cream shadow-1'
                  : 'bg-cream text-ink-80 hover:bg-cream-card hover:text-navy-deep'
              }`}
            >
              {t(`statuses.${s}`)}
            </button>
          ))}
        </div>

        {/* Live Search Input */}
        <div className="relative min-w-[240px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`🔍 ${t('bookings.searchPlaceholder')}`}
            className="w-full rounded-lg border border-ink-20 bg-cream py-2 ps-3 pe-8 text-small text-navy-deep focus:outline-none focus:ring-1 focus:ring-terracotta transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute end-2.5 top-2.5 text-small font-bold text-ink-60 hover:text-navy-deep"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-small text-ink-60 font-semibold uppercase tracking-eyebrow">
        <span>{t('bookings.showing', { shown: filtered.length, total: bookings.length })}</span>
        {isPending && <span className="text-terracotta-text animate-pulse">{t('common.syncing')}</span>}
      </div>

      {/* Cards List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-ink-10 bg-cream-card p-12 text-center text-ink-60 animate-fade-in-up">
            <p className="text-lead font-semibold text-navy-deep">{t('bookings.noMatchTitle')}</p>
            <p className="mt-1 text-small">{t('bookings.noMatchHint')}</p>
          </div>
        ) : (
          filtered.map((b) => (
            <div
              key={b.id}
              className="group rounded-2xl border border-ink-10 bg-cream-card p-6 shadow-1 hover-lift transition-colors hover:border-ink-20 animate-in-up"
            >
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                {/* Left details */}
                <div className="space-y-2.5 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-display text-h4 font-bold text-navy-deep group-hover:text-terracotta transition-colors">
                      {b.clientName}
                    </h3>
                    <span
                      className={`rounded-full px-3 py-0.5 text-small font-semibold uppercase tracking-wider ${
                        b.status === 'CONFIRMED'
                          ? 'bg-success-soft text-success'
                          : b.status === 'COMPLETED'
                          ? 'bg-info-soft text-info'
                          : b.status === 'CANCELLED'
                          ? 'bg-danger-soft text-danger'
                          : 'bg-warning-soft text-warning pulse-live'
                      }`}
                    >
                      {t(`statuses.${b.status}`)}
                    </span>
                  </div>

                  <p className="text-body text-ink-80">
                    <strong>{t('bookings.topicInline')}</strong> {b.topicTitle || b.topicSlug}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-small text-ink-70">
                    {/* Copy Email Button */}
                    <button
                      onClick={() => copyToClipboard(b.clientEmail, `email-${b.id}`)}
                      className="inline-flex items-center gap-1.5 rounded-md border border-ink-10 bg-cream px-2.5 py-1 text-small font-medium hover:border-terracotta hover:text-terracotta btn-press transition-colors"
                      title={t('bookings.copyEmailTitle')}
                    >
                      <span>📧 {b.clientEmail}</span>
                      <span className="text-[10px] opacity-70">
                        {copiedId === `email-${b.id}` ? `✓ ${t('bookings.copied')}` : '📋'}
                      </span>
                    </button>

                    {b.clientPhone && (
                      <button
                        onClick={() => copyToClipboard(b.clientPhone!, `phone-${b.id}`)}
                        className="inline-flex items-center gap-1.5 rounded-md border border-ink-10 bg-cream px-2.5 py-1 text-small font-medium hover:border-terracotta hover:text-terracotta btn-press transition-colors"
                        title={t('bookings.copyPhoneTitle')}
                      >
                        <span>📞 {b.clientPhone}</span>
                        <span className="text-[10px] opacity-70">
                          {copiedId === `phone-${b.id}` ? `✓ ${t('bookings.copied')}` : '📋'}
                        </span>
                      </button>
                    )}

                    <span className="rounded-md bg-cream px-2.5 py-1 text-small font-medium border border-ink-10">
                      🗓️ {formatDateTime(b.date)}
                    </span>

                    <span className="rounded-md bg-cream px-2.5 py-1 text-small font-medium border border-ink-10">
                      ⏱️ {t('bookings.minutes', { count: b.duration })}
                    </span>
                  </div>

                  {b.notes && (
                    <div className="mt-3 rounded-lg bg-cream p-3.5 text-small text-ink-80 border border-ink-10">
                      <strong className="text-navy-deep">{t('bookings.clientFocusNote')}</strong> {b.notes}
                    </div>
                  )}
                </div>

                {/* Right controls */}
                <div className="flex flex-col gap-3 min-w-[220px] border-t border-ink-10 pt-4 md:border-t-0 md:pt-0">
                  {userRole === 'ADMIN' && (
                    <div>
                      <label className="mb-1 block text-small font-semibold uppercase tracking-eyebrow text-ink-70">
                        {t('bookings.assignedCoach')}
                      </label>
                      <select
                        value={b.coachId || ''}
                        onChange={(e) => handleCoachAssign(b.id, e.target.value)}
                        className="w-full rounded-lg border border-ink-20 bg-cream p-2 text-small text-navy-deep focus:outline-none focus:ring-1 focus:ring-terracotta transition-colors cursor-pointer"
                      >
                        <option value="">{t('bookings.unassigned')}</option>
                        {coaches.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} ({t(`roles.${c.role}`)})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Interactive Status Changer */}
                  <div>
                    <label className="mb-1 block text-small font-semibold uppercase tracking-eyebrow text-ink-70">
                      {t('bookings.actionStatus')}
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {['CONFIRMED', 'COMPLETED', 'CANCELLED', 'PENDING'].map((st) => (
                        <button
                          key={st}
                          onClick={() => handleStatusChange(b.id, st)}
                          disabled={b.status === st}
                          className={`rounded-md border py-1.5 text-small font-semibold btn-press transition-colors ${
                            b.status === st
                              ? 'bg-navy-deep text-cream opacity-50 cursor-default'
                              : 'border-ink-20 bg-cream text-navy-deep hover:bg-cream-card hover:border-navy-deep'
                          }`}
                        >
                          {st === 'CONFIRMED' && '✓ '}
                          {st === 'COMPLETED' && '⭐ '}
                          {st === 'CANCELLED' && '✕ '}
                          {t(`statuses.${st}`)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
