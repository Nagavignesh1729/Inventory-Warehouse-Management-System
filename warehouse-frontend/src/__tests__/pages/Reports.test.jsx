// src/__tests__/Reports.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Reports from '../pages/Reports';

describe('Reports Component', () => {
  beforeEach(() => {
    render(<Reports />);
  });

  test('renders main heading and subheading', () => {
    expect(screen.getByText('Reports & Analytics')).toBeInTheDocument();
    expect(screen.getByText(/Generate comprehensive reports/i)).toBeInTheDocument();
  });

  test('renders all report type radio buttons', () => {
    const inventoryRadio = screen.getByLabelText('Inventory Summary');
    const lowstockRadio = screen.getByLabelText('Low Stock Report');
    const movementRadio = screen.getByLabelText('Stock Movement');
    const valuationRadio = screen.getByLabelText('Inventory Valuation');

    expect(inventoryRadio).toBeInTheDocument();
    expect(lowstockRadio).toBeInTheDocument();
    expect(movementRadio).toBeInTheDocument();
    expect(valuationRadio).toBeInTheDocument();
  });

  test('selecting a report type updates the radio button', () => {
    const lowstockRadio = screen.getByLabelText('Low Stock Report');
    fireEvent.click(lowstockRadio);
    expect(lowstockRadio.checked).toBe(true);
  });

  test('renders dropdowns for date range, warehouse, and category', () => {
    expect(screen.getByLabelText('Date Range')).toBeInTheDocument();
    expect(screen.getByLabelText('Warehouse')).toBeInTheDocument();
    expect(screen.getByLabelText('Category')).toBeInTheDocument();
  });

  test('renders Generate Report button', () => {
    expect(screen.getByText('Generate Report')).toBeInTheDocument();
  });

  test('renders Export buttons', () => {
    expect(screen.getByText('Export PDF')).toBeInTheDocument();
    expect(screen.getByText(/CSV/i)).toBeInTheDocument();
  });
});
