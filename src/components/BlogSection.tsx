import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from "react-router-dom";


interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  featured_image_url: string;
  tags: string[];
  status: string;
  author_id: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  slug: string;
}

const BlogSection = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      
      // Transform data to match BlogPost interface
      const transformedPosts: BlogPost[] = (data || []).map(post => ({
        id: post.id,
        title: post.title,
        excerpt: post.excerpt || '',
        content: post.content,
        featured_image_url: post.featured_image_url || '',
        tags: Array.isArray(post.tags) ? post.tags.map(tag => String(tag)) : [],
        status: post.status,
        author_id: post.author_id || '',
        published_at: post.published_at || '',
        created_at: post.created_at,
        updated_at: post.updated_at,
        slug: post.slug || post.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
      }));
      
      setPosts(transformedPosts);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Latest Blog Posts</h2>
            <p className="text-gray-600">Stay updated with industry insights and career tips</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="h-48 bg-gray-300 rounded-t-lg"></div>
                <CardHeader>
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Latest Blog Posts</h2>
          <p className="text-gray-600">Stay updated with industry insights and career tips</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
              {post.featured_image_url && (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={post.featured_image_url} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.published_at).toLocaleDateString()}
                </div>
                <CardTitle className="text-lg hover:text-blue-600 transition-colors">
                  {post.title}
                </CardTitle>
              </CardHeader>
             <CardContent>
  <p className="text-gray-600 mb-4 line-clamp-3">
    {post.excerpt}
  </p>
  <div className="flex flex-wrap gap-2 mb-4">
    {post.tags?.slice(0, 3).map((tag, index) => (
      <Badge key={index} variant="secondary" className="text-xs">
        {tag}
      </Badge>
    ))}
  </div>
  <Link to={`/blog/${post.slug}`}>
    <Button variant="ghost" size="sm" className="group">
      Read More
      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
    </Button>
  </Link>
</CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
  <Link to="/blog">
    <Button variant="outline" size="lg">
      View All Posts
    </Button>
  </Link>
</div>
      </div>
    </section>
  );
};

export default BlogSection;
