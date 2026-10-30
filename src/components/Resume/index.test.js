import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Resume from './index';

test('renders resume page with authentic credentials and sections', () => {
  render(
    <MemoryRouter>
      <Resume />
    </MemoryRouter>
  );

  // Check header & name
  const nameHeading = screen.getByRole('heading', { level: 1 });
  expect(nameHeading).toBeInTheDocument();
  expect(nameHeading.textContent.replace(/\u00a0/g, ' ')).toContain('Mahmud al Hasan');
  expect(screen.getAllByText(/Software Engineer \(.*Backend\)/i).length).toBeGreaterThanOrEqual(1);

  // Check authentic work experience
  expect(screen.getByText(/EXONEXT & SourcingPi/i)).toBeInTheDocument();
  expect(screen.getAllByText(/Doctor Dekhao/i).length).toBeGreaterThanOrEqual(1);
  expect(screen.getByText(/DataShall Analytics/i)).toBeInTheDocument();
  expect(screen.getByText(/Bangladesh University of Business and Technology/i)).toBeInTheDocument();

  // Check consistent date periods
  expect(screen.getByText(/Feb 2025 – Present/i)).toBeInTheDocument();
  expect(screen.getByText(/Jun 2019 – Sep 2021/i)).toBeInTheDocument();

  // Check professional references
  expect(screen.getByText(/Habibur Rahman/i)).toBeInTheDocument();
  expect(screen.getByText(/IFTEKHAR UDDIN MD\. TANVIR/i)).toBeInTheDocument();
  expect(screen.getByText(/Island Securities Ltd\./i)).toBeInTheDocument();

  // Check control buttons
  expect(screen.getByRole('button', { name: /copy plain text resume/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /print or save pdf/i })).toBeInTheDocument();
});
