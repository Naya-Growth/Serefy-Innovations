import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import ArticleCard from '../components/ArticleCard';
import SearchBar from '../components/blog/SearchBar';
import CategoryFilter from '../components/blog/CategoryFilter';
import Pagination from '../components/blog/Pagination';
import NewsletterCTA from '../components/blog/NewsletterCTA';
import BlogSkeleton from '../components/blog/BlogSkeleton';
import EmptyState from '../components/blog/EmptyState';
import { usePosts } from '../hooks/useContentOS';

export default function BlogListing() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;

  // Whenever search query or category changes, reset to page 1
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const { posts, isLoading, error } = usePosts({
    q: searchQuery || undefined,
    category: selectedCategory !== 'All' ? selectedCategory : undefined
  });

  const featuredArticle = currentPage === 1 && !searchQuery && selectedCategory === 'All' ? posts[0] : null;
  
  // If there's a featured article, regular articles are the rest. Otherwise, all are regular.
  const allRegularArticles = featuredArticle ? posts.slice(1) : posts;
  
  const totalPages = Math.max(1, Math.ceil(allRegularArticles.length / articlesPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  
  const indexOfLastArticle = safeCurrentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const regularArticles = allRegularArticles.slice(indexOfFirstArticle, indexOfLastArticle);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-surface text-on-surface font-body antialiased selection:bg-primary/20 min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-8 xs:py-10 sm:py-12 md:py-14 lg:py-16 xl:py-20 2xl:py-24 3xl:py-28 4xl:py-32 px-3 xs:px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 bg-white text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-2 xs:px-2.5 sm:px-3 py-0.5 xs:py-0.75 sm:py-1 rounded-full bg-green-50 text-green-700 text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-wider mb-2 xs:mb-3 sm:mb-4">
              SERE INSIGHTS
            </span>
            <h1 className="font-headline text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl 3xl:text-7xl font-extrabold text-slate-900 mb-2 xs:mb-3 sm:mb-4 tracking-tight leading-[1.15]">
              Smart Poultry Farming<br />
              <span className="text-primary">Knowledge Hub</span>
            </h1>
            <p className="text-xs xs:text-sm sm:text-base md:text-lg xl:text-xl 2xl:text-2xl text-slate-500 max-w-2xl xl:max-w-3xl 2xl:max-w-4xl mx-auto mb-3 xs:mb-4 sm:mb-6">
              Expert insights, practical guides, and industry updates to help you succeed in modern poultry farming.
            </p>

            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </motion.div>
        </div>
      </section>

      {/* Category Filter & Content Background Wrapper */}
      <div className="bg-emerald-50/60 min-h-screen pb-12 xs:pb-16 sm:pb-20 xl:pb-24 2xl:pb-28">
        <CategoryFilter 
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {/* Content */}
        <section className="w-full py-6 xs:py-8 sm:py-10 px-3 xs:px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
          <div className="max-w-7xl mx-auto">

            {error && (
              <EmptyState message="Failed to load articles. Please try again later." />
            )}

            {!error && (
              <>
                {/* Featured Article */}
                {featuredArticle && !isLoading && (
                  <div className="mb-4 xs:mb-6 sm:mb-8">
                    <h3 className="text-[9px] xs:text-[10px] sm:text-xs font-bold text-green-700 uppercase tracking-widest mb-2 xs:mb-3 sm:mb-4">FEATURED</h3>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                    >
                      <ArticleCard 
                        id={featuredArticle.slug}
                        title={featuredArticle.title}
                        excerpt={featuredArticle.excerpt}
                        featuredImage={featuredArticle.featuredImage}
                        authorName={featuredArticle.author.name}
                        publishDate={featuredArticle.publishDate}
                        category={featuredArticle.category}
                        variant="featured" 
                      />
                    </motion.div>
                  </div>
                )}

                {/* Articles Grid */}
                {isLoading ? (
                  <BlogSkeleton />
                ) : regularArticles.length > 0 ? (
                  <>
                    <h3 className="text-[9px] xs:text-[10px] sm:text-xs font-bold text-slate-700 uppercase tracking-widest mb-2 xs:mb-3 sm:mb-4">LATEST ARTICLES</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-3 xs:gap-4 sm:gap-6 xl:gap-8 2xl:gap-10">
                      {regularArticles.map((article, index) => (
                        <motion.div
                          key={article.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
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
                  </>
                ) : (
                  <EmptyState message="No articles found matching your criteria." />
                )}

                <Pagination 
                  currentPage={safeCurrentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}

          </div>
        </section>
      </div>

      <NewsletterCTA />
    </div>
  );
}
