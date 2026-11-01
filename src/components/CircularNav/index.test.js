import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import CircularNav from './index'
import { UiProvider } from '../../context/UiContext'

const renderCircularNav = (initialEntries = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <UiProvider>
        <CircularNav />
      </UiProvider>
    </MemoryRouter>
  )
}

describe('CircularNav Component', () => {
  test('renders closed trigger button by default with accessible label', () => {
    renderCircularNav()

    const triggerBtn = screen.getByRole('button', {
      name: /Open circular navigation menu/i,
    })
    expect(triggerBtn).toBeInTheDocument()
    expect(triggerBtn).toHaveAttribute('aria-expanded', 'false')
  })

  test('toggles open state and displays all 7 navigation items when clicked', () => {
    renderCircularNav()

    const triggerBtn = screen.getByRole('button', {
      name: /Open circular navigation menu/i,
    })
    fireEvent.click(triggerBtn)

    // Trigger should now show close label & expanded state
    expect(triggerBtn).toHaveAttribute('aria-expanded', 'true')
    expect(
      screen.getByRole('button', { name: /Close navigation menu/i })
    ).toBeInTheDocument()

    // Check all 7 navigation items are present
    expect(screen.getByRole('link', { name: /Home/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /About/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Resume/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Works/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Focus/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Blog/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Contact/i })).toBeInTheDocument()
  })

  test('closes menu when Escape key is pressed', () => {
    renderCircularNav()

    const triggerBtn = screen.getByRole('button', {
      name: /Open circular navigation menu/i,
    })
    fireEvent.click(triggerBtn)
    expect(triggerBtn).toHaveAttribute('aria-expanded', 'true')

    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' })
    expect(triggerBtn).toHaveAttribute('aria-expanded', 'false')
  })

  test('closes menu when clicking the backdrop scrim', () => {
    renderCircularNav()

    const triggerBtn = screen.getByRole('button', {
      name: /Open circular navigation menu/i,
    })
    fireEvent.click(triggerBtn)
    expect(triggerBtn).toHaveAttribute('aria-expanded', 'true')

    const scrim = screen.getByTestId('circular-scrim')
    expect(scrim).toBeInTheDocument()
    fireEvent.click(scrim)

    expect(triggerBtn).toHaveAttribute('aria-expanded', 'false')
  })

  test('closes menu and triggers navigation when a menu link is clicked', () => {
    renderCircularNav()

    const triggerBtn = screen.getByRole('button', {
      name: /Open circular navigation menu/i,
    })
    fireEvent.click(triggerBtn)

    const aboutLink = screen.getByRole('link', { name: /About/i })
    fireEvent.click(aboutLink)

    expect(triggerBtn).toHaveAttribute('aria-expanded', 'false')
  })

  test('highlights active link according to current route', () => {
    renderCircularNav(['/blog'])

    const triggerBtn = screen.getByRole('button', {
      name: /Open circular navigation menu/i,
    })
    fireEvent.click(triggerBtn)

    const blogLink = screen.getByRole('link', { name: /Blog/i })
    expect(blogLink).toHaveClass('active')
  })

  test('updates HUD readout badge on item hover', () => {
    renderCircularNav()

    const triggerBtn = screen.getByRole('button', {
      name: /Open circular navigation menu/i,
    })
    fireEvent.click(triggerBtn)

    const worksLink = screen.getByRole('link', { name: /Works/i })
    fireEvent.mouseEnter(worksLink)

    expect(screen.getByText('Enterprise Systems & APIs')).toBeInTheDocument()
  })
})