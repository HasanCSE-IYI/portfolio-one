import { useEffect, useRef } from 'react';

/**
 * Custom React hook for WCAG 2.1 AA focus trapping and focus restoration on modals.
 *
 * @param {boolean} isOpen - Whether the modal dialog is open.
 * @param {React.RefObject<HTMLElement>} modalRef - Ref attached to the modal dialog DOM container.
 * @param {Object} [options]
 * @param {string} [options.initialFocusSelector] - Optional selector within modal to focus on open.
 */
export const useFocusTrap = (isOpen, modalRef, options = {}) => {
  const previousActiveElement = useRef(null);
  const initialFocusSelector = options.initialFocusSelector;

  useEffect(() => {
    if (!isOpen) {
      if (
        previousActiveElement.current &&
        typeof previousActiveElement.current.focus === 'function'
      ) {
        previousActiveElement.current.focus();
        previousActiveElement.current = null;
      }
      return;
    }

    // Cache element focused before modal opened
    if (typeof document !== 'undefined') {
      previousActiveElement.current = document.activeElement;
    }

    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    // Set initial focus
    const focusTimer = setTimeout(() => {
      if (!modalRef.current) return;
      if (initialFocusSelector) {
        const target = modalRef.current.querySelector(initialFocusSelector);
        if (target && typeof target.focus === 'function') {
          target.focus();
          return;
        }
      }
      const focusable = modalRef.current.querySelectorAll(focusableSelectors);
      if (focusable.length > 0 && typeof focusable[0].focus === 'function') {
        focusable[0].focus();
      }
    }, 25);

    const handleKeyDown = (e) => {
      if (e.key !== 'Tab' || !modalRef.current) return;

      const focusable = Array.from(
        modalRef.current.querySelectorAll(focusableSelectors)
      ).filter((el) => {
        if (typeof window !== 'undefined' && window.getComputedStyle) {
          const style = window.getComputedStyle(el);
          return style.display !== 'none' && style.visibility !== 'hidden';
        }
        return true;
      });

      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }

      const firstElement = focusable[0];
      const lastElement = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (
          document.activeElement === firstElement ||
          !modalRef.current.contains(document.activeElement)
        ) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (
          document.activeElement === lastElement ||
          !modalRef.current.contains(document.activeElement)
        ) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, modalRef, initialFocusSelector]);
};

export default useFocusTrap;
