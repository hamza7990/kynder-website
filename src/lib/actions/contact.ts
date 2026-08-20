'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export interface ContactResult {
  success?: boolean;
  error?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Persist a contact message. Returns an error result instead of throwing so a
 * database failure surfaces as an honest error to the visitor — never a false
 * "sent" state.
 */
export async function submitContactMessage(data: {
  name: string;
  email: string;
  message: string;
}): Promise<ContactResult> {
  const name = data.name?.trim();
  const email = data.email?.trim();
  const message = data.message?.trim();

  if (!name || !email || !message) {
    return { error: 'Please complete every field.' };
  }
  if (!EMAIL_RE.test(email)) {
    return { error: 'Please enter a valid email address.' };
  }

  try {
    await db.contactMessage.create({ data: { name, email, message } });
    revalidatePath('/admin/messages');
    return { success: true };
  } catch {
    return { error: 'Could not send your message right now. Please try again.' };
  }
}

/** Admin-only list of contact messages, newest first. */
export async function getContactMessages() {
  await requireAuth('ADMIN');
  return db.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function markContactMessageHandledAction(id: string, handled: boolean) {
  await requireAuth('ADMIN');
  try {
    await db.contactMessage.update({ where: { id }, data: { handled } });
    revalidatePath('/admin/messages');
    return { success: true };
  } catch {
    return { error: 'Could not update the message.' };
  }
}
