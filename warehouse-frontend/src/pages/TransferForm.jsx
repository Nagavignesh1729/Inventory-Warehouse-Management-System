import React, { useState } from 'react';

const TransferForm = ({ onSave, onCancel, warehouses }) => {
  const [formData, setFormData] = useState({
    item: '',
    quantity: 1,
    from: warehouses[0] || '',
    to: warehouses[1] || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.from === formData.to) {
        alert("Source and destination warehouses cannot be the same.");
        return;
    }
    onSave(formData);
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
        <label htmlFor="item" className="block text-sm font-medium text-gray-700">
          Item Name *
        </label>
        <input
          type="text"
          id="item"
          name="item"
          required
          placeholder="e.g., iPhone 15 Pro"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={formData.item}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="from" className="block text-sm font-medium text-gray-700">
            From Warehouse *
          </label>
          <select
            id="from"
            name="from"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={formData.from}
            onChange={handleChange}
          >
            {warehouses.map(wh => <option key={wh} value={wh}>{wh}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="to" className="block text-sm font-medium text-gray-700">
            To Warehouse *
          </label>
          <select
            id="to"
            name="to"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={formData.to}
            onChange={handleChange}
          >
            {warehouses.map(wh => <option key={wh} value={wh}>{wh}</option>)}
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