import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Twitter, Linkedin } from 'lucide-react';
import ArticleCard from '../components/ArticleCard';
import Pagination from '../components/blog/Pagination';
import NewsletterCTA from '../components/blog/NewsletterCTA';
import BlogSkeleton from '../components/blog/BlogSkeleton';
import EmptyState from '../components/blog/EmptyState';
import AuthorCard from '../components/blog/AuthorCard';
import { mockArticles, authorsData } from '../data/blogData';

export default function AuthorPage() {
  const { authorSlug } = useParams<{ authorSlug: string }>();
  const navigate = useNavigate();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const articlesPerPage = 6;

  const author = authorSlug ? authorsData[authorSlug] : null;

  useEffect(() => {
    setCurrentPage(1);
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [authorSlug]);

  if (!author) {
    return (
      <div className="min-h-[70vh] bg-emerald-50/60 flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Author Not Found</h1>
        <p className="text-slate-600 mb-8">The author profile you are looking for does not exist.</p>
        <button 
          onClick={() => navigate('/blog')}
          className="px-6 py-2 rounded-full bg-primary text-white font-semibold hover:bg-emerald-800 transition-colors"
        >
          Back to Blog
        </button>
      </div>
    );
  }

  const authorArticles = mockArticles.filter(article => article.author.slug === authorSlug);

  const totalPages = Math.max(1, Math.ceil(authorArticles.length / articlesPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  
  const indexOfLastArticle = safeCurrentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = authorArticles.slice(indexOfFirstArticle, indexOfLastArticle);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-surface text-on-surface font-body antialiased min-h-screen flex flex-col">
      <section className="w-full py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white pt-28 border-b border-slate-100">
        <div className="max-w-4xl mx-auto">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-primary transition-colors mb-8">
            <ArrowLeft size={16} /> Back to Blog
          </Link>
          
          <AuthorCard author={author} layout="row" />
        </div>
      </section>

      <div className="bg-emerald-50/60 flex-1 py-16">
        <section className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 border-b border-emerald-100 pb-4">
              Articles by {author.name}
            </h2>
            
            {isLoading ? (
              <BlogSkeleton />
            ) : authorArticles.length > 0 ? (
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
              <EmptyState message="No articles published by this author yet." />
            )}
          </div>
        </section>
      </div>
      
      <NewsletterCTA />
    </div>
  );
}
