'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function getAllSiteSettings() {
  try {
    const settings = await db.siteSetting.findMany();
    const map: Record<string, string> = {};
    for (const s of settings) {
      map[s.key] = s.value;
    }
    return map;
  } catch {
    return {};
  }
}

export async function updateSiteSettingsAction(formData: FormData) {
  await requireAuth('ADMIN');

  const entries = Array.from(formData.entries());

  try {
    for (const [key, value] of entries) {
      if (key.startsWith('$ACTION_')) continue;
      // FormData values are string | File; only persist string fields.
      if (typeof value !== 'string') continue;
      const strVal = value;

      await db.siteSetting.upsert({
        where: { key },
        update: { value: strVal },
        create: { key, value: strVal },
      });
    }
  } catch {
    return { error: 'Could not save settings. Please try again.' };
  }

  revalidatePath('/admin/content');
  revalidatePath('/admin/about');
  revalidatePath('/admin/settings');
  revalidatePath('/');
  revalidatePath('/about');
  return { success: true, message: 'Settings saved successfully!' };
}
