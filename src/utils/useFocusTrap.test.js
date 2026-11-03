import React, { useRef } from 'react';
import { render, screen, act } from '@testing-library/react';
import { useFocusTrap } from './useFocusTrap';

const TestModal = ({ isOpen, initialSelector }) => {
  const modalRef = useRef(null);
  useFocusTrap(isOpen, modalRef, { initialFocusSelector: initialSelector });

  if (!isOpen) return null;

  return (
    <div data-testid="modal" ref={modalRef} role="dialog">
      <button data-testid="btn-first">First</button>
      <input data-testid="input-mid" placeholder="Input" />
      <button data-testid="btn-last">Last</button>
    </div>
  );
};

describe('useFocusTrap', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('does not throw when closed', () => {
    expect(() => render(<TestModal isOpen={false} />)).not.toThrow();
  });

  test('focuses first element on open', () => {
    render(<TestModal isOpen={true} />);
    act(() => {
      jest.advanceTimersByTime(50);
    });
    expect(screen.getByTestId('btn-first')).toHaveFocus();
  });

  test('focuses specified initialFocusSelector when provided', () => {
    render(<TestModal isOpen={true} initialSelector="[data-testid='input-mid']" />);
    act(() => {
      jest.advanceTimersByTime(50);
    });
    expect(screen.getByTestId('input-mid')).toHaveFocus();
  });

  test('cycles focus within modal on Tab and Shift+Tab', () => {
    render(<TestModal isOpen={true} />);
    act(() => {
      jest.advanceTimersByTime(50);
    });

    const first = screen.getByTestId('btn-first');
    const last = screen.getByTestId('btn-last');

    // Focus last and press Tab -> wraps to first
    last.focus();
    expect(last).toHaveFocus();

    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
    window.dispatchEvent(tabEvent);
    expect(first).toHaveFocus();

    // From first, press Shift+Tab -> wraps to last
    const shiftTabEvent = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true });
    window.dispatchEvent(shiftTabEvent);
    expect(last).toHaveFocus();
  });
});
