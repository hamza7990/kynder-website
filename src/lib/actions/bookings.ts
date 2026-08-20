'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

const GENERIC_ERROR = 'Something went wrong. Please try again.';

export async function getAllBookings(filterStatus?: string) {
  await requireAuth('ADMIN');

  try {
    return await db.booking.findMany({
      where: filterStatus && filterStatus !== 'ALL' ? { status: filterStatus } : undefined,
      orderBy: { date: 'asc' },
      include: {
        coach: { select: { id: true, name: true, email: true, avatar: true } },
      },
    });
  } catch {
    return [];
  }
}

export async function getCoachBookings() {
  const session = await requireAuth();

  try {
    return await db.booking.findMany({
      where: { coachId: session.id },
      orderBy: { date: 'asc' },
      include: {
        coach: { select: { id: true, name: true, email: true } },
      },
    });
  } catch {
    return [];
  }
}

export async function createBookingAction(data: {
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  topicSlug: string;
  topicTitle?: string;
  date: Date | string;
  notes?: string;
  coachId?: string;
}) {
  try {
    let targetCoachId = data.coachId;

    // Auto-match coach if not specified.
    if (!targetCoachId) {
      const matchedCoach = await db.user.findFirst({
        where: { isActive: true, specialties: { contains: data.topicSlug } },
      });

      if (matchedCoach) {
        targetCoachId = matchedCoach.id;
      } else {
        // Fallback to admin/founder.
        const admin = await db.user.findFirst({ where: { role: 'ADMIN', isActive: true } });
        targetCoachId = admin?.id;
      }
    }

    const booking = await db.booking.create({
      data: {
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        clientPhone: data.clientPhone || null,
        topicSlug: data.topicSlug,
        topicTitle: data.topicTitle || data.topicSlug,
        coachId: targetCoachId,
        date: new Date(data.date),
        duration: 60,
        status: 'PENDING',
        notes: data.notes || null,
      },
    });

    revalidatePath('/admin/bookings');
    revalidatePath('/admin');
    revalidatePath('/coach');
    return { success: true, bookingId: booking.id };
  } catch {
    return { error: GENERIC_ERROR };
  }
}

export async function updateBookingStatusAction(bookingId: string, status: string) {
  const session = await requireAuth();

  try {
    // If coach, verify booking belongs to them.
    if (session.role === 'COACH') {
      const booking = await db.booking.findUnique({ where: { id: bookingId } });
      if (!booking || booking.coachId !== session.id) {
        return { error: 'Unauthorized to update this booking.' };
      }
    }

    await db.booking.update({ where: { id: bookingId }, data: { status } });
  } catch {
    return { error: GENERIC_ERROR };
  }

  revalidatePath('/admin/bookings');
  revalidatePath('/coach');
  return { success: true };
}

export async function assignCoachAction(bookingId: string, coachId: string) {
  await requireAuth('ADMIN');

  try {
    await db.booking.update({ where: { id: bookingId }, data: { coachId } });
  } catch {
    return { error: GENERIC_ERROR };
  }

  revalidatePath('/admin/bookings');
  revalidatePath('/coach');
  return { success: true };
}

export async function updateBookingNotesAction(bookingId: string, notes: string) {
  const session = await requireAuth();

  try {
    const booking = await db.booking.findUnique({ where: { id: bookingId } });
    if (!booking) return { error: 'Booking not found.' };

    if (session.role === 'COACH' && booking.coachId !== session.id) {
      return { error: 'Unauthorized.' };
    }

    await db.booking.update({ where: { id: bookingId }, data: { notes } });
  } catch {
    return { error: GENERIC_ERROR };
  }

  revalidatePath('/admin/bookings');
  revalidatePath('/coach');
  return { success: true };
}
