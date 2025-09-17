import { useState, useEffect } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Play,
  ChevronLeft,
  ChevronRight,
  Instagram,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SocialPost {
  id: number;
  type: 'Post' | 'Reel';
  platform: string;
  image: string;
  title: string;
  hashtags: string;
  likes: number;
  comments: number;
  shares: number;
  timeAgo: string;
}

const socialPosts: SocialPost[] = [
  {
    id: 1,
    type: 'Post',
    platform: 'Instagram',
    image:
      'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    title: 'Landing my dream job through MinuteHire! 🎉 The AI interview was seamless',
    hashtags: '#MinuteHire #JobSuccess #CareerGoals',
    likes: 234,
    comments: 12,
    shares: 8,
    timeAgo: '2 hours ago',
  },
  {
    id: 2,
    type: 'Reel',
    platform: 'Instagram',
    image:
      'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    title: 'AI-powered interviews are the future! ⚡ Watch how I aced mine',
    hashtags: '#AIInterview #TechCareers #MinuteHire',
    likes: 445,
    comments: 28,
    shares: 15,
    timeAgo: '5 hours ago',
  },
  {
    id: 3,
    type: 'Post',
    platform: 'Instagram',
    image:
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    title: 'From coding bootcamp to tech lead! 👨‍💻 Thanks MinuteHire for the perfect match',
    hashtags: '#CodingJourney #TechJobs #Success',
    likes: 189,
    comments: 15,
    shares: 6,
    timeAgo: '1 day ago',
  },
  {
    id: 4,
    type: 'Reel',
    platform: 'Instagram',
    image:
      'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    title: 'My MinuteHire success story! From job search to offer in 2 weeks 🚀',
    hashtags: '#JobSearch #QuickHiring #Success',
    likes: 567,
    comments: 34,
    shares: 22,
    timeAgo: '2 days ago',
  },
  {
    id: 5,
    type: 'Post',
    platform: 'Instagram',
    image:
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    title: 'Remote work dreams came true! 💻 MinuteHire connected me with amazing companies',
    hashtags: '#RemoteWork #WorkFromHome #MinuteHire',
    likes: 892,
    comments: 67,
    shares: 43,
    timeAgo: '3 days ago',
  },
  {
    id: 6,
    type: 'Reel',
    platform: 'Instagram',
    image:
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    title: 'Team collaboration at its finest! 🤝 Found my perfect workplace culture',
    hashtags: '#TeamWork #CompanyCulture #Hiring',
    likes: 1205,
    comments: 89,
    shares: 156,
    timeAgo: '4 days ago',
  },
  {
    id: 7,
    type: 'Post',
    platform: 'Instagram',
    image:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    title: 'Code review sessions that actually matter! 💡 My new job values growth',
    hashtags: '#CodeReview #ProfessionalGrowth #TechLife',
    likes: 334,
    comments: 21,
    shares: 11,
    timeAgo: '5 days ago',
  },
  {
    id: 8,
    type: 'Reel',
    platform: 'Instagram',
    image:
      'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    title: 'Interview prep made easy with MinuteHire! 📚 Their AI feedback was spot-on',
    hashtags: '#InterviewPrep #AICoach #CareerTips',
    likes: 678,
    comments: 42,
    shares: 28,
    timeAgo: '6 days ago',
  },
];

const SocialMediaSection = () => {
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const extendedPosts = [...socialPosts, ...socialPosts, ...socialPosts]; // Infinite carousel

  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleLike = (postId: number) => {
    setLikedPosts(prev =>
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    );
  };

  const formatNumber = (num: number): string => {
    return num >= 1000 ? `${(num / 1000).toFixed(1)}k` : `${num}`;
  };

  useEffect(() => {
    if (!isAutoScrolling) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        const next = prev + 1;
        // For mobile, show one card at a time; for desktop, show 3 cards
        const maxIndex = isMobile ? socialPosts.length : socialPosts.length - 2;
        if (next >= maxIndex) {
          setTimeout(() => setCurrentIndex(0), 700);
          return next;
        }
        return next;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [isAutoScrolling, isMobile]);

  const handlePrevious = () => {
    setIsAutoScrolling(false);
    const maxIndex = isMobile ? socialPosts.length - 1 : socialPosts.length - 3;
    setCurrentIndex(prev => (prev === 0 ? maxIndex : prev - 1));
    setTimeout(() => setIsAutoScrolling(true), 5000);
  };

  const handleNext = () => {
    setIsAutoScrolling(false);
    const maxIndex = isMobile ? socialPosts.length - 1 : socialPosts.length - 3;
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
    setTimeout(() => setIsAutoScrolling(true), 5000);
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-blue-50/30 py-12 sm:py-16 lg:py-20 w-full overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 text-xs sm:text-sm font-semibold mb-4 sm:mb-6 lg:mb-8 shadow-lg">
            <Instagram className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Live from Social Media</span>
            <span className="sm:hidden">Social Media</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-gray-900 via-purple-700 to-pink-600 bg-clip-text text-transparent leading-tight">
            Join the Conversation
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-xs sm:max-w-2xl lg:max-w-3xl mx-auto font-light px-4 sm:px-0">
            See what our community is sharing about their MinuteHire success stories
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Navigation Buttons - Show on mobile with swipe indicators */}
          <Button
            onClick={handlePrevious}
            variant="ghost"
            size="icon"
            className="absolute left-2 sm:left-4 lg:left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm shadow-lg hover:scale-110 transition duration-300 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex"
          >
            <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
          </Button>

          <Button
            onClick={handleNext}
            variant="ghost"
            size="icon"
            className="absolute right-2 sm:right-4 lg:right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm shadow-lg hover:scale-110 transition duration-300 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex"
          >
            <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
          </Button>

          <div className="overflow-hidden mx-0 sm:mx-8 lg:mx-12">
            <div
              className="flex gap-3 sm:gap-4 lg:gap-6 transition-transform duration-700 ease-in-out"
              style={{
                transform: isMobile
                  ? `translateX(-${currentIndex * 100}%)`
                  : `translateX(-${currentIndex * 100}%)`,
                width: isMobile
                  ? `${socialPosts.length * 100}%`
                  : `${(extendedPosts.length / 3) * 100}%`,
              }}
            >
              {(isMobile ? socialPosts : extendedPosts).map((post, index) => (
                <div
                  key={`${post.id}-${index}`}
                  className="flex-shrink-0 p-2 sm:p-3 lg:p-4"
                  style={{
                    width: isMobile
                      ? `${100 / socialPosts.length}%`
                      : `${100 / extendedPosts.length}%`,
                  }}
                >
                  <Card className="group relative bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] overflow-hidden border-0 h-[400px] sm:h-[480px] lg:h-[520px]">
                    <CardContent className="p-0 h-full flex flex-col">
                      {/* Image */}
                      <div className="relative aspect-square overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
                          <span
                            className={`px-2 sm:px-3 py-1 rounded-full text-white text-xs sm:text-sm font-semibold shadow-lg ${post.type === 'Reel' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gradient-to-r from-blue-500 to-cyan-500'}`}
                          >
                            {post.type}
                          </span>
                        </div>
                        {post.type === 'Reel' && (
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl">
                              <Play
                                className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800 ml-1"
                                fill="currentColor"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-3 sm:p-4 lg:p-5 flex-1 flex flex-col">
                        <div className="flex-1">
                          <p className="text-gray-800 font-medium text-xs sm:text-sm leading-relaxed mb-2 line-clamp-2">
                            {post.title}
                          </p>
                          <p className="text-blue-600 text-xs sm:text-sm font-medium mb-3 sm:mb-4 line-clamp-1">
                            {post.hashtags}
                          </p>
                        </div>
                        <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-100">
                          <div className="flex items-center space-x-3 sm:space-x-4">
                            <button
                              onClick={() => toggleLike(post.id)}
                              className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors group/like"
                            >
                              <Heart
                                className={`w-4 h-4 sm:w-5 sm:h-5 ${likedPosts.includes(post.id) ? 'text-red-500 fill-current scale-110' : 'group-hover/like:scale-110'}`}
                              />
                              <span className="text-xs sm:text-sm font-medium">
                                {formatNumber(
                                  likedPosts.includes(post.id) ? post.likes + 1 : post.likes
                                )}
                              </span>
                            </button>
                            <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors group/comment">
                              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 group-hover/comment:scale-110 transition-transform duration-200" />
                              <span className="text-xs sm:text-sm font-medium">
                                {post.comments}
                              </span>
                            </button>
                            <button className="flex items-center space-x-1 text-gray-500 hover:text-green-500 transition-colors group/share">
                              <Share2 className="w-4 h-4 sm:w-5 sm:h-5 group-hover/share:scale-110 transition-transform duration-200" />
                              <span className="text-xs sm:text-sm font-medium hidden sm:inline">
                                {post.shares}
                              </span>
                            </button>
                          </div>
                          <span className="text-xs text-gray-400 font-medium">{post.timeAgo}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Pagination Dots */}
          {isMobile && (
            <div className="flex justify-center mt-6 space-x-2">
              {socialPosts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsAutoScrolling(false);
                    setCurrentIndex(index);
                    setTimeout(() => setIsAutoScrolling(true), 5000);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex % socialPosts.length
                      ? 'bg-purple-600 w-6'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Social Links */}
        <div className="text-center mt-12 sm:mt-16">
          <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 font-light px-4 sm:px-0">
            Connect with us across platforms
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 px-4 sm:px-0">
            <a
              href="https://www.instagram.com/minutehire/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl transform hover:scale-105 transition duration-300 shadow-lg">
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                Instagram
              </Button>
            </a>
            <a
              href="https://x.com/MinuteHire"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button
                variant="outline"
                className="w-full sm:w-auto border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl transform hover:scale-105 transition duration-300 shadow-lg"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0012 8v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
                Twitter
              </Button>
            </a>
            <a
              href="https://www.linkedin.com/company/minute-hire"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button
                variant="outline"
                className="w-full sm:w-auto border-2 border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl transform hover:scale-105 transition duration-300 shadow-lg"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8.5h4v13h-4v-13zM8.5 8.5h3.5v1.72c.49-.89 1.74-1.82 3.6-1.82 3.85 0 4.57 2.53 4.57 5.82v7.28h-4v-6.45c0-1.54-.03-3.52-2.15-3.52s-2.48 1.67-2.48 3.4v6.57h-4v-13z" />
                </svg>
                LinkedIn
              </Button>
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61579000265753"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button
                variant="outline"
                className="w-full sm:w-auto border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl transform hover:scale-105 transition duration-300 shadow-lg"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaSection;
