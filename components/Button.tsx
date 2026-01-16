import React from 'react';

interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, disabled, variant = 'primary', children, className = '' }) => {
  const baseStyles = "px-6 py-3 rounded-full font-bold text-sm tracking-wide uppercase shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";
  
  const variants = {
    primary: "bg-gold text-gray-900 hover:bg-yellow-400 border-2 border-yellow-500",
    secondary: "bg-gray-800 text-white hover:bg-gray-700 border-2 border-gray-600",
    danger: "bg-red-600 text-white hover:bg-red-500 border-2 border-red-800"
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled} 
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;