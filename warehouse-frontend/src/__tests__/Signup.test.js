// Signup.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Signup from './Signup';

describe('Signup Component', () => {
  const mockNavigateToLogin = jest.fn();

  beforeEach(() => {
    render(<Signup onNavigateToLogin={mockNavigateToLogin} />);
    mockNavigateToLogin.mockClear();
  });

  test('renders all input fields and submit button', () => {
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
  });

  test('shows error if passwords do not match', () => {
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: '456' } });

    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
  });

  test('calls onNavigateToLogin after successful signup', async () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email address/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: '123456' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: '123456' } });

    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    await waitFor(() => expect(alertMock).toHaveBeenCalledWith('Signup successful! Please log in.'));
    expect(mockNavigateToLogin).toHaveBeenCalled();

    alertMock.mockRestore();
  });

  test('disables submit button while signing up', async () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email address/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: '123456' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: '123456' } });

    const submitButton = screen.getByRole('button', { name: /Sign Up/i });
    
    fireEvent.click(submitButton);

    // Immediately after click
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent(/Creating account.../i);

    // Wait for async completion
    await waitFor(() => expect(alertMock).toHaveBeenCalled());

    expect(submitButton).not.toBeDisabled();
    expect(submitButton).toHaveTextContent(/Sign Up/i);

    alertMock.mockRestore();
  });

  test('navigates to login when "Already have an account?" is clicked', () => {
    fireEvent.click(screen.getByText(/Already have an account/i));
    expect(mockNavigateToLogin).toHaveBeenCalled();
  });
});
