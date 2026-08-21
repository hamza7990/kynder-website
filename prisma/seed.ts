import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { questions } from '../src/data/questions';
import { topics } from '../src/data/topics';

const prisma = new PrismaClient();

// Non-secret profile copy for an admin account. Credentials (email/password)
// ALWAYS come from the environment; only these display fields live in-file.
type AdminProfile = {
  name: string;
  title?: string | null;
  avatar?: string | null;
  bio?: string | null;
  specialties?: string | null;
};

// Idempotent admin upsert. First run CREATES the account with the given
// password. Any later run refreshes the profile fields but DELIBERATELY leaves
// passwordHash and role untouched — re-seeding must never reset or duplicate an
// existing admin (a human may have changed their password in the app since).
async function ensureAdmin(
  rawEmail: string | undefined,
  password: string | undefined,
  profile: AdminProfile,
  { required, label }: { required: boolean; label: string },
): Promise<void> {
  const email = rawEmail?.trim().toLowerCase();

  if (!email || !password) {
    if (required) {
      throw new Error(
        'ADMIN_EMAIL and ADMIN_PASSWORD must be set to seed the primary admin ' +
          'account. Refusing to seed a known default password.',
      );
    }
    console.log(`  - ${label} (${'ADMIN2_EMAIL/ADMIN2_PASSWORD'}) not set — skipping.`);
    return;
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN', isActive: true, ...profile },
    });
    console.log(`  - ${label} ${email}: already existed — profile refreshed, password left unchanged.`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { email, passwordHash, role: 'ADMIN', isActive: true, ...profile },
  });
  console.log(`  - ${label} ${email}: created.`);
}

async function main() {
  console.log('Seeding KYNDER database...');

  // 1. Admin accounts. Credentials come from the environment ONLY — no default
  //    password lives in this file. The primary admin (ADMIN_EMAIL/ADMIN_PASSWORD)
  //    is required; a second admin (ADMIN2_EMAIL/ADMIN2_PASSWORD) is created only
  //    if that second pair is also set. Both are idempotent (see ensureAdmin).
  const founderProfile: AdminProfile = {
    name: 'Dr. Shereen Williams',
    title: 'Founder of KYNDER | ICF-Certified Coach',
    avatar: '/shereen-williams.jpg',
    bio: 'Professional Doctorate in Leadership & Cultural Transformation with Distinction. Author of The Currency of Kindness.',
    specialties: 'having-hard-conversations,executive-presence,leading-through-change,cross-cultural-leadership',
  };
  await ensureAdmin(process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD, founderProfile, {
    required: true,
    label: 'primary admin',
  });

  // Second admin: a plain ADMIN with no founder profile. The display name is
  // derived mechanically from the email local-part (not invented biography).
  const admin2Email = process.env.ADMIN2_EMAIL?.trim().toLowerCase();
  const admin2Name = admin2Email
    ? (admin2Email.split('@')[0] ?? 'admin').replace(/[._-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : 'Admin';
  await ensureAdmin(
    process.env.ADMIN2_EMAIL,
    process.env.ADMIN2_PASSWORD,
    { name: admin2Name, title: null, avatar: null, bio: null, specialties: null },
    { required: false, label: 'second admin' },
  );

  // NOTE: The two fabricated coaches ("Sarah Jenkins" and "Marcus Vance") were
  // removed — they were invented, not real KYNDER coaches. Do not re-add coach
  // records until the client supplies real coach identities.

  // 2. Seed Questions (upsert by `no` → idempotent).
  let qIndex = 0;
  for (const q of questions) {
    await prisma.question.upsert({
      where: { no: q.no },
      update: {
        question: q.question,
        pillar: q.pillar,
        steps: JSON.stringify(q.steps),
        order: qIndex,
      },
      create: {
        no: q.no,
        question: q.question,
        pillar: q.pillar,
        steps: JSON.stringify(q.steps),
        order: qIndex,
      },
    });
    qIndex++;
  }

  // 3. Seed Topics (upsert by `slug` → idempotent).
  let tIndex = 0;
  for (const t of topics) {
    await prisma.topic.upsert({
      where: { slug: t.slug },
      update: {
        title: t.title,
        blurb: t.blurb,
        cluster: t.cluster,
        order: tIndex,
      },
      create: {
        slug: t.slug,
        title: t.title,
        blurb: t.blurb,
        cluster: t.cluster,
        order: tIndex,
      },
    });
    tIndex++;
  }

  // 4. No sample bookings are seeded — the dashboards start empty and fill with
  //    real bookings made through /book.

  // 5. Initial site settings (upsert by key → idempotent). These mirror the
  //    static defaults in src/data so the CMS starts from the shipped copy; the
  //    public pages read these keys and fall back to the static data if missing.
  //    Values the client has not yet supplied (career story, contact email,
  //    social URLs) are deliberately NOT seeded — the app then shows its honest
  //    [PENDING] placeholder rather than a guessed value.
  const settings = [
    { key: 'site_name', value: 'KYNDER' },
    { key: 'site_tagline', value: 'Kind leadership is strong leadership.' },
    { key: 'hero_eyebrow', value: 'Human-led leadership coaching' },
    { key: 'hero_headline', value: 'Leadership starts with self-awareness.' },
    { key: 'hero_lead', value: 'Kynder is a leadership development brand built around a simple idea: kind leadership is strong leadership. It offers real, human-led coaching with Dr. Shereen Williams, grounded in original doctoral research into what makes leaders effective across cultures.' },
    { key: 'positioning_statement', value: "Sometimes people don't need more information — they need a safe space to think." },
    { key: 'about_heading', value: 'Meet Dr Shereen Williams' },
    { key: 'about_portrait', value: '/shereen-williams.jpg' },
    { key: 'about_intro', value: 'Founder of KYNDER | ICF-Certified Coach | Human Leadership & Transformation Expert | Author | Speaker' },
    { key: 'about_bio', value: "Dr Shereen Williams created KYNDER from a simple belief: sometimes people don't need more information — they need a safe space to think, talk things through and find their way forward. With more than 25 years of experience in leadership, organisational transformation, culture and change, Shereen has worked with people and organisations across Asia, Africa and the Middle East — from individuals taking their first steps into leadership to senior executives navigating complex transformation." },
    // about_story is intentionally NOT seeded — the client's real career story is
    // pending, so the page shows its [PENDING: career story] placeholder.
    { key: 'about_credentials', value: "As an ICF-certified coach, Shereen coaches people across all career stages — from students and emerging professionals to managers, senior leaders and C-suite executives. Her coaching provides a confidential space to think, reflect, challenge assumptions, build confidence, navigate difficult decisions and turn insight into action. Shereen holds a Professional Doctorate in Leadership & Cultural Transformation with Distinction and is the author of The Currency of Kindness. Her work explores the relationship between kindness, human behaviour, leadership and organisational performance. She is also Managing Director of the Global Kindness Institute across Asia, Africa and the Middle East and an international speaker." },
    { key: 'stat_1_val', value: 'DProf' },
    { key: 'stat_2_val', value: '25+' },
    { key: 'stat_3_val', value: '17+' },
    // contact_email and social_* are intentionally NOT seeded — no guessed values.
    { key: 'allow_public_booking', value: 'true' },
  ];

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: {}, // do NOT overwrite edits made in the admin on re-seed
      create: { key: s.key, value: s.value },
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
