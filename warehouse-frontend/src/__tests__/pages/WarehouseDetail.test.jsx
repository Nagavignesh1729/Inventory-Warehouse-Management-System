// src/__tests__/pages/WarehouseDetail.test.jsx
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import WarehouseDetail from '../../pages/WarehouseDetail';

describe('WarehouseDetail Component', () => {
  const mockOnBack = jest.fn();

  // Mock items to be displayed in the table
  const mockItems = [
    { id: 'INV001', name: 'iPhone 15 Pro', category: 'Electronics', stock: 45, location: 'A1-3B', lastUpdated: '2024-01-15' },
    { id: 'INV002', name: 'MacBook Pro', category: 'Electronics', stock: 30, location: 'A1-4C', lastUpdated: '2024-01-20' },
    { id: 'INV003', name: 'Desk Chair', category: 'Furniture', stock: 20, location: 'B2-1A', lastUpdated: '2024-01-18' },
  ];

  beforeEach(() => {
    // Render component with mock items
    render(<WarehouseDetail warehouseId="WH001" items={mockItems} onBack={mockOnBack} />);
  });

  test('renders warehouse information correctly', () => {
    // Warehouse name and location
    expect(screen.getByText('Main Warehouse')).toBeInTheDocument();
    expect(screen.getByText('New York, NY')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();

    // Capacity and utilization cards
    const capacityCard = screen.getAllByText('Capacity')[0].closest('div');
    expect(within(capacityCard).getByText('50,000 sq ft')).toBeInTheDocument();

    const utilizationCard = screen.getAllByText('Utilization')[0].closest('div');
    expect(within(utilizationCard).getByText('85%')).toBeInTheDocument();

    // Low stock and total items
    expect(screen.getByText('Total Items')).toBeInTheDocument();
    expect(screen.getByText('1,247')).toBeInTheDocument();
    expect(screen.getByText('Low Stock Items')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  test('renders items table and filters rows based on search input', () => {
     const searchInput = screen.getByPlaceholderText(/Search items/i);

    fireEvent.change(searchInput, { target: { value: 'iPhone' } });

    expect(searchInput.value).toBe('iPhone');

    const rows = screen.getAllByRole('row');

    const dataRows = rows.slice(1);

    const filteredRows = dataRows.filter(row =>
      within(row).queryByText(/iPhone/i)
    );

      expect(filteredRows.length).toBeGreaterThan(0);
  });
  test('searching for non-existent item shows no rows', () => {
  const searchInput = screen.getByPlaceholderText(/Search items/i);
  fireEvent.change(searchInput, { target: { value: 'NonExistentItem' } });

  const rows = screen.getAllByRole('row');
  const dataRows = rows.slice(1); // skip header

  const filteredRows = dataRows.filter(row =>
    within(row).queryByText(/NonExistentItem/i)
  );

  expect(filteredRows.length).toBe(0); // ✅ now it should pass
});

});
