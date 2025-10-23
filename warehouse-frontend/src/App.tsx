import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import InventoryList from './pages/InventoryList';
import WarehouseList from './pages/WarehouseList';
import WarehouseDetail from './pages/WarehouseDetail';
import Transfers from './pages/Transfers';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import Modal from './components/Modal';
import CSVImporter from './components/CSVImporter';
import { restoreSession } from './api/client';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    async function init() {
      const user = await restoreSession();
      if (user) {
        setCurrentUser(user);
        setIsAuthenticated(true);
        setCurrentPage('dashboard');
      }
    }
    init();
  }, []);
  
  const addNotification = (notification: any) => {
    setNotifications(prev => [{ ...notification, id: Date.now(), read: false }, ...prev]);
  };

  const markNotificationsAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleLogin = (user: any) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentPage('login');
  };

  const navigateToWarehouse = (warehouseId: string) => {
    setSelectedWarehouse(warehouseId);
    setCurrentPage('warehouse-detail');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setSidebarOpen(false);
  };

  if (!isAuthenticated) {
    if (currentPage === 'signup') {
      return <Signup onNavigateToLogin={() => setCurrentPage('login')} />;
    }
    return <Login onLogin={handleLogin} onNavigateToSignup={() => setCurrentPage('signup')} />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} onImport={() => setIsImporting(true)} />;
      case 'inventory':
        return <InventoryList onImport={() => setIsImporting(true)} />;
      case 'warehouses':
        return <WarehouseList onWarehouseSelect={navigateToWarehouse} />;
      case 'transfers':
        return <Transfers addNotification={addNotification} />;
      case 'warehouse-detail':
        return <WarehouseDetail warehouseId={selectedWarehouse} onBack={() => setCurrentPage('warehouses')} />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <NotFound />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar currentPage={currentPage} onNavigate={handleNavigate} isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar
          onLogout={handleLogout}
          onMenuClick={() => setSidebarOpen(true)}
          notifications={notifications}
          onClearNotifications={markNotificationsAsRead}
          currentUser={currentUser}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 py-8">{renderCurrentPage()}</div>
        </main>
      </div>
      <Modal isOpen={isImporting} onClose={() => setIsImporting(false)} title="Import CSV" size="xl">
        <CSVImporter onImport={() => {}} onClose={() => setIsImporting(false)} />
      </Modal>
    </div>
  );
}

export default App;
