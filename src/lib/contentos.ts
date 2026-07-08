import { Article, Category, ContentOSAuthor } from '../types/blog';

// NayaGrowth API base url
const CONTENTOS_API_BASE = "https://api.nayagrowth.com/api/content/public/publications/serefy-innovations";

// Helper to calculate reading time
const calculateReadTime = (text: string | null): string => {
  if (!text) return '3 min read';
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
};

// Helper to format date
const formatDate = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD for now
  } catch {
    return isoString;
  }
};

// Map ContentOS post to Frontend Article interface
const mapPostToArticle = (post: any): Article => {
  const metadata = post.body?.metadata || {};
  const taxonomy = metadata.taxonomy || {};
  const categories = Array.isArray(taxonomy.categories) ? taxonomy.categories : [];
  const tags = Array.isArray(taxonomy.tags) ? taxonomy.tags : [];
  
  // Extract featured image from OpenGraph, fallback to the checked public cover.
  const featuredImage = post.seo?.social?.openGraph?.image || 
                        post.social?.openGraph?.image || 
                        '/media/og-cover.jpg';
                        
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || '',
    content: post.bodyText || '', // We'll use blocks for rendering in detail page
    bodyBlocks: post.body?.blocks || [],
    featuredImage,
    author: {
      name: post.authorName || post.author?.fullName || 'Content Ops',
      slug: post.author?.id || 'unknown',
      avatar: post.author?.avatar || undefined,
      role: 'Contributor', // ContentOS doesn't provide role by default
      bio: post.author?.bio || undefined
    },
    publishDate: formatDate(post.publishedAt),
    category: categories.length > 0 ? categories[0] : 'Uncategorized',
    tags,
    readTime: calculateReadTime(post.bodyText),
    seo: {
      title: post.seo?.title,
      description: post.seo?.description,
      canonicalUrl: post.canonicalUrl,
      schemaJsonLd: post.schemaJsonLd,
      social: post.social
    }
  };
};

export async function fetchPosts(params?: {
  q?: string;
  category?: string;
  author?: string;
}): Promise<Article[]> {
  const url = new URL(`${CONTENTOS_API_BASE}/posts`);
  if (params?.q) url.searchParams.append('q', params.q);
  if (params?.category && params.category !== 'All') url.searchParams.append('category', params.category);
  if (params?.author) url.searchParams.append('author', params.author);
  
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  
  const data = await response.json();
  return (data.posts || []).map(mapPostToArticle);
}

export async function fetchPostBySlug(slug: string): Promise<Article | null> {
  try {
    const response = await fetch(`${CONTENTOS_API_BASE}/posts/${slug}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to fetch post');
    }
    
    const data = await response.json();
    return mapPostToArticle(data.post);
  } catch (err) {
    console.error('Error fetching post by slug', err);
    return null;
  }
}

export async function fetchCategories(): Promise<string[]> {
  const response = await fetch(`${CONTENTOS_API_BASE}/categories`);
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  
  const data = await response.json();
  return ['All', ...(data.categories || []).map((c: Category) => c.name)];
}

export async function fetchAuthors(): Promise<ContentOSAuthor[]> {
  const response = await fetch(`${CONTENTOS_API_BASE}/authors`);
  if (!response.ok) {
    throw new Error('Failed to fetch authors');
  }
  
  const data = await response.json();
  return data.authors || [];
}
