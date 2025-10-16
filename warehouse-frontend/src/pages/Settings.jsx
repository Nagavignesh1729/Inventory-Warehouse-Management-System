import React, { useState, useEffect } from 'react';
import { Building, User, Upload, Download, Save } from 'lucide-react';
import { ToastContainer } from '../components/ToastPlaceholder';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('organization');
  const [toasts, setToasts] = useState([]);

  const [orgSettings, setOrgSettings] = useState({
    name: 'InventoryPro Inc.',
    email: 'admin@inventorypro.com',
    phone: '(555) 123-4567',
    address: '123 Business Ave, Suite 100\nNew York, NY 10001',
    website: 'https://inventorypro.com',
    logo: null
  });

  const [csvSettings, setCsvSettings] = useState({
    delimiter: ',',
    encoding: 'UTF-8',
    dateFormat: 'MM/DD/YYYY',
    includeHeaders: true,
    autoBackup: true,
    backupFrequency: 'daily'
  });

  const [profileSettings, setProfileSettings] = useState({
    name: 'John Doe',
    email: 'john.doe@company.com',
    phone: '(555) 987-6543',
    role: 'Administrator',
    notifications: {
      lowStock: true,
      newItems: true,
      reports: false,
      systemUpdates: true
    }
  });

  // Load settings from localStorage when the component mounts
  useEffect(() => {
    try {
      const savedOrgSettings = localStorage.getItem('inventoryPro_orgSettings');
      const savedCsvSettings = localStorage.getItem('inventoryPro_csvSettings');
      const savedProfileSettings = localStorage.getItem('inventoryPro_profileSettings');

      if (savedOrgSettings) setOrgSettings(JSON.parse(savedOrgSettings));
      if (savedCsvSettings) setCsvSettings(JSON.parse(savedCsvSettings));
      if (savedProfileSettings) setProfileSettings(JSON.parse(savedProfileSettings));
    } catch (error) {
      console.error("Failed to load settings from localStorage:", error);
    }
  }, []);

  const addToast = (toast) => {
    const id = Date.now();
    
    const newToast = {
      ...toast,
      id,
      onClose: () => setToasts(prev => prev.filter(t => t.id !== id)),
    };

    setToasts(prev => [...prev, newToast]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const handleSaveSettings = () => {
    try {
      localStorage.setItem('inventoryPro_orgSettings', JSON.stringify(orgSettings));
      localStorage.setItem('inventoryPro_csvSettings', JSON.stringify(csvSettings));
      localStorage.setItem('inventoryPro_profileSettings', JSON.stringify(profileSettings));

      addToast({
        type: 'success',
        title: 'Settings Saved',
        message: 'Your changes have been saved successfully.'
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Save Failed',
        message: 'There was an error saving your settings.'
      });
      console.error("Failed to save settings:", error);
    }
  };


  const tabs = [
    { id: 'organization', label: 'Organization', icon: Building },
    { id: 'csv', label: 'CSV Settings', icon: Upload },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  const renderOrganizationSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="orgName" className="block text-sm font-medium text-gray-700">
            Organization Name
          </label>
          <input
            type="text"
            id="orgName"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={orgSettings.name}
            onChange={(e) => setOrgSettings(prev => ({ ...prev, name: e.target.value }))}
          />
        </div>

        <div>
          <label htmlFor="orgEmail" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            id="orgEmail"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={orgSettings.email}
            onChange={(e) => setOrgSettings(prev => ({ ...prev, email: e.target.value }))}
          />
        </div>

        <div>
          <label htmlFor="orgPhone" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            id="orgPhone"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={orgSettings.phone}
            onChange={(e) => setOrgSettings(prev => ({ ...prev, phone: e.target.value }))}
          />
        </div>

        <div>
          <label htmlFor="orgWebsite" className="block text-sm font-medium text-gray-700">
            Website
          </label>
          <input
            type="url"
            id="orgWebsite"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={orgSettings.website}
            onChange={(e) => setOrgSettings(prev => ({ ...prev, website: e.target.value }))}
          />
        </div>
      </div>

      <div>
        <label htmlFor="orgAddress" className="block text-sm font-medium text-gray-700">
          Address
        </label>
        <textarea
          id="orgAddress"
          rows={3}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={orgSettings.address}
          onChange={(e) => setOrgSettings(prev => ({ ...prev, address: e.target.value }))}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Organization Logo</label>
        <div className="mt-1 flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
            {orgSettings.logo ? (
              <img src={orgSettings.logo} alt="Logo" className="w-full h-full object-cover rounded-lg" />
            ) : (
              <Building className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200">
            <Upload className="w-4 h-4" />
            <span>Upload Logo</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderCSVSettings = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-2">CSV Import/Export Configuration</h4>
        <p className="text-sm text-blue-700">Configure how CSV files are processed during import and export operations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="delimiter" className="block text-sm font-medium text-gray-700">
            Field Delimiter
          </label>
          <select
            id="delimiter"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={csvSettings.delimiter}
            onChange={(e) => setCsvSettings(prev => ({ ...prev, delimiter: e.target.value }))}
          >
            <option value=",">Comma (,)</option>
            <option value=";">Semicolon (;)</option>
            <option value="\t">Tab</option>
            <option value="|">Pipe (|)</option>
          </select>
        </div>

        <div>
          <label htmlFor="encoding" className="block text-sm font-medium text-gray-700">
            File Encoding
          </label>
          <select
            id="encoding"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={csvSettings.encoding}
            onChange={(e) => setCsvSettings(prev => ({ ...prev, encoding: e.target.value }))}
          >
            <option value="UTF-8">UTF-8</option>
            <option value="UTF-16">UTF-16</option>
            <option value="ISO-8859-1">ISO-8859-1</option>
          </select>
        </div>

        <div>
          <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700">
            Date Format
          </label>
          <select
            id="dateFormat"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={csvSettings.dateFormat}
            onChange={(e) => setCsvSettings(prev => ({ ...prev, dateFormat: e.target.value }))}
          >
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            <option value="DD-MM-YYYY">DD-MM-YYYY</option>
          </select>
        </div>

        <div>
          <label htmlFor="backupFrequency" className="block text-sm font-medium text-gray-700">
            Auto Backup Frequency
          </label>
          <select
            id="backupFrequency"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={csvSettings.backupFrequency}
            onChange={(e) => setCsvSettings(prev => ({ ...prev, backupFrequency: e.target.value }))}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="never">Never</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            id="includeHeaders"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            checked={csvSettings.includeHeaders}
            onChange={(e) => setCsvSettings(prev => ({ ...prev, includeHeaders: e.target.checked }))}
          />
          <label htmlFor="includeHeaders" className="ml-2 block text-sm text-gray-700">
            Include headers in exported CSV files
          </label>
        </div>

        <div className="flex items-center">
          <input
            id="autoBackup"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            checked={csvSettings.autoBackup}
            onChange={(e) => setCsvSettings(prev => ({ ...prev, autoBackup: e.target.checked }))}
          />
          <label htmlFor="autoBackup" className="ml-2 block text-sm text-gray-700">
            Enable automatic data backup
          </label>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-md font-medium text-gray-900 mb-4">Sample CSV Template</h4>
        <div className="bg-gray-50 rounded-lg p-4">
          <code className="text-sm text-gray-800">
            Item ID,Name,Category,Stock Level,Warehouse,Price,SKU<br/>
            INV001,iPhone 15 Pro,Electronics,45,Main Warehouse,999.99,APL-IP15P<br/>
            INV002,Nike Air Force 1,Clothing,125,Fashion Store,89.99,NK-AF1-WHT
          </code>
        </div>
        <button className="mt-3 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200">
          <Download className="w-4 h-4" />
          <span>Download Template</span>
        </button>
      </div>
    </div>
  );

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="profileName" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            id="profileName"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={profileSettings.name}
            onChange={(e) => setProfileSettings(prev => ({ ...prev, name: e.target.value }))}
          />
        </div>

        <div>
          <label htmlFor="profileEmail" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            id="profileEmail"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={profileSettings.email}
            onChange={(e) => setProfileSettings(prev => ({ ...prev, email: e.target.value }))}
          />
        </div>

        <div>
          <label htmlFor="profilePhone" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            id="profilePhone"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={profileSettings.phone}
            onChange={(e) => setProfileSettings(prev => ({ ...prev, phone: e.target.value }))}
          />
        </div>

        {/* --- THIS IS THE CHANGE --- */}
        <div>
          <label htmlFor="profileRole" className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <select
            id="profileRole"
            name="role"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 text-gray-500 cursor-not-allowed"
            value={profileSettings.role}
            disabled // A user typically cannot change their own role.
            onChange={(e) => setProfileSettings(prev => ({ ...prev, role: e.target.value }))}
          >
            <option value="Administrator">Administrator</option>
            <option value="Manager">Manager</option>
            <option value="Staff">Staff</option>
          </select>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-md font-medium text-gray-900 mb-4">Notification Preferences</h4>
        <div className="space-y-4">
          {Object.entries(profileSettings.notifications).map(([key, value]) => (
            <div key={key} className="flex items-center">
              <input
                id={`notification-${key}`}
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={value}
                onChange={(e) => setProfileSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, [key]: e.target.checked }
                }))}
              />
              <label htmlFor={`notification-${key}`} className="ml-2 block text-sm text-gray-700">
                {key === 'lowStock' && 'Low stock alerts'}
                {key === 'newItems' && 'New item notifications'}
                {key === 'reports' && 'Weekly reports'}
                {key === 'systemUpdates' && 'System updates'}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-md font-medium text-gray-900 mb-4">Change Password</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <ToastContainer toasts={toasts} />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="mt-2 text-gray-600">Manage your system configuration and preferences</p>
          </div>
          <button
            onClick={handleSaveSettings}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'organization' && renderOrganizationSettings()}
            {activeTab === 'csv' && renderCSVSettings()}
            {activeTab === 'profile' && renderProfileSettings()}
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;