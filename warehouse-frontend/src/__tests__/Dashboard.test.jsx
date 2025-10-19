// __tests__/Dashboard.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from '../pages/Dashboard';

describe('Dashboard Component - Basic Tests', () => {

  test('renders dashboard title and welcome text', () => {
    render(<Dashboard onNavigate={() => {}} onImport={() => {}} />);
    
    // Check main title
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    // Check welcome text
    expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
  });

  test('renders all main buttons', () => {
    render(<Dashboard onNavigate={() => {}} onImport={() => {}} />);
    
    expect(screen.getByText(/Add Item/i)).toBeInTheDocument();
    expect(screen.getByText(/Import CSV/i)).toBeInTheDocument();
    expect(screen.getByText(/Generate Report/i)).toBeInTheDocument();
  });

  test('calls onNavigate prop when Add Item button is clicked', () => {
    const onNavigate = jest.fn();
    render(<Dashboard onNavigate={onNavigate} onImport={() => {}} />);
    
    fireEvent.click(screen.getByText(/Add Item/i));
    expect(onNavigate).toHaveBeenCalledWith('inventory');
  });

  test('calls onNavigate prop when Generate Report button is clicked', () => {
    const onNavigate = jest.fn();
    render(<Dashboard onNavigate={onNavigate} onImport={() => {}} />);
    
    fireEvent.click(screen.getByText(/Generate Report/i));
    expect(onNavigate).toHaveBeenCalledWith('reports');
  });

  test('calls onImport prop when Import CSV button is clicked', () => {
    const onImport = jest.fn();
    render(<Dashboard onNavigate={() => {}} onImport={onImport} />);
    
    fireEvent.click(screen.getByText(/Import CSV/i));
    expect(onImport).toHaveBeenCalled();
  });

});
