import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Contact from './index';

test('renders contact page with original info-map card content, no direct maps popup card, and no dark mode', () => {
  render(
    <MemoryRouter>
      <Contact />
    </MemoryRouter>
  );

  // Check restored original card info inside .info-map
  const infoMap = document.querySelector('.info-map');
  expect(infoMap).toBeInTheDocument();
  expect(infoMap).toHaveTextContent('Mahmud al Hasan');
  expect(infoMap).toHaveTextContent('Backend Software Engineer');
  expect(infoMap).toHaveTextContent('(Laravel, NestJS • Transitioning to .NET)');
  expect(infoMap).toHaveTextContent('Bayazid, Chattogram, Bangladesh');
  expect(infoMap).toHaveTextContent('+880 1727 328200');
  expect(infoMap).toHaveTextContent('mahmud.csem@gmail.com');

  // Verify unwanted street details from the screenshot card are NOT present
  expect(screen.queryByText(/পাবলিক মোড়/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/পাবলিক মোড়/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/বিএসআরএম/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Public Mor/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/BSRM Goli/i)).not.toBeInTheDocument();

  // Verify "Google Maps-এ সরাসরি দেখার কার্ড" is NOT present
  expect(screen.queryByText(/Google Maps-এ সরাসরি দেখুন/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Google Maps-এ দেখুন/i)).not.toBeInTheDocument();

  // Verify "ডার্ক মোড" is removed
  expect(screen.queryByRole('tab', { name: /ডার্ক মোড/i })).not.toBeInTheDocument();

  // Verify only Satellite and Road Map tabs are present
  expect(screen.getByRole('tab', { name: /স্যাটেলাইট/i })).toBeInTheDocument();
  expect(screen.getByRole('tab', { name: /রোড ম্যাপ/i })).toBeInTheDocument();

  // Check map recenter button
  expect(screen.getByLabelText(/Recenter map on Bayazid, Chattogram/i)).toBeInTheDocument();
});
