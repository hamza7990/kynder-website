/**
 * Server-side content resolver.
 *
 * Public pages, the Header and the Footer read their copy through these
 * functions. Each one reads the database first and FALLS BACK to the static
 * copy in `src/data` when a record is missing OR the database is unreachable —
 * a failed query never throws here, it just returns the shipped defaults.
 *
 * `cache()` dedupes the single settings query across every call within one
 * request, so a page that reads site + home + about content hits the DB once.
 */
import { cache } from 'react';
import { db } from './db';
import { site as staticSite } from '@/data/site';
import {
  hero as staticHero,
  positioning as staticPositioning,
  proofPoints as staticProofPoints,
  questionsPreview as staticQuestionsPreview,
  topicsPreview as staticTopicsPreview,
  aboutTeaser as staticAboutTeaser,
  ctaBand as staticCtaBand,
} from '@/data/home';
import { about as staticAbout } from '@/data/about';
import {
  topics as staticTopics,
  clusters as staticClusters,
  type Topic,
  type Cluster,
} from '@/data/topics';
import { questions as staticQuestions, type Question } from '@/data/questions';
import type { Locale } from '@/i18n/config';

/** Load all site settings into a plain map. Returns {} if the DB is unreachable. */
const getSettings = cache(async (): Promise<Record<string, string>> => {
  try {
    const rows = await db.siteSetting.findMany();
    const map: Record<string, string> = {};
    for (const row of rows) map[row.key] = row.value;
    return map;
  } catch {
    return {};
  }
});

/** DB value if present and non-empty, otherwise the static fallback. */
function pick(map: Record<string, string>, key: string, fallback: string): string {
  const value = map[key];
  return value && value.trim().length > 0 ? value : fallback;
}

// ─── Site (Header / Footer) ─────────────────────────────────────────────────
export interface SiteContent {
  name: string;
  tagline: string;
  copyright: string;
  contactEmail: string;
  social: { linkedin: string; instagram: string; youtube: string };
}

export const getSiteContent = cache(async (): Promise<SiteContent> => {
  const s = await getSettings();
  return {
    name: pick(s, 'site_name', staticSite.name),
    tagline: pick(s, 'site_tagline', staticSite.tagline),
    copyright: pick(s, 'site_copyright', staticSite.copyright),
    contactEmail: pick(s, 'contact_email', staticSite.contactEmail),
    social: {
      linkedin: pick(s, 'social_linkedin', staticSite.social.linkedin),
      instagram: pick(s, 'social_instagram', staticSite.social.instagram),
      youtube: pick(s, 'social_youtube', staticSite.social.youtube),
    },
  };
});

// ─── Home page previews ─────────────────────────────────────────────────────
export const getHomeContent = cache(async () => {
  const s = await getSettings();
  return {
    hero: {
      ...staticHero,
      eyebrow: pick(s, 'hero_eyebrow', staticHero.eyebrow),
      headline: pick(s, 'hero_headline', staticHero.headline),
      lead: pick(s, 'hero_lead', staticHero.lead),
    },
    positioning: {
      statement: pick(s, 'positioning_statement', staticPositioning.statement),
    },
    proofPoints: [
      { value: pick(s, 'stat_1_val', staticProofPoints[0].value), label: staticProofPoints[0].label },
      { value: pick(s, 'stat_2_val', staticProofPoints[1].value), label: staticProofPoints[1].label },
      { value: pick(s, 'stat_3_val', staticProofPoints[2].value), label: staticProofPoints[2].label },
    ],
    questionsPreview: staticQuestionsPreview,
    topicsPreview: staticTopicsPreview,
    aboutTeaser: {
      ...staticAboutTeaser,
      heading: pick(s, 'about_heading', staticAboutTeaser.heading),
      portrait: pick(s, 'about_portrait', staticAboutTeaser.portrait),
    },
    ctaBand: staticCtaBand,
  };
});

// ─── About page ─────────────────────────────────────────────────────────────
export const getAboutContent = cache(async () => {
  const s = await getSettings();
  return {
    ...staticAbout,
    heading: pick(s, 'about_heading', staticAbout.heading),
    intro: pick(s, 'about_intro', staticAbout.intro),
    portrait: pick(s, 'about_portrait', staticAbout.portrait),
    bio: pick(s, 'about_bio', staticAbout.bio),
    story: pick(s, 'about_story', staticAbout.story),
    credentials: pick(s, 'about_credentials', staticAbout.credentials),
    proofPoints: [
      { value: pick(s, 'stat_1_val', staticProofPoints[0].value), label: staticProofPoints[0].label },
      { value: pick(s, 'stat_2_val', staticProofPoints[1].value), label: staticProofPoints[1].label },
      { value: pick(s, 'stat_3_val', staticProofPoints[2].value), label: staticProofPoints[2].label },
    ],
  };
});

// ─── Bilingual fallback (A2 Slice 6) ────────────────────────────────────────
// Under the `ar` locale, prefer the Arabic value when it is present and
// non-blank; otherwise fall back to English. Under `en`, always English. An
// empty/whitespace Arabic string is treated as absent so the render is never
// blank. In A2 no Arabic is authored yet, so `ar` resolves to English here — the
// plumbing is inert until A3 fills the `*Ar` columns.
function preferAr(locale: Locale, ar: string | null | undefined, en: string): string {
  if (locale === 'ar' && ar && ar.trim().length > 0) return ar;
  return en;
}

// ─── Questions ──────────────────────────────────────────────────────────────
function parseSteps(json: string): Question['steps'] {
  try {
    const parsed: unknown = JSON.parse(json);
    if (Array.isArray(parsed)) {
      return (parsed as unknown[]).map((s) => String(s)) as unknown as Question['steps'];
    }
  } catch {
    /* fall through to empty */
  }
  return [] as unknown as Question['steps'];
}

/** Arabic steps if present and non-empty after parsing, else the English steps. */
function pickSteps(locale: Locale, stepsAr: string | null | undefined, stepsEn: string): Question['steps'] {
  if (locale === 'ar' && stepsAr && stepsAr.trim().length > 0) {
    const ar = parseSteps(stepsAr);
    if (Array.isArray(ar) && ar.length > 0) return ar;
  }
  return parseSteps(stepsEn);
}

export const getQuestionsContent = cache(async (locale: Locale = 'en'): Promise<Question[]> => {
  try {
    const rows = await db.question.findMany({ orderBy: { order: 'asc' } });
    if (rows.length === 0) return staticFallbackQuestions(locale);
    return rows.map((r) => ({
      no: r.no,
      question: preferAr(locale, r.questionAr, r.question),
      pillar: r.pillar as Question['pillar'],
      steps: pickSteps(locale, r.stepsAr, r.steps),
    }));
  } catch {
    return staticFallbackQuestions(locale);
  }
});

// DB unreachable → the shipped English copy. Static data carries no Arabic in A2,
// so the `ar` locale still lands on English here (correct: never a blank render).
function staticFallbackQuestions(locale: Locale): Question[] {
  return staticQuestions.map((q) => ({
    no: q.no,
    pillar: q.pillar,
    question: preferAr(locale, q.questionAr, q.question),
    steps: locale === 'ar' && q.stepsAr ? q.stepsAr : q.steps,
  }));
}

// ─── Topics ─────────────────────────────────────────────────────────────────
export const getTopicsContent = cache(async (locale: Locale = 'en'): Promise<Topic[]> => {
  try {
    const rows = await db.topic.findMany({ orderBy: { order: 'asc' } });
    if (rows.length === 0) return staticFallbackTopics(locale);
    return rows.map((r) => ({
      slug: r.slug,
      title: preferAr(locale, r.titleAr, r.title),
      blurb: preferAr(locale, r.blurbAr, r.blurb),
      cluster: r.cluster as Cluster,
    }));
  } catch {
    return staticFallbackTopics(locale);
  }
});

function staticFallbackTopics(locale: Locale): Topic[] {
  return staticTopics.map((t) => ({
    slug: t.slug,
    title: preferAr(locale, t.titleAr, t.title),
    blurb: preferAr(locale, t.blurbAr, t.blurb),
    cluster: t.cluster,
  }));
}

/** Clusters are presentation-only groupings; not CMS-managed, so always static. */
export const clusters = staticClusters;
