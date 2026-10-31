import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Guestbook from './index';
import { UiProvider } from '../../context/UiContext';

describe('Guestbook Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('does not render when isOpen is false', () => {
    render(
      <MemoryRouter>
        <UiProvider>
          <Guestbook isOpen={false} onClose={() => {}} />
        </UiProvider>
      </MemoryRouter>
    );

    expect(screen.queryByText(/Public Guestbook/i)).not.toBeInTheDocument();
  });

  it('renders guestbook title, form and initial entries when isOpen is true', () => {
    render(
      <MemoryRouter>
        <UiProvider>
          <Guestbook isOpen={true} onClose={() => {}} />
        </UiProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Public Guestbook & Social Wall')).toBeInTheDocument();
    expect(screen.getByText('Sign the Wall')).toBeInTheDocument();
    expect(screen.getByLabelText(/Your Name \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Message \*/i)).toBeInTheDocument();
    expect(screen.getByText('Samiul Karim')).toBeInTheDocument();
  });

  it('adds a new entry to the wall when form is submitted', () => {
    render(
      <MemoryRouter>
        <UiProvider>
          <Guestbook isOpen={true} onClose={() => {}} />
        </UiProvider>
      </MemoryRouter>
    );

    const nameInput = screen.getByLabelText(/Your Name \*/i);
    const messageInput = screen.getByLabelText(/Message \*/i);
    const submitBtn = screen.getByRole('button', { name: /Pin Message/i });

    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
    fireEvent.change(messageInput, { target: { value: 'Exciting work on this portfolio!' } });
    fireEvent.click(submitBtn);

    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText(/Exciting work on this portfolio!/i)).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = jest.fn();
    render(
      <MemoryRouter>
        <UiProvider>
          <Guestbook isOpen={true} onClose={handleClose} />
        </UiProvider>
      </MemoryRouter>
    );

    const closeBtn = screen.getByLabelText('Close guestbook');
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
