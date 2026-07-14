import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  trendingSearches?: string[];
}

export default function SearchBar({ 
  searchQuery, 
  setSearchQuery, 
  trendingSearches = ['Incubation', 'Solar Power', 'IoT', 'Data Analytics', 'Innovations'] 
}: SearchBarProps) {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/blog/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleTrendingClick = (term: string) => {
    setSearchQuery(term);
    navigate(`/blog/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto relative">
        <div className="relative flex items-center bg-white rounded-full border border-slate-200 shadow-sm hover:border-emerald-300 transition-colors focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-200">
          <Search className="absolute left-3 xs:left-3.5 sm:left-4 text-slate-400" size={16} xs:size={18} sm:size={20} />
          <input
            type="text"
            placeholder="Search articles, topics, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 xs:pl-11 sm:pl-12 pr-3 xs:pr-4 py-2.5 xs:py-3 sm:py-3.5 bg-transparent outline-none text-slate-900 placeholder:text-slate-400 text-xs xs:text-sm sm:text-base rounded-full"
          />
          <button type="submit" className="hidden">Search</button>
        </div>
      </form>
      
      {trendingSearches.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-1.5 xs:gap-2 mt-3 xs:mt-4 text-[10px] xs:text-xs sm:text-sm">
          <span className="text-slate-500">Trending:</span>
          {trendingSearches.map(term => (
            <button
              key={term}
              onClick={() => handleTrendingClick(term)}
              className="text-slate-600 hover:text-primary transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
