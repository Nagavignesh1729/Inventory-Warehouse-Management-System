import React from 'react';
import { Package, AlertTriangle, Warehouse, TrendingUp, Plus, Upload, FileText } from 'lucide-react';
import CardMetric from '../components/CardMetric';

const Dashboard = ({ onNavigate, onImport }) => {
  const metrics = [
    {
      title: 'Total Stock Items',
      value: '1,247',
      icon: Package,
      color: 'blue',
      trend: '+12%'
    },
    {
      title: 'Low Stock Items',
      value: '23',
      icon: AlertTriangle,
      color: 'orange',
      trend: '-5%'
    },
    {
      title: 'Total Warehouses',
      value: '8',
      icon: Warehouse,
      color: 'teal',
      trend: '+2'
    },
    {
      title: 'Monthly Revenue',
      value: '$124,890',
      icon: TrendingUp,
      color: 'green',
      trend: '+18%'
    }
  ];

  const recentActivity = [
    { id: 1, action: 'Item Added', item: 'Samsung Galaxy S24', warehouse: 'Main Warehouse', time: '2 hours ago' },
    { id: 2, action: 'Stock Updated', item: 'iPhone 15 Pro', warehouse: 'Electronics Hub', time: '4 hours ago' },
    { id: 3, action: 'Low Stock Alert', item: 'MacBook Air M2', warehouse: 'Tech Center', time: '6 hours ago' },
    { id: 4, action: 'Warehouse Added', item: 'North Branch', warehouse: 'System', time: '1 day ago' },
    { id: 5, action: 'Bulk Import', item: '145 items imported', warehouse: 'Main Warehouse', time: '2 days ago' }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back! Here's an overview of your inventory system.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onNavigate('inventory')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </button>
          <button
            onClick={onImport}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
          >
            <Upload className="w-4 h-4" />
            <span>Import CSV</span>
          </button>
          <button
            onClick={() => onNavigate('reports')}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
          >
            <FileText className="w-4 h-4" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <CardMetric key={index} {...metric} />
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <div>
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.item} • {activity.warehouse}</p>
                  </div>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">In Stock</span>
                <span className="font-semibold text-green-600">1,185 items</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Low Stock</span>
                <span className="font-semibold text-orange-600">23 items</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Out of Stock</span>
                <span className="font-semibold text-red-600">8 items</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Categories</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Electronics</span>
                <span className="font-semibold">425 items</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Clothing</span>
                <span className="font-semibold">312 items</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Books</span>
                <span className="font-semibold">198 items</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Home & Garden</span>
                <span className="font-semibold">156 items</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;