import { supabase } from '@/integrations/supabase/client';

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  featured_image_url: string | null;
  status: 'draft' | 'published';
  tags: string[] | null;
  slug: string | null;
  author_id: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export const blogApi = {
  async getAllPosts(): Promise<BlogPost[]> {
    console.log('Fetching all blog posts...');
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching blog posts:', error);
      throw error;
    }

    console.log('Fetched blog posts:', data);
    return data as BlogPost[];
  },

  async getPublishedPosts(): Promise<BlogPost[]> {
    console.log('Fetching published blog posts...');
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Error fetching published posts:', error);
      return [];
    }

    console.log('Fetched published posts:', data);
    return (data || []) as BlogPost[];
  },

  async createPost(post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>): Promise<BlogPost> {
    console.log('Creating blog post:', post);

    const slug = post.slug || post.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const postData = {
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      featured_image_url: post.featured_image_url,
      tags: post.tags,
      status: post.status,
      slug,
      author_id: post.author_id,
      published_at: post.status === 'published' ? new Date().toISOString() : null,
    };

    const { data, error } = await supabase
      .from('blog_posts')
      .insert([postData])
      .select()
      .single();

    if (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }

    console.log('Created blog post:', data);
    return data as BlogPost;
  },

  async updatePost(id: string, updates: Partial<BlogPost>): Promise<BlogPost> {
    console.log('Updating blog post:', id, updates);

    const updateData = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    if (updates.status === 'published' && !updates.published_at) {
      updateData.published_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating blog post:', error);
      throw error;
    }

    console.log('Updated blog post:', data);
    return data as BlogPost;
  },

  async deletePost(id: string): Promise<void> {
    console.log('Deleting blog post:', id);
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting blog post:', error);
      throw error;
    }

    console.log('Deleted blog post:', id);
  }
};
