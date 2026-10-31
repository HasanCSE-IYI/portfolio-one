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
  });
});
