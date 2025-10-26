// InventoryList.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import InventoryList from '../../pages/InventoryList';

describe('InventoryList Component', () => {
  test('renders inventory list and filters correctly', () => {
    const handleImport = jest.fn();

    render(<InventoryList onImport={handleImport} />);

    // Check header
    expect(screen.getByText('Inventory Management')).toBeInTheDocument();

    // Check Add Item button
    const addButton = screen.getByText('Add Item');
    expect(addButton).toBeInTheDocument();

    // Click Import CSV button
    const importButton = screen.getByText('Import CSV');
    fireEvent.click(importButton);
    expect(handleImport).toHaveBeenCalled();

    // Search input should exist
    const searchInput = screen.getByRole('textbox');
    expect(searchInput).toBeInTheDocument();

    // Type in search to filter items
    fireEvent.change(searchInput, { target: { value: 'iPhone' } });
    expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
    expect(screen.queryByText('Samsung Galaxy S24')).not.toBeInTheDocument();

    // Click Add Item to open modal
    fireEvent.click(addButton);
    expect(screen.getByText('Add New Item')).toBeInTheDocument();
  });

  test('shows empty state when no items match filters', () => {
    render(<InventoryList onImport={() => {}} />);

    // Get search input
    const searchInput = screen.getByRole('textbox');

    // Type a value that matches no item
    fireEvent.change(searchInput, { target: { value: 'NonExistingItem' } });

    expect(screen.getByText('No inventory items found')).toBeInTheDocument();
    expect(screen.getByText('Get started by adding your first inventory item or importing from CSV')).toBeInTheDocument();
  });
});
