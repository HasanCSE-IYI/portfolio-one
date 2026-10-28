import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Contact from './index';

test('renders contact page with enhanced map UI, 7 English Google modes, Fullscreen exit button, modern marker card, and info-map', () => {
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

  // Verify unwanted street details from the old card are NOT present
  expect(screen.queryByText(/পাবলিক মোড়/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/পাবলিক মোড়/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/বিএসআরএম/i)).not.toBeInTheDocument();

  // Verify "ডার্ক মোড" is removed
  expect(screen.queryByRole('tab', { name: /ডার্ক মোড/i })).not.toBeInTheDocument();

  // Verify all 7 Google Map modes are present with English names
  expect(screen.getByRole('tab', { name: /^Satellite$/i })).toBeInTheDocument();
  expect(screen.getByRole('tab', { name: /^Roadmap$/i })).toBeInTheDocument();
  expect(screen.getByRole('tab', { name: /^Terrain$/i })).toBeInTheDocument();
  expect(screen.getByRole('tab', { name: /^Traffic$/i })).toBeInTheDocument();
  expect(screen.getByRole('tab', { name: /^Transit$/i })).toBeInTheDocument();
  expect(screen.getByRole('tab', { name: /^Biking$/i })).toBeInTheDocument();
  expect(screen.getByRole('tab', { name: /^Sat Traffic$/i })).toBeInTheDocument();

  // Check map recenter button
  expect(screen.getByLabelText(/Recenter map on Bayazid, Chattogram/i)).toBeInTheDocument();

  // Check Fullscreen button
  const fullscreenBtn = screen.getByLabelText(/View Fullscreen Map/i);
  expect(fullscreenBtn).toBeInTheDocument();

  // Check bottom floating bar covers placeholders and displays Bayazid location & coordinates
  expect(screen.getByText(/বায়জিদ, চট্টগ্রাম/i)).toBeInTheDocument();
  expect(screen.getByText(/22.3911° N, 91.8177° E/i)).toBeInTheDocument();

  // Test entering Fullscreen reveals the dedicated prominent "Exit Full View" button
  fireEvent.click(fullscreenBtn);
  const exitFullViewBtn = screen.getByRole('button', { name: /Exit Full View/i });
  expect(exitFullViewBtn).toBeInTheDocument();
  expect(screen.getByText(/ESC/i)).toBeInTheDocument();

  // Test exiting Fullscreen
  fireEvent.click(exitFullViewBtn);
  expect(screen.queryByRole('button', { name: /Exit Full View/i })).not.toBeInTheDocument();
});
