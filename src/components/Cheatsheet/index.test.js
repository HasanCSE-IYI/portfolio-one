import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Cheatsheet from './index';

describe('Cheatsheet Component', () => {
  it('does not render when isOpen is false', () => {
    render(<Cheatsheet isOpen={false} onClose={() => {}} />);
    expect(screen.queryByText('Keyboard Shortcuts')).not.toBeInTheDocument();
  });

  it('renders all shortcut groups when isOpen is true', () => {
    render(<Cheatsheet isOpen={true} onClose={() => {}} />);

    expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument();
    expect(screen.getByText(/Global Navigation/i)).toBeInTheDocument();
    expect(screen.getByText(/Developer Tools/i)).toBeInTheDocument();
    expect(screen.getByText(/Audio & Accessibility/i)).toBeInTheDocument();
    expect(screen.getByText('Navigate to Home')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = jest.fn();
    render(<Cheatsheet isOpen={true} onClose={handleClose} />);

    const closeBtn = screen.getByLabelText('Close cheatsheet');
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
