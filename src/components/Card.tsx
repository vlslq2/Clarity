import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  gradient?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = false, 
  glass = false,
  padding = 'md',
  gradient = false,
  onClick
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8'
  };

  return (
    <div 
      className={`
        ${glass 
          ? 'bg-white/95 backdrop-blur-xl border-2 border-white/30 shadow-xl shadow-black/10' 
          : gradient
          ? 'bg-gradient-to-br from-white via-white to-gray-50/80 border-2 border-gray-200/80 shadow-lg shadow-gray-900/10'
          : 'bg-white border-2 border-gray-200/80 shadow-lg shadow-gray-900/10'
        }
        rounded-2xl
        ${hover ? 'card-hover cursor-pointer hover:shadow-xl hover:shadow-gray-900/12 hover:border-gray-300/90 active:scale-[0.98]' : ''}
        ${paddingClasses[padding]}
        ${onClick ? 'cursor-pointer' : ''}
        transition-all duration-300 ease-out
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;