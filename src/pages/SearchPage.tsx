import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Search as SearchIcon } from 'lucide-react';
import ArticleCard from '../components/ArticleCard';
import SearchBar from '../components/blog/SearchBar';
import Pagination from '../components/blog/Pagination';
import NewsletterCTA from '../components/blog/NewsletterCTA';
import BlogSkeleton from '../components/blog/BlogSkeleton';
import EmptyState from '../components/blog/EmptyState';
import { usePosts } from '../hooks/useContentOS';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;

  // We only run API query based on the URL parameter 'q'
  // Local state 'searchInput' is just for the input field value
  const query = searchParams.get('q') || '';

  const { posts: searchResults, isLoading, error } = usePosts({ q: query });

  useEffect(() => {
    setSearchInput(query);
    setCurrentPage(1);
    window.scrollTo(0, 0);
  }, [query]);

  const handleSearchSubmit = (newQuery: string) => {
    setSearchInput(newQuery);
    if (newQuery.trim()) {
      setSearchParams({ q: newQuery.trim() });
    } else {
      setSearchParams({});
    }
  };

  const totalPages = Math.max(1, Math.ceil(searchResults.length / articlesPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  
  const indexOfLastArticle = safeCurrentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = searchResults.slice(indexOfFirstArticle, indexOfLastArticle);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-surface text-on-surface font-body antialiased selection:bg-primary/20 min-h-screen">
      {/* Search Hero Section */}
      <section className="w-full py-16 px-4 bg-emerald-50/60 border-b border-emerald-100 text-center">
        <div className="max-w-4xl mx-auto">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-emerald-800 transition-colors mb-6">
            <ArrowLeft size={16} /> Back to Blog
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-primary shadow-sm mx-auto mb-6">
              <SearchIcon size={32} />
            </div>
            <h1 className="font-headline text-3xl md:text-5xl font-extrabold mb-8 tracking-tight text-slate-900">
              Search Results
            </h1>
            
            <div className="max-w-2xl mx-auto">
              <SearchBar 
                searchQuery={searchInput}
                setSearchQuery={handleSearchSubmit}
                trendingSearches={[]} // Disable trending searches on results page to avoid clutter
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <div className="bg-white min-h-screen pb-20">
        <section className="w-full py-12 px-4">
          <div className="max-w-7xl mx-auto">
            {query && (
              <p className="text-slate-600 mb-8 font-medium text-lg">
                Showing results for <span className="font-bold text-slate-900">"{query}"</span> 
                <span className="text-slate-400 ml-2">({searchResults.length} articles)</span>
              </p>
            )}

            {!query && (
              <div className="text-center py-20">
                <p className="text-slate-500 text-lg">Enter a search term above to find articles.</p>
              </div>
            )}

            {query && error && (
              <EmptyState message="Failed to search articles." />
            )}

            {query && !error && (
              <>
                {isLoading ? (
                  <BlogSkeleton />
                ) : currentArticles.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {currentArticles.map((article, index) => (
                        <motion.div
                          key={article.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          <ArticleCard 
                            id={article.slug}
                            title={article.title}
                            excerpt={article.excerpt}
                            featuredImage={article.featuredImage}
                            authorName={article.author.name}
                            publishDate={article.publishDate}
                            category={article.category}
                          />
                        </motion.div>
                      ))}
                    </div>

                    <Pagination 
                      currentPage={safeCurrentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </>
                ) : (
                  <EmptyState message={`No articles found for "${query}"`}>
                    <button 
                      onClick={() => {
                        setSearchInput('');
                        setSearchParams({});
                      }}
                      className="mt-4 px-4 py-2 bg-primary text-white rounded-full font-semibold hover:bg-emerald-800 transition-colors"
                    >
                      Clear Search
                    </button>
                  </EmptyState>
                )}
              </>
            )}
          </div>
        </section>
      </div>

      <NewsletterCTA />
    </div>
  );
}
