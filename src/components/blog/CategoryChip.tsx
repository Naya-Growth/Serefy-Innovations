import React from 'react';
import { Link } from 'react-router-dom';

interface CategoryChipProps {
  category: string;
  className?: string;
  isLink?: boolean;
}

export default function CategoryChip({ 
  category, 
  className = '',
  isLink = true
}: CategoryChipProps) {
  const baseClasses = "inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider rounded-full border border-emerald-100/50 shadow-sm transition-colors";
  const hoverClasses = isLink ? "hover:bg-emerald-100" : "";
  
  if (isLink) {
    return (
      <Link 
        to={`/blog/category/${category}`} 
        className={`${baseClasses} ${hoverClasses} ${className}`}
      >
        {category}
      </Link>
    );
  }

  return (
    <span className={`${baseClasses} ${hoverClasses} ${className}`}>
      {category}
    </span>
  );
}
