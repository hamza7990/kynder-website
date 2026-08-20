'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { hashPassword, requireAuth } from '@/lib/auth';

const GENERIC_ERROR = 'Something went wrong. Please try again.';

export async function getCoaches() {
  await requireAuth();
  try {
    return await db.user.findMany({
      where: { role: 'COACH' },
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { bookings: true } } },
    });
  } catch {
    return [];
  }
}

export async function getAllTeamMembers() {
  await requireAuth('ADMIN');
  try {
    return await db.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { bookings: true } } },
    });
  } catch {
    return [];
  }
}

export async function createCoachAction(formData: FormData) {
  await requireAuth('ADMIN');

  const name = formData.get('name')?.toString().trim();
  const email = formData.get('email')?.toString().trim().toLowerCase();
  const password = formData.get('password')?.toString();
  const title = formData.get('title')?.toString().trim();
  const bio = formData.get('bio')?.toString().trim();
  const specialties = formData.get('specialties')?.toString().trim();
  const avatar = formData.get('avatar')?.toString().trim() || null;

  if (!name || !email || !password) {
    return { error: 'Name, email, and password are required.' };
  }

  try {
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return { error: 'A user with this email already exists.' };
    }

    const passwordHash = await hashPassword(password);

    await db.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: 'COACH',
        title: title || 'Leadership Coach',
        bio: bio || null,
        specialties: specialties || null,
        avatar,
        isActive: true,
      },
    });
  } catch {
    return { error: GENERIC_ERROR };
  }

  revalidatePath('/admin/coaches');
  return { success: true };
}

export async function updateCoachAction(id: string, formData: FormData) {
  await requireAuth('ADMIN');

  const name = formData.get('name')?.toString().trim();
  const email = formData.get('email')?.toString().trim().toLowerCase();
  const title = formData.get('title')?.toString().trim();
  const bio = formData.get('bio')?.toString().trim();
  const specialties = formData.get('specialties')?.toString().trim();
  const avatar = formData.get('avatar')?.toString().trim() || null;
  const newPassword = formData.get('newPassword')?.toString();

  if (!name || !email) {
    return { error: 'Name and email are required.' };
  }

  const data: {
    name: string;
    email: string;
    title: string | null;
    bio: string | null;
    specialties: string | null;
    avatar: string | null;
    passwordHash?: string;
  } = {
    name,
    email,
    title: title || null,
    bio: bio || null,
    specialties: specialties || null,
    avatar,
  };

  try {
    if (newPassword && newPassword.length >= 6) {
      data.passwordHash = await hashPassword(newPassword);
    }

    await db.user.update({ where: { id }, data });
  } catch {
    return { error: GENERIC_ERROR };
  }

  revalidatePath('/admin/coaches');
  revalidatePath(`/admin/coaches/${id}`);
  return { success: true };
}

export async function toggleCoachStatusAction(id: string, currentStatus: boolean) {
  await requireAuth('ADMIN');

  try {
    await db.user.update({ where: { id }, data: { isActive: !currentStatus } });
  } catch {
    return { error: GENERIC_ERROR };
  }

  revalidatePath('/admin/coaches');
  return { success: true };
}

export async function deleteCoachAction(id: string) {
  await requireAuth('ADMIN');

  try {
    const coach = await db.user.findUnique({
      where: { id },
      include: { bookings: true },
    });

    if (!coach) return { error: 'Coach not found.' };

    if (coach.bookings.length > 0) {
      // Soft delete / deactivate rather than breaking relations.
      await db.user.update({ where: { id }, data: { isActive: false } });
      revalidatePath('/admin/coaches');
      return { success: true, message: 'Coach deactivated because they have existing bookings.' };
    }

    await db.user.delete({ where: { id } });
  } catch {
    return { error: GENERIC_ERROR };
  }

  revalidatePath('/admin/coaches');
  return { success: true };
}

export async function updateCoachSelfProfileAction(formData: FormData) {
  const session = await requireAuth();

  const name = formData.get('name')?.toString().trim();
  const title = formData.get('title')?.toString().trim();
  const bio = formData.get('bio')?.toString().trim();
  const specialties = formData.get('specialties')?.toString().trim();
  const avatar = formData.get('avatar')?.toString().trim() || null;

  if (!name) {
    return { error: 'Name is required.' };
  }

  try {
    await db.user.update({
      where: { id: session.id },
      data: {
        name,
        title: title || null,
        bio: bio || null,
        specialties: specialties || null,
        avatar,
      },
    });
  } catch {
    return { error: GENERIC_ERROR };
  }

  revalidatePath('/coach/profile');
  return { success: true, message: 'Profile updated successfully!' };
}
