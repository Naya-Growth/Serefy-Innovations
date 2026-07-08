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
    <div className={`text-center py-20 bg-white rounded-xl border border-slate-200 ${className}`}>
      <p className="text-slate-500 font-medium mb-4">{message}</p>
      {children}
    </div>
  );
}
