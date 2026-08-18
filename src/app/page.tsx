import { HeroSection } from '@/components/home/hero-section';
import { PositioningSection } from '@/components/home/positioning-section';

// Home is a narrative page of previews, not a catalogue. Every string it shows
// comes from src/data (home.ts, questions.ts, topics.ts) — no copy lives here.
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PositioningSection />
    </>
  );
}
