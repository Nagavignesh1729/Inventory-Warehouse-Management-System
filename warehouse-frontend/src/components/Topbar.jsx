import React, { useState, useEffect, useRef } from 'react';
import { User, LogOut, Bell, Search, Menu } from 'lucide-react';

const Topbar = ({ onLogout, onMenuClick, notifications, onClearNotifications, currentUser }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications && unreadCount > 0) {
      onClearNotifications();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          
          <div className="flex items-center">
            <button onClick={onMenuClick} className="lg:hidden mr-4 text-gray-600"><Menu className="h-6 w-6" /></button>
            <div className="hidden sm:block max-w-lg w-full lg:max-w-xs">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-5 w-5 text-gray-400" /></div>
                <input id="search" name="search" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md" placeholder="Search inventory..." type="search" />
              </div>
            </div>
          </div>
          
          <div className="ml-4 flex items-center space-x-2 sm:space-x-4">
            <div className="relative" ref={notificationRef}>
              <button
                type="button"
                onClick={handleBellClick}
                className="relative bg-white p-2 rounded-full text-gray-400 hover:text-gray-500"
              >
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
                )}
              </button>
              
              {showNotifications && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="p-4 border-b"><h3 className="text-lg font-medium text-gray-900">Notifications</h3></div>
                  <div className="py-1 max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => {
                        const Icon = notification.icon;
                        return (
                          <div key={notification.id} className="flex items-start px-4 py-3 text-sm text-gray-700 hover:bg-gray-100">
                            <Icon className={`w-5 h-5 mt-0.5 mr-3 text-${notification.color}-500`} />
                            <div className="flex-1">
                              <p className="text-gray-800">{notification.text}</p>
                              <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500">No new notifications</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="max-w-xs bg-white flex items-center text-sm rounded-full"
              >
                <div className="bg-blue-600 p-2 rounded-full"><User className="w-5 h-5 text-white" /></div>
                <span className="hidden md:block ml-2 text-gray-700 font-medium">
                  {currentUser ? currentUser.name : 'User'}
                </span>
              </button>

              {showProfileMenu && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <button onClick={onLogout} className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;