import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import WarehouseList from './WarehouseList';
import '@testing-library/jest-dom/extend-expect';

// Mock DataTable, FilterBar, Modal, EmptyState, and Badge
jest.mock('../components/DataTable', () => ({ columns, data }) => (
  <div data-testid="datatable">
    {data.map(d => (
      <div key={d.id} data-testid="warehouse-row">{d.name}</div>
    ))}
  </div>
));

jest.mock('../components/FilterBar', () => ({ searchTerm, onSearchChange, filters }) => (
  <input
    data-testid="search-input"
    value={searchTerm}
    onChange={e => onSearchChange(e.target.value)}
  />
));

jest.mock('../components/Modal', () => ({ isOpen, children }) => (
  isOpen ? <div data-testid="modal">{children}</div> : null
));

jest.mock('../components/EmptyState', () => ({ title, onAction }) => (
  <div>
    <span>{title}</span>
    <button onClick={onAction}>Action</button>
  </div>
));

jest.mock('../components/Badge', () => ({ text }) => <span>{text}</span>);

describe('WarehouseList Component', () => {
  const onWarehouseSelect = jest.fn();

  test('renders warehouses correctly', () => {
    render(<WarehouseList onWarehouseSelect={onWarehouseSelect} />);

    expect(screen.getByText('Warehouse Management')).toBeInTheDocument();

    // Check that some sample warehouses render
    expect(screen.getByText('Main Warehouse')).toBeInTheDocument();
    expect(screen.getByText('Electronics Hub')).toBeInTheDocument();
  });

  test('search input filters warehouses', () => {
    render(<WarehouseList onWarehouseSelect={onWarehouseSelect} />);
    const searchInput = screen.getByTestId('search-input');

    fireEvent.change(searchInput, { target: { value: 'Electronics' } });

    // DataTable should only show filtered warehouse
    expect(screen.getByText('Electronics Hub')).toBeInTheDocument();
    expect(screen.queryByText('Main Warehouse')).not.toBeInTheDocument();
  });

  test('clicking Add Warehouse opens modal', () => {
    render(<WarehouseList onWarehouseSelect={onWarehouseSelect} />);
    const addButton = screen.getByText('Add Warehouse');

    fireEvent.click(addButton);

    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByText('Add New Warehouse')).toBeInTheDocument();
  });

  test('clicking warehouse view button calls onWarehouseSelect', () => {
    render(<WarehouseList onWarehouseSelect={onWarehouseSelect} />);
    const viewButtons = screen.getAllByLabelText(/View details for/i);

    fireEvent.click(viewButtons[0]);
    expect(onWarehouseSelect).toHaveBeenCalledWith('WH001');
  });
});
