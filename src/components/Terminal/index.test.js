import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Terminal from './index';
import { UiProvider } from '../../context/UiContext';

describe('Terminal Component', () => {
  it('does not render when isOpen is false', () => {
    render(
      <MemoryRouter>
        <UiProvider>
          <Terminal isOpen={false} onClose={() => {}} />
        </UiProvider>
      </MemoryRouter>
    );

    expect(screen.queryByText(/portfolio-os/i)).not.toBeInTheDocument();
  });

  it('renders terminal window and banner when isOpen is true', () => {
    render(
      <MemoryRouter>
        <UiProvider>
          <Terminal isOpen={true} onClose={() => {}} />
        </UiProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/hasan@portfolio-os: ~ \(zsh\)/i)).toBeInTheDocument();
    expect(screen.getByText(/MAHMUD AL HASAN/i)).toBeInTheDocument();
  });

  it('executes help command and displays available commands', () => {
    render(
      <MemoryRouter>
        <UiProvider>
          <Terminal isOpen={true} onClose={() => {}} />
        </UiProvider>
      </MemoryRouter>
    );

    const input = screen.getByLabelText('Terminal command prompt');
    fireEvent.change(input, { target: { value: 'help' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(screen.getByText(/Available commands:/i)).toBeInTheDocument();
  });

  it('executes skills command and lists core competencies', () => {
    render(
      <MemoryRouter>
        <UiProvider>
          <Terminal isOpen={true} onClose={() => {}} />
        </UiProvider>
      </MemoryRouter>
    );

    const input = screen.getByLabelText('Terminal command prompt');
    fireEvent.change(input, { target: { value: 'skills' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(screen.getByText(/Technical Competencies:/i)).toBeInTheDocument();
    expect(screen.getByText(/ASP\.NET Core/i)).toBeInTheDocument();
  });

  it('clears screen when clear command is executed', () => {
    render(
      <MemoryRouter>
        <UiProvider>
          <Terminal isOpen={true} onClose={() => {}} />
        </UiProvider>
      </MemoryRouter>
    );

    const input = screen.getByLabelText('Terminal command prompt');
    fireEvent.change(input, { target: { value: 'clear' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(screen.queryByText(/MAHMUD AL HASAN/i)).toBeNull();
  });

  it('calls onClose when close dot is clicked', () => {
    const handleClose = jest.fn();
    render(
      <MemoryRouter>
        <UiProvider>
          <Terminal isOpen={true} onClose={handleClose} />
        </UiProvider>
      </MemoryRouter>
    );

    const closeDot = screen.getAllByLabelText('Close terminal')[0];
    fireEvent.click(closeDot);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
