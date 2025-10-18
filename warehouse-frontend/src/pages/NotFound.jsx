import React from 'react';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <div className="mx-auto h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center">
              <Search className="h-12 w-12 text-blue-600" />
            </div>
            <h1 className="mt-6 text-6xl font-extrabold text-gray-900">404</h1>
            <h2 className="mt-2 text-3xl font-bold text-gray-900">Page Not Found</h2>
            <p className="mt-4 text-base text-gray-600">
              Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <button
              onClick={() => window.history.back()}
              className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </button>

            <button
              onClick={() => window.location.href = '/'}
              className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <Home className="w-4 h-4 mr-2" />
              Return to Dashboard
            </button>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-900">Need help?</h3>
              <p className="mt-2 text-sm text-gray-600">
                If you think this is an error, please contact our support team.
              </p>
              <button className="mt-3 text-sm text-blue-600 hover:text-blue-500 font-medium">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;