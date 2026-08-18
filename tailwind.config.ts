import type { Config } from 'tailwindcss';

/**
 * Tailwind theme mapped entirely to the design tokens in
 * `src/styles/tokens.css`. Components must consume these semantic utilities
 * (e.g. `bg-cream`, `text-ink`, `shadow-2`) — never hardcoded values.
 *
 * Breakpoints are content-driven size steps, not device names.
 */
const config: Config = {
  content: ['./src/app/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    // Content-driven breakpoints: 480 / 768 / 1024 / 1280 / 1440.
    screens: {
      xs: '480px',
      sm: '768px',
      md: '1024px',
      lg: '1280px',
      xl: '1440px',
    },
    container: {
      center: true,
      screens: { xl: '1120px' },
    },
    extend: {
      colors: {
        'navy-deep': 'var(--navy-deep)',
        navy: {
          DEFAULT: 'var(--navy)',
          hover: 'var(--navy-hover)',
          active: 'var(--navy-active)',
        },
        terracotta: {
          DEFAULT: 'var(--terracotta)',
          hover: 'var(--terracotta-hover)',
          active: 'var(--terracotta-active)',
          soft: 'var(--terracotta-16)',
          ink: 'var(--terracotta-ink)',
        },
        gold: {
          DEFAULT: 'var(--gold)',
          soft: 'var(--gold-16)',
        },
        cream: {
          DEFAULT: 'var(--cream)',
          card: 'var(--cream-card)',
        },
        ink: {
          DEFAULT: 'var(--ink)',
          90: 'var(--ink-90)',
          80: 'var(--ink-80)',
          70: 'var(--ink-70)',
          60: 'var(--ink-60)',
          40: 'var(--ink-40)',
          20: 'var(--ink-20)',
          10: 'var(--ink-10)',
        },
      },
      fontFamily: {
        display: 'var(--font-display)',
        sans: 'var(--font-sans)',
      },
      fontSize: {
        'display-1': ['var(--fs-display-1)', { lineHeight: 'var(--lh-tight)', letterSpacing: 'var(--tracking-display)' }],
        'display-2': ['var(--fs-display-2)', { lineHeight: 'var(--lh-snug)', letterSpacing: 'var(--tracking-display)' }],
        h2: ['var(--fs-h2)', { lineHeight: 'var(--lh-heading)', letterSpacing: 'var(--tracking-tight)' }],
        h3: ['var(--fs-h3)', { lineHeight: 'var(--lh-heading)', letterSpacing: 'var(--tracking-tight)' }],
        h4: ['var(--fs-h4)', { lineHeight: 'var(--lh-snug)', letterSpacing: 'var(--tracking-normal)' }],
        lead: ['var(--fs-lead)', { lineHeight: 'var(--lh-body)' }],
        body: ['var(--fs-body)', { lineHeight: 'var(--lh-body)' }],
        small: ['var(--fs-small)', { lineHeight: 'var(--lh-body)' }],
      },
      fontWeight: {
        regular: 'var(--weight-regular)',
        medium: 'var(--weight-medium)',
        semibold: 'var(--weight-semibold)',
        bold: 'var(--weight-bold)',
      },
      letterSpacing: {
        display: 'var(--tracking-display)',
        tight: 'var(--tracking-tight)',
        eyebrow: 'var(--tracking-eyebrow)',
      },
      lineHeight: {
        tight: 'var(--lh-tight)',
        snug: 'var(--lh-snug)',
        heading: 'var(--lh-heading)',
        body: 'var(--lh-body)',
      },
      spacing: {
        1: 'var(--space-1)',
        2: 'var(--space-2)',
        3: 'var(--space-3)',
        4: 'var(--space-4)',
        5: 'var(--space-5)',
        6: 'var(--space-6)',
        8: 'var(--space-8)',
        10: 'var(--space-10)',
        12: 'var(--space-12)',
        16: 'var(--space-16)',
        20: 'var(--space-20)',
        gutter: 'var(--gutter)',
        'gutter-lg': 'var(--gutter-lg)',
        'section-sm': 'var(--section-sm)',
        'section-md': 'var(--section-md)',
        'section-lg': 'var(--section-lg)',
      },
      maxWidth: {
        container: 'var(--container-max)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        full: 'var(--radius-full)',
      },
      boxShadow: {
        1: 'var(--shadow-1)',
        2: 'var(--shadow-2)',
        3: 'var(--shadow-3)',
        none: 'none',
      },
      transitionDuration: {
        fast: 'var(--dur-fast)',
        base: 'var(--dur-base)',
        slow: 'var(--dur-slow)',
        ambient: 'var(--dur-ambient)',
      },
      transitionTimingFunction: {
        out: 'var(--ease-out)',
        'in-out': 'var(--ease-in-out)',
      },
    },
  },
  plugins: [],
};

export default config;
