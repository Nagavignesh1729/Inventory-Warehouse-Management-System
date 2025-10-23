import React, { useState, useEffect } from 'react';
import { Plus, ArrowRightLeft, AlertTriangle } from 'lucide-react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import TransferFormFixed from './TransferFormFixed';
import { listTransfers, createTransfer, approveTransfer, rejectTransfer, listWarehouses, listInventory } from '../api/client';

const Transfers = ({ addNotification }) => {
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [transfers, setTransfers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserWarehouse, setCurrentUserWarehouse] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [transfersData, warehousesData, itemsData] = await Promise.all([
        listTransfers(),
        listWarehouses(),
        listInventory()
      ]);
      
      console.log('Loaded warehouses:', warehousesData);
      console.log('Loaded items:', itemsData);
      console.log('Loaded transfers:', transfersData);
      
      setTransfers(transfersData || []);
      setWarehouses(warehousesData || []);
      setItems(itemsData || []);
      
      // Set default warehouse to first one
      if (warehousesData && warehousesData.length > 0 && !currentUserWarehouse) {
        setCurrentUserWarehouse(warehousesData[0].name);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error loading transfer data:', err);
      setError(err.message || 'Failed to load transfer data');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTransfer = async (transferData) => {
    try {
      console.log('Transfer data received from form:', transferData);
      
      const created = await createTransfer(transferData);
      
      // Add to local state
      setTransfers([created, ...transfers]);
      setShowTransferForm(false);

      // Find item and warehouse names for notification
      const selectedItem = items.find(item => item.id === transferData.item_id);
      const sourceWarehouse = warehouses.find(wh => wh.id === transferData.source_warehouse_id);
      const destWarehouse = warehouses.find(wh => wh.id === transferData.dest_warehouse_id);

      // Create a new notification
      addNotification({
        icon: AlertTriangle,
        text: `New transfer request for ${transferData.quantity}x "${selectedItem?.name || 'Unknown Item'}" from ${sourceWarehouse?.name || 'Unknown Warehouse'}.`,
        time: 'Just now',
        color: 'orange',
        warehouse: destWarehouse?.name || 'Unknown Warehouse',
      });
    } catch (err) {
      console.error('Error creating transfer:', err);
      alert('Failed to create transfer: ' + (err.message || 'Unknown error'));
    }
  };

  const handleApprove = async (transferId) => {
    try {
      await approveTransfer(transferId);
      setTransfers(transfers.map(t => 
        t.id === transferId ? { ...t, status: 'APPROVED' } : t
      ));
    } catch (err) {
      console.error('Error approving transfer:', err);
      alert('Failed to approve transfer: ' + (err.message || 'Unknown error'));
    }
  };

  const handleReject = async (transferId) => {
    try {
      await rejectTransfer(transferId);
      setTransfers(transfers.map(t => 
        t.id === transferId ? { ...t, status: 'REJECTED' } : t
      ));
    } catch (err) {
      console.error('Error rejecting transfer:', err);
      alert('Failed to reject transfer: ' + (err.message || 'Unknown error'));
    }
  };

  const columns = [
    { key: 'id', label: 'Transfer ID' },
    { key: 'item', label: 'Item Name' },
    { key: 'from', label: 'From Warehouse' },
    { key: 'to', label: 'To Warehouse' },
    { key: 'quantity', label: 'Quantity' },
    {
      key: 'status',
      label: 'Status',
      render: (status) => {
        const variant = status === 'COMPLETED' ? 'green' : 
                      status === 'APPROVED' ? 'blue' :
                      status === 'PENDING' ? 'yellow' : 'red';
        const displayStatus = status === 'PENDING' ? 'Pending Approval' :
                            status === 'APPROVED' ? 'Approved' :
                            status === 'COMPLETED' ? 'Completed' :
                            status === 'REJECTED' ? 'Rejected' :
                            status === 'CANCELLED' ? 'Cancelled' : status;
        return <Badge text={displayStatus} variant={variant} />;
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => {
        const canApprove = row.status === 'PENDING' && row.to === currentUserWarehouse;
        if (canApprove) {
          return (
            <div className="flex space-x-2">
              <button 
                onClick={() => handleApprove(row.id)} 
                className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
              >
                Approve
              </button>
              <button 
                onClick={() => handleReject(row.id)} 
                className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Reject
              </button>
            </div>
          );
        }
        return <span className="text-xs text-gray-500">No actions available</span>;
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Transfers</h1>
          <p className="mt-2 text-gray-600">Initiate and manage stock transfers between warehouses.</p>
        </div>
        <button
          onClick={() => setShowTransferForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Transfer</span>
        </button>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex items-center">
            <div className="flex-shrink-0">
                <ArrowRightLeft className="h-5 w-5 text-yellow-700" />
            </div>
            <div className="ml-3">
                <p className="text-sm text-yellow-700">
                    You are currently viewing transfers as the manager of:
                    <select
                        value={currentUserWarehouse}
                        onChange={(e) => setCurrentUserWarehouse(e.target.value)}
                        className="ml-2 font-bold bg-yellow-100 border-yellow-300 rounded focus:ring-yellow-500"
                    >
                        {warehouses.map(wh => (
                          <option key={wh.id} value={wh.name}>
                            {wh.name}
                          </option>
                        ))}
                    </select>
                </p>
            </div>
        </div>
      </div>

      {loading && (
        <div className="text-gray-600">Loading transfers...</div>
      )}
      {error && (
        <div className="text-red-600">Failed to load transfers: {error}</div>
      )}
      {!loading && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
          <DataTable columns={columns} data={transfers} />
        </div>
      )}

      <Modal isOpen={showTransferForm} onClose={() => setShowTransferForm(false)} title="Initiate New Transfer" size="lg">
        <TransferFormFixed
          onSave={handleSaveTransfer}
          onCancel={() => setShowTransferForm(false)}
          warehouses={warehouses}
          items={items}
        />
      </Modal>
    </div>
  );
};

export default Transfers;