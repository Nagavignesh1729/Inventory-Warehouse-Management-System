import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

const ToastPlaceholder = ({ type = 'info', title, message, onClose }) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  const iconColors = {
    success: 'text-green-400',
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400'
  };

  const Icon = icons[type];

  return (
    <div className={`max-w-sm w-full ${colors[type]} shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden`}>
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className={`h-6 w-6 ${iconColors[type]}`} />
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium">{title}</p>
            {message && (
              <p className="mt-1 text-sm opacity-75">{message}</p>
            )}
          </div>
          {onClose && (
            <div className="ml-4 flex-shrink-0 flex">
              <button
                className="inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={onClose}
              >
                <span className="sr-only">Close</span>
                <XCircle className="h-5 w-5 opacity-50 hover:opacity-75" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Usage example component
const ToastContainer = ({ toasts = [] }) => {
  return (
    <div className="fixed inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end z-50">
      <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
        {toasts.map((toast, index) => (
          <ToastPlaceholder
            key={index}
            type={toast.type}
            title={toast.title}
            message={toast.message}
            onClose={toast.onClose}
          />
        ))}
      </div>
    </div>
  );
};

export { ToastPlaceholder as default, ToastContainer };