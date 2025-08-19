import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { blogApi, BlogPost } from "@/lib/api/blog.ts";
import { Calendar, User, ArrowLeft } from "lucide-react";

const BlogDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const posts = await blogApi.getPublishedPosts();
        const matched = posts.find((p) => p.slug === slug);
        if (matched) {
          setPost(matched);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error("Error loading post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return <div className="p-10 text-gray-600">Loading...</div>;
  }

  if (notFound || !post) {
    return <div className="p-10 text-red-500">Post not found.</div>;
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 px-6 py-12 max-w-4xl mx-auto">
      {/* Back Button */}
      <Link to="/blog" className="inline-flex items-center text-blue-600 mb-6 group">
        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to Blog
      </Link>

      {/* Header */}
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

      {/* Meta */}
      <div className="flex items-center text-sm text-gray-500 mb-6 gap-4">
        <div className="flex items-center">
          <User className="h-4 w-4 mr-1" />
          <span>MinuteHire Team</span>
        </div>
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{new Date(post.published_at || post.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Feature Image */}
      {post.featured_image_url && (
        <img
          src={post.featured_image_url}
          alt={post.title}
          className="w-full rounded-2xl mb-8 shadow"
        />
      )}

      {/* Content */}
      <div
        className="prose max-w-none text-lg"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Tags */}
      {post.tags?.length > 0 && (
        <div className="mt-8">
          <h4 className="text-sm font-semibold text-gray-600 mb-2">Tags:</h4>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogDetailPage;
