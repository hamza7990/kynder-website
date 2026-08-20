'use server';

import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import {
  clearSessionCookie,
  getSession,
  hashPassword,
  setSessionCookie,
  verifyPassword,
} from '@/lib/auth';

export async function loginAction(formData: FormData) {
  const email = formData.get('email')?.toString().trim().toLowerCase();
  const password = formData.get('password')?.toString();

  if (!email || !password) {
    return { error: 'Please enter both email and password.' };
  }

  // Note: redirect() throws NEXT_REDIRECT by design, so it must run OUTSIDE the
  // try/catch below — otherwise a successful login would be swallowed as an error.
  let role: 'ADMIN' | 'COACH';
  try {
    const user = await db.user.findUnique({ where: { email } });

    if (!user || !user.isActive) {
      return { error: 'Invalid credentials or inactive account.' };
    }

    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      return { error: 'Invalid email or password.' };
    }

    await setSessionCookie({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as 'ADMIN' | 'COACH',
      title: user.title,
      avatar: user.avatar,
    });

    role = user.role as 'ADMIN' | 'COACH';
  } catch {
    return { error: 'Something went wrong signing in. Please try again.' };
  }

  redirect(role === 'ADMIN' ? '/admin' : '/coach');
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect('/login');
}

export async function changePasswordAction(formData: FormData) {
  const session = await getSession();
  if (!session) {
    return { error: 'Unauthorized' };
  }

  const currentPassword = formData.get('currentPassword')?.toString();
  const newPassword = formData.get('newPassword')?.toString();
  const confirmPassword = formData.get('confirmPassword')?.toString();

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: 'All password fields are required.' };
  }

  if (newPassword.length < 6) {
    return { error: 'New password must be at least 6 characters.' };
  }

  if (newPassword !== confirmPassword) {
    return { error: 'New passwords do not match.' };
  }

  try {
    const user = await db.user.findUnique({ where: { id: session.id } });
    if (!user) {
      return { error: 'User not found.' };
    }

    const isMatch = await verifyPassword(currentPassword, user.passwordHash);
    if (!isMatch) {
      return { error: 'Current password is incorrect.' };
    }

    const newHash = await hashPassword(newPassword);
    await db.user.update({
      where: { id: user.id },
      data: { passwordHash: newHash },
    });
  } catch {
    return { error: 'Could not update your password. Please try again.' };
  }

  return { success: true, message: 'Password updated successfully!' };
}
