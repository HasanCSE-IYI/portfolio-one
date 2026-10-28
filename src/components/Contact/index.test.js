import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Contact from './index';

test('renders contact page with 3 Map Types, 7 Google Map Details, Layers drawer, modern zoom buttons, Exit Full View button, and subtle coordinate pill', () => {
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

  // Verify all 7 Google Map Details & Overlays are present in the quick strip with English names
  expect(screen.getByRole('tab', { name: /^Traffic$/i })).toBeInTheDocument();
  expect(screen.getByRole('tab', { name: /^Transit$/i })).toBeInTheDocument();
  expect(screen.getByRole('tab', { name: /^Biking$/i })).toBeInTheDocument();
  expect(screen.getByRole('tab', { name: /^3D Buildings$/i })).toBeInTheDocument();
  expect(screen.getByRole('tab', { name: /^Street View$/i })).toBeInTheDocument();
  expect(screen.getByRole('tab', { name: /^Wildfires$/i })).toBeInTheDocument();
  expect(screen.getByRole('tab', { name: /^Air quality$/i })).toBeInTheDocument();

  // Check modern Zoom In and Zoom Out controls
  expect(screen.getByRole('button', { name: /Zoom in/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Zoom out/i })).toBeInTheDocument();

  // Check Google Maps Layers drawer toggle button
  const layersBtn = screen.getByRole('button', { name: /Map Details and Layers/i });
  expect(layersBtn).toBeInTheDocument();

  // Test opening the Google Maps authentic drawer
  fireEvent.click(layersBtn);
  expect(screen.getByRole('dialog', { name: /Map type and details/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Close Map Details Drawer/i })).toBeInTheDocument();

  // Test toggling a detail from the drawer
  const drawerTrafficBtn = screen.getByRole('button', { name: /Toggle Traffic/i });
  expect(drawerTrafficBtn).toBeInTheDocument();
  fireEvent.click(drawerTrafficBtn);
  expect(screen.getByText(/Google Live Traffic: Real-time traffic flow active/i)).toBeInTheDocument();

  // Test switching base map type to Roadmap while Traffic detail stays active
  const roadmapTab = screen.getByRole('tab', { name: /^Roadmap$/i });
  fireEvent.click(roadmapTab);
  expect(screen.getByText(/Google Live Traffic: Real-time traffic flow active/i)).toBeInTheDocument();

  // Close the drawer
  const closeDrawerBtn = screen.getByRole('button', { name: /Close Map Details Drawer/i });
  fireEvent.click(closeDrawerBtn);
  expect(screen.queryByRole('dialog', { name: /Map type and details/i })).not.toBeInTheDocument();

  // Check subtle bottom-left coordinate pill covering placeholders
  expect(screen.getByText(/বায়জিদ, চট্টগ্রাম/i)).toBeInTheDocument();
  expect(screen.getByText(/22.3911° N, 91.8177° E/i)).toBeInTheDocument();
  expect(screen.getByText(/2x Retina HD/i)).toBeInTheDocument();

  // Check bottom-right Google Maps link
  expect(screen.getByRole('link', { name: /Open Bayazid in Google Maps/i })).toBeInTheDocument();

  // Check map recenter button
  expect(screen.getByLabelText(/Recenter map on Bayazid, Chattogram/i)).toBeInTheDocument();

  // Check Fullscreen button
  const fullscreenBtn = screen.getByLabelText(/View Fullscreen Map/i);
  expect(fullscreenBtn).toBeInTheDocument();

  // Test entering Fullscreen reveals the dedicated prominent "Exit Full View" button
  fireEvent.click(fullscreenBtn);
  const exitFullViewBtn = screen.getByRole('button', { name: /Exit Full View/i });
  expect(exitFullViewBtn).toBeInTheDocument();
  expect(screen.getByText(/ESC/i)).toBeInTheDocument();

  // Test exiting Fullscreen
  fireEvent.click(exitFullViewBtn);
  expect(screen.queryByRole('button', { name: /Exit Full View/i })).not.toBeInTheDocument();
});
