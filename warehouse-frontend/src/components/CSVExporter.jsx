import React, { useState } from 'react';
import { Download, FileText, Settings, Calendar, Filter } from 'lucide-react';

const CSVExporter = ({ 
  data = [], 
  filename = 'export', 
  columns = [],
  onExport,
  showFilters = false,
  className = ''
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [exportOptions, setExportOptions] = useState({
    includeHeaders: true,
    delimiter: ',',
    encoding: 'UTF-8',
    dateFormat: 'MM/DD/YYYY',
    selectedColumns: columns.length > 0 ? columns.map(col => col.key || col) : [],
    filters: {
      dateRange: 'all',
      category: '',
      warehouse: '',
      status: ''
    }
  });

  const defaultColumns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category' },
    { key: 'stockLevel', label: 'Stock Level' },
    { key: 'warehouse', label: 'Warehouse' },
    { key: 'lastUpdated', label: 'Last Updated' },
    { key: 'status', label: 'Status' }
  ];

  const availableColumns = columns.length > 0 ? columns : defaultColumns;

  const formatValue = (value, key) => {
    if (value === null || value === undefined) return '';
    
    // Format dates
    if (key.toLowerCase().includes('date') || key === 'lastUpdated') {
      try {
        const date = new Date(value);
        if (exportOptions.dateFormat === 'MM/DD/YYYY') {
          return date.toLocaleDateString('en-US');
        } else if (exportOptions.dateFormat === 'DD/MM/YYYY') {
          return date.toLocaleDateString('en-GB');
        } else if (exportOptions.dateFormat === 'YYYY-MM-DD') {
          return date.toISOString().split('T')[0];
        }
        return value;
      } catch {
        return value;
      }
    }

    // Format numbers
    if (typeof value === 'number') {
      return value.toString();
    }

    // Escape CSV special characters
    const stringValue = value.toString();
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }

    return stringValue;
  };

  const generateCSV = () => {
    let processedData = [...data];

    // Apply filters if enabled
    if (showFilters) {
      if (exportOptions.filters.category) {
        processedData = processedData.filter(row => row.category === exportOptions.filters.category);
      }
      if (exportOptions.filters.warehouse) {
        processedData = processedData.filter(row => row.warehouse === exportOptions.filters.warehouse);
      }
      if (exportOptions.filters.status) {
        processedData = processedData.filter(row => row.status === exportOptions.filters.status);
      }
    }

    // Get selected columns or all available columns
    const columnsToExport = exportOptions.selectedColumns.length > 0 
      ? availableColumns.filter(col => exportOptions.selectedColumns.includes(col.key || col))
      : availableColumns;

    let csvContent = '';

    // Add headers if enabled
    if (exportOptions.includeHeaders) {
      const headers = columnsToExport.map(col => col.label || col.key || col);
      csvContent += headers.join(exportOptions.delimiter) + '\n';
    }

    // Add data rows
    processedData.forEach(row => {
      const values = columnsToExport.map(col => {
        const key = col.key || col;
        const value = row[key];
        return formatValue(value, key);
      });
      csvContent += values.join(exportOptions.delimiter) + '\n';
    });

    return csvContent;
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const csvContent = generateCSV();
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);

      // Call onExport callback if provided
      if (onExport) {
        onExport({
          filename: link.download,
          rowCount: data.length,
          columnCount: exportOptions.selectedColumns.length || availableColumns.length
        });
      }

    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
      setShowOptions(false);
    }
  };

  const toggleColumnSelection = (columnKey) => {
    setExportOptions(prev => ({
      ...prev,
      selectedColumns: prev.selectedColumns.includes(columnKey)
        ? prev.selectedColumns.filter(col => col !== columnKey)
        : [...prev.selectedColumns, columnKey]
    }));
  };

  const handleOptionChange = (key, value) => {
    if (key.includes('.')) {
      const [parent, child] = key.split('.');
      setExportOptions(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setExportOptions(prev => ({
        ...prev,
        [key]: value
      }));
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex space-x-2">
        {/* Simple Export Button */}
        <button
          onClick={handleExport}
          disabled={isExporting || data.length === 0}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? (
            <>
              <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              Exporting...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </>
          )}
        </button>

        {/* Options Button */}
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Export Options Modal */}
      {showOptions && (
        <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Export Options</h3>
            <p className="text-sm text-gray-600">Customize your CSV export settings</p>
          </div>

          <div className="p-4 space-y-6 max-h-96 overflow-y-auto">
            {/* Basic Options */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Format Options</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    id="includeHeaders"
                    type="checkbox"
                    checked={exportOptions.includeHeaders}
                    onChange={(e) => handleOptionChange('includeHeaders', e.target.checked)}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <label htmlFor="includeHeaders" className="ml-2 text-sm text-gray-700">
                    Include column headers
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Delimiter</label>
                    <select
                      value={exportOptions.delimiter}
                      onChange={(e) => handleOptionChange('delimiter', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-sm"
                    >
                      <option value=",">Comma (,)</option>
                      <option value=";">Semicolon (;)</option>
                      <option value="\t">Tab</option>
                      <option value="|">Pipe (|)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date Format</label>
                    <select
                      value={exportOptions.dateFormat}
                      onChange={(e) => handleOptionChange('dateFormat', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-sm"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Column Selection */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Columns to Export</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded-md p-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exportOptions.selectedColumns.length === availableColumns.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleOptionChange('selectedColumns', availableColumns.map(col => col.key || col));
                      } else {
                        handleOptionChange('selectedColumns', []);
                      }
                    }}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm font-medium text-gray-700">Select All</label>
                </div>
                {availableColumns.map((column) => {
                  const key = column.key || column;
                  const label = column.label || key;
                  return (
                    <div key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={exportOptions.selectedColumns.includes(key)}
                        onChange={() => toggleColumnSelection(key)}
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 text-sm text-gray-700">{label}</label>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Filters */}
            {showFilters && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Filters</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                      value={exportOptions.filters.category}
                      onChange={(e) => handleOptionChange('filters.category', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-sm"
                    >
                      <option value="">All Categories</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Clothing">Clothing</option>
                      <option value="Books">Books</option>
                      <option value="Home & Garden">Home & Garden</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Warehouse</label>
                    <select
                      value={exportOptions.filters.warehouse}
                      onChange={(e) => handleOptionChange('filters.warehouse', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-sm"
                    >
                      <option value="">All Warehouses</option>
                      <option value="Main Warehouse">Main Warehouse</option>
                      <option value="Electronics Hub">Electronics Hub</option>
                      <option value="Tech Center">Tech Center</option>
                      <option value="Fashion Store">Fashion Store</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {data.length} rows • {exportOptions.selectedColumns.length || availableColumns.length} columns
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowOptions(false)}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExport}
                  disabled={isExporting || data.length === 0 || exportOptions.selectedColumns.length === 0}
                  className="px-4 py-2 bg-teal-600 text-white text-sm rounded-md hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isExporting ? 'Exporting...' : 'Export'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {showOptions && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowOptions(false)}
        ></div>
      )}
    </div>
  );
};

export default CSVExporter;