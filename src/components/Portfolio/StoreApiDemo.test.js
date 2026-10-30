import { render, screen, fireEvent, act } from '@testing-library/react';
import StoreApiDemo from './StoreApiDemo';

describe('StoreApiDemo Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('renders live architecture simulator and interactive category filters', () => {
    render(<StoreApiDemo />);

    expect(screen.getByText(/LIVE ARCHITECTURE SIMULATOR/i)).toBeInTheDocument();
    expect(screen.getByText(/Browse Catalog \(Interactive EF Core\)/i)).toBeInTheDocument();

    // Verify category filter buttons exist
    const audioBtn = screen.getByRole('button', { name: /^Audio$/i });
    expect(audioBtn).toBeInTheDocument();

    // Click Audio filter
    fireEvent.click(audioBtn);
    expect(audioBtn).toHaveClass('active');

    // Verify URL preview updated with category=Audio
    expect(screen.getByText(/category=Audio/i)).toBeInTheDocument();

    // Verify SQL query contains WHERE [p].[Category] = 'Audio'
    expect(screen.getByText(/WHERE \[p\]\.\[Category\] = 'Audio'/i)).toBeInTheDocument();
  });

  test('simulates pipeline execution and inspects JSON response', () => {
    render(<StoreApiDemo />);

    const sendBtn = screen.getByRole('button', { name: /send simulated http request/i });
    fireEvent.click(sendBtn);

    // Fast-forward simulation timer
    act(() => {
      jest.advanceTimersByTime(400);
    });

    // Check that response status badge is visible
    expect(screen.getByText(/200 OK/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /copy json/i })).toBeInTheDocument();
  });

  test('filters live query dynamically when searching keyword', () => {
    render(<StoreApiDemo />);

    const searchInput = screen.getByLabelText(/filter products by keyword/i);
    fireEvent.change(searchInput, { target: { value: 'keyboard' } });

    // Verify URL preview updated with search=keyboard
    expect(screen.getByText(/search=keyboard/i)).toBeInTheDocument();

    // Verify compiled SQL contains LIKE '%keyboard%'
    expect(screen.getByText(/LIKE '%keyboard%'/i)).toBeInTheDocument();
  });
});
