import React, { useState, useEffect } from 'react';
import { Plus, MapPin, Package, TrendingUp, Edit, Trash2, Eye } from 'lucide-react';
import DataTable from '../components/DataTable';
import FilterBar from '../components/FilterBar';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import Badge from '../components/Badge';
import { listWarehouses as apiListWarehouses } from '../api/client';
import { createWarehouse as apiCreateWarehouse } from '../api/client';

const WarehouseList = ({ onWarehouseSelect }) => {
  const [showWarehouseForm, setShowWarehouseForm] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await apiListWarehouses();
        const mapped = (data || []).map((row) => ({
          id: row.warehouse_id || row.id || row.code || String(row.id || row.warehouse_id || ''),
          name: row.name || row.warehouse_name || 'Unnamed',
          location: row.location || [row.city, row.state].filter(Boolean).join(', ') || 'Unknown',
          capacity: typeof row.capacity === 'number' ? `${row.capacity.toLocaleString()} sq ft` : (row.capacity || ''),
          currentStock: row.total_stock ?? row.current_stock ?? 0,
          utilization: row.utilization ?? 0,
          status: row.status || 'Active',
          manager: row.manager || '',
          address: row.address || '',
          phone: row.phone || '',
          email: row.email || '',
        }));
        if (!cancelled) {
          setWarehouses(mapped);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load warehouses');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const columns = [
    { key: 'id', label: 'Warehouse ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { 
      key: 'location', 
      label: 'Location', 
      sortable: true,
      render: (value) => (
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span>{value}</span>
        </div>
      )
    },
    { key: 'capacity', label: 'Capacity', sortable: true },
    { 
      key: 'currentStock', 
      label: 'Current Stock', 
      sortable: true,
      render: (value) => (
        <div className="flex items-center space-x-2">
          <Package className="w-4 h-4 text-blue-500" />
          <span className="font-medium">{value != null ? value.toLocaleString() : '0'} items</span>
        </div>
      )
    },
    { 
      key: 'utilization', 
      label: 'Utilization', 
      sortable: true,
      render: (value) => (
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                value >= 80 ? 'bg-red-500' : value >= 60 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${value}%` }}
            ></div>
          </div>
          <span className="font-medium">{value}%</span>
        </div>
      )
    },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true,
      render: (value) => (
        <Badge 
          text={value} 
          variant={value === 'Active' ? 'green' : value === 'Maintenance' ? 'yellow' : 'red'} 
        />
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => onWarehouseSelect(row.id)}
            className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
            aria-label={`View details for ${row.name}`}
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleEdit(row)}
            className="text-teal-600 hover:text-teal-800 transition-colors duration-200"
            aria-label={`Edit ${row.name}`}
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="text-red-600 hover:text-red-800 transition-colors duration-200"
            aria-label={`Delete ${row.name}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const handleEdit = (warehouse) => {
    setEditingWarehouse(warehouse);
    setShowWarehouseForm(true);
  };

  const handleDelete = (warehouseId) => {
    if (window.confirm('Are you sure you want to delete this warehouse?')) {
      setWarehouses(warehouses.filter(wh => wh.id !== warehouseId));
    }
  };

  const handleSaveWarehouse = async (warehouseData) => {
    try {
    if (editingWarehouse) {
      // update exising record
      const updated = await apiCreateWarehouse(warehouseData);
      setWarehouses(warehouses.map(wh => 
        wh.id === editingWarehouse.id ? { ...wh, ...updated } : wh
      ));
    } else {
      // create new warehouse
      const created = await apiCreateWarehouse(warehouseData);
      setWarehouses([...warehouses, created]);
    }
    setShowWarehouseForm(false);
    setEditingWarehouse(null);
    } catch (err) {
      console.error('Save warehouse error:', err);
      alert('Failed to save warehouse: ' + (err.message || 'Unknown error'));
    }
  };

  const filteredWarehouses = warehouses.filter(warehouse =>
    warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Warehouse Management</h1>
          <p className="mt-2 text-gray-600">Manage your warehouse locations and monitor capacity</p>
        </div>
        <button
          onClick={() => {
            setEditingWarehouse(null);
            setShowWarehouseForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Warehouse</span>
        </button>
      </div>

      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={[]}
      />

      {loading && (
        <div className="text-gray-600">Loading warehouses...</div>
      )}
      {error && (
        <div className="text-red-600">Failed to load warehouses: {error}</div>
      )}

      {filteredWarehouses.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No warehouses found"
          description="Get started by adding your first warehouse location"
          actionLabel="Add New Warehouse"
          onAction={() => setShowWarehouseForm(true)}
        />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
          <DataTable
            columns={columns}
            data={filteredWarehouses}
            searchable={false}
          />
        </div>
      )}

      <Modal
        isOpen={showWarehouseForm}
        onClose={() => {
          setShowWarehouseForm(false);
          setEditingWarehouse(null);
        }}
        title={editingWarehouse ? 'Edit Warehouse' : 'Add New Warehouse'}
        size="lg"
      >
        <WarehouseForm
          warehouse={editingWarehouse}
          onSave={handleSaveWarehouse}
          onCancel={() => {
            setShowWarehouseForm(false);
            setEditingWarehouse(null);
          }}
        />
      </Modal>
    </div>
  );
};

const WarehouseForm = ({ warehouse, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: '',
    manager: '',
    status: 'Active',
    address: '',
    phone: '',
    email: ''
  });

  React.useEffect(() => {
    if (warehouse) {
      setFormData({
        name: warehouse.name || '',
        location: warehouse.location || '',
        capacity: warehouse.capacity || '',
        manager: warehouse.manager || '',
        status: warehouse.status || 'Active',
        address: warehouse.address || '',
        phone: warehouse.phone || '',
        email: warehouse.email || ''
      });
    } else {
      setFormData({
        name: '',
        location: '',
        capacity: '',
        manager: '',
        status: 'Active',
        address: '',
        phone: '',
        email: ''
      });
    }
  }, [warehouse]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Warehouse Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="manager" className="block text-sm font-medium text-gray-700">
            Manager
          </label>
          <input
            type="text"
            id="manager"
            name="manager"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={formData.manager}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location *
          </label>
          <input
            type="text"
            id="location"
            name="location"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={formData.location}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
            Capacity
          </label>
          <input
            type="text"
            id="capacity"
            name="capacity"
            placeholder="e.g., 50,000 sq ft"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={formData.capacity}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Full Address
        </label>
        <textarea
          id="address"
          name="address"
          rows={3}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={formData.address}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          id="status"
          name="status"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="Active">Active</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {warehouse ? 'Update Warehouse' : 'Add Warehouse'}
        </button>
      </div>
    </form>
  );
};

export default WarehouseList;