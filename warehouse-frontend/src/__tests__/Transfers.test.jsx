import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Transfers from './Transfers';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import { AlertTriangle } from 'lucide-react';

// Mock the DataTable and Modal components to simplify testing
jest.mock('../components/DataTable', () => ({ columns, data }) => (
  <div data-testid="datatable">
    {data.map(d => (
      <div key={d.id} data-testid="transfer-row">
        {d.item} - {d.status}
      </div>
    ))}
  </div>
));

jest.mock('../components/Modal', () => ({ isOpen, children }) =>
  isOpen ? <div data-testid="modal">{children}</div> : null
);

jest.mock('./TransferForm', () => ({ onSave, onCancel, warehouses }) => {
  const handleSubmit = () => {
    onSave({
      item: 'Test Item',
      from: warehouses[0],
      to: warehouses[1],
      quantity: 5,
    });
  };
  return (
    <div>
      <button data-testid="submit-transfer" onClick={handleSubmit}>
        Save Transfer
      </button>
    </div>
  );
});

describe('Transfers Component', () => {
  test('renders initial transfers and can add a new transfer', async () => {
    const mockAddNotification = jest.fn();

    render(<Transfers addNotification={mockAddNotification} />);

    // Check initial transfer rows
    const rows = screen.getAllByTestId('transfer-row');
    expect(rows.length).toBe(2);
    expect(rows[0]).toHaveTextContent('iPhone 15 Pro');

    // Open new transfer form
    const newTransferButton = screen.getByText(/New Transfer/i);
    fireEvent.click(newTransferButton);

    // Modal should be visible
    const modal = screen.getByTestId('modal');
    expect(modal).toBeInTheDocument();

    // Submit the transfer
    const submitButton = screen.getByTestId('submit-transfer');
    fireEvent.click(submitButton);

    // Wait for table to update
    await waitFor(() => {
      const updatedRows = screen.getAllByTestId('transfer-row');
      expect(updatedRows.length).toBe(3);
      expect(updatedRows[0]).toHaveTextContent('Test Item');
    });

    // Check notification triggered
    expect(mockAddNotification).toHaveBeenCalledTimes(1);
    expect(mockAddNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        text: expect.stringContaining('New transfer request for 5x "Test Item"'),
      })
    );
  });
});
