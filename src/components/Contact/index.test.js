import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Contact from './index';

test('renders contact page with 3 Map Types, Traffic and Transit details, slim English coordinates pill, and harmonious Exit Full View button', () => {
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

  // Verify the 3 Base Google Map Types are present with English names
  expect(screen.getByRole('tab', { name: /^Satellite$/i })).toBeInTheDocument();
  expect(screen.getByRole('tab', { name: /^Roadmap$/i })).toBeInTheDocument();
  expect(screen.getByRole('tab', { name: /^Terrain$/i })).toBeInTheDocument();

  // Verify core Google Map Details (Traffic and Transit) are present with English names
  expect(screen.getByRole('tab', { name: /^Traffic$/i })).toBeInTheDocument();
  expect(screen.getByRole('tab', { name: /^Transit$/i })).toBeInTheDocument();

  // Verify removed details are NOT present
  expect(screen.queryByRole('tab', { name: /^Biking$/i })).not.toBeInTheDocument();
  expect(screen.queryByRole('tab', { name: /^Cycling$/i })).not.toBeInTheDocument();
  expect(screen.queryByRole('tab', { name: /^3D Buildings$/i })).not.toBeInTheDocument();
  expect(screen.queryByRole('tab', { name: /^Street View$/i })).not.toBeInTheDocument();
  expect(screen.queryByRole('tab', { name: /^Wildfires$/i })).not.toBeInTheDocument();
  expect(screen.queryByRole('tab', { name: /^Air quality$/i })).not.toBeInTheDocument();

  // Check modern Zoom In and Zoom Out controls
  expect(screen.getByRole('button', { name: /Zoom in/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Zoom out/i })).toBeInTheDocument();

  // Test toggling Traffic detail
  const trafficTab = screen.getByRole('tab', { name: /^Traffic$/i });
  fireEvent.click(trafficTab);
  expect(screen.getByText(/Google Live Traffic: Real-time traffic flow active/i)).toBeInTheDocument();

  // Test switching base map type to Roadmap while Traffic detail stays active
  const roadmapTab = screen.getByRole('tab', { name: /^Roadmap$/i });
  fireEvent.click(roadmapTab);
  expect(screen.getByText(/Google Live Traffic: Real-time traffic flow active/i)).toBeInTheDocument();

  // Check slim bottom floating pill (Bengali text removed, English coordinates and location present)
  expect(screen.queryByText(/বায়জিদ, চট্টগ্রাম/i)).not.toBeInTheDocument();
  expect(screen.getByText(/22.3911° N, 91.8177° E · Bayazid, Chattogram/i)).toBeInTheDocument();

  // Check integrated Google Maps link in the bottom pill
  expect(screen.getByRole('link', { name: /Open Bayazid in Google Maps/i })).toBeInTheDocument();

  // Check map recenter button
  expect(screen.getByLabelText(/Recenter map on Bayazid, Chattogram/i)).toBeInTheDocument();

  // Check Fullscreen button
  const fullscreenBtn = screen.getByLabelText(/View Fullscreen Map/i);
  expect(fullscreenBtn).toBeInTheDocument();

  // Test entering Fullscreen reveals the harmonious "Exit Full View" button
  fireEvent.click(fullscreenBtn);
  const exitFullViewBtn = screen.getByRole('button', { name: /Exit Full View/i });
  expect(exitFullViewBtn).toBeInTheDocument();
  expect(screen.getByText(/ESC/i)).toBeInTheDocument();

  // Test exiting Fullscreen
  fireEvent.click(exitFullViewBtn);
  expect(screen.queryByRole('button', { name: /Exit Full View/i })).not.toBeInTheDocument();
});
