import { renderToStaticMarkup } from 'react-dom/server';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import RootLayout from './layout';
import HomePage from './page';

describe('app shell', () => {
  it('root layout renders the html document shell around its children', () => {
    // Rendered to a static string to avoid nesting <html> inside jsdom's body.
    const markup = renderToStaticMarkup(
      <RootLayout>
        <p>child content</p>
      </RootLayout>,
    );

    expect(markup).toContain('lang="en"');
    expect(markup).toContain('<body');
    expect(markup).toContain('child content');
  });

  it('root layout provides the single <main id="main"> landmark around its children', () => {
    const markup = renderToStaticMarkup(
      <RootLayout>
        <p>child content</p>
      </RootLayout>,
    );
    expect(markup).toContain('<main id="main"');
    expect(markup).toContain('child content');
  });

  it('home page renders no landmark of its own (the layout owns <main>)', () => {
    const { container } = render(<HomePage />);
    expect(container).toBeEmptyDOMElement();
  });
});
