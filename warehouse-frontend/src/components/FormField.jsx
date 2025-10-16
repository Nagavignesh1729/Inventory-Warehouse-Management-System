import React from 'react';

const FormField = ({ 
  label, 
  type = 'text', 
  name, 
  value, 
  onChange, 
  placeholder, 
  required = false,
  disabled = false,
  error,
  helperText,
  icon: Icon,
  className = '',
  ...props 
}) => {
  const fieldId = `field-${name}`;
  
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        
        {type === 'textarea' ? (
          <textarea
            id={fieldId}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={`block w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${
              error 
                ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500'
            } ${disabled ? 'bg-gray-50 text-gray-500' : 'bg-white'}`}
            {...props}
          />
        ) : type === 'select' ? (
          <select
            id={fieldId}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
            className={`block w-full ${Icon ? 'pl-10' : 'pl-3'} pr-10 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${
              error 
                ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            } ${disabled ? 'bg-gray-50 text-gray-500' : 'bg-white'}`}
            {...props}
          >
            {props.children}
          </select>
        ) : (
          <input
            type={type}
            id={fieldId}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={`block w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${
              error 
                ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500'
            } ${disabled ? 'bg-gray-50 text-gray-500' : 'bg-white'}`}
            {...props}
          />
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default FormField;