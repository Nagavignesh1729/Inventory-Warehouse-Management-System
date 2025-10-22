import { render, screen, fireEvent } from '@testing-library/react';
import ItemForm from '../../pages/ItemForm';

describe('ItemForm', () => {
  const mockOnSave = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all input fields', () => {
    render(<ItemForm onSave={mockOnSave} onCancel={mockOnCancel} />);
    expect(screen.getByLabelText(/Item Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/SKU/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Warehouse/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Current Stock Level/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Minimum Stock Level/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Unit Price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
  });

  test('prefills form when item prop is passed', () => {
    const item = { name: 'Test', category: 'Electronics', warehouse: 'Main Warehouse', stockLevel: 5 };
    render(<ItemForm item={item} onSave={mockOnSave} onCancel={mockOnCancel} />);
    expect(screen.getByDisplayValue('Test')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Electronics')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Main Warehouse')).toBeInTheDocument();
    expect(screen.getByDisplayValue('5')).toBeInTheDocument();
  });

  test('calls onSave with correct data', () => {
    render(<ItemForm onSave={mockOnSave} onCancel={mockOnCancel} />);
    fireEvent.change(screen.getByLabelText(/Item Name/i), { target: { value: 'Laptop' } });
    fireEvent.change(screen.getByLabelText(/Category/i), { target: { value: 'Electronics' } });
    fireEvent.change(screen.getByLabelText(/Warehouse/i), { target: { value: 'Main Warehouse' } });
    fireEvent.change(screen.getByLabelText(/Current Stock Level/i), { target: { value: 0 } });
    fireEvent.click(screen.getByText(/Add Item/i));
    
    expect(mockOnSave).toHaveBeenCalled();
    const savedData = mockOnSave.mock.calls[0][0];
    expect(savedData.name).toBe('Laptop');
    expect(savedData.status).toBe('Out of Stock'); // stockLevel = 0
  });

  test('calls onCancel when cancel button is clicked', () => {
    render(<ItemForm onSave={mockOnSave} onCancel={mockOnCancel} />);
    fireEvent.click(screen.getByText(/Cancel/i));
    expect(mockOnCancel).toHaveBeenCalled();
  });
});
