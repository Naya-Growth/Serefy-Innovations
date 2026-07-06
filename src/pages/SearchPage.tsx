import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, ArrowLeft } from 'lucide-react';
import ArticleCard from '../components/ArticleCard';
import SearchBar from '../components/blog/SearchBar';
import Pagination from '../components/blog/Pagination';
import NewsletterCTA from '../components/blog/NewsletterCTA';
import BlogSkeleton from '../components/blog/BlogSkeleton';
import EmptyState from '../components/blog/EmptyState';
import { mockArticles } from '../data/blogData';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const articlesPerPage = 6;

  // Sync state with URL params
  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
  }, [searchParams]);

  // Update URL params when searching
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      setSearchParams({ q: query });
    } else {
      setSearchParams({});
    }
    setCurrentPage(1);
  };

  // Simulate API loading state
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredArticles = mockArticles.filter(article => {
    const q = searchQuery.toLowerCase();
    return (
      article.title.toLowerCase().includes(q) ||
      article.excerpt.toLowerCase().includes(q) ||
      article.tags.some(tag => tag.toLowerCase().includes(q))
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / articlesPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  
  const indexOfLastArticle = safeCurrentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-surface text-on-surface font-body antialiased min-h-screen flex flex-col">
      <section className="w-full py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-white text-center pt-28 border-b border-emerald-50">
        <div className="max-w-4xl mx-auto">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-primary transition-colors mb-6">
            <ArrowLeft size={16} /> Back to Blog
          </Link>
          <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-8 tracking-tight">
            Search Results
          </h1>
          
          <SearchBar 
            searchQuery={searchQuery}
            setSearchQuery={handleSearch}
          />
        </div>
      </section>

      <div className="bg-emerald-50/60 flex-1 pb-20">
        <section className="w-full py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {searchQuery && !isLoading && (
              <p className="text-slate-600 mb-8 font-medium">
                Found {filteredArticles.length} result{filteredArticles.length !== 1 ? 's' : ''} for <span className="text-slate-900 font-bold">"{searchQuery}"</span>
              </p>
            )}

            {isLoading ? (
              <BlogSkeleton />
            ) : filteredArticles.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentArticles.map((article) => (
                    <ArticleCard 
                      key={article.id}
                      id={article.slug}
                      title={article.title}
                      excerpt={article.excerpt}
                      featuredImage={article.featuredImage}
                      authorName={article.author.name}
                      publishDate={article.publishDate}
                      category={article.category}
                    />
                  ))}
                </div>
                
                <Pagination 
                  currentPage={safeCurrentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <EmptyState message={`We couldn't find any articles matching "${searchQuery}". Try adjusting your keywords.`}>
                <button 
                  onClick={() => handleSearch('')}
                  className="px-6 py-2.5 rounded-full bg-emerald-50 text-primary font-bold hover:bg-emerald-100 transition-colors"
                >
                  Clear Search
                </button>
              </EmptyState>
            )}
          </div>
        </section>
      </div>
      
      <NewsletterCTA />
    </div>
  );
}
