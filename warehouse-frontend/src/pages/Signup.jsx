import React, { useState } from 'react';
import { Package, User, Mail, Lock } from 'lucide-react';

const Signup = ({ onNavigateToLogin }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setIsLoading(true);

    // Simulate signup process
    setTimeout(() => {
      setIsLoading(false);
      alert('Signup successful! Please log in.');
      onNavigateToLogin();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-blue-600 rounded-lg flex items-center justify-center">
              <Package className="h-8 w-8 text-white" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Create Account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Get started with your new inventory system
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User className="h-5 w-5 text-gray-400" /></div>
                  <input name="fullName" type="text" required className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md" placeholder="Enter your full name" value={formData.fullName} onChange={handleChange} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email address</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-gray-400" /></div>
                  <input name="email" type="email" required className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md" placeholder="Enter your email" value={formData.email} onChange={handleChange} />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-400" /></div>
                  <input name="password" type="password" required className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md" placeholder="Enter your password" value={formData.password} onChange={handleChange} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-400" /></div>
                  <input name="confirmPassword" type="password" required className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} />
                </div>
              </div>
            </div>
            
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </button>
            
            <div className="text-sm text-center">
              <button type="button" onClick={onNavigateToLogin} className="font-medium text-blue-600 hover:text-blue-500">
                Already have an account? Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;