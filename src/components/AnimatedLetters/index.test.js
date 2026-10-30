import React from 'react';
import { render, screen } from '@testing-library/react';
import AnimatedLetters from './index';

describe('AnimatedLetters Component', () => {
  test('renders animated word wrap with proper aria-label and notranslate attribute', () => {
    const textArray = 'Portfolio'.split('');
    render(
      <AnimatedLetters letterClass="text-animate" strArray={textArray} idx={10} />
    );

    const wrap = screen.getByLabelText('Portfolio');
    expect(wrap).toBeInTheDocument();
    expect(wrap).toHaveAttribute('translate', 'no');
    expect(wrap).toHaveClass('animated-word-wrap');
    expect(wrap).toHaveClass('notranslate');
  });

  test('preserves spacing and accessible text content for multi-word phrases', () => {
    const textArray = 'Senior Backend'.split('');
    render(
      <AnimatedLetters letterClass="text-animate" strArray={textArray} idx={1} />
    );

    const wrap = screen.getByLabelText('Senior Backend');
    expect(wrap).toBeInTheDocument();
    expect(wrap.textContent).toContain('Senior');
    expect(wrap.textContent).toContain('Backend');
  });
});
