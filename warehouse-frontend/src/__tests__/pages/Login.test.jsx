// src/__tests__/Login.test.jsx
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import Login from '../../pages/Login';

jest.useFakeTimers();

describe('Login Component', () => {
  const mockLogin = jest.fn();

  beforeEach(() => {
    render(<Login onLogin={mockLogin} />);
  });

  test('renders email and password fields', () => {
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  test('renders sign in and sign up buttons', () => {
    expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
  });

  test('toggles password visibility', () => {
    const passwordInput = screen.getByLabelText(/Password/i);

    // Select the first button in the password field container
    const toggleButton = screen.getAllByRole('button')[0];

    // Initially, type should be 'password'
    expect(passwordInput.type).toBe('password');

    // Click toggle button to show password
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('text');

    // Click again to hide password
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('password');
  });

  test('calls onLogin after submitting', async () => {
    const signInButton = screen.getByRole('button', { name: /Sign in/i });

    fireEvent.click(signInButton);

    // Wrap timers in act to avoid warning
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
    });
  });
});
