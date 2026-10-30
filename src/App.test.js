import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders portfolio app navigation and header', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );

  // Check that the main navigation or home text renders
  const contactLinks = screen.getAllByRole('link', { name: /contact/i });
  expect(contactLinks.length).toBeGreaterThan(0);

  const focusLinks = screen.getAllByRole('link', { name: /focus/i });
  expect(focusLinks.length).toBeGreaterThan(0);
});

test('renders 404 NotFound page when route does not exist', async () => {
  render(
    <MemoryRouter initialEntries={['/unknown-nonexistent-route']}>
      <App />
    </MemoryRouter>
  );

  const notFoundTitle = await screen.findByText(/Page Not Found/i);
  expect(notFoundTitle).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Return to Home/i })).toBeInTheDocument();
});
