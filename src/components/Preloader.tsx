import type React from 'react';
import { useState, useEffect } from 'react';


interface PreloaderProps {
  onLoadComplete: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onLoadComplete }) => {
  const taglines = [
    'Connecting Talent in Minutes…',
    'From Campus to Corporate…',
    'Hire. Work. Grow.',
    'Opportunities at Your Fingertips…',
  ];

  const [currentTagline, setCurrentTagline] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [taglineFade, setTaglineFade] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + Math.random() * 15 + 5;
      });
    }, 200);

    // Tagline rotation
    const taglineInterval = setInterval(() => {
      setTaglineFade(false);
      setTimeout(() => {
        setCurrentTagline(prev => (prev + 1) % taglines.length);
        setTaglineFade(true);
      }, 400);
    }, 2500);

    // Complete loading
    const timer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsFading(true);
        setTimeout(onLoadComplete, 1000);
      }, 500);
    }, 4500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(taglineInterval);
      clearTimeout(timer);
    };
  }, [onLoadComplete, taglines.length]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-all duration-1000 ease-out pointer-events-none ${
        isFading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      }`}
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #e9ecef 100%)',
      }}
      role="status"
      aria-label="Loading application"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-black/5 rounded-full animate-spin"
          style={{ animationDuration: '20s' }}
        ></div>
        <div
          className="absolute -bottom-1/2 -right-1/2 w-3/4 h-3/4 bg-black/10 rounded-full animate-spin"
          style={{ animationDuration: '15s', animationDirection: 'reverse' }}
        ></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-black/30 rounded-full animate-bounce"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 8}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: '3s',
            }}
          ></div>
        ))}
      </div>

      {/* Main content container */}
      <div className="relative z-10 text-center px-8 max-w-lg">
        {/* Logo/Icon placeholder with modern design */}
        <div className="mb-12 flex justify-center">
          <img
            src='/lovable-uploads/76dddbd0-7747-4d66-87df-6345c5f6b55f.png'
            alt="logo"
          />
        </div>

        {/* Tagline with modern typography */}
        <div className="mb-16 h-16 flex items-center justify-center">
          <h2
            className={`text-3xl md:text-4xl font-bold text-black text-center transition-all duration-400 ease-out transform ${
              taglineFade
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-4 scale-95'
            }`}
            style={{
              textShadow: '0 4px 20px rgba(0,0,0,0.3)',
              fontWeight: '700',
              letterSpacing: '-0.02em',
            }}
          >
            {taglines[currentTagline]}
          </h2>
        </div>

        {/* Modern progress bar */}
        <div className="w-full max-w-xs mx-auto mb-8">
          <div className="h-1 bg-gray-200/50 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              className="h-full bg-gradient-to-r from-black via-gray-800 to-black transition-all duration-300 ease-out rounded-full shadow-lg"
              style={{
                width: `${Math.min(progress, 100)}%`,
                boxShadow: '0 0 20px rgba(0,0,0,0.8)',
              }}
            ></div>
          </div>
          <div className="mt-3 text-gray-700 text-sm font-medium text-center">
            {Math.round(Math.min(progress, 100))}%
          </div>
        </div>

        {/* Modern loading dots */}
        <div className="flex justify-center space-x-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 bg-black/80 rounded-full animate-bounce shadow-lg"
              style={{
                animationDelay: `${i * 0.15}s`,
                animationDuration: '1.4s',
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Subtle bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300/50 to-transparent"></div>
    </div>
  );
};

export default Preloader;
