import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import ArticleCard from '../components/ArticleCard';
import Pagination from '../components/blog/Pagination';
import NewsletterCTA from '../components/blog/NewsletterCTA';
import BlogSkeleton from '../components/blog/BlogSkeleton';
import EmptyState from '../components/blog/EmptyState';
import { usePosts } from '../hooks/useContentOS';

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;

  // Reset page when category changes
  useEffect(() => {
    setCurrentPage(1);
    window.scrollTo(0, 0);
  }, [category]);

  const { posts, isLoading, error } = usePosts({ category });

  const totalPages = Math.max(1, Math.ceil(posts.length / articlesPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  
  const indexOfLastArticle = safeCurrentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = posts.slice(indexOfFirstArticle, indexOfLastArticle);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-surface text-on-surface font-body antialiased selection:bg-primary/20 min-h-screen">
      {/* Category Hero Section */}
      <section className="w-full py-16 px-4 bg-emerald-800 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-200 hover:text-white transition-colors mb-6">
            <ArrowLeft size={16} /> Back to Blog
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-headline text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
              {category}
            </h1>
            <p className="text-lg text-emerald-100 max-w-2xl mx-auto">
              Explore our latest articles, insights, and guides related to {category}.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <div className="bg-emerald-50/60 min-h-screen pb-20">
        <section className="w-full py-12 px-4">
          <div className="max-w-7xl mx-auto">
            {error && (
              <EmptyState message="Failed to load category articles." />
            )}

            {!error && (
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
                  <EmptyState message={`No articles found for category: ${category}`} />
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
