import React, { useState } from 'react';
import { BarChart3, Download, TrendingUp, Package, AlertTriangle, DollarSign } from 'lucide-react';
import CSVExporter from '../components/CSVExporter';
import DataTable from '../components/DataTable';

const Reports = () => {
  const [reportType, setReportType] = useState('inventory');
  const [dateRange, setDateRange] = useState('last30days');
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [generatedReport, setGeneratedReport] = useState(null);

  // --- Sample Data for Reports ---
  const inventorySummaryData = [
    { category: 'Electronics', totalItems: 425, inStock: 390, lowStock: 25, outOfStock: 10, value: 150000 },
    { category: 'Clothing', totalItems: 312, inStock: 280, lowStock: 20, outOfStock: 12, value: 45000 },
    { category: 'Books', totalItems: 198, inStock: 190, lowStock: 8, outOfStock: 0, value: 12000 },
  ];

  const lowStockData = [
    { item: 'Samsung Galaxy S24', category: 'Electronics', currentStock: 8, minLevel: 10, warehouse: 'Electronics Hub', status: 'Low Stock' },
    { item: 'Adidas Ultraboost', category: 'Clothing', currentStock: 3, minLevel: 5, warehouse: 'Fashion Store', status: 'Low Stock' },
    { item: 'MacBook Air M2', category: 'Electronics', currentStock: 0, minLevel: 2, warehouse: 'Tech Center', status: 'Out of Stock' },
  ];

  const stockMovementData = [
    { item: 'iPhone 15 Pro', type: 'Sale', quantity: -10, date: '2024-09-15', warehouse: 'Main Warehouse' },
    { item: 'Nike Air Force 1', type: 'Restock', quantity: 50, date: '2024-09-14', warehouse: 'Fashion Store' },
  ];

  // --- Column Definitions for Reports ---
  const reportColumns = {
    inventory: [
      { key: 'category', label: 'Category', sortable: true },
      { key: 'totalItems', label: 'Total Items', sortable: true },
      { key: 'inStock', label: 'In Stock', sortable: true },
    ],
    lowstock: [
      { key: 'item', label: 'Item', sortable: true },
      { key: 'category', label: 'Category', sortable: true },
      { key: 'currentStock', label: 'Current Stock', sortable: true },
      { key: 'warehouse', label: 'Warehouse', sortable: true },
    ],
    movement: [
      { key: 'item', label: 'Item', sortable: true },
      { key: 'type', label: 'Type', sortable: true },
      { key: 'quantity', label: 'Quantity', sortable: true },
      { key: 'date', label: 'Date', sortable: true },
    ],
    valuation: [
      { key: 'category', label: 'Category', sortable: true },
      { key: 'totalItems', label: 'Total Items', sortable: true },
      { key: 'value', label: 'Total Value ($)', sortable: true, render: (value) => value.toLocaleString() },
    ],
  };

  const reportTypes = [
    { id: 'inventory', label: 'Inventory Summary', icon: Package },
    { id: 'lowstock', label: 'Low Stock Report', icon: AlertTriangle },
    { id: 'movement', label: 'Stock Movement', icon: TrendingUp },
    { id: 'valuation', label: 'Inventory Valuation', icon: DollarSign }
  ];

  const generateReport = () => {
    let data;
    switch (reportType) {
      case 'inventory': data = inventorySummaryData; break;
      case 'lowstock': data = lowStockData; break;
      case 'movement': data = stockMovementData; break;
      case 'valuation': data = inventorySummaryData; break;
      default: data = [];
    }
    setGeneratedReport({
      title: reportTypes.find(rt => rt.id === reportType).label,
      data: data,
      columns: reportColumns[reportType],
    });
  };

  const exportReport = (format) => {
    if (format === 'pdf') {
      alert('Exporting as PDF is not yet implemented. Please use CSV export.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="mt-2 text-gray-600">Generate comprehensive reports on your inventory data</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => exportReport('pdf')}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
          <CSVExporter
            data={generatedReport ? generatedReport.data : []}
            columns={generatedReport ? generatedReport.columns : []}
            filename={`${reportType}_report`}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Report Builder</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <div className="space-y-2">
              {reportTypes.map((type) => (
                <label key={type.id} className="flex items-center">
                  <input
                    type="radio"
                    name="reportType"
                    value={type.id}
                    checked={reportType === type.id}
                    onChange={(e) => setReportType(e.target.value)}
                    className="h-4 w-4 text-blue-600"
                  />
                  <type.icon className="w-4 h-4 ml-2 mr-2 text-gray-500" />
                  <span className="text-sm text-gray-700">{type.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              id="dateRange"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="block w-full border-gray-300 rounded-md shadow-sm"
            >
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="lastyear">Last Year</option>
            </select>
          </div>
          <div>
            <label htmlFor="warehouse" className="block text-sm font-medium text-gray-700 mb-2">Warehouse</label>
            <select
              id="warehouse"
              value={selectedWarehouse}
              onChange={(e) => setSelectedWarehouse(e.target.value)}
              className="block w-full border-gray-300 rounded-md shadow-sm"
            >
              <option value="">All Warehouses</option>
              <option value="WH001">Main Warehouse</option>
            </select>
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full border-gray-300 rounded-md shadow-sm"
            >
              <option value="">All Categories</option>
              <option value="Electronics">Electronics</option>
            </select>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={generateReport}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Generate Report
          </button>
        </div>
      </div>

      {generatedReport && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">{generatedReport.title}</h3>
          <div className="overflow-x-auto">
            <DataTable
              columns={generatedReport.columns}
              data={generatedReport.data}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;