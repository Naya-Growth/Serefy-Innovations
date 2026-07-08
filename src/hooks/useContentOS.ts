import { useState, useEffect } from 'react';
import { Article, ContentOSAuthor } from '../types/blog';
import { fetchPosts, fetchPostBySlug, fetchCategories, fetchAuthors } from '../lib/contentos';

export function usePosts(params?: { q?: string; category?: string; author?: string }) {
  const [posts, setPosts] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    
    fetchPosts(params)
      .then(data => {
        if (mounted) {
          setPosts(data);
          setIsLoading(false);
        }
      })
      .catch(err => {
        if (mounted) {
          setError(err);
          setIsLoading(false);
        }
      });
      
    return () => { mounted = false; };
  }, [params?.q, params?.category, params?.author]);

  return { posts, isLoading, error };
}

export function usePost(slug: string | undefined) {
  const [post, setPost] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    if (!slug) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    fetchPostBySlug(slug)
      .then(data => {
        if (mounted) {
          setPost(data);
          setIsLoading(false);
        }
      })
      .catch(err => {
        if (mounted) {
          setError(err);
          setIsLoading(false);
        }
      });
      
    return () => { mounted = false; };
  }, [slug]);

  return { post, isLoading, error };
}

export function useCategories() {
  const [categories, setCategories] = useState<string[]>(['All']);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchCategories()
      .then(data => {
        if (mounted) {
          setCategories(data);
          setIsLoading(false);
        }
      })
      .catch(err => {
        console.error('Failed to load categories', err);
        if (mounted) setIsLoading(false);
      });
      
    return () => { mounted = false; };
  }, []);

  return { categories, isLoading };
}

export function useAuthors() {
  const [authors, setAuthors] = useState<ContentOSAuthor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchAuthors()
      .then(data => {
        if (mounted) {
          setAuthors(data);
          setIsLoading(false);
        }
      })
      .catch(err => {
        console.error('Failed to load authors', err);
        if (mounted) setIsLoading(false);
      });
      
    return () => { mounted = false; };
  }, []);

  return { authors, isLoading };
}
