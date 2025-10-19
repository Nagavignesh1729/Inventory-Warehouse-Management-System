// src/__tests__/Settings.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Settings from '../../pages/Settings';

describe('Settings Component', () => {
  beforeEach(() => {
    localStorage.clear(); // Clear localStorage before each test
    render(<Settings />);
  });

  test('renders main heading and subheading', () => {
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText(/Manage your system configuration/i)).toBeInTheDocument();
  });

  test('renders tab navigation buttons', () => {
    expect(screen.getByText('Organization')).toBeInTheDocument();
    expect(screen.getByText('CSV Settings')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  test('switching tabs shows correct content', () => {
    fireEvent.click(screen.getByText('CSV Settings'));
    expect(screen.getByText('CSV Import/Export Configuration')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Profile'));
    expect(screen.getByText('Notification Preferences')).toBeInTheDocument();
  });

  test('organization input fields render and are editable', () => {
    const orgNameInput = screen.getByLabelText('Organization Name');
    expect(orgNameInput.value).toBe('InventoryPro Inc.');
    fireEvent.change(orgNameInput, { target: { value: 'NewOrgName' } });
    expect(orgNameInput.value).toBe('NewOrgName');
  });

  test('profile checkboxes can be toggled', () => {
    fireEvent.click(screen.getByText('Profile'));
    const lowStockCheckbox = screen.getByLabelText('Low stock alerts');
    expect(lowStockCheckbox.checked).toBe(true);
    fireEvent.click(lowStockCheckbox);
    expect(lowStockCheckbox.checked).toBe(false);
  });

  test('Save Changes button updates localStorage and shows toast', () => {
    const saveButton = screen.getByText('Save Changes');

    fireEvent.click(saveButton);

    const savedOrg = JSON.parse(localStorage.getItem('inventoryPro_orgSettings'));
    expect(savedOrg.name).toBe('InventoryPro Inc.');

    // Optional: check that toast appears
    expect(screen.getByText('Settings Saved')).toBeInTheDocument();
  });
});
