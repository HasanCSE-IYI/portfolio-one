import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Contact from './index';

test('renders contact page with location info and map landmarks', () => {
  render(
    <MemoryRouter>
      <Contact />
    </MemoryRouter>
  );

  // Check landmark markers and headings
  const landmarkElements = screen.getAllByText(/পাবলিক মোড়, বিএসআরএম গলি/i);
  expect(landmarkElements.length).toBeGreaterThanOrEqual(1);

  expect(screen.getByText(/Public Mor, BSRM Goli · Bayazid Bostami Road/i)).toBeInTheDocument();
  expect(screen.getByText(/Bayazid, Chattogram - 4210, Bangladesh/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /স্যাটেলাইট/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /ম্যাপ/i })).toBeInTheDocument();
});
