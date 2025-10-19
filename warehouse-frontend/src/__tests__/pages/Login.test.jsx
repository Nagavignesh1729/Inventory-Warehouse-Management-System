import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../pages/Login';

jest.useFakeTimers();

describe('Login Component', () => {
  const mockLogin = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    render(<Login onLogin={mockLogin} onNavigateToSignup={mockNavigate} />);
  });

  test('renders email and password fields', () => {
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  test('renders sign in and sign up buttons', () => {
    expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
  });

  test('typing updates input fields', () => {
    const emailInput = screen.getByLabelText(/Email address/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'myPass123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('myPass123');
  });

  test('toggles password visibility', () => {
    const passwordInput = screen.getByLabelText(/Password/i);
    const toggleButton = screen.getByRole('button', { name: /Eye/i });

    expect(passwordInput.type).toBe('password');
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('text');
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('password');
  });

  test('calls onLogin after submitting', async () => {
    const emailInput = screen.getByLabelText(/Email address/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const signInButton = screen.getByRole('button', { name: /Sign in/i });

    fireEvent.change(emailInput, { target: { value: 'user@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(signInButton);

    expect(signInButton).toBeDisabled();

    jest.advanceTimersByTime(1000); // fast-forward the timeout
    await waitFor(() => expect(mockLogin).toHaveBeenCalledWith({
      name: 'User',
      email: 'user@test.com'
    }));
  });

  test('calls onNavigateToSignup when Sign Up clicked', () => {
    const signUpButton = screen.getByRole('button', { name: /Sign Up/i });
    fireEvent.click(signUpButton);
    expect(mockNavigate).toHaveBeenCalled();
  });
});
