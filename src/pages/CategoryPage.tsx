import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ArticleCard from '../components/ArticleCard';
import Pagination from '../components/blog/Pagination';
import NewsletterCTA from '../components/blog/NewsletterCTA';
import BlogSkeleton from '../components/blog/BlogSkeleton';
import CategoryFilter from '../components/blog/CategoryFilter';
import { mockArticles, categoriesData } from '../data/blogData';

export default function CategoryPage() {
  const { category = 'All' } = useParams<{ category: string }>();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const articlesPerPage = 6;

  useEffect(() => {
    setCurrentPage(1);
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [category]);

  const filteredArticles = mockArticles.filter(article => 
    category === 'All' || article.category === category
  );

  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / articlesPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  
  const indexOfLastArticle = safeCurrentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Mock navigation for category filter on Category page
  const handleCategoryChange = (newCategory: string) => {
    window.location.href = `/blog/category/${newCategory}`;
  };

  return (
    <div className="bg-surface text-on-surface font-body antialiased min-h-screen flex flex-col">
      <section className="w-full py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-white text-center pt-28">
        <div className="max-w-4xl mx-auto">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-primary transition-colors mb-4">
            <ArrowLeft size={16} /> Back to Blog
          </Link>
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            <span className="text-primary">{category}</span> Articles
          </h1>
          <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
            Browse our latest insights and guides related to {category}.
          </p>
        </div>
      </section>

      <div className="bg-emerald-50/60 flex-1 pb-20">
        <CategoryFilter 
          selectedCategory={category}
          setSelectedCategory={handleCategoryChange}
          categories={categoriesData}
        />

        <section className="w-full py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
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
              <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
                <p className="text-slate-500">No articles found in this category.</p>
              </div>
            )}
          </div>
        </section>
      </div>
      
      <NewsletterCTA />
    </div>
  );
}
