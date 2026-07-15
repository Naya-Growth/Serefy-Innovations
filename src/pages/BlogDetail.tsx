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
      <div className="min-h-[70vh] bg-emerald-50/60 flex flex-col items-center justify-center p-4 xs:p-6">
        <h1 className="text-2xl xs:text-3xl font-bold text-slate-900 mb-3 xs:mb-4">Article Not Found</h1>
        <p className="text-slate-600 mb-6 xs:mb-8 text-sm xs:text-base">The article you are looking for does not exist or failed to load.</p>
        <button
          onClick={() => navigate('/blog')}
          className="px-3 xs:px-4 sm:px-5 py-2 xs:py-2.5 rounded-full bg-primary text-white font-semibold hover:bg-emerald-800 transition-colors text-xs xs:text-sm"
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
      <section className="relative w-full overflow-hidden px-3 xs:px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 pt-6 xs:pt-8 sm:pt-10 xl:pt-12 2xl:pt-14 pb-4 xs:pb-6 sm:pb-8 xl:pb-10 2xl:pb-12">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-50/50 via-transparent to-transparent -z-10" />

        <div className="max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto relative z-10">
          <Link to="/blog" className="inline-flex items-center gap-1.5 xs:gap-2 text-xs xs:text-sm xl:text-base font-semibold text-primary hover:text-emerald-800 transition-colors mb-4 xs:mb-5 sm:mb-8 xl:mb-10">
            <ArrowLeft size={16} /> Back to Blog
          </Link>

          <div className="flex items-center gap-2 xs:gap-2.5 sm:gap-3 xl:gap-4 mb-3 xs:mb-4 sm:mb-6 xl:mb-8">
            <Link to={`/blog/category/${article.category}`} className="px-2.5 xs:px-3 sm:px-4 xl:px-5 py-1 xs:py-1.5 xl:py-2 rounded-full bg-emerald-50 text-primary text-[9px] xs:text-[10px] sm:text-xs xl:text-sm font-bold uppercase tracking-wider hover:bg-emerald-100 transition-colors border border-emerald-100/50 shadow-sm">
              {article.category}
            </Link>
            <span className="text-slate-300">•</span>
            <div className="flex items-center gap-1 xs:gap-1.5 xl:gap-2 text-slate-500 text-[10px] xs:text-xs sm:text-sm xl:text-base font-medium">
              <Clock size={14} />
              <span>{article.readTime}</span>
            </div>
          </div>

          <h1 className="font-headline text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl 3xl:text-8xl font-extrabold text-slate-900 leading-[1.15] tracking-tight mb-4 xs:mb-5 sm:mb-8 xl:mb-10">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-3 xs:gap-4 sm:gap-6 xl:gap-8 py-3 xs:py-4 sm:py-6 xl:py-8 border-y border-slate-100">
            <div className="flex items-center gap-2.5 xs:gap-3 sm:gap-4 xl:gap-5">
              <Link to={`/blog/author/${article.author.slug}`} className="group relative">
                <div className="w-9 xs:w-10 sm:w-12 lg:w-14 xl:w-16 2xl:w-20 h-9 xs:h-10 sm:h-12 lg:h-14 xl:h-16 2xl:h-20 rounded-full bg-emerald-100 flex items-center justify-center text-primary font-bold text-base xs:text-lg sm:text-xl xl:text-2xl border-2 xs:border-3 sm:border-4 border-white shadow-md group-hover:scale-105 transition-transform overflow-hidden">
                  {article.author.avatar ? (
                    <img src={article.author.avatar} alt={article.author.name} className="w-full h-full object-cover" />
                  ) : (
                    article.author.name.charAt(0)
                  )}
                </div>
              </Link>
              <div>
                <Link to={`/blog/author/${article.author.slug}`} className="font-bold text-slate-900 text-sm xs:text-base sm:text-lg xl:text-xl hover:text-primary transition-colors block leading-tight">
                  {article.author.name}
                </Link>
                <div className="flex items-center gap-1.5 xs:gap-2 xl:gap-2.5 text-[10px] xs:text-xs sm:text-sm xl:text-base text-slate-500 mt-0.5 xs:mt-1">
                  <span className="font-medium text-primary/80">{article.author.role}</span>
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1 xs:gap-1.5"><Calendar size={14} className="text-slate-400"/> {article.publishDate}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 xl:gap-3">
              <span className="text-[9px] xs:text-[10px] sm:text-xs xl:text-sm font-semibold text-slate-400 mr-1 xs:mr-1.5 sm:mr-2 xl:mr-3 uppercase tracking-wider">Share</span>
              <button onClick={copyLink} className="w-7 xs:w-8 sm:w-9 lg:w-10 xl:w-12 h-7 xs:h-8 sm:h-9 lg:h-10 xl:h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-emerald-50 hover:border-emerald-400 hover:text-primary hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300">
                <LinkIcon size={16} />
              </button>
              <button className="w-7 xs:w-8 sm:w-9 lg:w-10 xl:w-12 h-7 xs:h-8 sm:h-9 lg:h-10 xl:h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-[#1DA1F2]/10 hover:border-[#1DA1F2] hover:text-[#1DA1F2] hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#1DA1F2]/20 transition-all duration-300">
                <Twitter size={16} />
              </button>
              <button className="w-7 xs:w-8 sm:w-9 lg:w-10 xl:w-12 h-7 xs:h-8 sm:h-9 lg:h-10 xl:h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-[#0A66C2]/10 hover:border-[#0A66C2] hover:text-[#0A66C2] hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#0A66C2]/20 transition-all duration-300">
                <Linkedin size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="w-full max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 mb-3 xs:mb-4 sm:mb-6 xl:mb-8 relative z-10">
        <div className="aspect-[16/9] xs:aspect-[16/9] sm:aspect-[16/9] w-full rounded-xl xs:rounded-2xl xl:rounded-3xl overflow-hidden bg-slate-100 shadow-xl shadow-slate-200/50 border border-slate-100">
          <img src={article.featuredImage} alt={article.title || 'Article featured image'} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out" />
        </div>
      </section>

      {/* Article Content */}
      <section className="w-full max-w-3xl xl:max-w-4xl 2xl:max-w-5xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 mb-4 xs:mb-6 sm:mb-8 xl:mb-10 flex-1">
        {article.bodyBlocks && article.bodyBlocks.length > 0 ? (
          <ContentOSRenderer blocks={article.bodyBlocks} />
        ) : (
          <div 
            className="prose prose-sm xs:prose-base sm:prose-lg prose-slate prose-emerald max-w-none prose-p:text-slate-700 prose-p:leading-[2.2] prose-p:tracking-[0.015em] prose-headings:font-headline prose-h2:text-2xl xs:prose-h2:text-3xl prose-h2:font-extrabold prose-h2:tracking-tight prose-h2:mb-4 xs:prose-h2:mb-6 prose-h2:mt-8 xs:prose-h2:mt-12 prose-h3:text-xl xs:prose-h3:text-2xl prose-h3:font-bold prose-a:text-primary hover:prose-a:text-emerald-800 prose-p:first-of-type:first-letter:text-5xl xs:prose-p:first-of-type:first-letter:text-7xl prose-p:first-of-type:first-letter:font-headline prose-p:first-of-type:first-letter:font-black prose-p:first-of-type:first-letter:text-primary prose-p:first-of-type:first-letter:mr-3 xs:prose-p:first-of-type:first-letter:mr-4 prose-p:first-of-type:first-letter:float-left prose-p:first-of-type:first-letter:leading-[0.8] prose-p:first-of-type:first-letter:pt-2"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        )}
        
        {/* Tags */}
        <div className="mt-6 xs:mt-8 sm:mt-12 xl:mt-16 pt-4 xs:pt-6 sm:pt-8 xl:pt-10 border-t border-slate-100 flex flex-wrap gap-2 xs:gap-2.5 sm:gap-3 xl:gap-4 items-center">
          <span className="text-[9px] xs:text-[10px] sm:text-xs xl:text-sm font-semibold text-slate-400 mr-1 xs:mr-1.5 sm:mr-2 xl:mr-3 uppercase tracking-wider">Tags:</span>
          {article.tags.map(tag => (
            <Link key={tag} to={`/blog/search?q=${tag}`} className="px-2.5 xs:px-3 sm:px-4 xl:px-5 py-1 xs:py-1.5 sm:py-2 xl:py-2.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-[9px] xs:text-[10px] sm:text-xs xl:text-sm font-semibold hover:bg-primary hover:border-primary hover:text-white hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              #{tag}
            </Link>
          ))}
        </div>
      </section>

      {/* Related Articles */}
      <section className="w-full bg-emerald-50/60 py-4 xs:py-6 sm:py-8 lg:py-10 xl:py-12 2xl:py-14 px-3 xs:px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 border-t border-emerald-100">
        <div className="max-w-7xl xl:max-w-8xl 2xl:max-w-9xl mx-auto">
          <h2 className="font-headline text-lg xs:text-xl sm:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-slate-900 mb-3 xs:mb-4 sm:mb-6 xl:mb-8 text-center">Read Next</h2>
          
          {isLoadingRelated ? (
            <BlogSkeleton />
          ) : relatedArticles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-3 xs:gap-4 sm:gap-6 xl:gap-8 2xl:gap-10">
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
