import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { questions } from '../src/data/questions';
import { topics } from '../src/data/topics';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding KYNDER database...');

  // Admin credentials come from the environment ONLY — no default password lives
  // in this file. Set ADMIN_EMAIL and ADMIN_PASSWORD before seeding.
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error(
      'ADMIN_EMAIL and ADMIN_PASSWORD must be set to seed the admin account. ' +
        'Refusing to seed a known default password.',
    );
  }

  const adminPasswordHash = await bcrypt.hash(adminPassword, 10);

  // 1. Create or update the founder/admin account. Keyed on email, so re-running
  //    updates in place rather than creating a duplicate.
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: 'Dr. Shereen Williams',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      title: 'Founder of KYNDER | ICF-Certified Coach',
      avatar: '/shereen-williams.jpg',
      bio: 'Professional Doctorate in Leadership & Cultural Transformation with Distinction. Author of The Currency of Kindness.',
      specialties: 'having-hard-conversations,executive-presence,leading-through-change,cross-cultural-leadership',
      isActive: true,
    },
    create: {
      email: adminEmail,
      name: 'Dr. Shereen Williams',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      title: 'Founder of KYNDER | ICF-Certified Coach',
      avatar: '/shereen-williams.jpg',
      bio: 'Professional Doctorate in Leadership & Cultural Transformation with Distinction. Author of The Currency of Kindness.',
      specialties: 'having-hard-conversations,executive-presence,leading-through-change,cross-cultural-leadership',
      isActive: true,
    },
  });

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
