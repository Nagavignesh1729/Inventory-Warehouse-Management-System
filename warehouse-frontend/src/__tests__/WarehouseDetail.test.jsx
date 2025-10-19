import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import WarehouseDetail from './WarehouseDetail';
import '@testing-library/jest-dom/extend-expect';

// Mock DataTable and FilterBar to simplify tests
jest.mock('../components/DataTable', () => ({ columns, data }) => (
  <div data-testid="datatable">
    {data.map(d => (
      <div key={d.id} data-testid="item-row">
        {d.name} - {d.status}
      </div>
    ))}
  </div>
));

jest.mock('../components/FilterBar', () => ({ searchTerm, onSearchChange, filters }) => (
  <div>
    <input
      data-testid="search-input"
      value={searchTerm}
      onChange={e => onSearchChange(e.target.value)}
    />
    {filters.map(f => (
      <select
        key={f.label}
        data-testid={`filter-${f.label}`}
        value={f.value}
        onChange={e => f.onChange(e.target.value)}
      >
        {f.options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    ))}
  </div>
));

describe('WarehouseDetail Component', () => {
  test('renders warehouse info and items correctly', () => {
    const warehouseId = 'WH001';
    const onBack = jest.fn();

    render(<WarehouseDetail warehouseId={warehouseId} onBack={onBack} />);

    // Check warehouse name and location
    expect(screen.getByText('Main Warehouse')).toBeInTheDocument();
    expect(screen.getByText('New York, NY')).toBeInTheDocument();

    // Check manager info
    expect(screen.getByText('John Smith')).toBeInTheDocument();
    expect(screen.getByText('(555) 123-4567')).toBeInTheDocument();
    expect(screen.getByText('john.smith@company.com')).toBeInTheDocument();

    // Check items
    const itemRows = screen.getAllByTestId('item-row');
    expect(itemRows.length).toBeGreaterThan(0);
    expect(screen.getByText(/iPhone 15 Pro/)).toBeInTheDocument();
  });

  test('handles warehouse not found', () => {
    const warehouseId = 'INVALID';
    const onBack = jest.fn();

    render(<WarehouseDetail warehouseId={warehouseId} onBack={onBack} />);

    expect(screen.getByText(/Warehouse Not Found/)).toBeInTheDocument();

    const backButton = screen.getByText(/Go Back/);
    fireEvent.click(backButton);
    expect(onBack).toHaveBeenCalled();
  });

  test('search input updates state', () => {
    const warehouseId = 'WH002';
    const onBack = jest.fn();

    render(<WarehouseDetail warehouseId={warehouseId} onBack={onBack} />);

    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'Dell' } });
    expect(searchInput.value).toBe('Dell');
  });
});
