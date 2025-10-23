import React, { useState } from 'react';

const TransferForm = ({ onSave, onCancel, warehouses, items }) => {
  const [formData, setFormData] = useState({
    item_id: '',
    quantity: 1,
    source_warehouse_id: '',
    dest_warehouse_id: '',
    reason: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.source_warehouse_id === formData.dest_warehouse_id) {
        alert("Source and destination warehouses cannot be the same.");
        return;
    }
    
    // Find item and warehouse names for display
    const selectedItem = items.find(item => item.id === formData.item_id);
    const sourceWarehouse = warehouses.find(wh => wh.id === formData.source_warehouse_id);
    const destWarehouse = warehouses.find(wh => wh.id === formData.dest_warehouse_id);
    
    console.log('Form data before submit:', formData);
    console.log('Selected item:', selectedItem);
    console.log('Source warehouse:', sourceWarehouse);
    console.log('Dest warehouse:', destWarehouse);
    
    const transferData = {
      ...formData,
      // Add display names for frontend
      item: selectedItem?.name || 'Unknown Item',
      from: sourceWarehouse?.name || 'Unknown Warehouse',
      to: destWarehouse?.name || 'Unknown Warehouse',
    };
    
    console.log('Final transfer data being sent:', transferData);
    onSave(transferData);
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value, 10) : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="item_id" className="block text-sm font-medium text-gray-700">
          Item *
        </label>
        <select
          id="item_id"
          name="item_id"
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={formData.item_id}
          onChange={handleChange}
        >
          <option value="">Select an item</option>
          {items.map(item => (
            <option key={item.id} value={item.id}>
              {item.name} (Stock: {item.stockLevel || 0})
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="source_warehouse_id" className="block text-sm font-medium text-gray-700">
            From Warehouse *
          </label>
          <select
            id="source_warehouse_id"
            name="source_warehouse_id"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={formData.source_warehouse_id}
            onChange={handleChange}
          >
            <option value="">Select source warehouse</option>
            {warehouses.map(wh => (
              <option key={wh.id} value={wh.id}>
                {wh.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="dest_warehouse_id" className="block text-sm font-medium text-gray-700">
            To Warehouse *
          </label>
          <select
            id="dest_warehouse_id"
            name="dest_warehouse_id"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={formData.dest_warehouse_id}
            onChange={handleChange}
          >
            <option value="">Select destination warehouse</option>
            {warehouses.map(wh => (
              <option key={wh.id} value={wh.id}>
                {wh.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div>
        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
          Quantity *
        </label>
        <input
          type="number"
          id="quantity"
          name="quantity"
          required
          min="1"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={formData.quantity}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
          Reason (Optional)
        </label>
        <textarea
          id="reason"
          name="reason"
          rows={3}
          placeholder="Reason for transfer..."
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={formData.reason}
          onChange={handleChange}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Initiate Transfer
        </button>
      </div>
    </form>
  );
};

export default TransferForm;