import React from 'react';

interface EmptyStateProps {
  message?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function EmptyState({ 
  message = "No articles found matching your criteria.", 
  className = "",
  children 
}: EmptyStateProps) {
  return (
    <div className={`text-center py-12 xs:py-14 sm:py-16 md:py-18 lg:py-20 xl:py-24 bg-white rounded-xl border border-slate-200 ${className}`}>
      <p className="text-slate-500 font-medium mb-3 xs:mb-4 sm:mb-5 text-xs xs:text-sm sm:text-base md:text-lg">{message}</p>
      {children}
    </div>
  );
}
