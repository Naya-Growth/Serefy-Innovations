import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import ArticleCard from '../components/ArticleCard';
import AuthorCard from '../components/blog/AuthorCard';
import Pagination from '../components/blog/Pagination';
import NewsletterCTA from '../components/blog/NewsletterCTA';
import BlogSkeleton from '../components/blog/BlogSkeleton';
import EmptyState from '../components/blog/EmptyState';
import { usePosts, useAuthors } from '../hooks/useContentOS';
import { Author } from '../types/blog';

export default function AuthorPage() {
  const { authorSlug } = useParams<{ authorSlug: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;

  useEffect(() => {
    setCurrentPage(1);
    window.scrollTo(0, 0);
  }, [authorSlug]);

  const { authors, isLoading: isLoadingAuthors } = useAuthors();
  const { posts, isLoading: isLoadingPosts, error } = usePosts({ author: authorSlug });
  
  const contentOSAuthor = authors.find(a => a.id === authorSlug);
  
  const authorData: Author | undefined = contentOSAuthor ? {
    name: contentOSAuthor.fullName,
    slug: contentOSAuthor.id,
    avatar: contentOSAuthor.avatar || undefined,
    bio: contentOSAuthor.bio || undefined,
    role: 'Contributor'
  } : undefined;

  const totalPages = Math.max(1, Math.ceil(posts.length / articlesPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  
  const indexOfLastArticle = safeCurrentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = posts.slice(indexOfFirstArticle, indexOfLastArticle);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isLoading = isLoadingAuthors || isLoadingPosts;

  return (
    <div className="bg-surface text-on-surface font-body antialiased selection:bg-primary/20 min-h-screen">
      {/* Author Hero Section */}
      <section className="w-full py-16 px-4 bg-emerald-50/60 border-b border-emerald-100">
        <div className="max-w-4xl mx-auto">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-emerald-800 transition-colors mb-8">
            <ArrowLeft size={16} /> Back to Blog
          </Link>
          
          {isLoadingAuthors ? (
            <div className="animate-pulse flex flex-col md:flex-row gap-8 items-center md:items-start">
              <div className="w-32 h-32 bg-slate-200 rounded-full shrink-0" />
              <div className="flex-1 space-y-4">
                <div className="h-10 bg-slate-200 rounded w-1/2" />
                <div className="h-6 bg-slate-200 rounded w-1/3" />
                <div className="h-20 bg-slate-200 rounded w-full" />
              </div>
            </div>
          ) : authorData ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <AuthorCard author={authorData} layout="row" />
            </motion.div>
          ) : (
            <div className="text-center py-10">
              <h1 className="text-3xl font-bold text-slate-900 mb-4">Author Not Found</h1>
              <p className="text-slate-600">The author you are looking for does not exist.</p>
            </div>
          )}
        </div>
      </section>

      {/* Content */}
      <div className="bg-white min-h-screen pb-20">
        <section className="w-full py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h3 className="font-headline text-2xl font-bold text-slate-900 mb-8 border-b border-slate-100 pb-4">
              Articles by {authorData?.name || 'this author'}
            </h3>

            {error && (
              <EmptyState message="Failed to load author's articles." />
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
                  <EmptyState message="No articles found for this author." />
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
