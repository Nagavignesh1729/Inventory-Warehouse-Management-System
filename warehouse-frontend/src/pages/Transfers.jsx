import React, { useState } from 'react';
import { Plus, ArrowRightLeft, AlertTriangle } from 'lucide-react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import TransferForm from './TransferForm';

const Transfers = ({ addNotification }) => {
  const [showTransferForm, setShowTransferForm] = useState(false);
  
  const initialTransfers = [
    { id: 'TRN001', item: 'iPhone 15 Pro', from: 'Main Warehouse', to: 'Electronics Hub', quantity: 10, status: 'Pending Approval', initiatedBy: 'Main Warehouse' },
    { id: 'TRN002', item: 'Nike Air Force 1', from: 'Fashion Store', to: 'Main Warehouse', quantity: 50, status: 'Completed', initiatedBy: 'Fashion Store' },
  ];
  const [transfers, setTransfers] = useState(initialTransfers);
  
  const [currentUserWarehouse, setCurrentUserWarehouse] = useState('Electronics Hub');
  const warehouses = ['Main Warehouse', 'Electronics Hub', 'Tech Center', 'Fashion Store'];

  const handleSaveTransfer = (transferData) => {
    const newTransfer = {
      ...transferData,
      id: `TRN${String(transfers.length + 1).padStart(3, '0')}`,
      status: 'Pending Approval',
      initiatedBy: transferData.from,
    };
    setTransfers([newTransfer, ...transfers]);
    setShowTransferForm(false);

    // Create a new notification
    addNotification({
      icon: AlertTriangle,
      text: `New transfer request for ${transferData.quantity}x "${transferData.item}" from ${transferData.from}.`,
      time: 'Just now',
      color: 'orange',
      warehouse: transferData.to, // To notify the correct warehouse manager
    });
  };

  const handleApprove = (transferId) => {
    setTransfers(transfers.map(t => t.id === transferId ? { ...t, status: 'Completed' } : t));
  };

  const handleReject = (transferId) => {
    setTransfers(transfers.map(t => t.id === transferId ? { ...t, status: 'Rejected' } : t));
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
        const variant = status === 'Completed' ? 'green' : status === 'Pending Approval' ? 'yellow' : 'red';
        return <Badge text={status} variant={variant} />;
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => {
        const canApprove = row.status === 'Pending Approval' && row.to === currentUserWarehouse;
        if (canApprove) {
          return (
            <div className="flex space-x-2">
              <button onClick={() => handleApprove(row.id)} className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">Approve</button>
              <button onClick={() => handleReject(row.id)} className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Reject</button>
            </div>
          );
        }
        return null;
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
                        {warehouses.map(wh => <option key={wh} value={wh}>{wh}</option>)}
                    </select>
                </p>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <DataTable columns={columns} data={transfers} />
      </div>

      <Modal isOpen={showTransferForm} onClose={() => setShowTransferForm(false)} title="Initiate New Transfer" size="lg">
        <TransferForm
          onSave={handleSaveTransfer}
          onCancel={() => setShowTransferForm(false)}
          warehouses={warehouses}
        />
      </Modal>
    </div>
  );
};

export default Transfers;