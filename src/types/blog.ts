export interface Author {
  name: string;
  slug: string;
  avatar?: string;
  bio?: string;
  role?: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Keep this for now or migrate to body.blocks
  featuredImage: string;
  author: Author;
  publishDate: string;
  category: string;
  tags: string[];
  readTime: string;
  
  // Extra fields for ContentOS mapping
  bodyBlocks?: any[];
  seo?: {
    title?: string | null;
    description?: string | null;
    canonicalUrl?: string | null;
    schemaJsonLd?: string | null;
    social?: any;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  postCount: number;
}

export interface ContentOSAuthor {
  id: string;
  fullName: string;
  avatar: string | null;
  bio: string | null;
  articleCount: number;
}
