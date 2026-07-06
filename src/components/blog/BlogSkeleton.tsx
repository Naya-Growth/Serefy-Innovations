import React from 'react';

export default function BlogSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="flex flex-col overflow-hidden rounded-xl bg-white border border-slate-100 shadow-sm animate-pulse">
          <div className="aspect-[4/3] bg-slate-200" />
          <div className="flex-1 p-5 flex flex-col">
            <div className="h-6 bg-slate-200 rounded w-3/4 mb-3" />
            <div className="h-4 bg-slate-200 rounded w-full mb-2" />
            <div className="h-4 bg-slate-200 rounded w-5/6 mb-4" />
            <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between">
              <div className="h-4 bg-slate-200 rounded w-1/3" />
              <div className="h-4 bg-slate-200 rounded w-1/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
