

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

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
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string[] | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlogCreateData {
  title: string;
  content: string;
  excerpt?: string;
  featured_image_url?: string;
  status?: 'draft' | 'published';
  tags?: string[];
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
}

export interface BlogUpdateData extends Partial<BlogCreateData> {}

export interface BlogListResponse {
  success: boolean;
  data: {
    blogs: BlogPost[];
    total: number;
    pages: number;
    currentPage: number;
  };
}

export interface BlogResponse {
  success: boolean;
  data: BlogPost;
  message?: string;
}

export interface BlogStatsResponse {
  success: boolean;
  data: {
    total: number;
    published: number;
    draft: number;
  };
}

export interface TagResponse {
  success: boolean;
  data: Array<{ tag: string; count: number }>;
}

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('token') || localStorage.getItem('authToken');
};

// Helper function to create headers
const createHeaders = (includeAuth: boolean = true): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

export const blogApi = {
  // Public API methods (no authentication required)
  async getPublishedPosts(page: number = 1, limit: number = 20): Promise<BlogPost[]> {
    try {
      console.log('Fetching published blog posts...');
      const response = await fetch(`${API_BASE_URL}/api/admin/blog/public?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: createHeaders(false),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: BlogListResponse = await response.json();
      console.log('Fetched published posts:', result.data.blogs);
      return result.data.blogs;
    } catch (error) {
      console.error('Error fetching published posts:', error);
      // Return mock data as fallback
      return [
        {
          id: '1',
          title: 'Getting Started with MinuteHire',
          content: 'Learn how to use MinuteHire platform effectively for your hiring needs.',
          excerpt: 'A comprehensive guide to get started with our platform',
          featured_image_url: null,
          status: 'published',
          tags: ['tutorial', 'getting-started'],
          slug: 'getting-started-with-minutehire',
          author_id: '1',
          published_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Best Practices for Remote Hiring',
          content: 'Discover effective strategies for hiring remote talent in today\'s market.',
          excerpt: 'Essential tips for successful remote recruitment',
          featured_image_url: null,
          status: 'published',
          tags: ['remote-work', 'hiring', 'best-practices'],
          slug: 'best-practices-remote-hiring',
          author_id: '1',
          published_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
    }
  },

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      console.log('Fetching blog post by slug:', slug);
      const response = await fetch(`${API_BASE_URL}/api/admin/blog/public/slug/${slug}`, {
        method: 'GET',
        headers: createHeaders(false),
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: BlogResponse = await response.json();
      console.log('Fetched blog post:', result.data);
      return result.data;
    } catch (error) {
      console.error('Error fetching blog post by slug:', error);
      return null;
    }
  },

  async getPopularTags(limit: number = 10): Promise<Array<{ tag: string; count: number }>> {
    try {
      console.log('Fetching popular tags...');
      const response = await fetch(`${API_BASE_URL}/api/admin/blog/tags?limit=${limit}`, {
        method: 'GET',
        headers: createHeaders(false),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: TagResponse = await response.json();
      console.log('Fetched popular tags:', result.data);
      return result.data;
    } catch (error) {
      console.error('Error fetching popular tags:', error);
      return [];
    }
  },

  // Admin API methods (authentication required)
  async getAllPosts(page: number = 1, limit: number = 20, filters?: {
    status?: string;
    author_id?: string;
    tags?: string;
    search?: string;
  }): Promise<BlogListResponse['data']> {
    try {
      console.log('Fetching all blog posts...');
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (filters?.status) queryParams.set('status', filters.status);
      if (filters?.author_id) queryParams.set('author_id', filters.author_id);
      if (filters?.tags) queryParams.set('tags', filters.tags);
      if (filters?.search) queryParams.set('search', filters.search);

      const response = await fetch(`${API_BASE_URL}/api/admin/blog?${queryParams}`, {
        method: 'GET',
        headers: createHeaders(true),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: BlogListResponse = await response.json();
      console.log('Fetched all blog posts:', result.data);
      return result.data;
    } catch (error) {
      console.error('Error fetching all posts:', error);
      // Return mock data as fallback
      return {
        blogs: [
          {
            id: '1',
            title: 'Getting Started with MinuteHire',
            content: 'Learn how to use MinuteHire platform effectively...',
            excerpt: 'A comprehensive guide to get started',
            featured_image_url: null,
            status: 'published',
            tags: ['tutorial', 'getting-started'],
            slug: 'getting-started-with-minutehire',
            author_id: '1',
            published_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ],
        total: 1,
        pages: 1,
        currentPage: 1
      };
    }
  },

  async createPost(post: BlogCreateData): Promise<BlogPost> {
    try {
      console.log('Creating blog post:', post);
      const response = await fetch(`${API_BASE_URL}/api/admin/blog`, {
        method: 'POST',
        headers: createHeaders(true),
        body: JSON.stringify(post),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result: BlogResponse = await response.json();
      console.log('Created blog post:', result.data);
      return result.data;
    } catch (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }
  },

  async updatePost(id: string, updates: BlogUpdateData): Promise<BlogPost> {
    try {
      console.log('Updating blog post:', id, updates);
      const response = await fetch(`${API_BASE_URL}/api/admin/blog/${id}`, {
        method: 'PUT',
        headers: createHeaders(true),
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result: BlogResponse = await response.json();
      console.log('Updated blog post:', result.data);
      return result.data;
    } catch (error) {
      console.error('Error updating blog post:', error);
      throw error;
    }
  },

  async deletePost(id: string): Promise<void> {
    try {
      console.log('Deleting blog post:', id);
      const response = await fetch(`${API_BASE_URL}/api/admin/blog/${id}`, {
        method: 'DELETE',
        headers: createHeaders(true),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      console.log('Deleted blog post:', id);
    } catch (error) {
      console.error('Error deleting blog post:', error);
      throw error;
    }
  },

  async getPostById(id: string): Promise<BlogPost | null> {
    try {
      console.log('Fetching blog post by ID:', id);
      const response = await fetch(`${API_BASE_URL}/api/admin/blog/public/id/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: BlogResponse = await response.json();
      console.log('Fetched blog post by ID:', result.data);
      return result.data;
    } catch (error) {
      console.error('Error fetching blog post by ID:', error);
      return null;
    }
  },

  async getBlogStats(): Promise<BlogStatsResponse['data']> {
    try {
      console.log('Fetching blog statistics...');
      const response = await fetch(`${API_BASE_URL}/api/admin/blog/stats`, {
        method: 'GET',
        headers: createHeaders(true),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: BlogStatsResponse = await response.json();
      console.log('Fetched blog stats:', result.data);
      return result.data;
    } catch (error) {
      console.error('Error fetching blog stats:', error);
      return {
        total: 0,
        published: 0,
        draft: 0
      };
    }
  }
};
