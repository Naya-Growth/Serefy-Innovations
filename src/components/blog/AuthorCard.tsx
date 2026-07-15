import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Twitter, Linkedin, User } from 'lucide-react';
import { Author } from '../../types/blog';

interface AuthorCardProps {
  author: Author;
  layout?: 'row' | 'column';
  showSocials?: boolean;
  className?: string;
}

export default function AuthorCard({ 
  author, 
  layout = 'row', 
  showSocials = true,
  className = ''
}: AuthorCardProps) {
  const isRow = layout === 'row';

  return (
    <div className={`flex ${isRow ? 'flex-col md:flex-row items-center md:items-start' : 'flex-col items-center text-center'} gap-8 ${className}`}>
      <Link to={`/blog/author/${author.slug}`} className="shrink-0 group">
        <div className={`rounded-full bg-emerald-100 flex items-center justify-center text-primary font-bold border-4 border-emerald-50 group-hover:scale-105 transition-transform ${isRow ? 'w-32 h-32 text-5xl' : 'w-24 h-24 text-4xl'}`}>
          {author.avatar || <User size={isRow ? 48 : 32} />}
        </div>
      </Link>
      
      <div className={`flex-1 ${!isRow && 'flex flex-col items-center'}`}>
        <Link to={`/blog/author/${author.slug}`}>
          <h2 className={`font-headline font-extrabold text-slate-900 mb-2 hover:text-primary transition-colors ${isRow ? 'text-4xl' : 'text-3xl'}`}>
            {author.name}
          </h2>
        </Link>
        <p className="text-primary font-semibold mb-4">{author.role}</p>
        
        {author.bio && (
          <p className={`text-slate-600 text-lg leading-relaxed mb-6 ${isRow ? 'max-w-2xl md:text-left text-center' : ''}`}>
            {author.bio}
          </p>
        )}
        
        {showSocials && (
          <div className={`flex items-center gap-3 ${isRow ? 'justify-center md:justify-start' : 'justify-center'}`}>
            <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-[#1DA1F2] hover:text-white transition-colors">
              <Twitter size={18} />
            </button>
            <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-[#0A66C2] hover:text-white transition-colors">
              <Linkedin size={18} />
            </button>
            <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-emerald-600 hover:text-white transition-colors">
              <Mail size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
