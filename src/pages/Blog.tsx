import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, ArrowRight, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '@/components/Footer';
import { blogApi, BlogPost } from '@/lib/api/blog';

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [popularTags, setPopularTags] = useState<Array<{ tag: string; count: number }>>([]);

  useEffect(() => {
    fetchPosts();
    fetchPopularTags();
  }, [currentPage, selectedTag]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const publishedPosts = await blogApi.getPublishedPosts(currentPage, 20);
      setPosts(publishedPosts);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPopularTags = async () => {
    try {
      const tags = await blogApi.getPopularTags(10);
      setPopularTags(tags);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      fetchPosts();
      return;
    }

    try {
      setLoading(true);
      const searchResults = await blogApi.getPublishedPosts(1, 20);
      const filteredPosts = searchResults.filter(
        post =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setPosts(filteredPosts);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error searching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTagFilter = async (tag: string) => {
    setSelectedTag(tag);
    setCurrentPage(1);

    if (tag === 'all') {
      fetchPosts();
      return;
    }

    try {
      setLoading(true);
      const allPosts = await blogApi.getPublishedPosts(1, 20);
      const filteredPosts = allPosts.filter(post => post.tags?.includes(tag));
      setPosts(filteredPosts);
    } catch (error) {
      console.error('Error filtering by tag:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Navbar /> */}

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">MinuteHire Blog</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Stay updated with the latest industry insights, career tips, and HR trends
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-md mx-auto">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 text-gray-900"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Button
                type="submit"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                Search
              </Button>
            </div>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Filter Bar */}
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Filter by tag:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedTag === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleTagFilter('all')}
                  >
                    All
                  </Button>
                  {popularTags.slice(0, 6).map(tagData => (
                    <Button
                      key={tagData.tag}
                      variant={selectedTag === tagData.tag ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleTagFilter(tagData.tag)}
                    >
                      {tagData.tag} ({tagData.count})
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Blog Posts Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
            ) : posts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No posts found</h3>
                <p className="text-gray-500">
                  {searchTerm || selectedTag !== 'all'
                    ? 'Try adjusting your search or filters.'
                    : 'Check back later for new content.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {posts.map(post => (
                  <Card
                    key={post.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow duration-200 group"
                  >
                    {post.featured_image_url && (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={post.featured_image_url}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <Calendar className="h-4 w-4" />
                        {post.published_at
                          ? new Date(post.published_at).toLocaleDateString()
                          : new Date(post.created_at).toLocaleDateString()}
                      </div>
                      <CardTitle className="text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
                        <Link to={post.slug ? `/blog/${post.slug}` : `/blog/post/${post.id}`}>
                          {post.title}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.excerpt || post.content.substring(0, 150) + '...'}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags?.slice(0, 3).map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs cursor-pointer hover:bg-blue-100"
                            onClick={() => handleTagFilter(tag)}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Link to={post.slug ? `/blog/${post.slug}` : `/blog/post/${post.id}`}>
                        <Button variant="ghost" size="sm" className="group-hover:text-blue-600">
                          Read More
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="sticky top-8 space-y-6">
              {/* Popular Tags */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Popular Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map(tagData => (
                      <Badge
                        key={tagData.tag}
                        variant="outline"
                        className="cursor-pointer hover:bg-blue-50 hover:border-blue-300"
                        onClick={() => handleTagFilter(tagData.tag)}
                      >
                        {tagData.tag} ({tagData.count})
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Newsletter Signup */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Stay Updated</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Get the latest insights delivered to your inbox.
                  </p>
                  <form className="space-y-3">
                    <Input placeholder="Your email address" type="email" />
                    <Button className="w-full" size="sm">
                      Subscribe
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Blog;
