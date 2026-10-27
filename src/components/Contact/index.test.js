import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Contact from './index';

test('renders contact page with location info stopping at Bayazid for security', () => {
  render(
    <MemoryRouter>
      <Contact />
    </MemoryRouter>
  );

  // Check location headings and badges (all stopping at Bayazid for privacy/security)
  const bayazidHeadings = screen.getAllByText(/বায়েজীদ, চট্টগ্রাম/i);
  expect(bayazidHeadings.length).toBeGreaterThanOrEqual(1);

  expect(screen.getByText(/Bayazid, Chattogram - 4210, Bangladesh/i)).toBeInTheDocument();
  expect(screen.getByText(/HD স্যাটেলাইট ভিউ/i)).toBeInTheDocument();

  // Strict Security/Privacy Assertion: Exact sensitive street names must NOT appear in any rendered text
  expect(screen.queryByText(/পাবলিক মোড়/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/বিএসআরএম/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Public Mor/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/BSRM Goli/i)).not.toBeInTheDocument();
});
