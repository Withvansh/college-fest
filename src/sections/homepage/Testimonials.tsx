import { Star } from 'lucide-react';

const Testimonials = () => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white py-12 sm:py-16 lg:py-20 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 text-xs sm:text-sm font-bold mb-4 sm:mb-6">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 fill-current" />
            <span className="hidden sm:inline">Trusted by Industry Leaders</span>
            <span className="sm:hidden">Industry Leaders</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent leading-tight">
            What Our Clients Say
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-xs sm:max-w-2xl lg:max-w-4xl mx-auto font-light px-4 sm:px-0">
            Join thousands of companies transforming their hiring process
          </p>
        </div>

        {/* Floating testimonial cards with different animations */}
        <div className="relative max-w-7xl mx-auto h-auto sm:h-[400px] lg:h-[450px] overflow-hidden">
          <div className="flex items-center justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full animate-float px-4 sm:px-0">
              {[
                {
                  name: 'Sarah Johnson',
                  role: 'HR Director at TechCorp',
                  content:
                    'MinuteHire reduced our hiring time from weeks to days. The AI matching is incredibly accurate and has transformed our recruitment process completely!',
                  avatar:
                    'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
                  company: 'TechCorp',
                },
                {
                  name: 'Michael Chen',
                  role: 'Founder at StartupX',
                  content:
                    "The testing platform helped us find developers with exactly the skills we needed. It's a complete game changer for startups looking to scale quickly!",
                  avatar:
                    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
                  company: 'StartupX',
                },
                {
                  name: 'Emily Rodriguez',
                  role: 'Talent Manager at GlobalFirm',
                  content:
                    'Best investment we made this year. The HRMS features streamlined our entire workflow and improved our employee satisfaction significantly.',
                  avatar:
                    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
                  company: 'GlobalFirm',
                },
              ].map((testimonial, index) => (
                <div
                  key={index}
                  className={`group bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-2xl transition-all duration-700 border border-gray-100 relative overflow-hidden transform hover:scale-105 ${
                    index === 0
                      ? 'animate-bounce-slow'
                      : index === 1
                        ? 'animate-pulse-slow'
                        : 'animate-float-slow'
                  }`}
                  style={{
                    animationDelay: `${index * 0.5}s`,
                    animationDuration: `${3 + index}s`,
                  }}
                >
                  {/* Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Stars with animation */}
                    <div className="flex mb-3 sm:mb-4 space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 fill-current drop-shadow-sm transform group-hover:scale-110 transition-transform duration-300"
                          style={{ transitionDelay: `${i * 100}ms` }}
                        />
                      ))}
                    </div>

                    {/* Quote with elegant typography */}
                    <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed font-light">
                      "{testimonial.content}"
                    </p>

                    {/* Author Info */}
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-gray-200 shadow-md"
                        />
                        <div className="absolute -bottom-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full border-2 border-white"></div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">
                          {testimonial.name}
                        </div>
                        <div className="text-gray-500 text-xs sm:text-sm">{testimonial.role}</div>
                        <div className="text-blue-600 text-xs font-medium">
                          {testimonial.company}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Subtle quote decoration */}
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                    <svg
                      className="w-4 h-4 sm:w-6 sm:h-6 text-gray-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-10zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Minimalist Trust Indicators */}
        <div className="text-center mt-8 sm:mt-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-0">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              <div className="text-center opacity-70 hover:opacity-100 transition-opacity duration-300 p-2 sm:p-0">
                <div className="font-light text-2xl sm:text-3xl text-gray-900 mb-1">10K+</div>
                <div className="text-xs text-gray-600 uppercase tracking-wider">Companies</div>
              </div>
              <div className="text-center opacity-70 hover:opacity-100 transition-opacity duration-300 p-2 sm:p-0">
                <div className="font-light text-2xl sm:text-3xl text-gray-900 mb-1">500K+</div>
                <div className="text-xs text-gray-600 uppercase tracking-wider">Hires</div>
              </div>
              <div className="text-center opacity-70 hover:opacity-100 transition-opacity duration-300 p-2 sm:p-0">
                <div className="font-light text-2xl sm:text-3xl text-gray-900 mb-1">95%</div>
                <div className="text-xs text-gray-600 uppercase tracking-wider">Faster</div>
              </div>
              <div className="text-center opacity-70 hover:opacity-100 transition-opacity duration-300 p-2 sm:p-0">
                <div className="font-light text-2xl sm:text-3xl text-gray-900 mb-1">4.9★</div>
                <div className="text-xs text-gray-600 uppercase tracking-wider">Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
