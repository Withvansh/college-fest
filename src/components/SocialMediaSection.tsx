import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Play, ChevronLeft, ChevronRight, Instagram } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from "@/components/ui/button";

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
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    title: "Landing my dream job through MinuteHire! 🎉 The AI interview was seamless",
    hashtags: "#MinuteHire #JobSuccess #CareerGoals",
    likes: 234,
    comments: 12,
    shares: 8,
    timeAgo: "2 hours ago"
  },
  {
    id: 2,
    type: 'Reel',
    platform: 'Instagram',
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    title: "AI-powered interviews are the future! ⚡ Watch how I aced mine",
    hashtags: "#AIInterview #TechCareers #MinuteHire",
    likes: 445,
    comments: 28,
    shares: 15,
    timeAgo: "5 hours ago"
  },
  {
    id: 3,
    type: 'Post',
    platform: 'Instagram',
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    title: "From coding bootcamp to tech lead! 👨‍💻 Thanks MinuteHire for the perfect match",
    hashtags: "#CodingJourney #TechJobs #Success",
    likes: 189,
    comments: 15,
    shares: 6,
    timeAgo: "1 day ago"
  },
  {
    id: 4,
    type: 'Reel',
    platform: 'Instagram',
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    title: "My MinuteHire success story! From job search to offer in 2 weeks 🚀",
    hashtags: "#JobSearch #QuickHiring #Success",
    likes: 567,
    comments: 34,
    shares: 22,
    timeAgo: "2 days ago"
  },
  {
    id: 5,
    type: 'Post',
    platform: 'Instagram',
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    title: "Remote work dreams came true! 💻 MinuteHire connected me with amazing companies",
    hashtags: "#RemoteWork #WorkFromHome #MinuteHire",
    likes: 892,
    comments: 67,
    shares: 43,
    timeAgo: "3 days ago"
  },
  {
    id: 6,
    type: 'Reel',
    platform: 'Instagram',
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    title: "Team collaboration at its finest! 🤝 Found my perfect workplace culture",
    hashtags: "#TeamWork #CompanyCulture #Hiring",
    likes: 1205,
    comments: 89,
    shares: 156,
    timeAgo: "4 days ago"
  },
  {
    id: 7,
    type: 'Post',
    platform: 'Instagram',
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    title: "Code review sessions that actually matter! 💡 My new job values growth",
    hashtags: "#CodeReview #ProfessionalGrowth #TechLife",
    likes: 334,
    comments: 21,
    shares: 11,
    timeAgo: "5 days ago"
  },
  {
    id: 8,
    type: 'Reel',
    platform: 'Instagram',
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    title: "Interview prep made easy with MinuteHire! 📚 Their AI feedback was spot-on",
    hashtags: "#InterviewPrep #AICoach #CareerTips",
    likes: 678,
    comments: 42,
    shares: 28,
    timeAgo: "6 days ago"
  }
];

const SocialMediaSection = () => {
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  const extendedPosts = [...socialPosts, ...socialPosts, ...socialPosts]; // Infinite carousel

  const toggleLike = (postId: number) => {
    setLikedPosts(prev =>
      prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
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
        if (next >= socialPosts.length) {
          setTimeout(() => setCurrentIndex(0), 700);
          return next;
        }
        return next;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [isAutoScrolling]);

  const handlePrevious = () => {
    setIsAutoScrolling(false);
    setCurrentIndex(prev => (prev === 0 ? socialPosts.length - 3 : prev - 1));
    setTimeout(() => setIsAutoScrolling(true), 5000);
  };

  const handleNext = () => {
    setIsAutoScrolling(false);
    setCurrentIndex(prev => (prev + 1 >= socialPosts.length ? 0 : prev + 1));
    setTimeout(() => setIsAutoScrolling(true), 5000);
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-blue-50/30 py-20 w-full overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 text-sm font-semibold mb-8 shadow-lg">
            <Instagram className="w-5 h-5 mr-2" />
            Live from Social Media
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-purple-700 to-pink-600 bg-clip-text text-transparent">
            Join the Conversation
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
            See what our community is sharing about their MinuteHire success stories
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          <Button onClick={handlePrevious} variant="ghost" size="icon" className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm shadow-lg hover:scale-110 transition duration-300 rounded-full w-12 h-12">
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button onClick={handleNext} variant="ghost" size="icon" className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm shadow-lg hover:scale-110 transition duration-300 rounded-full w-12 h-12">
            <ChevronRight className="h-6 w-6" />
          </Button>

          <div className="overflow-hidden mx-12">
            <div
              className="flex gap-6 transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / 3)}%)`,
                width: `${(extendedPosts.length * 100) / 3}%`
              }}
            >
              {extendedPosts.map((post, index) => (
                <div
                  key={`${post.id}-${index}`}
                  className="flex-shrink-0"
                  style={{ width: `${100 / extendedPosts.length}%` }}
                >
                  <Card className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] overflow-hidden border-0 h-[520px]">
                    <CardContent className="p-0 h-full flex flex-col">
                      {/* Image */}
                      <div className="relative aspect-square overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute top-4 right-4">
                          <span className={`px-3 py-1 rounded-full text-white text-sm font-semibold shadow-lg ${post.type === 'Reel' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gradient-to-r from-blue-500 to-cyan-500'}`}>
                            {post.type}
                          </span>
                        </div>
                        {post.type === 'Reel' && (
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl">
                              <Play className="w-6 h-6 text-gray-800 ml-1" fill="currentColor" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="flex-1">
                          <p className="text-gray-800 font-medium text-sm leading-relaxed mb-2 line-clamp-2">{post.title}</p>
                          <p className="text-blue-600 text-sm font-medium mb-4">{post.hashtags}</p>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center space-x-4">
                            <button onClick={() => toggleLike(post.id)} className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors group/like">
                              <Heart className={`w-5 h-5 ${likedPosts.includes(post.id) ? 'text-red-500 fill-current scale-110' : 'group-hover/like:scale-110'}`} />
                              <span className="text-sm font-medium">{formatNumber(likedPosts.includes(post.id) ? post.likes + 1 : post.likes)}</span>
                            </button>
                            <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors group/comment">
                              <MessageCircle className="w-5 h-5 group-hover/comment:scale-110 transition-transform duration-200" />
                              <span className="text-sm font-medium">{post.comments}</span>
                            </button>
                            <button className="flex items-center space-x-1 text-gray-500 hover:text-green-500 transition-colors group/share">
                              <Share2 className="w-5 h-5 group-hover/share:scale-110 transition-transform duration-200" />
                              <span className="text-sm font-medium">{post.shares}</span>
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
        </div>

        {/* Social Links */}
        <div className="text-center mt-16">
          <p className="text-lg text-gray-600 mb-8 font-light">Connect with us across platforms</p>
          <div className="flex justify-center space-x-4">
            <a href="https://www.instagram.com/minutehire?igsh=aG03NmhlZGZqOHZi" target="_blank" rel="noopener noreferrer">
              <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl transform hover:scale-105 transition duration-300 shadow-lg">
                <Instagram className="w-5 h-5 mr-3" />
                Instagram
              </Button>
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white px-8 py-4 rounded-2xl transform hover:scale-105 transition duration-300 shadow-lg">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0012 8v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
                Twitter
              </Button>
            </a>
            <a href="https://www.linkedin.com/company/minute-hire/about/" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="border-2 border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white px-8 py-4 rounded-2xl transform hover:scale-105 transition duration-300 shadow-lg">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8.5h4v13h-4v-13zM8.5 8.5h3.5v1.72c.49-.89 1.74-1.82 3.6-1.82 3.85 0 4.57 2.53 4.57 5.82v7.28h-4v-6.45c0-1.54-.03-3.52-2.15-3.52s-2.48 1.67-2.48 3.4v6.57h-4v-13z" />
                </svg>
                LinkedIn
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaSection;



// import { useState, useEffect } from 'react';
// import { Heart, MessageCircle, Share2, Play, ChevronLeft, ChevronRight, Instagram } from 'lucide-react';
// import { Card, CardContent } from '@/components/ui/card';
// import { Button } from "@/components/ui/button";

// const SocialMediaSection = () => {
//   const [likedPosts, setLikedPosts] = useState<number[]>([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isAutoScrolling, setIsAutoScrolling] = useState(true);

//   const toggleLike = (postId: number) => {
//     setLikedPosts(prev => 
//       prev.includes(postId) 
//         ? prev.filter(id => id !== postId)
//         : [...prev, postId]
//     );
//   };

//   const socialPosts = [
//     {
//       id: 1,
//       type: 'Post',
//       platform: 'Instagram',
//       image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
//       title: "Landing my dream job through MinuteHire! 🎉 The AI interview was seamless",
//       hashtags: "#MinuteHire #JobSuccess #CareerGoals",
//       likes: 234,
//       comments: 12,
//       shares: 8,
//       timeAgo: "2 hours ago"
//     },
//     {
//       id: 2,
//       type: 'Reel',
//       platform: 'Instagram',
//       image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
//       title: "AI-powered interviews are the future! ⚡ Watch how I aced mine",
//       hashtags: "#AIInterview #TechCareers #MinuteHire",
//       likes: 445,
//       comments: 28,
//       shares: 15,
//       timeAgo: "5 hours ago"
//     },
//     {
//       id: 3,
//       type: 'Post',
//       platform: 'Instagram',
//       image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
//       title: "From coding bootcamp to tech lead! 👨‍💻 Thanks MinuteHire for the perfect match",
//       hashtags: "#CodingJourney #TechJobs #Success",
//       likes: 189,
//       comments: 15,
//       shares: 6,
//       timeAgo: "1 day ago"
//     },
//     {
//       id: 4,
//       type: 'Reel',
//       platform: 'Instagram',
//       image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
//       title: "My MinuteHire success story! From job search to offer in 2 weeks 🚀",
//       hashtags: "#JobSearch #QuickHiring #Success",
//       likes: 567,
//       comments: 34,
//       shares: 22,
//       timeAgo: "2 days ago"
//     },
//     {
//       id: 5,
//       type: 'Post',
//       platform: 'Instagram',
//       image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
//       title: "Remote work dreams came true! 💻 MinuteHire connected me with amazing companies",
//       hashtags: "#RemoteWork #WorkFromHome #MinuteHire",
//       likes: 892,
//       comments: 67,
//       shares: 43,
//       timeAgo: "3 days ago"
//     },
//     {
//       id: 6,
//       type: 'Reel',
//       platform: 'Instagram',
//       image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
//       title: "Team collaboration at its finest! 🤝 Found my perfect workplace culture",
//       hashtags: "#TeamWork #CompanyCulture #Hiring",
//       likes: 1205,
//       comments: 89,
//       shares: 156,
//       timeAgo: "4 days ago"
//     },
//     {
//       id: 7,
//       type: 'Post',
//       platform: 'Instagram',
//       image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
//       title: "Code review sessions that actually matter! 💡 My new job values growth",
//       hashtags: "#CodeReview #ProfessionalGrowth #TechLife",
//       likes: 334,
//       comments: 21,
//       shares: 11,
//       timeAgo: "5 days ago"
//     },
//     {
//       id: 8,
//       type: 'Reel',
//       platform: 'Instagram',
//       image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
//       title: "Interview prep made easy with MinuteHire! 📚 Their AI feedback was spot-on",
//       hashtags: "#InterviewPrep #AICoach #CareerTips",
//       likes: 678,
//       comments: 42,
//       shares: 28,
//       timeAgo: "6 days ago"
//     }
//   ];

//   // Create an extended array for infinite scroll effect
//   const extendedPosts = [...socialPosts, ...socialPosts, ...socialPosts];

//   // Never-ending scroll functionality
//   useEffect(() => {
//     if (!isAutoScrolling) return;
    
//     const interval = setInterval(() => {
//       setCurrentIndex((prevIndex) => {
//         const nextIndex = prevIndex + 1;
//         // Reset to beginning seamlessly when we reach the end of first set
//         if (nextIndex >= socialPosts.length) {
//           // Use setTimeout to reset position after transition completes
//           setTimeout(() => {
//             setCurrentIndex(0);
//           }, 700); // Match transition duration
//           return nextIndex;
//         }
//         return nextIndex;
//       });
//     }, 3500);

//     return () => clearInterval(interval);
//   }, [socialPosts.length, isAutoScrolling]);

//   const handlePrevious = () => {
//     setIsAutoScrolling(false);
//     setCurrentIndex((prevIndex) => {
//       if (prevIndex === 0) {
//         return socialPosts.length - 3;
//       }
//       return prevIndex - 1;
//     });
//     setTimeout(() => setIsAutoScrolling(true), 5000);
//   };

//   const handleNext = () => {
//     setIsAutoScrolling(false);
//     setCurrentIndex((prevIndex) => {
//       const nextIndex = prevIndex + 1;
//       if (nextIndex >= socialPosts.length) {
//         return 0;
//       }
//       return nextIndex;
//     });
//     setTimeout(() => setIsAutoScrolling(true), 5000);
//   };

//   const formatNumber = (num: number) => {
//     if (num >= 1000) {
//       return (num / 1000).toFixed(1) + 'k';
//     }
//     return num.toString();
//   };

//   return (
//     <div className="bg-gradient-to-br from-gray-50 via-white to-blue-50/30 py-20 w-full overflow-hidden">
//       <div className="container mx-auto px-6 max-w-7xl">
//         {/* Header Section */}
//         <div className="text-center mb-16">
//           <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 text-sm font-semibold mb-8 shadow-lg">
//             <Instagram className="w-5 h-5 mr-2" />
//             Live from Social Media
//           </div>
//           <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-purple-700 to-pink-600 bg-clip-text text-transparent">
//             Join the Conversation
//           </h2>
//           <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
//             See what our community is sharing about their MinuteHire success stories
//           </p>
//         </div>

//         {/* Social Media Feed */}
//         <div className="relative">
//           {/* Navigation Arrows */}
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={handlePrevious}
//             className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 rounded-full w-12 h-12"
//           >
//             <ChevronLeft className="h-6 w-6" />
//           </Button>
          
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={handleNext}
//             className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 rounded-full w-12 h-12"
//           >
//             <ChevronRight className="h-6 w-6" />
//           </Button>

//           {/* Cards Container */}
//           <div className="overflow-hidden mx-12">
//             <div 
//               className="flex gap-6 transition-transform duration-700 ease-in-out"
//               style={{ 
//                 transform: `translateX(-${currentIndex * (100 / 3)}%)`,
//                 width: `${(extendedPosts.length * 100) / 3}%`
//               }}
//             >
//               {extendedPosts.map((post, index) => (
//                 <div 
//                   key={`${post.id}-${Math.floor(index / socialPosts.length)}`}
//                   className="flex-shrink-0"
//                   style={{ width: `${100 / extendedPosts.length}%` }}
//                 >
//                   <Card className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] overflow-hidden border-0 h-[520px]">
//                     <CardContent className="p-0 h-full flex flex-col">
//                       {/* Image Container */}
//                       <div className="relative aspect-square overflow-hidden">
//                         <img 
//                           src={post.image} 
//                           alt={post.title}
//                           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
//                         />
                        
//                         {/* Post/Reel Label */}
//                         <div className="absolute top-4 right-4">
//                           <span className={`px-3 py-1 rounded-full text-white text-sm font-semibold shadow-lg ${
//                             post.type === 'Reel' 
//                               ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
//                               : 'bg-gradient-to-r from-blue-500 to-cyan-500'
//                           }`}>
//                             {post.type}
//                           </span>
//                         </div>

//                         {/* Play Button for Reels */}
//                         {post.type === 'Reel' && (
//                           <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                             <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl">
//                               <Play className="w-6 h-6 text-gray-800 ml-1" fill="currentColor" />
//                             </div>
//                           </div>
//                         )}

//                         {/* Gradient Overlay */}
//                         <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                       </div>

//                       {/* Content Section */}
//                       <div className="p-5 flex-1 flex flex-col">
//                         {/* Post Content */}
//                         <div className="flex-1">
//                           <p className="text-gray-800 font-medium text-sm leading-relaxed mb-2 line-clamp-2">
//                             {post.title}
//                           </p>
//                           <p className="text-blue-600 text-sm font-medium mb-4">
//                             {post.hashtags}
//                           </p>
//                         </div>

//                         {/* Engagement Section */}
//                         <div className="flex items-center justify-between pt-4 border-t border-gray-100">
//                           <div className="flex items-center space-x-4">
//                             <button 
//                               onClick={() => toggleLike(post.id)}
//                               className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors group/like"
//                             >
//                               <Heart 
//                                 className={`w-5 h-5 transition-all duration-300 ${
//                                   likedPosts.includes(post.id) 
//                                     ? 'text-red-500 fill-current scale-110' 
//                                     : 'group-hover/like:scale-110'
//                                 }`} 
//                               />
//                               <span className="text-sm font-medium">
//                                 {formatNumber(likedPosts.includes(post.id) ? post.likes + 1 : post.likes)}
//                               </span>
//                             </button>
                            
//                             <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors group/comment">
//                               <MessageCircle className="w-5 h-5 group-hover/comment:scale-110 transition-transform duration-200" />
//                               <span className="text-sm font-medium">{post.comments}</span>
//                             </button>
                            
//                             <button className="flex items-center space-x-1 text-gray-500 hover:text-green-500 transition-colors group/share">
//                               <Share2 className="w-5 h-5 group-hover/share:scale-110 transition-transform duration-200" />
//                               <span className="text-sm font-medium">{post.shares}</span>
//                             </button>
//                           </div>
                          
//                           <span className="text-xs text-gray-400 font-medium">{post.timeAgo}</span>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Enhanced Follow Us CTA */}
//         <div className="text-center mt-16">
//           <p className="text-lg text-gray-600 mb-8 font-light">Connect with us across platforms</p>
          
//           {/* --------------------------------------------------------------------------------------------------------------------------------------------- */}

// <div className="flex justify-center space-x-4">
//   <a
//     href="https://www.instagram.com/minutehire?igsh=aG03NmhlZGZqOHZi"
//     target="_blank"
//     rel="noopener noreferrer"
//   >
//     <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-lg">
//       <Instagram className="w-5 h-5 mr-3" />
//       Instagram
//     </Button>
//   </a>

//   <a
//     href="https://www.twitter.com"
//     target="_blank"
//     rel="noopener noreferrer"
//   >
//     <Button
//       variant="outline"
//       className="border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white px-8 py-4 rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-lg"
//     >
//       <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
//         <path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0012 8v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
//       </svg>
//       Twitter
//     </Button>
//   </a>

//   <a
//     href="https://www.linkedin.com/company/minute-hire/about/"
//     target="_blank"
//     rel="noopener noreferrer"
//   >
//     <Button
//       variant="outline"
//       className="border-2 border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white px-8 py-4 rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-lg"
//     >
//       <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
//         <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8.5h4v13h-4v-13zM8.5 8.5h3.5v1.72c.49-.89 1.74-1.82 3.6-1.82 3.85 0 4.57 2.53 4.57 5.82v7.28h-4v-6.45c0-1.54-.03-3.52-2.15-3.52s-2.48 1.67-2.48 3.4v6.57h-4v-13z" />
//       </svg>
//       LinkedIn
//     </Button>
//   </a>
// </div>    
            
                   
//           </div> {/* End of Follow Us CTA */}
//         </div> {/* End of container */}
//       </div> {/* End of bg wrapper */}
//   );
// };

// export default SocialMediaSection;
