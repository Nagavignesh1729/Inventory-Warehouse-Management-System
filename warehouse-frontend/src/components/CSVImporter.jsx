import React, { useState, useRef } from 'react';
import { Upload, Download, CheckCircle, AlertTriangle, X, FileText } from 'lucide-react';

const CSVImporter = ({ onImport, onClose, acceptedColumns = [] }) => {
  const [file, setFile] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [columnMapping, setColumnMapping] = useState({});
  const [errors, setErrors] = useState([]);
  const [step, setStep] = useState(1); // 1: Upload, 2: Preview & Map, 3: Results
  const [importResults, setImportResults] = useState(null);
  const fileInputRef = useRef(null);

  const requiredColumns = ['name', 'category', 'stockLevel', 'warehouse'];
  const optionalColumns = ['sku', 'price', 'description', 'minStockLevel'];
  const allColumns = [...requiredColumns, ...optionalColumns, ...acceptedColumns];

  const sampleCSV = `Item ID,Name,Category,Stock Level,Warehouse,Price,SKU,Description,Min Stock Level
INV001,iPhone 15 Pro,Electronics,45,Main Warehouse,999.99,APL-IP15P,"Latest iPhone model with advanced camera",10
INV002,Nike Air Force 1,Clothing,125,Fashion Store,89.99,NK-AF1-WHT,"Classic white sneakers",20
INV003,MacBook Air M2,Electronics,23,Tech Center,1299.99,APL-MBA-M2,"13-inch laptop with M2 chip",5`;

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      parseCSV(selectedFile);
    } else {
      setErrors(['Please select a valid CSV file']);
    }
  };

  const parseCSV = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          setErrors(['CSV file must contain at least a header row and one data row']);
          return;
        }

        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const data = lines.slice(1).map((line, index) => {
          const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
          const row = {};
          headers.forEach((header, i) => {
            row[header] = values[i] || '';
          });
          row._rowIndex = index + 2; // +2 for header and 0-based index
          return row;
        });

        setHeaders(headers);
        setCsvData(data);
        setStep(2);
        setErrors([]);

        // Auto-map columns based on common names
        const mapping = {};
        headers.forEach(header => {
          const normalizedHeader = header.toLowerCase().replace(/\s+/g, '');
          if (normalizedHeader.includes('name')) mapping[header] = 'name';
          else if (normalizedHeader.includes('category')) mapping[header] = 'category';
          else if (normalizedHeader.includes('stock')) mapping[header] = 'stockLevel';
          else if (normalizedHeader.includes('warehouse')) mapping[header] = 'warehouse';
          else if (normalizedHeader.includes('sku')) mapping[header] = 'sku';
          else if (normalizedHeader.includes('price')) mapping[header] = 'price';
          else if (normalizedHeader.includes('description')) mapping[header] = 'description';
          else if (normalizedHeader.includes('min')) mapping[header] = 'minStockLevel';
        });
        setColumnMapping(mapping);

      } catch (error) {
        setErrors(['Error parsing CSV file. Please check the file format.']);
      }
    };
    reader.readAsText(file);
  };

  const handleColumnMappingChange = (csvColumn, systemColumn) => {
    setColumnMapping(prev => ({
      ...prev,
      [csvColumn]: systemColumn
    }));
  };

  const validateAndImport = () => {
    const validationErrors = [];
    const mappedData = [];

    // Check if all required columns are mapped
    const mappedSystemColumns = Object.values(columnMapping);
    const missingRequired = requiredColumns.filter(col => !mappedSystemColumns.includes(col));
    
    if (missingRequired.length > 0) {
      validationErrors.push(`Missing required columns: ${missingRequired.join(', ')}`);
    }

    // Validate data rows
    csvData.forEach((row, index) => {
      const mappedRow = {};
      let hasErrors = false;

      Object.entries(columnMapping).forEach(([csvCol, systemCol]) => {
        if (systemCol) {
          const value = row[csvCol];
          
          // Validate required fields
          if (requiredColumns.includes(systemCol) && (!value || value.trim() === '')) {
            validationErrors.push(`Row ${row._rowIndex}: ${systemCol} is required`);
            hasErrors = true;
          }

          // Validate numeric fields
          if ((systemCol === 'stockLevel' || systemCol === 'price' || systemCol === 'minStockLevel') && value) {
            const numValue = parseFloat(value);
            if (isNaN(numValue) || numValue < 0) {
              validationErrors.push(`Row ${row._rowIndex}: ${systemCol} must be a valid positive number`);
              hasErrors = true;
            } else {
              mappedRow[systemCol] = numValue;
            }
          } else {
            mappedRow[systemCol] = value;
          }
        }
      });

      if (!hasErrors) {
        mappedData.push(mappedRow);
      }
    });

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Import data
    const results = {
      totalRows: csvData.length,
      successfulImports: mappedData.length,
      failedImports: csvData.length - mappedData.length,
      data: mappedData
    };

    setImportResults(results);
    setStep(3);
    
    if (onImport) {
      onImport(mappedData, results);
    }
  };

  const downloadSampleCSV = () => {
    const blob = new Blob([sampleCSV], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory_sample_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const resetImporter = () => {
    setStep(1);
    setFile(null);
    setCsvData([]);
    setHeaders([]);
    setColumnMapping({});
    setErrors([]);
    setImportResults(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-center space-x-8">
        <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            1
          </div>
          <span className="ml-2 text-sm font-medium">Upload CSV</span>
        </div>
        <div className={`w-8 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
        <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            2
          </div>
          <span className="ml-2 text-sm font-medium">Map Columns</span>
        </div>
        <div className={`w-8 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
        <div className={`flex items-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            3
          </div>
          <span className="ml-2 text-sm font-medium">Import Results</span>
        </div>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Import Errors</h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc space-y-1 pl-5">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-6">
          {/* File Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
                id="csv-upload"
              />
              <label
                htmlFor="csv-upload"
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Select CSV File
              </label>
              <p className="mt-2 text-sm text-gray-500">
                Upload a CSV file with your inventory data
              </p>
            </div>
          </div>

          {/* Sample Template */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Need a template?</h4>
                <p className="text-sm text-gray-600">Download our sample CSV template to get started</p>
              </div>
              <button
                onClick={downloadSampleCSV}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Template
              </button>
            </div>
          </div>

          {/* Format Requirements */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">CSV Format Requirements</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Required columns: Name, Category, Stock Level, Warehouse</li>
              <li>• Optional columns: SKU, Price, Description, Min Stock Level</li>
              <li>• Use comma (,) as the delimiter</li>
              <li>• Include headers in the first row</li>
              <li>• Numeric values should not contain letters or special characters</li>
            </ul>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Map Your Columns</h3>
                <p className="mt-1 text-sm text-yellow-700">
                  Match your CSV columns to our system fields. Required fields are marked with *.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {headers.map((header, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    CSV Column: <strong>{header}</strong>
                  </label>
                </div>
                <div className="flex-1">
                  <select
                    value={columnMapping[header] || ''}
                    onChange={(e) => handleColumnMappingChange(header, e.target.value)}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="">Select field...</option>
                    <optgroup label="Required Fields">
                      {requiredColumns.map(col => (
                        <option key={col} value={col}>
                          {col === 'stockLevel' ? 'Stock Level' : 
                           col === 'minStockLevel' ? 'Min Stock Level' : 
                           col.charAt(0).toUpperCase() + col.slice(1)} *
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Optional Fields">
                      {optionalColumns.map(col => (
                        <option key={col} value={col}>
                          {col === 'stockLevel' ? 'Stock Level' : 
                           col === 'minStockLevel' ? 'Min Stock Level' : 
                           col.charAt(0).toUpperCase() + col.slice(1)}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              </div>
            ))}
          </div>

          {/* Preview Data */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Preview Data ({csvData.length} rows)</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {headers.slice(0, 4).map(header => (
                      <th key={header} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        {header}
                      </th>
                    ))}
                    {headers.length > 4 && (
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        +{headers.length - 4} more
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {csvData.slice(0, 3).map((row, index) => (
                    <tr key={index}>
                      {headers.slice(0, 4).map(header => (
                        <td key={header} className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                          {row[header]}
                        </td>
                      ))}
                      {headers.length > 4 && (
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                          ...
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {step === 3 && importResults && (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Import Completed</h3>
                <p className="mt-1 text-sm text-green-700">
                  Your inventory data has been successfully imported.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{importResults.totalRows}</div>
                <div className="text-sm text-gray-600">Total Rows</div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{importResults.successfulImports}</div>
                <div className="text-sm text-gray-600">Successful</div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{importResults.failedImports}</div>
                <div className="text-sm text-gray-600">Failed</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between border-t border-gray-200 pt-6">
        <div>
          {step > 1 && step < 3 && (
            <button
              onClick={resetImporter}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Start Over
            </button>
          )}
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            {step === 3 ? 'Close' : 'Cancel'}
          </button>
          {step === 2 && (
            <button
              onClick={validateAndImport}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Import Data
            </button>
          )}
          {step === 3 && (
            <button
              onClick={resetImporter}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Import More Data
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CSVImporter;