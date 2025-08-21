

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
    // Mock data
    const mockPosts: BlogPost[] = [
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
    ];
    console.log('Fetched blog posts:', mockPosts);
    return mockPosts;
  },

  async getPublishedPosts(): Promise<BlogPost[]> {
    console.log('Fetching published blog posts...');
    const allPosts = await this.getAllPosts();
    const publishedPosts = allPosts.filter(post => post.status === 'published');
    console.log('Fetched published posts:', publishedPosts);
    return publishedPosts;
  },

  async createPost(post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>): Promise<BlogPost> {
    console.log('Creating blog post:', post);
    // Mock create functionality
    const newPost: BlogPost = {
      ...post,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    console.log('Created blog post:', newPost);
    return newPost;
  },

  async updatePost(id: string, updates: Partial<BlogPost>): Promise<BlogPost> {
    console.log('Updating blog post:', id, updates);
    // Mock update functionality
    const updatedPost: BlogPost = {
      id,
      title: 'Updated Post',
      content: 'Updated content',
      excerpt: null,
      featured_image_url: null,
      status: 'published',
      tags: null,
      slug: null,
      author_id: null,
      published_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...updates
    };
    console.log('Updated blog post:', updatedPost);
    return updatedPost;
  },

  async deletePost(id: string): Promise<void> {
    console.log('Deleting blog post:', id);
    // Mock delete functionality
    console.log('Deleted blog post:', id);
  }
};
