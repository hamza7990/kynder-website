import { ImageResponse } from 'next/og';
import { ogImageAlt } from '@/data/seo';

// Applied to every route by the file convention; generated once at build.
export const dynamic = 'force-static';
export const alt = ogImageAlt;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Brand palette (from src/styles/tokens.css).
const NAVY_DEEP = '#1b2038';
const CREAM = '#faf6f0';
const TERRACOTTA = '#c87d5d';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: NAVY_DEEP,
          padding: '80px',
        }}
      >
        <div style={{ display: 'flex', height: '8px', width: '120px', background: TERRACOTTA }} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 128,
              fontWeight: 700,
              letterSpacing: '0.06em',
              color: CREAM,
              lineHeight: 1,
            }}
          >
            KYNDER
          </div>
          <div style={{ marginTop: 28, fontSize: 44, color: CREAM, opacity: 0.9 }}>
            Kind leadership is strong leadership.
          </div>
        </div>
        <div style={{ fontSize: 28, letterSpacing: '0.14em', color: TERRACOTTA }}>
          LEADERSHIP COACHING · DR. SHEREEN WILLIAMS
        </div>
      </div>
    ),
    size,
  );
}
