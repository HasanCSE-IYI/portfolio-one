import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ScrollToTop from './index';

describe('ScrollToTop Component', () => {
  const originalTitle = document.title;
  const originalScrollTo = window.scrollTo;

  beforeEach(() => {
    window.scrollTo = jest.fn();
  });

  afterEach(() => {
    document.title = originalTitle;
    window.scrollTo = originalScrollTo;
  });

  test('sets title and scrolls to top on root route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <ScrollToTop />
      </MemoryRouter>
    );

    expect(document.title).toBe(
      'Mahmud al Hasan | Senior Backend Software Engineer'
    );
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
  });

  test('updates document title when navigating to /about', () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <ScrollToTop />
      </MemoryRouter>
    );

    expect(document.title).toBe(
      'About Me | Mahmud al Hasan (8+ Years Backend Engineering)'
    );
  });

  test('updates document title when navigating to a specific blog article', () => {
    render(
      <MemoryRouter initialEntries={['/blog/clean-architecture-dotnet']}>
        <ScrollToTop />
      </MemoryRouter>
    );

    expect(document.title).toBe(
      'Engineering Article | Mahmud al Hasan'
    );
  });

  test('sets 404 title for unknown route', () => {
    render(
      <MemoryRouter initialEntries={['/unknown-page-route']}>
        <ScrollToTop />
      </MemoryRouter>
    );

    expect(document.title).toBe(
      '404 - Page Not Found | Mahmud al Hasan'
    );
  });
});
