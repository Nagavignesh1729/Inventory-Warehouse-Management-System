import { render, screen, fireEvent } from '@testing-library/react';
import DataTable from './DataTable';

const columns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'name', label: 'Name', sortable: true },
];

const data = [
  { id: 1, name: 'Banana' },
  { id: 2, name: 'Apple' },
  { id: 3, name: 'Cherry' },
];

test('renders table headers', () => {
  render(<DataTable columns={columns} data={data} />);
  expect(screen.getByText('ID')).toBeInTheDocument();
  expect(screen.getByText('Name')).toBeInTheDocument();
});

test('filters rows when searching', () => {
  render(<DataTable columns={columns} data={data} />);
  fireEvent.change(screen.getByPlaceholderText('Search table...'), { target: { value: 'apple' } });
  expect(screen.getByText('Apple')).toBeInTheDocument();
  expect(screen.queryByText('Banana')).not.toBeInTheDocument();
});

test('sorts rows when clicking column header', () => {
  render(<DataTable columns={columns} data={data} />);
  fireEvent.click(screen.getByText('Name')); // Sort asc
  const firstRow = screen.getAllByRole('row')[1];
  expect(firstRow).toHaveTextContent('Apple');
});
