import React, { useState, useEffect } from 'react';
import { listCategories, listWarehouses } from '../api/client';

const ItemForm = ({ item, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    stockLevel: 0,
    warehouse: '',
    description: '',
    sku: '',
    price: 0,
    minStockLevel: 0
  });

  const [categories, setCategories] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load categories and warehouses
    const loadData = async () => {
      try {
        const [categoriesData, warehousesData] = await Promise.all([
          listCategories(),
          listWarehouses()
        ]);
        
        setCategories(categoriesData || []);
        setWarehouses(warehousesData || []);
      } catch (err) {
        console.error('Error loading form data:', err);
        // Set default categories if API fails
        setCategories([
          { category_id: 'default-1', name: 'Electronics' },
          { category_id: 'default-2', name: 'Clothing' },
          { category_id: 'default-3', name: 'Books' },
          { category_id: 'default-4', name: 'Home & Garden' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        category: item.category || '',
        stockLevel: item.stockLevel || 0,
        warehouse: item.warehouse || '',
        description: item.description || '',
        sku: item.sku || '',
        price: item.price || 0,
        minStockLevel: item.minStockLevel || item.reorderLevel || 0
      });
    }
  }, [item]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Find the selected warehouse ID
    const selectedWarehouse = warehouses.find(w => w.name === formData.warehouse);
    const warehouse_id = selectedWarehouse?.id || selectedWarehouse?.warehouse_id;
    
    // Prepare data for backend
    const itemData = {
      name: formData.name,
      category: formData.category, // This will be converted to category_id in backend
      stockLevel: formData.stockLevel,
      warehouse_id: warehouse_id,
      description: formData.description,
      sku: formData.sku,
      minStockLevel: formData.minStockLevel
    };

    onSave(itemData);
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Item Name *
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
          <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
            SKU
          </label>
          <input
            type="text"
            id="sku"
            name="sku"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={formData.sku}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category *
          </label>
          <select
            id="category"
            name="category"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={formData.category}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.category_id || category.name} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="warehouse" className="block text-sm font-medium text-gray-700">
            Warehouse *
          </label>
          <select
            id="warehouse"
            name="warehouse"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={formData.warehouse}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="">Select a warehouse</option>
            {warehouses.map((warehouse) => (
              <option key={warehouse.id || warehouse.warehouse_id} value={warehouse.name}>
                {warehouse.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="stockLevel" className="block text-sm font-medium text-gray-700">
            Current Stock Level *
          </label>
          <input
            type="number"
            id="stockLevel"
            name="stockLevel"
            required
            min="0"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={formData.stockLevel}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="minStockLevel" className="block text-sm font-medium text-gray-700">
            Minimum Stock Level
          </label>
          <input
            type="number"
            id="minStockLevel"
            name="minStockLevel"
            min="0"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={formData.minStockLevel}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Unit Price ($)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            min="0"
            step="0.01"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={formData.price}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={formData.description}
          onChange={handleChange}
        />
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
          {item ? 'Update Item' : 'Add Item'}
        </button>
      </div>
    </form>
  );
};

export default ItemForm;