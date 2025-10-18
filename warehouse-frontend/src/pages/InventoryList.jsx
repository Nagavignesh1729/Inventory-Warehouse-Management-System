import React, { useState } from 'react';
import { Plus, Download, Upload, Edit, Trash2, Package } from 'lucide-react';
import DataTable from '../components/DataTable';
import FilterBar from '../components/FilterBar';
import Modal from '../components/Modal';
import ItemForm from './ItemForm';
import EmptyState from '../components/EmptyState';
import Badge from '../components/Badge';
import CSVExporter from '../components/CSVExporter';

const InventoryList = ({ onImport }) => {
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('');

  const sampleItems = [
    { id: 'INV001', name: 'iPhone 15 Pro', category: 'Electronics', stockLevel: 45, warehouse: 'Main Warehouse', lastUpdated: '2025-01-15', status: 'In Stock' },
    { id: 'INV002', name: 'Samsung Galaxy S24', category: 'Electronics', stockLevel: 8, warehouse: 'Electronics Hub', lastUpdated: '2025-01-14', status: 'Low Stock' },
    { id: 'INV003', name: 'MacBook Air M2', category: 'Electronics', stockLevel: 0, warehouse: 'Tech Center', lastUpdated: '2025-01-13', status: 'Out of Stock' },
    { id: 'INV004', name: 'Nike Air Force 1', category: 'Clothing', stockLevel: 125, warehouse: 'Fashion Store', lastUpdated: '2025-01-12', status: 'In Stock' },
    { id: 'INV005', name: 'The Great Gatsby', category: 'Books', stockLevel: 67, warehouse: 'Book Depot', lastUpdated: '2025-01-11', status: 'In Stock' }
  ];

  const [items, setItems] = useState(sampleItems);

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
    { key: 'warehouse', label: 'Warehouse', sortable: true },
    { key: 'lastUpdated', label: 'Last Updated', sortable: true },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(row)}
            className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
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

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowItemForm(true);
  };

  const handleDelete = (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setItems(items.filter(item => item.id !== itemId));
    }
  };

  const handleSaveItem = (itemData) => {
    if (editingItem) {
      // ** THIS IS THE FIX **
      // We now merge the existing item data with the new form data 
      // AND add the current date for 'lastUpdated'.
      setItems(items.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...itemData, lastUpdated: new Date().toISOString().split('T')[0] } 
          : item
      ));
    } else {
      const newItem = {
        ...itemData,
        id: `INV${String(items.length + 1).padStart(3, '0')}`,
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      setItems([...items, newItem]);
    }
    setShowItemForm(false);
    setEditingItem(null);
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || item.category === categoryFilter;
    const matchesWarehouse = !warehouseFilter || item.warehouse === warehouseFilter;
    
    return matchesSearch && matchesCategory && matchesWarehouse;
  });

  const filterOptions = {
    categories: [...new Set(items.map(item => item.category))],
    warehouses: [...new Set(items.map(item => item.warehouse))]
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="mt-2 text-gray-600">Manage your inventory items across all warehouses</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onImport}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
          >
            <Upload className="w-4 h-4" />
            <span>Import CSV</span>
          </button>
          <CSVExporter
            data={filteredItems}
            filename="inventory"
            columns={columns.filter(c => c.key !== 'actions')}
          />
          <button
            onClick={() => {
              setEditingItem(null);
              setShowItemForm(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={[
          {
            label: 'Category',
            value: categoryFilter,
            onChange: setCategoryFilter,
            options: filterOptions.categories
          },
          {
            label: 'Warehouse',
            value: warehouseFilter,
            onChange: setWarehouseFilter,
            options: filterOptions.warehouses
          }
        ]}
      />

      {filteredItems.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No inventory items found"
          description="Get started by adding your first inventory item or importing from CSV"
          actionLabel="Add New Item"
          onAction={() => setShowItemForm(true)}
        />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
          <DataTable
            columns={columns}
            data={filteredItems}
            searchable={false}
          />
        </div>
      )}

      <Modal
        isOpen={showItemForm}
        onClose={() => {
          setShowItemForm(false);
          setEditingItem(null);
        }}
        title={editingItem ? 'Edit Item' : 'Add New Item'}
      >
        <ItemForm
          item={editingItem}
          onSave={handleSaveItem}
          onCancel={() => {
            setShowItemForm(false);
            setEditingItem(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default InventoryList;