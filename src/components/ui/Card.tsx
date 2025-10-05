import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass';
}

export function Card({ children, className = '', variant = 'default' }: CardProps) {
  const variantStyles = {
    default: 'bg-gray-900 border border-gray-800',
    glass: 'bg-gray-900/50 backdrop-blur-xl border border-gray-800/50',
  };
  
  return (
    <div className={`rounded-lg shadow-2xl ${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  );
}
