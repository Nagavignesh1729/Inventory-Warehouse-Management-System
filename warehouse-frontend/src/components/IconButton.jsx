import React from 'react';

const IconButton = ({ 
  icon: Icon, 
  onClick, 
  variant = 'default', 
  size = 'md', 
  disabled = false, 
  ariaLabel,
  className = '',
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    default: "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:ring-blue-500",
    primary: "text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    secondary: "text-blue-700 bg-blue-100 hover:bg-blue-200 focus:ring-blue-500",
    success: "text-white bg-green-600 hover:bg-green-700 focus:ring-green-500",
    danger: "text-white bg-red-600 hover:bg-red-700 focus:ring-red-500",
    warning: "text-white bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
    ghost: "text-gray-700 bg-transparent hover:bg-gray-100 focus:ring-blue-500"
  };

  const sizeClasses = {
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-base",
    lg: "h-12 w-12 text-lg"
  };

  const iconSizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button
      type="button"
      className={classes}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      {...props}
    >
      <Icon className={iconSizeClasses[size]} />
    </button>
  );
};

export default IconButton;