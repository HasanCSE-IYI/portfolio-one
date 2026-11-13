import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import About from './index';

describe('About Component', () => {
  test('renders page heading and subtitle', () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/About me/i)).toBeInTheDocument();
    expect(
      screen.getByText(/8\+ Years in Production Backend Systems/i)
    ).toBeInTheDocument();
  });

  test('renders interactive 3D tech cube region and controls', () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );

    const cubeRegion = screen.getByRole('region', {
      name: /Interactive 3D Tech Cube/i,
    });
    expect(cubeRegion).toBeInTheDocument();

    // Verify key shortcut interaction (Arrow keys rotate, r resets)
    fireEvent.keyDown(cubeRegion, { key: 'ArrowRight' });
    const autoSpinBtn = screen.getByRole('button', { name: /Reset cube to auto spin/i });
    expect(autoSpinBtn).toBeInTheDocument();

    fireEvent.click(autoSpinBtn);
    expect(screen.queryByRole('button', { name: /Reset cube to auto spin/i })).not.toBeInTheDocument();
  });

  test('renders engineering influence books', () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Clean Architecture' })).toBeInTheDocument();
    expect(screen.getByText(/Designing Data-Intensive Applications/i)).toBeInTheDocument();
    expect(screen.getByText(/Domain-Driven Design/i)).toBeInTheDocument();
    expect(screen.getByText(/Pro ASP.NET Core Web API/i)).toBeInTheDocument();
  });

  test('toggles engineering philosophy principles', () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );

    const toggleBtn = screen.getByRole('button', {
      name: /View Engineering Principles & Philosophy/i,
    });
    expect(toggleBtn).toBeInTheDocument();

    fireEvent.click(toggleBtn);
    expect(screen.getByText(/Clean Architecture & Decoupled Domain/i)).toBeInTheDocument();
    expect(screen.getByText(/High Throughput & Database Indexing/i)).toBeInTheDocument();
    expect(screen.getByText(/Defensive Security & RBAC/i)).toBeInTheDocument();
  });

  test('renders tech tags as interactive links pointing to portfolio', () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );

    const csharpLink = screen.getByRole('link', { name: /C# \(\.NET 8\)/i });
    expect(csharpLink).toBeInTheDocument();
    expect(csharpLink).toHaveAttribute('href', '/portfolio?cat=dotnet');

    const dockerLink = screen.getByRole('link', { name: /Docker/i });
    expect(dockerLink).toBeInTheDocument();
    expect(dockerLink).toHaveAttribute('href', '/portfolio?q=Docker');
  });

  test('renders book tags as interactive links to blog categories and portfolio', () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );

    const archTagLink = screen.getByRole('link', { name: /Architecture/i });
    expect(archTagLink).toBeInTheDocument();
    expect(archTagLink).toHaveAttribute('href', '/blog?cat=Architecture');

    const dotnetTagLink = screen.getByRole('link', { name: /\.NET Ecosystem/i });
    expect(dotnetTagLink).toBeInTheDocument();
    expect(dotnetTagLink).toHaveAttribute('href', '/portfolio?cat=dotnet');
  });

  test('renders executive CV download link and direct contact link', () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );

    const cvLink = screen.getByRole('link', { name: /VIEW \/ DOWNLOAD EXECUTIVE CV/i });
    expect(cvLink).toBeInTheDocument();
    expect(cvLink).toHaveAttribute('href', '/resume');

    const contactLink = screen.getByRole('link', { name: /DISCUSS PROJECTS & ROLES/i });
    expect(contactLink).toBeInTheDocument();
    expect(contactLink).toHaveAttribute('href', '/contact');
  });
});
