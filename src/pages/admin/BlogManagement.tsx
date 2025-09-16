import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pencil, Plus, Trash2, Eye, Calendar, User, Search, BarChart3 } from 'lucide-react';

import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { blogApi, BlogPost, BlogCreateData, BlogUpdateData } from '@/lib/api/blog';

const BlogManagement = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0 });

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    featured_image_url: '',
    tags: '',
    status: 'draft' as 'draft' | 'published',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
  });

  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
    fetchStats();
  }, [currentPage, statusFilter, searchTerm]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const filters: any = {};

      if (statusFilter !== 'all') {
        filters.status = statusFilter;
      }

      if (searchTerm.trim()) {
        filters.search = searchTerm.trim();
      }

      const result = await blogApi.getAllPosts(currentPage, 20, filters);
      setPosts(result.blogs);
      setTotalPages(result.pages);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to fetch blog posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await blogApi.getBlogStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleCreatePost = async () => {
    try {
      if (!formData.title.trim() || !formData.content.trim()) {
        toast.error('Title and content are required');
        return;
      }

      const postData: BlogCreateData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        excerpt: formData.excerpt.trim() || undefined,
        featured_image_url: formData.featured_image_url.trim() || undefined,
        status: formData.status,
        tags: formData.tags.trim()
          ? formData.tags
              .split(',')
              .map(tag => tag.trim())
              .filter(Boolean)
          : undefined,
        meta_title: formData.meta_title.trim() || undefined,
        meta_description: formData.meta_description.trim() || undefined,
        meta_keywords: formData.meta_keywords.trim()
          ? formData.meta_keywords
              .split(',')
              .map(keyword => keyword.trim())
              .filter(Boolean)
          : undefined,
      };

      await blogApi.createPost(postData);
      toast.success('Blog post created successfully');
      setIsCreateModalOpen(false);
      resetForm();
      fetchPosts();
      fetchStats();
    } catch (error: any) {
      console.error('Error creating post:', error);
      toast.error(error.message || 'Failed to create blog post');
    }
  };
  const handleEditPost = async () => {
    if (!selectedPost) return;

    try {
      if (!formData.title.trim() || !formData.content.trim()) {
        toast.error('Title and content are required');
        return;
      }

      const updateData: BlogUpdateData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        excerpt: formData.excerpt.trim() || undefined,
        featured_image_url: formData.featured_image_url.trim() || undefined,
        status: formData.status,
        tags: formData.tags.trim()
          ? formData.tags
              .split(',')
              .map(tag => tag.trim())
              .filter(Boolean)
          : undefined,
        meta_title: formData.meta_title.trim() || undefined,
        meta_description: formData.meta_description.trim() || undefined,
        meta_keywords: formData.meta_keywords.trim()
          ? formData.meta_keywords
              .split(',')
              .map(keyword => keyword.trim())
              .filter(Boolean)
          : undefined,
      };

      await blogApi.updatePost(selectedPost.id, updateData);
      toast.success('Blog post updated successfully');
      setIsEditModalOpen(false);
      setSelectedPost(null);
      resetForm();
      fetchPosts();
      fetchStats();
    } catch (error: any) {
      console.error('Error updating post:', error);
      toast.error(error.message || 'Failed to update blog post');
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await blogApi.deletePost(id);
      toast.success('Blog post deleted successfully');
      fetchPosts();
      fetchStats();
    } catch (error: any) {
      console.error('Error deleting post:', error);
      toast.error(error.message || 'Failed to delete blog post');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      featured_image_url: '',
      tags: '',
      status: 'draft',
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
    });
  };

  const openEditModal = (post: BlogPost) => {
    setSelectedPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || '',
      featured_image_url: post.featured_image_url || '',
      tags: post.tags?.join(', ') || '',
      status: post.status,
      meta_title: post.meta_title || '',
      meta_description: post.meta_description || '',
      meta_keywords: post.meta_keywords?.join(', ') || '',
    });
    setIsEditModalOpen(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPosts();
  };

  const renderFormFields = () => (
    <Tabs defaultValue="content" className="w-full">
      <TabsList className="grid w-full grid-cols-2 h-10 sm:h-11">
        <TabsTrigger value="content" className="text-xs sm:text-sm">
          Content
        </TabsTrigger>
        <TabsTrigger value="seo" className="text-xs sm:text-sm">
          SEO Settings
        </TabsTrigger>
      </TabsList>

      <TabsContent value="content" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
        <div>
          <Label htmlFor="title" className="text-sm font-medium mb-2 block">
            Title *
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter post title"
            required
            className="h-10 sm:h-11"
          />
        </div>
        <div>
          <Label htmlFor="excerpt" className="text-sm font-medium mb-2 block">
            Excerpt
          </Label>
          <Textarea
            id="excerpt"
            value={formData.excerpt}
            onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
            placeholder="Enter post excerpt (recommended for SEO)"
            rows={3}
            className="resize-none"
          />
        </div>
        <div>
          <Label htmlFor="content" className="text-sm font-medium mb-2 block">
            Content *
          </Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={e => setFormData({ ...formData, content: e.target.value })}
            placeholder="Enter post content"
            rows={8}
            required
            className="resize-none"
          />
        </div>
        <div>
          <Label htmlFor="featured_image" className="text-sm font-medium mb-2 block">
            Featured Image URL
          </Label>
          <Input
            id="featured_image"
            value={formData.featured_image_url}
            onChange={e => setFormData({ ...formData, featured_image_url: e.target.value })}
            placeholder="Enter image URL"
            className="h-10 sm:h-11"
          />
        </div>
        <div>
          <Label htmlFor="tags" className="text-sm font-medium mb-2 block">
            Tags (comma-separated)
          </Label>
          <Input
            id="tags"
            value={formData.tags}
            onChange={e => setFormData({ ...formData, tags: e.target.value })}
            placeholder="Enter tags separated by commas"
            className="h-10 sm:h-11"
          />
        </div>
        <div>
          <Label htmlFor="status" className="text-sm font-medium mb-2 block">
            Status
          </Label>
          <Select
            value={formData.status}
            onValueChange={(value: 'draft' | 'published') =>
              setFormData({ ...formData, status: value })
            }
          >
            <SelectTrigger className="h-10 sm:h-11">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </TabsContent>

      <TabsContent value="seo" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
        <div>
          <Label htmlFor="meta_title" className="text-sm font-medium mb-2 block">
            Meta Title
          </Label>
          <Input
            id="meta_title"
            value={formData.meta_title}
            onChange={e => setFormData({ ...formData, meta_title: e.target.value })}
            placeholder="SEO meta title (recommended: 50-60 characters)"
            maxLength={60}
            className="h-10 sm:h-11"
          />
          <p className="text-xs text-gray-500 mt-1">{formData.meta_title.length}/60 characters</p>
        </div>
        <div>
          <Label htmlFor="meta_description" className="text-sm font-medium mb-2 block">
            Meta Description
          </Label>
          <Textarea
            id="meta_description"
            value={formData.meta_description}
            onChange={e => setFormData({ ...formData, meta_description: e.target.value })}
            placeholder="SEO meta description (recommended: 150-160 characters)"
            rows={3}
            maxLength={160}
            className="resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.meta_description.length}/160 characters
          </p>
        </div>
        <div>
          <Label htmlFor="meta_keywords" className="text-sm font-medium mb-2 block">
            Meta Keywords (comma-separated)
          </Label>
          <Input
            id="meta_keywords"
            value={formData.meta_keywords}
            onChange={e => setFormData({ ...formData, meta_keywords: e.target.value })}
            placeholder="Enter SEO keywords separated by commas"
            className="h-10 sm:h-11"
          />
        </div>
      </TabsContent>
    </Tabs>
  );

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            Blog Management
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Create and manage SEO-optimized blog posts
          </p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsCreateModalOpen(true)} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Create Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Blog Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 sm:space-y-6">
              {renderFormFields()}
              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button onClick={handleCreatePost} className="w-full sm:w-auto">
                  Create Post
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        <Card className="p-3 sm:p-4 md:p-6 hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600 font-medium">Total Posts</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mt-1">
                  {stats.total}
                </p>
              </div>
              <div className="flex-shrink-0 ml-3">
                <BarChart3 className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-3 sm:p-4 md:p-6 hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600 font-medium">Published</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600 mt-1">
                  {stats.published}
                </p>
              </div>
              <div className="flex-shrink-0 ml-3">
                <Eye className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-3 sm:p-4 md:p-6 hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600 font-medium">Drafts</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-600 mt-1">
                  {stats.draft}
                </p>
              </div>
              <div className="flex-shrink-0 ml-3">
                <Pencil className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-3 sm:p-4 md:p-6">
        <CardContent className="p-0">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Search Section */}
            <div className="flex-1 min-w-0">
              <Label htmlFor="search" className="text-sm font-medium mb-2 block">
                Search Posts
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search by title, content, or tags..."
                  className="pl-10 pr-4 py-2.5 text-sm w-full h-11"
                />
              </div>
            </div>

            {/* Filter and Search Button Section */}
            <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
              <div className="flex-1 min-w-0">
                <Label htmlFor="status-filter" className="text-sm font-medium mb-2 block">
                  Status
                </Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full h-11">
                    <SelectValue placeholder="All Posts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Posts</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                  }}
                  className="flex-1 xs:flex-none h-11 px-4"
                >
                  Clear
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setCurrentPage(1);
                    fetchPosts();
                  }}
                  className="flex-1 xs:flex-none h-11 px-4"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Blog Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 sm:py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm sm:text-base">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <p className="text-sm sm:text-base text-gray-500">No blog posts found.</p>
              <Button className="mt-4 w-full sm:w-auto" onClick={() => setIsCreateModalOpen(true)}>
                Create Your First Post
              </Button>
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="block md:hidden space-y-3">
                {posts.map(post => (
                  <Card key={post.id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm text-gray-900 truncate">
                            {post.title}
                          </h3>
                          {post.excerpt && (
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {post.excerpt}
                            </p>
                          )}
                        </div>
                        <Badge
                          variant={post.status === 'published' ? 'default' : 'secondary'}
                          className="ml-2 text-xs"
                        >
                          {post.status}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(post.created_at).toLocaleDateString()}
                        </div>
                        {post.tags && post.tags.length > 0 && (
                          <span>
                            {post.tags.length} tag{post.tags.length > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        {post.status === 'published' && post.published_at && (
                          <span className="text-xs text-green-600">
                            Published {new Date(post.published_at).toLocaleDateString()}
                          </span>
                        )}
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditModal(post)}
                            className="h-8 px-2"
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePost(post.id)}
                            className="h-8 px-2"
                          >
                            <Trash2 className="h-3 w-3 text-red-500" />
                          </Button>
                          {post.status === 'published' && post.slug && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                              className="h-8 px-2"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {posts.map(post => (
                      <TableRow key={post.id}>
                        <TableCell className="font-medium">
                          <div>
                            <p className="font-semibold">{post.title}</p>
                            {post.excerpt && (
                              <p className="text-sm text-gray-500 truncate max-w-xs">
                                {post.excerpt}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                            {post.status}
                          </Badge>
                          {post.status === 'published' && post.published_at && (
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(post.published_at).toLocaleDateString()}
                            </p>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {post.tags?.slice(0, 2).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {post.tags && post.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{post.tags.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="h-3 w-3" />
                            {new Date(post.created_at).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => openEditModal(post)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeletePost(post.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            {post.status === 'published' && post.slug && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 mt-6">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="h-9 px-3 text-sm"
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="h-9 px-3 text-sm"
                    >
                      Next
                    </Button>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600 px-2 py-1">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Blog Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 sm:space-y-6">
            {renderFormFields()}
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button onClick={handleEditPost} className="w-full sm:w-auto">
                Update Post
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogManagement;
