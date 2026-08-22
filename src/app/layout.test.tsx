import { renderToStaticMarkup } from 'react-dom/server';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import RootLayout from './layout';
import HomePage from './page';

describe('app shell', () => {
  it('root layout renders the html document shell around its children', async () => {
    // RootLayout is an async server component; await it to get the element tree.
    // Rendered to a static string to avoid nesting <html> inside jsdom's body.
    const markup = renderToStaticMarkup(await RootLayout({ children: <p>child content</p> }));

    expect(markup).toContain('lang="en"');
    expect(markup).toContain('<body');
    expect(markup).toContain('child content');
  });

  it('root layout provides the single <main id="main"> landmark around its children', async () => {
    const markup = renderToStaticMarkup(await RootLayout({ children: <p>child content</p> }));
    expect(markup).toContain('<main id="main"');
    expect(markup).toContain('child content');
  });

  it('home page renders content but no <main> of its own (the layout owns <main>)', async () => {
    const { container } = render(await HomePage());
    expect(container).not.toBeEmptyDOMElement();
    expect(container.querySelector('main')).toBeNull();
  });
});
