// TransferForm.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TransferForm from './TransferForm';

describe('TransferForm Component', () => {
  const mockOnSave = jest.fn();
  const mockOnCancel = jest.fn();
  const warehouses = ['Main Warehouse', 'Secondary Warehouse'];

  beforeEach(() => {
    mockOnSave.mockClear();
    mockOnCancel.mockClear();
    render(
      <TransferForm
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        warehouses={warehouses}
      />
    );
  });

  test('renders all fields with default values', () => {
    expect(screen.getByLabelText(/Item Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/From Warehouse/i)).toHaveValue('Main Warehouse');
    expect(screen.getByLabelText(/To Warehouse/i)).toHaveValue('Secondary Warehouse');
    expect(screen.getByLabelText(/Quantity/i)).toHaveValue(1);
  });

  test('calls onCancel when Cancel button is clicked', () => {
    fireEvent.click(screen.getByText(/Cancel/i));
    expect(mockOnCancel).toHaveBeenCalled();
  });

  test('updates input values on change', () => {
    fireEvent.change(screen.getByLabelText(/Item Name/i), { target: { value: 'iPhone 15' } });
    fireEvent.change(screen.getByLabelText(/Quantity/i), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText(/From Warehouse/i), { target: { value: 'Secondary Warehouse' } });
    fireEvent.change(screen.getByLabelText(/To Warehouse/i), { target: { value: 'Main Warehouse' } });

    expect(screen.getByLabelText(/Item Name/i)).toHaveValue('iPhone 15');
    expect(screen.getByLabelText(/Quantity/i)).toHaveValue(5);
    expect(screen.getByLabelText(/From Warehouse/i)).toHaveValue('Secondary Warehouse');
    expect(screen.getByLabelText(/To Warehouse/i)).toHaveValue('Main Warehouse');
  });

  test('alerts if source and destination warehouses are the same', () => {
    window.alert = jest.fn();

    fireEvent.change(screen.getByLabelText(/From Warehouse/i), { target: { value: 'Main Warehouse' } });
    fireEvent.change(screen.getByLabelText(/To Warehouse/i), { target: { value: 'Main Warehouse' } });

    fireEvent.click(screen.getByText(/Initiate Transfer/i));
    expect(window.alert).toHaveBeenCalledWith('Source and destination warehouses cannot be the same.');
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  test('calls onSave with correct data when valid', () => {
    fireEvent.change(screen.getByLabelText(/Item Name/i), { target: { value: 'iPhone 15' } });
    fireEvent.change(screen.getByLabelText(/Quantity/i), { target: { value: '3' } });
    fireEvent.change(screen.getByLabelText(/From Warehouse/i), { target: { value: 'Main Warehouse' } });
    fireEvent.change(screen.getByLabelText(/To Warehouse/i), { target: { value: 'Secondary Warehouse' } });

    fireEvent.click(screen.getByText(/Initiate Transfer/i));

    expect(mockOnSave).toHaveBeenCalledWith({
      item: 'iPhone 15',
      quantity: 3,
      from: 'Main Warehouse',
      to: 'Secondary Warehouse'
    });
  });
});
