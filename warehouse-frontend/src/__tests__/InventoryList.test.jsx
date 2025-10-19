// __tests__/InventoryList.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import InventoryList from '../pages/InventoryList';

describe('InventoryList Component - Basic Tests', () => {

  test('renders inventory management title and buttons', () => {
    render(<InventoryList onImport={() => {}} />);
    
    expect(screen.getByText(/Inventory Management/i)).toBeInTheDocument();
    expect(screen.getByText(/Add Item/i)).toBeInTheDocument();
    expect(screen.getByText(/Import CSV/i)).toBeInTheDocument();
    expect(screen.getByText(/Export CSV/i)).toBeInTheDocument();
  });

  test('calls onImport prop when Import CSV button clicked', () => {
    const onImport = jest.fn();
    render(<InventoryList onImport={onImport} />);
    
    fireEvent.click(screen.getByText(/Import CSV/i));
    expect(onImport).toHaveBeenCalled();
  });

  test('opens modal when Add Item button clicked', () => {
    render(<InventoryList onImport={() => {}} />);
    
    fireEvent.click(screen.getByText(/Add Item/i));
    expect(screen.getByText(/Add New Item/i)).toBeInTheDocument();
  });

  test('filtering works correctly', () => {
    render(<InventoryList onImport={() => {}} />);
    
    // Search for an existing item
    const searchInput = screen.getByPlaceholderText(/Search/i);
    if (searchInput) {
      fireEvent.change(searchInput, { target: { value: 'iPhone' } });
      expect(screen.getByText(/iPhone 15 Pro/i)).toBeInTheDocument();
    }
  });

  test('shows empty state when no items match filter', () => {
    render(<InventoryList onImport={() => {}} />);
    
    const searchInput = screen.getByPlaceholderText(/Search/i);
    if (searchInput) {
      fireEvent.change(searchInput, { target: { value: 'NonExistentItem' } });
      expect(screen.getByText(/No inventory items found/i)).toBeInTheDocument();
    }
  });

});
