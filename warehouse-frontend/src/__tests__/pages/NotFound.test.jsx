// NotFound.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NotFound from '../../pages/NotFound';

describe('NotFound Component', () => {
  beforeEach(() => {
    // Render component before each test
    render(<NotFound />);
  });

  test('renders 404 heading', () => {
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
  });

  test('renders description text', () => {
    expect(
      screen.getByText(/Sorry, we couldn't find the page you're looking for/i)
    ).toBeInTheDocument();
  });

  test('renders "Go Back" button and calls window.history.back', () => {
    const goBackSpy = jest.spyOn(window.history, 'back').mockImplementation(() => {});
    const goBackButton = screen.getByRole('button', { name: /Go Back/i });
    fireEvent.click(goBackButton);
    expect(goBackSpy).toHaveBeenCalled();
    goBackSpy.mockRestore();
  });

  test('renders "Return to Dashboard" button and changes location', () => {
    const locationSpy = jest.spyOn(window.location, 'href', 'set');
    const dashboardButton = screen.getByRole('button', { name: /Return to Dashboard/i });
    fireEvent.click(dashboardButton);
    expect(locationSpy).toHaveBeenCalledWith('/');
    locationSpy.mockRestore();
  });

  test('renders Contact Support button', () => {
    expect(screen.getByRole('button', { name: /Contact Support/i })).toBeInTheDocument();
  });
});
