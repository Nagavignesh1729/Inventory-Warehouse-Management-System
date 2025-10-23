import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, Warehouse, TrendingUp, Plus, Upload, FileText } from 'lucide-react';
import CardMetric from '../components/CardMetric';
import { getDashboardStats, getInventorySummary } from '../api/client';

const Dashboard = ({ onNavigate, onImport }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [inventoryData, setInventoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [stats, inventory] = await Promise.all([
          getDashboardStats(),
          getInventorySummary()
        ]);
        
        if (!cancelled) {
          setDashboardData(stats);
          setInventoryData(inventory);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load dashboard data');
          // Fallback to default data
          setDashboardData({
            totalStockItems: 0,
            lowStockItems: 0,
            totalWarehouses: 0,
            monthlyRevenue: 0
          });
          setInventoryData({
            stockSummary: { inStock: 0, lowStock: 0, outOfStock: 0 },
            categoryBreakdown: [],
            recentActivity: []
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const metrics = dashboardData ? [
    {
      title: 'Total Stock Items',
      value: dashboardData.totalStockItems?.toLocaleString() || '0',
      icon: Package,
      color: 'blue',
      trend: '+12%'
    },
    {
      title: 'Low Stock Items',
      value: dashboardData.lowStockItems?.toString() || '0',
      icon: AlertTriangle,
      color: 'orange',
      trend: '-5%'
    },
    {
      title: 'Total Warehouses',
      value: dashboardData.totalWarehouses?.toString() || '0',
      icon: Warehouse,
      color: 'teal',
      trend: '+2'
    },
    {
      title: 'Monthly Revenue',
      value: `$${dashboardData.monthlyRevenue?.toLocaleString() || '0'}`,
      icon: TrendingUp,
      color: 'green',
      trend: '+18%'
    }
  ] : [];

  // Use real data or fallback to sample data
  const recentActivity = inventoryData?.recentActivity?.length > 0 ? inventoryData.recentActivity : [
    { id: 1, action: 'No recent activity', item: 'Start adding items to see activity', warehouse: 'System', time: 'N/A' }
  ];

  const stockSummary = inventoryData?.stockSummary || { inStock: 0, lowStock: 0, outOfStock: 0 };
  const categoryBreakdown = inventoryData?.categoryBreakdown || [];

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
      {loading && (
        <div className="text-gray-600">Loading dashboard data...</div>
      )}
      {error && (
        <div className="text-red-600">Failed to load dashboard: {error}</div>
      )}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <CardMetric key={index} {...metric} />
          ))}
        </div>
      )}

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
                <span className="font-semibold text-green-600">{stockSummary.inStock} items</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Low Stock</span>
                <span className="font-semibold text-orange-600">{stockSummary.lowStock} items</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Out of Stock</span>
                <span className="font-semibold text-red-600">{stockSummary.outOfStock} items</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Categories</h3>
            <div className="space-y-3">
              {categoryBreakdown.length > 0 ? (
                categoryBreakdown.map((category, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-600">{category.name}</span>
                    <span className="font-semibold">{category.count} items</span>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-sm">No categories with stock yet</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;