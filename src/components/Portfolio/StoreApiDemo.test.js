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

  test('navigates endpoints and view tabs using arrow keys', () => {
    render(<StoreApiDemo />);

    const getCatalogTab = screen.getByRole('tab', { name: /Browse Catalog/i });
    expect(getCatalogTab).toHaveAttribute('aria-selected', 'true');
    expect(getCatalogTab).toHaveAttribute('tabIndex', '0');

    // ArrowRight to next endpoint
    fireEvent.keyDown(getCatalogTab, { key: 'ArrowRight' });
    expect(screen.getByRole('tab', { name: /JWT Authentication/i })).toHaveAttribute('aria-selected', 'true');

    // End key to last endpoint
    fireEvent.keyDown(screen.getByRole('tab', { name: /JWT Authentication/i }), { key: 'End' });
    expect(screen.getByRole('tab', { name: /RFC 7807 Exception/i })).toHaveAttribute('aria-selected', 'true');

    // Home key back to first endpoint
    fireEvent.keyDown(screen.getByRole('tab', { name: /RFC 7807 Exception/i }), { key: 'Home' });
    expect(screen.getByRole('tab', { name: /Browse Catalog/i })).toHaveAttribute('aria-selected', 'true');

    // Test code view tabs (C# vs cURL)
    const csharpTab = screen.getByRole('tab', { name: /C# Controller & LINQ/i });
    expect(csharpTab).toHaveAttribute('aria-selected', 'true');
    fireEvent.keyDown(csharpTab, { key: 'ArrowRight' });
    const curlTab = screen.getByRole('tab', { name: /cURL Command/i });
    expect(curlTab).toHaveAttribute('aria-selected', 'true');
  });
});
