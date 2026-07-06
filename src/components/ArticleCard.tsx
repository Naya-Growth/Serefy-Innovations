import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';
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


export default function ArticleCard({
  id,
  title,
  excerpt,
  featuredImage,
  authorName,
  publishDate,
  category,
  variant = 'default'
}: ArticleCardProps) {
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
          <div className="relative aspect-[16/9] overflow-hidden">
            <img
              src={featuredImage || PLACEHOLDER_IMG}
              alt={title}
              onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMG; }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <span className="inline-block px-3 py-1 bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider rounded-full">
                {category}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            <h2 className="font-headline text-xl md:text-2xl font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors line-clamp-2">
              {title}
            </h2>
            <p className="text-slate-600 mb-4 line-clamp-2 leading-relaxed">
              {excerpt}
            </p>

            {/* Meta */}
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <User size={16} />
                <span className="font-medium">{authorName}</span>
              </div>
              <div className="flex items-center gap-2">
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
          className="flex gap-4 p-4 rounded-xl bg-white border border-slate-100 hover:border-emerald-200 hover:shadow-md transition-all duration-300"
        >
          {/* Thumbnail */}
          <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
            <img
              src={featuredImage || PLACEHOLDER_IMG}
              alt={title}
              onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMG; }}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <span className="inline-block text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
              {category}
            </span>
            <h3 className="font-headline font-bold text-slate-900 mb-1 line-clamp-2 group-hover:text-emerald-700 transition-colors">
              {title}
            </h3>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span>{formatDate(publishDate)}</span>
              <span>•</span>
              <span>{authorName}</span>
            </div>
          </div>
        </motion.div>
      </Link>
    );
  }

  // Default variant
  return (
    <Link to={`/blog/${id}`} className="group block">
      <motion.div
        whileHover={{ y: -4 }}
        className="h-full flex flex-col overflow-hidden rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all duration-300"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          <img
            src={featuredImage || PLACEHOLDER_IMG}
            alt={title}
            onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMG; }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3">
            <span className="inline-block px-2.5 py-1 bg-white/90 backdrop-blur-sm text-emerald-700 text-[10px] font-bold uppercase tracking-wider rounded-full">
              {category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 flex flex-col">
          <h3 className="font-headline font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-emerald-700 transition-colors">
            {title}
          </h3>
          <p className="text-slate-600 text-sm mb-4 line-clamp-3 flex-1 leading-relaxed">
            {excerpt}
          </p>

          {/* Meta */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <User size={14} />
              <span className="font-medium">{authorName}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Calendar size={14} />
              <span>{formatDate(publishDate)}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
