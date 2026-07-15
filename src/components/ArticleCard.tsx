import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User } from 'lucide-react';
import { motion } from 'motion/react';

interface ArticleCardProps {
  id: string;
  title: string;
  excerpt: string;
  featuredImage: string;
  authorName: string;
  publishDate: string;
  category: string;
  variant?: 'default' | 'featured' | 'compact';
}

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=1000&auto=format&fit=crop';

const ArticleCard: React.FC<ArticleCardProps> = ({
  id,
  title,
  excerpt,
  featuredImage,
  authorName,
  publishDate,
  category,
  variant = 'default'
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (variant === 'featured') {
    return (
      <Link to={`/blog/${id}`} className="group block">
        <motion.div
          whileHover={{ y: -4 }}
          className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {/* Featured Image */}
          <div className="relative aspect-[16/9] xs:aspect-[16/9] sm:aspect-[16/9] overflow-hidden bg-slate-100">
            <img
              src={featuredImage || PLACEHOLDER_IMG}
              alt={title || 'Article image'}
              onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMG; }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* Category Badge */}
            <div className="absolute top-2 left-2 xs:top-2.5 xs:left-2.5 sm:top-3 sm:left-3 md:top-4 md:left-4 xl:top-5 xl:left-5 2xl:top-6 2xl:left-6 z-10">
              <span className="inline-block px-2 py-0.75 xs:px-2.5 xs:py-1 sm:px-3 sm:py-1 md:px-3.5 md:py-1.25 xl:px-4 xl:py-1.5 2xl:px-5 2xl:py-2 bg-emerald-600 text-white text-[9px] xs:text-[10px] sm:text-xs md:text-sm xl:text-base 2xl:text-lg font-bold uppercase tracking-wider rounded-full shadow-md whitespace-nowrap">
                {category || 'Article'}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-3 xs:p-3.5 sm:p-4 md:p-5 lg:p-6 xl:p-7 2xl:p-8">
            <h2 className="font-headline text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-slate-900 mb-2 xs:mb-2.5 sm:mb-3 xl:mb-4 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-tight">
              {title || 'Untitled'}
            </h2>
            <p className="text-slate-600 text-[11px] xs:text-xs sm:text-sm md:text-base xl:text-lg 2xl:text-xl mb-2.5 xs:mb-3 sm:mb-4 xl:mb-5 line-clamp-2 leading-relaxed">
              {excerpt || 'No summary available.'}
            </p>

            {/* Meta */}
            <div className="flex items-center gap-2 xs:gap-2.5 sm:gap-3 xl:gap-4 text-[9px] xs:text-[10px] sm:text-xs md:text-sm xl:text-base 2xl:text-lg text-slate-500">
              <div className="flex items-center gap-1 xs:gap-1.5">
                <User size={16} />
                <span className="font-medium truncate max-w-[80px] xs:max-w-[100px] sm:max-w-[150px] md:max-w-[200px] xl:max-w-[250px] 2xl:max-w-[300px]">{authorName || 'Unknown'}</span>
              </div>
              <div className="flex items-center gap-1 xs:gap-1.5">
                <Calendar size={16} />
                <span>{formatDate(publishDate)}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link to={`/blog/${id}`} className="group block">
        <motion.div
          whileHover={{ x: 4 }}
          className="flex gap-2.5 xs:gap-3 sm:gap-4 p-2.5 xs:p-3 sm:p-4 rounded-xl bg-white border border-slate-100 hover:border-emerald-200 hover:shadow-md transition-all duration-300"
        >
          {/* Thumbnail */}
          <div className="relative w-14 h-14 xs:w-16 xs:h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 xl:w-28 xl:h-28 2xl:w-32 2xl:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100">
            <img
              src={featuredImage || PLACEHOLDER_IMG}
              alt={title || 'Article image'}
              onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMG; }}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              loading="lazy"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <span className="inline-block text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs xl:text-sm 2xl:text-base font-bold text-emerald-700 uppercase tracking-wider mb-0.5 xs:mb-1 truncate">
              {category || 'Article'}
            </span>
            <h3 className="font-headline font-bold text-slate-900 mb-0.5 xs:mb-1 line-clamp-2 group-hover:text-emerald-700 transition-colors text-[11px] xs:text-xs sm:text-sm md:text-base xl:text-lg 2xl:text-xl leading-tight">
              {title || 'Untitled'}
            </h3>
            <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 xl:gap-2.5 text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs xl:text-sm 2xl:text-base text-slate-500">
              <span className="truncate">{formatDate(publishDate)}</span>
              <span>•</span>
              <span className="truncate max-w-[60px] xs:max-w-[70px] sm:max-w-[100px] md:max-w-[120px] xl:max-w-[150px] 2xl:max-w-[180px]">{authorName || 'Unknown'}</span>
            </div>
          </div>
        </motion.div>
      </Link>
    );
  }

  // Default variant
  return (
    <Link to={`/blog/${id}`} className="group block h-full">
      <motion.div
        whileHover={{ y: -4 }}
        className="h-full flex flex-col overflow-hidden rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all duration-300"
      >
        {/* Image */}
        <div className="relative aspect-[16/10] xs:aspect-[16/9] sm:aspect-[16/9] overflow-hidden bg-slate-100">
          <img
            src={featuredImage || PLACEHOLDER_IMG}
            alt={title || 'Article image'}
            onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMG; }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute top-2 left-2 xs:top-2.5 xs:left-2.5 sm:top-3 sm:left-3 xl:top-4 xl:left-4 2xl:top-5 2xl:left-5 z-10">
            <span className="inline-block px-1.5 py-0.5 xs:px-2 xs:py-0.75 sm:px-2.5 sm:py-1 xl:px-3 xl:py-1.25 2xl:px-3.5 2xl:py-1.5 bg-white/90 backdrop-blur-sm text-emerald-700 text-[8px] xs:text-[9px] sm:text-[10px] xl:text-xs 2xl:text-sm font-bold uppercase tracking-wider rounded-full shadow-sm whitespace-nowrap">
              {category || 'Article'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-3 xs:p-3.5 sm:p-4 xl:p-5 2xl:p-6 flex flex-col">
          <h3 className="font-headline font-bold text-slate-900 mb-1 xs:mb-1.5 sm:mb-2 xl:mb-3 line-clamp-2 group-hover:text-emerald-700 transition-colors text-xs xs:text-sm sm:text-base xl:text-lg 2xl:text-xl leading-tight">
            {title || 'Untitled'}
          </h3>
          <p className="text-slate-600 text-[10px] xs:text-[11px] sm:text-xs xl:text-sm 2xl:text-base mb-2 xs:mb-2.5 sm:mb-3 xl:mb-4 line-clamp-3 flex-1 leading-relaxed">
            {excerpt || 'No summary available.'}
          </p>

          {/* Meta */}
          <div className="flex items-center justify-between pt-2 xs:pt-2.5 sm:pt-3 xl:pt-4 border-t border-slate-100 mt-auto">
            <div className="flex items-center gap-1 xs:gap-1.5 text-[8px] xs:text-[9px] sm:text-[10px] text-slate-500">
              <User size={14} />
              <span className="font-medium truncate max-w-[60px] xs:max-w-[70px] sm:max-w-[100px] xl:max-w-[120px] 2xl:max-w-[150px]">{authorName || 'Unknown'}</span>
            </div>
            <div className="flex items-center gap-1 xs:gap-1.5 text-[8px] xs:text-[9px] sm:text-[10px] text-slate-500">
              <Calendar size={14} />
              <span>{formatDate(publishDate)}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ArticleCard;
