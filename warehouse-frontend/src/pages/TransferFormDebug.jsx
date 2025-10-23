import React, { useState, useEffect } from 'react';

const TransferFormDebug = ({ onSave, onCancel, warehouses, items }) => {
  const [formData, setFormData] = useState({
    item_id: '',
    quantity: 1,
    source_warehouse_id: '',
    dest_warehouse_id: '',
    reason: '',
  });

  const [selectedItem, setSelectedItem] = useState(null);
  const [sourceWarehouse, setSourceWarehouse] = useState(null);
  const [destWarehouse, setDestWarehouse] = useState(null);

  // Debug logging
  useEffect(() => {
    console.log('=== TRANSFER FORM DEBUG ===');
    console.log('Warehouses prop:', warehouses);
    console.log('Items prop:', items);
    console.log('Warehouses length:', warehouses?.length);
    console.log('Items length:', items?.length);
    
    if (warehouses?.length > 0) {
      console.log('First warehouse structure:', Object.keys(warehouses[0]));
      console.log('First warehouse:', warehouses[0]);
    }
    
    if (items?.length > 0) {
      console.log('First item structure:', Object.keys(items[0]));
      console.log('First item:', items[0]);
    }
  }, [warehouses, items]);

  // Update selected objects when form data changes
  useEffect(() => {
    if (formData.item_id) {
      const item = items.find(item => item.id === formData.item_id);
      setSelectedItem(item);
      console.log('Selected item:', item);
      console.log('Looking for item_id:', formData.item_id);
      console.log('Available items:', items.map(i => ({ id: i.id, name: i.name })));
    }
  }, [formData.item_id, items]);

  useEffect(() => {
    if (formData.source_warehouse_id) {
      const warehouse = warehouses.find(wh => wh.id === formData.source_warehouse_id);
      setSourceWarehouse(warehouse);
      console.log('Selected source warehouse:', warehouse);
      console.log('Looking for source_warehouse_id:', formData.source_warehouse_id);
      console.log('Available warehouses:', warehouses.map(w => ({ id: w.id, name: w.name })));
    }
  }, [formData.source_warehouse_id, warehouses]);

  useEffect(() => {
    if (formData.dest_warehouse_id) {
      const warehouse = warehouses.find(wh => wh.id === formData.dest_warehouse_id);
      setDestWarehouse(warehouse);
      console.log('Selected dest warehouse:', warehouse);
    }
  }, [formData.dest_warehouse_id, warehouses]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('=== TRANSFER FORM SUBMISSION ===');
    console.log('Form data:', formData);
    console.log('Selected item:', selectedItem);
    console.log('Source warehouse:', sourceWarehouse);
    console.log('Dest warehouse:', destWarehouse);
    
    if (formData.source_warehouse_id === formData.dest_warehouse_id) {
        alert("Source and destination warehouses cannot be the same.");
        return;
    }
    
    if (!formData.item_id || !formData.source_warehouse_id || !formData.dest_warehouse_id) {
        alert("Please fill in all required fields.");
        console.log('Missing fields:', {
          item_id: !formData.item_id,
          source_warehouse_id: !formData.source_warehouse_id,
          dest_warehouse_id: !formData.dest_warehouse_id
        });
        return;
    }
    
    // Prepare data for backend - ONLY send what backend expects
    const backendData = {
      item_id: formData.item_id,
      source_warehouse_id: formData.source_warehouse_id,
      dest_warehouse_id: formData.dest_warehouse_id,
      quantity: parseInt(formData.quantity),
      reason: formData.reason || null
    };
    
    console.log('Backend data (what gets sent to API):', backendData);
    
    onSave(backendData);
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const newValue = type === 'number' ? parseInt(value, 10) || 0 : value;
    
    console.log(`Form field changed: ${name} = ${newValue}`);
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-red-50 p-4 rounded-lg">
        <h4 className="font-medium text-red-900">DEBUG MODE - Check Console</h4>
        <p className="text-sm text-red-700">Warehouses loaded: {warehouses?.length || 0}</p>
        <p className="text-sm text-red-700">Items loaded: {items?.length || 0}</p>
        <p className="text-sm text-red-700">Selected item ID: {formData.item_id}</p>
        <p className="text-sm text-red-700">Source warehouse ID: {formData.source_warehouse_id}</p>
        <p className="text-sm text-red-700">Dest warehouse ID: {formData.dest_warehouse_id}</p>
        <p className="text-sm text-red-700">Form valid: {formData.item_id && formData.source_warehouse_id && formData.dest_warehouse_id ? 'YES' : 'NO'}</p>
      </div>
      
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
            {items?.map(item => (
              <option key={item.id} value={item.id}>
                {item.name} (Stock: {item.stockLevel || 0}) [ID: {item.id?.substring(0, 8)}...]
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
              {warehouses?.map(wh => (
                <option key={wh.id} value={wh.id}>
                  {wh.name} [ID: {wh.id?.substring(0, 8)}...]
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
              {warehouses?.map(wh => (
                <option key={wh.id} value={wh.id}>
                  {wh.name} [ID: {wh.id?.substring(0, 8)}...]
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
            Initiate Transfer (DEBUG)
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransferFormDebug;