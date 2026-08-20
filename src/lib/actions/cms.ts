'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// A failed database call never throws out of these actions — it returns an error
// result the UI can show, so a DB outage cannot white-screen the admin.
const GENERIC_ERROR = 'Something went wrong. Please try again.';

// ─── Questions Actions ────────────────────────────────────────────────────────
export async function getDbQuestions() {
  try {
    return await db.question.findMany({ orderBy: { order: 'asc' } });
  } catch {
    return [];
  }
}

export async function updateQuestionAction(id: string, formData: FormData) {
  await requireAuth('ADMIN');

  const question = formData.get('question')?.toString().trim();
  const pillar = formData.get('pillar')?.toString().trim();
  const step1 = formData.get('step1')?.toString().trim();
  const step2 = formData.get('step2')?.toString().trim();
  const step3 = formData.get('step3')?.toString().trim();
  const step4 = formData.get('step4')?.toString().trim();
  const step5 = formData.get('step5')?.toString().trim();

  if (!question || !pillar) {
    return { error: 'Question text and pillar are required.' };
  }

  const steps = [step1, step2, step3, step4, step5].filter(Boolean);

  try {
    await db.question.update({
      where: { id },
      data: { question, pillar, steps: JSON.stringify(steps) },
    });
  } catch {
    return { error: GENERIC_ERROR };
  }

  revalidatePath('/admin/questions');
  revalidatePath('/questions');
  revalidatePath('/');
  return { success: true };
}

export async function createQuestionAction(formData: FormData) {
  await requireAuth('ADMIN');

  const no = formData.get('no')?.toString().trim();
  const question = formData.get('question')?.toString().trim();
  const pillar = formData.get('pillar')?.toString().trim();
  const step1 = formData.get('step1')?.toString().trim();
  const step2 = formData.get('step2')?.toString().trim();
  const step3 = formData.get('step3')?.toString().trim();
  const step4 = formData.get('step4')?.toString().trim();
  const step5 = formData.get('step5')?.toString().trim();

  if (!no || !question || !pillar) {
    return { error: 'Number (e.g. 11), question text, and pillar are required.' };
  }

  const steps = [step1, step2, step3, step4, step5].filter(Boolean);

  try {
    const count = await db.question.count();
    await db.question.create({
      data: {
        no: no.padStart(2, '0'),
        question,
        pillar,
        steps: JSON.stringify(steps),
        order: count,
      },
    });
  } catch {
    return { error: GENERIC_ERROR };
  }

  revalidatePath('/admin/questions');
  revalidatePath('/questions');
  revalidatePath('/');
  return { success: true };
}

export async function deleteQuestionAction(id: string) {
  await requireAuth('ADMIN');

  try {
    await db.question.delete({ where: { id } });
  } catch {
    return { error: GENERIC_ERROR };
  }

  revalidatePath('/admin/questions');
  revalidatePath('/questions');
  revalidatePath('/');
  return { success: true };
}

// ─── Topics Actions ───────────────────────────────────────────────────────────
export async function getDbTopics() {
  try {
    return await db.topic.findMany({ orderBy: { order: 'asc' } });
  } catch {
    return [];
  }
}

export async function updateTopicAction(id: string, formData: FormData) {
  await requireAuth('ADMIN');

  const title = formData.get('title')?.toString().trim();
  const blurb = formData.get('blurb')?.toString().trim();
  const cluster = formData.get('cluster')?.toString().trim();

  if (!title || !blurb || !cluster) {
    return { error: 'Title, blurb, and cluster category are required.' };
  }

  try {
    await db.topic.update({ where: { id }, data: { title, blurb, cluster } });
  } catch {
    return { error: GENERIC_ERROR };
  }

  revalidatePath('/admin/topics');
  revalidatePath('/topics');
  revalidatePath('/');
  return { success: true };
}

export async function createTopicAction(formData: FormData) {
  await requireAuth('ADMIN');

  const title = formData.get('title')?.toString().trim();
  const slug = formData.get('slug')?.toString().trim();
  const blurb = formData.get('blurb')?.toString().trim();
  const cluster = formData.get('cluster')?.toString().trim();

  if (!title || !slug || !blurb || !cluster) {
    return { error: 'Title, slug, blurb, and cluster are required.' };
  }

  try {
    const count = await db.topic.count();
    await db.topic.create({
      data: {
        title,
        slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        blurb,
        cluster,
        order: count,
      },
    });
  } catch {
    return { error: GENERIC_ERROR };
  }

  revalidatePath('/admin/topics');
  revalidatePath('/topics');
  revalidatePath('/');
  return { success: true };
}

export async function deleteTopicAction(id: string) {
  await requireAuth('ADMIN');

  try {
    await db.topic.delete({ where: { id } });
  } catch {
    return { error: GENERIC_ERROR };
  }

  revalidatePath('/admin/topics');
  revalidatePath('/topics');
  revalidatePath('/');
  return { success: true };
}

// ─── Manual Booking by Admin ──────────────────────────────────────────────────
export async function createManualBookingAction(formData: FormData) {
  await requireAuth('ADMIN');

  const clientName = formData.get('clientName')?.toString().trim();
  const clientEmail = formData.get('clientEmail')?.toString().trim();
  const clientPhone = formData.get('clientPhone')?.toString().trim();
  const topicSlug = formData.get('topicSlug')?.toString().trim() || 'executive-presence';
  const topicTitle = formData.get('topicTitle')?.toString().trim() || topicSlug;
  const coachId = formData.get('coachId')?.toString().trim() || null;
  const dateStr = formData.get('date')?.toString();
  const notes = formData.get('notes')?.toString().trim();

  if (!clientName || !clientEmail || !dateStr) {
    return { error: 'Client name, email, and date are required.' };
  }

  try {
    await db.booking.create({
      data: {
        clientName,
        clientEmail,
        clientPhone: clientPhone || null,
        topicSlug,
        topicTitle,
        coachId: coachId || undefined,
        date: new Date(dateStr),
        duration: 60,
        status: 'CONFIRMED',
        notes: notes || null,
      },
    });
  } catch {
    return { error: GENERIC_ERROR };
  }

  revalidatePath('/admin/bookings');
  revalidatePath('/admin');
  return { success: true };
}
