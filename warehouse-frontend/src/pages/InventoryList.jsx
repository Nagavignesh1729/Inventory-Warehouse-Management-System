import React, { useState, useEffect } from 'react';
import { Plus, Download, Upload, Edit, Trash2, Package } from 'lucide-react';
import DataTable from '../components/DataTable';
import FilterBar from '../components/FilterBar';
import Modal from '../components/Modal';
import ItemForm from './ItemForm';
import EmptyState from '../components/EmptyState';
import Badge from '../components/Badge';
import CSVExporter from '../components/CSVExporter';
import { listInventory, createItem, updateItem, deleteItem } from '../api/client';

const InventoryList = ({ onImport }) => {
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('');

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await listInventory();
        const mapped = (data || []).map((row) => ({
          id: row.item_id || String(Date.now()),
          name: row.name || 'Unnamed Item',
          category: row.category || 'Uncategorized',
          stockLevel: row.stock_level ?? 0,
          warehouse: row.warehouse_name || 'Unknown',
          lastUpdated: row.updated_at ? new Date(row.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          status: row.stock_level > row.reorder_level ? 'In Stock' : row.stock_level > 0 ? 'Low Stock' : 'Out of Stock',
          description: row.description || '',
          sku: row.sku || '',
          reorderLevel: row.reorder_level || 0,
          isActive: row.is_active ?? true,
        }));
        if (!cancelled) {
          setItems(mapped);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load inventory');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

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

  const handleDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteItem(itemId);
        setItems(items.filter(item => item.id !== itemId));
      } catch (err) {
        console.error('Delete item error:', err);
        alert('Failed to delete item: ' + (err.message || 'Unknown error'));
      }
    }
  };

  const handleSaveItem = async (itemData) => {
    try {
      if (editingItem) {
        const updated = await updateItem(editingItem.id, itemData);
        setItems(items.map(item => 
          item.id === editingItem.id 
            ? { 
                ...item, 
                ...itemData, 
                lastUpdated: new Date().toISOString().split('T')[0],
                status: itemData.stockLevel > 20 ? 'In Stock' : itemData.stockLevel > 0 ? 'Low Stock' : 'Out of Stock'
              } 
            : item
        ));
      } else {
        const created = await createItem(itemData);
        const newItem = {
          id: created.item_id || String(Date.now()),
          name: created.name || itemData.name,
          category: created.category || itemData.category,
          stockLevel: created.stock_level ?? itemData.stockLevel ?? 0,
          warehouse: created.warehouse_name || itemData.warehouse,
          lastUpdated: new Date().toISOString().split('T')[0],
          status: (created.stock_level ?? itemData.stockLevel ?? 0) > (created.reorder_level || 0) ? 'In Stock' : 
                  (created.stock_level ?? itemData.stockLevel ?? 0) > 0 ? 'Low Stock' : 'Out of Stock',
          description: created.description || itemData.description || '',
          sku: created.sku || itemData.sku || '',
          reorderLevel: created.reorder_level || itemData.reorderLevel || 0,
          isActive: created.is_active ?? true,
        };
        setItems([...items, newItem]);
      }
      setShowItemForm(false);
      setEditingItem(null);
    } catch (err) {
      console.error('Save item error:', err);
      alert('Failed to save item: ' + (err.message || 'Unknown error'));
    }
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

      {loading && (
        <div className="text-gray-600">Loading inventory...</div>
      )}
      {error && (
        <div className="text-red-600">Failed to load inventory: {error}</div>
      )}

      {!loading && filteredItems.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No inventory items found"
          description="Get started by adding your first inventory item or importing from CSV"
          actionLabel="Add New Item"
          onAction={() => setShowItemForm(true)}
        />
      ) : !loading && (
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