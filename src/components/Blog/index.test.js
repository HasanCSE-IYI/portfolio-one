import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Blog from './index';
import { UiProvider } from '../../context/UiContext';

describe('Blog Component', () => {
  it('renders articles directory list with title, search, and category pills', () => {
    render(
      <MemoryRouter initialEntries={['/blog']}>
        <UiProvider>
          <Routes>
            <Route path="/blog" element={<Blog />} />
          </Routes>
        </UiProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Architecture & Engineering/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search articles by topic/i)).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /All/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Architecture/i })).toBeInTheDocument();
    expect(screen.getByText(/Clean Architecture in ASP\.NET Core/i)).toBeInTheDocument();
  });

  it('filters articles when search query is entered', () => {
    render(
      <MemoryRouter initialEntries={['/blog']}>
        <UiProvider>
          <Routes>
            <Route path="/blog" element={<Blog />} />
          </Routes>
        </UiProvider>
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText(/Search articles by topic/i);
    fireEvent.change(searchInput, { target: { value: 'RabbitMQ' } });

    expect(screen.getByText(/Building Resilient Microservices with Laravel/i)).toBeInTheDocument();
    expect(screen.queryByText(/Database Indexing & Query Optimization/i)).toBeNull();
  });

  it('filters articles when category pill is selected', () => {
    render(
      <MemoryRouter initialEntries={['/blog']}>
        <UiProvider>
          <Routes>
            <Route path="/blog" element={<Blog />} />
          </Routes>
        </UiProvider>
      </MemoryRouter>
    );

    const dbCategoryPill = screen.getByRole('tab', { name: /^Database$/i });
    fireEvent.click(dbCategoryPill);

    expect(screen.getByText(/Database Indexing & Query Optimization/i)).toBeInTheDocument();
    expect(screen.queryByText(/Clean Architecture in ASP\.NET Core/i)).toBeNull();
  });

  it('renders single article view when slug matches', () => {
    render(
      <MemoryRouter initialEntries={['/blog/clean-architecture-aspnet-core']}>
        <UiProvider>
          <Routes>
            <Route path="/blog/:slug" element={<Blog />} />
          </Routes>
        </UiProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Back to Articles/i)).toBeInTheDocument();
    expect(screen.getByText(/Architecting High-Throughput Clean Architecture in ASP\.NET Core 8 & C#/i)).toBeInTheDocument();
    expect(screen.getByText('Mahmud al Hasan')).toBeInTheDocument();
    expect(screen.getByText(/The Challenge with Monolithic Layering/i)).toBeInTheDocument();
    expect(screen.getByText('Domain Layer')).toBeInTheDocument();

    // Verify Next Article pagination link exists
    const nextArticleLink = screen.getByRole('link', { name: /Next Article/i });
    expect(nextArticleLink).toBeInTheDocument();
  });

  it('renders both previous and next article links on middle articles', () => {
    render(
      <MemoryRouter initialEntries={['/blog/database-indexing-optimization-mysql']}>
        <UiProvider>
          <Routes>
            <Route path="/blog/:slug" element={<Blog />} />
          </Routes>
        </UiProvider>
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: /Previous Article/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Next Article/i })).toBeInTheDocument();
  });

  it('renders Article Not Found fallback when slug does not exist', () => {
    render(
      <MemoryRouter initialEntries={['/blog/non-existent-article-slug']}>
        <UiProvider>
          <Routes>
            <Route path="/blog/:slug" element={<Blog />} />
          </Routes>
        </UiProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Article Not Found/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Browse All Engineering Articles/i })).toBeInTheDocument();
  });

  it('navigates category tabs using arrow keys and home/end keys', () => {
    render(
      <MemoryRouter initialEntries={['/blog']}>
        <UiProvider>
          <Routes>
            <Route path="/blog" element={<Blog />} />
          </Routes>
        </UiProvider>
      </MemoryRouter>
    );

    const allTab = screen.getByRole('tab', { name: /^All$/i });
    expect(allTab).toHaveAttribute('aria-selected', 'true');
    expect(allTab).toHaveAttribute('tabIndex', '0');

    // ArrowRight to Architecture
    fireEvent.keyDown(allTab, { key: 'ArrowRight' });
    const archTab = screen.getByRole('tab', { name: /^Architecture$/i });
    expect(archTab).toHaveAttribute('aria-selected', 'true');
    expect(archTab).toHaveAttribute('tabIndex', '0');
    expect(allTab).toHaveAttribute('tabIndex', '-1');

    // End key to DevOps (last tab)
    fireEvent.keyDown(archTab, { key: 'End' });
    const devopsTab = screen.getByRole('tab', { name: /^DevOps$/i });
    expect(devopsTab).toHaveAttribute('aria-selected', 'true');

    // Home key back to All
    fireEvent.keyDown(devopsTab, { key: 'Home' });
    expect(screen.getByRole('tab', { name: /^All$/i })).toHaveAttribute('aria-selected', 'true');
  });

  it('supports deep linking via URL query parameters and displays results meta count', () => {
    render(
      <MemoryRouter initialEntries={['/blog?cat=Database']}>
        <UiProvider>
          <Routes>
            <Route path="/blog" element={<Blog />} />
          </Routes>
        </UiProvider>
      </MemoryRouter>
    );

    expect(screen.getByRole('tab', { name: /^Database$/i })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText(/Database Indexing & Query Optimization/i)).toBeInTheDocument();
    expect(screen.queryByText(/Clean Architecture in ASP\.NET Core/i)).toBeNull();

    // Verify results count badge
    expect(screen.getByText(/Showing 1 of \d+ engineering articles/i)).toBeInTheDocument();

    // Click clear all filters
    const clearBtn = screen.getByRole('button', { name: /clear all active filters/i });
    expect(clearBtn).toBeInTheDocument();
    fireEvent.click(clearBtn);

    expect(screen.getByRole('tab', { name: /^All$/i })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText(/Clean Architecture in ASP\.NET Core/i)).toBeInTheDocument();
  });
});
