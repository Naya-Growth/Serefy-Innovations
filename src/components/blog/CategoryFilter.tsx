import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Filter } from 'lucide-react';
import { useCategories } from '../../hooks/useContentOS';

interface CategoryFilterProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories?: string[];
}

export default function CategoryFilter({ 
  selectedCategory, 
  setSelectedCategory,
  categories: initialCategories
}: CategoryFilterProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { categories: fetchedCategories, isLoading } = useCategories();
  
  const categories = initialCategories || fetchedCategories;

  return (
    <div className="w-full py-6 px-4 sm:px-6 lg:px-8 border-b border-emerald-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-4">
          {/* Desktop Categories */}
          <div className="hidden lg:flex items-center gap-3 flex-wrap">
            {isLoading && !initialCategories ? (
              <div className="flex gap-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="w-20 h-9 bg-slate-200 animate-pulse rounded-full" />
                ))}
              </div>
            ) : (
              categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  {category}
                </button>
              ))
            )}
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="lg:hidden flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-slate-200 text-slate-700 font-semibold text-sm"
          >
            <Filter size={16} />
            {selectedCategory}
          </button>
        </div>

        {/* Mobile Categories Dropdown */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden mt-4 flex flex-wrap gap-2 overflow-hidden"
            >
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setIsFilterOpen(false);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-emerald-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
