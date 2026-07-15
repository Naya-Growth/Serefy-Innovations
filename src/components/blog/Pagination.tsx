import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-1.5 xs:gap-2 mt-10 xs:mt-12 sm:mt-16">
      <button 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-2.5 xs:px-3 sm:px-4 py-1.5 xs:py-2 rounded-md text-slate-600 font-medium text-[10px] xs:text-xs sm:text-sm disabled:opacity-50 disabled:text-slate-400 hover:text-primary transition-colors"
      >
        Previous
      </button>
      
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
        <button
          key={pageNumber}
          onClick={() => onPageChange(pageNumber)}
          className={`w-6 xs:w-7 sm:w-8 h-6 xs:h-7 sm:h-8 flex items-center justify-center rounded-full font-semibold text-[10px] xs:text-xs sm:text-sm transition-colors ${
            currentPage === pageNumber
              ? 'bg-primary text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:border-emerald-300'
          }`}
        >
          {pageNumber}
        </button>
      ))}

      <button 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-2.5 xs:px-3 sm:px-4 py-1.5 xs:py-2 rounded-md text-slate-600 font-medium text-[10px] xs:text-xs sm:text-sm disabled:opacity-50 disabled:text-slate-400 hover:text-primary transition-colors"
      >
        Next
      </button>
    </div>
  );
}
