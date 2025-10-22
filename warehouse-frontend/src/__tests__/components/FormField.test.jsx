import { render, screen, fireEvent } from '@testing-library/react';
import { User } from 'lucide-react';
import FormField from '../../components/FormField';

test('calls onChange when typing', () => {
  const handleChange = jest.fn();
  render(<FormField label="Username" name="username" value="" onChange={handleChange} />);
  
  const input = screen.getByLabelText(/username/i);
  fireEvent.change(input, { target: { value: 'John' } });
  expect(handleChange).toHaveBeenCalled();
});

test('shows error message', () => {
  render(<FormField label="Email" name="email" value="" onChange={() => {}} error="Invalid email" />);
  expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
});
