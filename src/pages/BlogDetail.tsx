import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Twitter, Linkedin, Link as LinkIcon, Calendar, Clock } from 'lucide-react';
import NewsletterCTA from '../components/blog/NewsletterCTA';
import ArticleCard from '../components/ArticleCard';
import ContentOSRenderer from '../components/blog/ContentOSRenderer';
import { usePost, usePosts } from '../hooks/useContentOS';
import BlogSkeleton from '../components/blog/BlogSkeleton';

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { post: article, isLoading, error } = usePost(id);
  
  // Use posts hook for related articles. 
  // In a real scenario we could fetch more and filter out the current one, 
  // but for simplicity we'll just fetch a few from the same category.
  const { posts: relatedPosts, isLoading: isLoadingRelated } = usePosts({
    category: article?.category !== 'Uncategorized' ? article?.category : undefined
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Inject SEO metadata
  useEffect(() => {
    if (article) {
      // Set Title
      const title = article.seo?.title || article.title;
      document.title = `${title} | Serefy Innovations`;

      // Helper to set meta tags
      const setMetaTag = (name: string, content: string, property = false) => {
        let element = document.querySelector(`meta[${property ? 'property' : 'name'}="${name}"]`);
        if (!element) {
          element = document.createElement('meta');
          element.setAttribute(property ? 'property' : 'name', name);
          document.head.appendChild(element);
        }
        element.setAttribute('content', content);
      };

      // Description
      if (article.seo?.description || article.excerpt) {
        setMetaTag('description', article.seo?.description || article.excerpt);
      }

      // Canonical
      if (article.seo?.canonicalUrl) {
        let link = document.querySelector('link[rel="canonical"]');
        if (!link) {
          link = document.createElement('link');
          link.setAttribute('rel', 'canonical');
          document.head.appendChild(link);
        }
        link.setAttribute('href', article.seo.canonicalUrl);
      }

      // OpenGraph
      if (article.seo?.social?.openGraph) {
        const og = article.seo.social.openGraph;
        if (og.title) setMetaTag('og:title', og.title, true);
        if (og.description) setMetaTag('og:description', og.description, true);
        if (og.image) setMetaTag('og:image', og.image, true);
      }
      
      // Twitter
      setMetaTag('twitter:card', 'summary_large_image');
      if (article.seo?.social?.twitter) {
        const twitter = article.seo.social.twitter;
        if (twitter.title || article.title) setMetaTag('twitter:title', twitter.title || article.title);
        if (twitter.description || article.excerpt) setMetaTag('twitter:description', twitter.description || article.excerpt);
        if (twitter.image || article.featuredImage) setMetaTag('twitter:image', twitter.image || article.featuredImage);
      } else {
        setMetaTag('twitter:title', title);
        setMetaTag('twitter:description', article.seo?.description || article.excerpt);
        setMetaTag('twitter:image', article.featuredImage);
      }

      // JSON-LD schema
      if (article.seo?.schemaJsonLd) {
        let script = document.querySelector('script[type="application/ld+json"]');
        if (!script) {
          script = document.createElement('script');
          script.setAttribute('type', 'application/ld+json');
          document.head.appendChild(script);
        }
        script.textContent = article.seo.schemaJsonLd;
      }
    }
  }, [article]);

  if (isLoading) {
    return (
      <div className="pt-28 pb-20 px-4 max-w-7xl mx-auto">
        <BlogSkeleton />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-[70vh] bg-emerald-50/60 flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Article Not Found</h1>
        <p className="text-slate-600 mb-8">The article you are looking for does not exist or failed to load.</p>
        <button
          onClick={() => navigate('/blog')}
          className="px-4 xs:px-5 sm:px-6 py-2 rounded-full bg-primary text-white font-semibold hover:bg-emerald-800 transition-colors text-xs xs:text-sm"
        >
          Back to Blog
        </button>
      </div>
    );
  }

  // Filter out the current article and take up to 3
  const relatedArticles = relatedPosts
    .filter(a => a.id !== article.id)
    .slice(0, 3);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="bg-white min-h-screen font-body text-slate-800 pt-20 flex flex-col selection:bg-primary/20">
      
      {/* Hero Section with Premium Gradient Accent */}
      <section className="relative w-full overflow-hidden px-3 xs:px-4 sm:px-6 lg:px-8 pt-10 xs:pt-12 pb-8 xs:pb-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-50/50 via-transparent to-transparent -z-10" />

        <div className="max-w-4xl mx-auto relative z-10">
          <Link to="/blog" className="inline-flex items-center gap-1.5 xs:gap-2 text-xs xs:text-sm font-semibold text-primary hover:text-emerald-800 transition-colors mb-5 xs:mb-8">
            <ArrowLeft size={12} xs:size={16} /> Back to Blog
          </Link>

          <div className="flex items-center gap-2 xs:gap-3 mb-4 xs:mb-6">
            <Link to={`/blog/category/${article.category}`} className="px-3 xs:px-4 py-1 xs:py-1.5 rounded-full bg-emerald-50 text-primary text-[10px] xs:text-xs font-bold uppercase tracking-wider hover:bg-emerald-100 transition-colors border border-emerald-100/50 shadow-sm">
              {article.category}
            </Link>
            <span className="text-slate-300">•</span>
            <div className="flex items-center gap-1 xs:gap-1.5 text-slate-500 text-xs xs:text-sm font-medium">
              <Clock size={12} xs:size={14} />
              <span>{article.readTime}</span>
            </div>
          </div>

          <h1 className="font-headline text-2xl xs:text-3xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.15] tracking-tight mb-5 xs:mb-8">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 xs:gap-6 py-4 xs:py-6 border-y border-slate-100">
            <div className="flex items-center gap-3 xs:gap-4">
              <Link to={`/blog/author/${article.author.slug}`} className="group relative">
                <div className="w-10 xs:w-12 sm:w-14 h-10 xs:h-12 sm:h-14 rounded-full bg-emerald-100 flex items-center justify-center text-primary font-bold text-lg xs:text-xl border-3 xs:border-4 border-white shadow-md group-hover:scale-105 transition-transform overflow-hidden">
                  {article.author.avatar ? (
                    <img src={article.author.avatar} alt={article.author.name} className="w-full h-full object-cover" />
                  ) : (
                    article.author.name.charAt(0)
                  )}
                </div>
              </Link>
              <div>
                <Link to={`/blog/author/${article.author.slug}`} className="font-bold text-slate-900 text-base xs:text-lg hover:text-primary transition-colors block leading-tight">
                  {article.author.name}
                </Link>
                <div className="flex items-center gap-1.5 xs:gap-2 text-xs xs:text-sm text-slate-500 mt-0.5 xs:mt-1">
                  <span className="font-medium text-primary/80">{article.author.role}</span>
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1 xs:gap-1.5"><Calendar size={12} xs:size={14} className="text-slate-400"/> {article.publishDate}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 xs:gap-2">
              <span className="text-[10px] xs:text-xs font-semibold text-slate-400 mr-1.5 xs:mr-2 uppercase tracking-wider">Share</span>
              <button onClick={copyLink} className="w-8 xs:w-9 sm:w-10 h-8 xs:h-9 sm:h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-emerald-50 hover:border-emerald-400 hover:text-primary hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300">
                <LinkIcon size={12} xs:size={16} />
              </button>
              <button className="w-8 xs:w-9 sm:w-10 h-8 xs:h-9 sm:h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-[#1DA1F2]/10 hover:border-[#1DA1F2] hover:text-[#1DA1F2] hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#1DA1F2]/20 transition-all duration-300">
                <Twitter size={12} xs:size={16} />
              </button>
              <button className="w-8 xs:w-9 sm:w-10 h-8 xs:h-9 sm:h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-[#0A66C2]/10 hover:border-[#0A66C2] hover:text-[#0A66C2] hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#0A66C2]/20 transition-all duration-300">
                <Linkedin size={12} xs:size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 relative z-10">
        <div className="aspect-[21/9] w-full rounded-3xl overflow-hidden bg-slate-100 shadow-2xl shadow-slate-200/50 border border-slate-100">
          <img src={article.featuredImage} alt={article.title} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700 ease-out" />
        </div>
      </section>

      {/* Article Content */}
      <section className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 flex-1">
        {article.bodyBlocks && article.bodyBlocks.length > 0 ? (
          <ContentOSRenderer blocks={article.bodyBlocks} />
        ) : (
          <div 
            className="prose prose-lg prose-slate prose-emerald max-w-none prose-p:text-slate-700 prose-p:leading-[2.2] prose-p:tracking-[0.015em] prose-headings:font-headline prose-h2:text-3xl prose-h2:font-extrabold prose-h2:tracking-tight prose-h2:mb-6 prose-h2:mt-12 prose-h3:text-2xl prose-h3:font-bold prose-a:text-primary hover:prose-a:text-emerald-800"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        )}
        
        {/* Tags */}
        <div className="mt-8 xs:mt-12 pt-6 xs:pt-8 border-t border-slate-100 flex flex-wrap gap-2 xs:gap-3 items-center">
          <span className="text-[10px] xs:text-xs font-semibold text-slate-400 mr-1.5 xs:mr-2 uppercase tracking-wider">Tags:</span>
          {article.tags.map(tag => (
            <Link key={tag} to={`/blog/search?q=${tag}`} className="px-3 xs:px-4 xs:px-5 py-1.5 xs:py-2 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-[10px] xs:text-xs sm:text-sm font-semibold hover:bg-primary hover:border-primary hover:text-white hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              #{tag}
            </Link>
          ))}
        </div>
      </section>

      {/* Related Articles */}
      <section className="w-full bg-emerald-50/60 py-14 xs:py-16 sm:py-20 px-3 xs:px-4 sm:px-6 lg:px-8 border-t border-emerald-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-headline text-2xl xs:text-3xl font-bold text-slate-900 mb-6 xs:mb-10 text-center">Read Next</h2>
          
          {isLoadingRelated ? (
            <BlogSkeleton />
          ) : relatedArticles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-6">
              {relatedArticles.map(relArticle => (
                <ArticleCard 
                  key={relArticle.id}
                  id={relArticle.slug}
                  title={relArticle.title}
                  excerpt={relArticle.excerpt}
                  featuredImage={relArticle.featuredImage}
                  authorName={relArticle.author.name}
                  publishDate={relArticle.publishDate}
                  category={relArticle.category}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-500">No related articles found.</p>
          )}
        </div>
      </section>

      <NewsletterCTA />
    </div>
  );
}
