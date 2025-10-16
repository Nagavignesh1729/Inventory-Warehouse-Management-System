import React, { useState } from 'react';
import { ArrowLeft, Package, AlertTriangle, TrendingUp, MapPin, User, Phone, Mail } from 'lucide-react';
import DataTable from '../components/DataTable';
import FilterBar from '../components/FilterBar';
import Badge from '../components/Badge';

// --- Sample Data (In a real app, this would come from a database/API) ---

const allWarehouses = {
  'WH001': {
    id: 'WH001', name: 'Main Warehouse', location: 'New York, NY', capacity: '50,000 sq ft', currentStock: 1247, utilization: 85, status: 'Active', manager: 'John Smith', address: '123 Industrial Blvd, Queens, NY 11101', phone: '(555) 123-4567', email: 'john.smith@company.com'
  },
  'WH002': {
    id: 'WH002', name: 'Electronics Hub', location: 'Los Angeles, CA', capacity: '30,000 sq ft', currentStock: 892, utilization: 72, status: 'Active', manager: 'Sarah Johnson', address: '456 Tech Ave, Los Angeles, CA 90001', phone: '(555) 234-5678', email: 'sarah.j@company.com'
  },
  'WH003': {
    id: 'WH003', name: 'Tech Center', location: 'Austin, TX', capacity: '25,000 sq ft', currentStock: 456, utilization: 45, status: 'Active', manager: 'Mike Davis', address: '789 Silicon Hills, Austin, TX 73301', phone: '(555) 345-6789', email: 'mike.d@company.com'
  },
  'WH004': {
    id: 'WH004', name: 'Fashion Store', location: 'Miami, FL', capacity: '20,000 sq ft', currentStock: 678, utilization: 68, status: 'Maintenance', manager: 'Emma Wilson', address: '101 Style St, Miami, FL 33101', phone: '(555) 456-7890', email: 'emma.w@company.com'
  },
  'WH005': {
    id: 'WH005', name: 'Book Depot', location: 'Chicago, IL', capacity: '15,000 sq ft', currentStock: 234, utilization: 32, status: 'Active', manager: 'David Brown', address: '212 Page Turner Ave, Chicago, IL 60290', phone: '(555) 567-8901', email: 'david.b@company.com'
  }
};

const warehouseItemsData = {
  'WH001': [
    { id: 'INV001', name: 'iPhone 15 Pro', category: 'Electronics', stockLevel: 45, lastUpdated: '2024-01-15', status: 'In Stock', aisle: 'A1', shelf: '3B' },
  ],
  'WH002': [
    { id: 'INV006', name: 'Dell XPS 13', category: 'Electronics', stockLevel: 23, lastUpdated: '2024-01-10', status: 'In Stock', aisle: 'A1', shelf: '2C' },
    { id: 'INV008', name: 'Sony WH-1000XM4', category: 'Electronics', stockLevel: 67, lastUpdated: '2024-01-08', status: 'In Stock', aisle: 'A2', shelf: '1B' }
  ],
  'WH004': [
     { id: 'INV004', name: 'Nike Air Force 1', category: 'Clothing', stockLevel: 125, lastUpdated: '2024-01-12', status: 'In Stock', aisle: 'B2', shelf: '1A' },
     { id: 'INV007', name: 'Adidas Ultraboost', category: 'Clothing', stockLevel: 8, lastUpdated: '2024-01-09', status: 'Low Stock', aisle: 'B2', shelf: '4A' },
  ]
};


const WarehouseDetail = ({ warehouseId, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // ** THE FIX IS HERE **
  // Find the correct warehouse from the sample data using the warehouseId prop
  const warehouse = allWarehouses[warehouseId];
  const warehouseItems = warehouseItemsData[warehouseId] || [];

  // Handle case where warehouse is not found
  if (!warehouse) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-red-600">Warehouse Not Found</h1>
        <p className="text-gray-600 mt-2">The warehouse with ID "{warehouseId}" could not be found.</p>
        <button
            onClick={onBack}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Go Back
        </button>
      </div>
    );
  }

  const columns = [
    { key: 'id', label: 'Item ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { 
      key: 'stockLevel', 
      label: 'Stock Level', 
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center space-x-2">
          <span className="font-medium">{value}</span>
          <Badge 
            text={row.status} 
            variant={row.status === 'In Stock' ? 'green' : row.status === 'Low Stock' ? 'yellow' : 'red'} 
          />
        </div>
      )
    },
    { 
      key: 'location', 
      label: 'Location', 
      render: (_, row) => `${row.aisle}-${row.shelf}`
    },
    { key: 'lastUpdated', label: 'Last Updated', sortable: true }
  ];

  const filteredItems = warehouseItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || item.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const filterOptions = {
    categories: [...new Set(warehouseItems.map(item => item.category))]
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
            aria-label="Go back to warehouses"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{warehouse.name}</h1>
            <div className="flex items-center mt-2 text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{warehouse.location}</span>
              <Badge text={warehouse.status} variant="green" size="sm" className="ml-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Warehouse Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{warehouse.currentStock.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
              <p className="text-2xl font-bold text-gray-900">
                {warehouseItems.filter(item => item.status === 'Low Stock').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-teal-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-teal-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Capacity</p>
              <p className="text-lg font-bold text-gray-900">{warehouse.capacity}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Utilization</p>
              <p className="text-2xl font-bold text-gray-900">{warehouse.utilization}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Warehouse Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Warehouse Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Address</p>
                <p className="text-gray-900">{warehouse.address}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Capacity</p>
                <p className="text-gray-900">{warehouse.capacity}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Current Stock</p>
                <p className="text-gray-900">{warehouse.currentStock.toLocaleString()} items</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Utilization</p>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 bg-blue-500 rounded-full" 
                      style={{ width: `${warehouse.utilization}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{warehouse.utilization}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Manager Information</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Manager</p>
                <p className="text-gray-900">{warehouse.manager}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-full">
                <Phone className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Phone</p>
                <p className="text-gray-900">{warehouse.phone}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-full">
                <Mail className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Email</p>
                <p className="text-gray-900">{warehouse.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Items in Warehouse */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Items in Warehouse</h2>
        
        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filters={[
            {
              label: 'Category',
              value: categoryFilter,
              onChange: setCategoryFilter,
              options: filterOptions.categories
            }
          ]}
        />

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
          <DataTable
            columns={columns}
            data={filteredItems}
            searchable={false}
          />
        </div>
      </div>
    </div>
  );
};

export default WarehouseDetail;