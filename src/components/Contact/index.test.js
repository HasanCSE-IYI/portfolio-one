import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Contact from './index';

test('renders contact page with restored address, multi-view map layers and pin details', () => {
  render(
    <MemoryRouter>
      <Contact />
    </MemoryRouter>
  );

  // Check header and profession
  expect(screen.getByText('Mahmud al Hasan')).toBeInTheDocument();
  expect(screen.getByText('Backend Software Engineer (.NET & Cloud APIs)')).toBeInTheDocument();

  // Check restored location details matching previous screenshot
  const landmarkHeadings = screen.getAllByText(/পাবলিক মোড়, বিএসআরএম গলি/i);
  expect(landmarkHeadings.length).toBeGreaterThanOrEqual(1);

  expect(screen.getByText(/Public Mor, BSRM Goli · Bayazid Bostami Road/i)).toBeInTheDocument();
  expect(screen.getByText(/Bayazid, Chattogram - 4210, Bangladesh/i)).toBeInTheDocument();

  // Check contact channels
  expect(screen.getByText('+880 1727 328200')).toBeInTheDocument();
  const emailElements = screen.getAllByText('mahmud.csem@gmail.com');
  expect(emailElements.length).toBeGreaterThanOrEqual(1);

  // Check multiple map view layer switcher buttons
  expect(screen.getByRole('tab', { name: /স্যাটেলাইট/i })).toBeInTheDocument();
  expect(screen.getByRole('tab', { name: /রোড ম্যাপ/i })).toBeInTheDocument();
  expect(screen.getByRole('tab', { name: /ডার্ক মোড/i })).toBeInTheDocument();

  // Check map recenter button
  expect(screen.getByLabelText(/Recenter map on Public Mor, Bayazid/i)).toBeInTheDocument();
});
