import React from 'react';

const MarqueeSection: React.FC = () => {
  // Mentor images
  const mentorImages = [
    'Bhavya R Bansal.jpeg',
    'Deepak Sharma.jpeg',
    'Sahil Sahore.jpeg',
    'Sudhir Kumar Chauhan.jpeg',
    'Umang Gupta.jpeg',
    'Vikas Tyagi.jpg',
  ];

  // Company logos
  const companyLogos = [
    '1.jpg',
    '2.jpg',
    '3.jpg',
    '4.jpg',
    '5.jpg',
    '6.jpeg',
    '7.png',
    '8.jpeg',
    '9.png',
    '10.jpeg',
    '11.png',
    '12.png',
    '13.png',
    '14.png',
    '15.png',
    '16.jpg',
    '17.png',
    '18.png',
  ];

  // College logos
  const collegeLogos = ['abesit.jpg', 'hlm.png', 'subharti.png'];

  // Duplicate arrays for seamless loop
  const duplicatedMentors = [...mentorImages, ...mentorImages];
  const duplicatedCompanies = [...companyLogos, ...companyLogos];
  const duplicatedColleges = [...collegeLogos, ...collegeLogos, ...collegeLogos, ...collegeLogos]; // More duplicates for smoother loop

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Our Ecosystem
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Trusted by leading companies, colleges, and industry experts worldwide
          </p>
        </div>

        <div className="space-y-8">
          {/* Row 1: Mentors & Experts - Scroll Right */}
          <div className="relative">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Mentors & Experts
            </h3>
            <div className="overflow-hidden">
              <div className="flex animate-scroll-right">
                {duplicatedMentors.map((mentor, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 mx-4 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden   transition-shadow duration-300 border-4 border-white"
                  >
                    <img
                      src={`/mentors/${mentor}`}
                      alt={`Mentor ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 2: Hiring Partners - Scroll Left */}
          <div className="relative">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Hiring Partners
            </h3>
            <div className="overflow-hidden">
              <div className="flex animate-scroll-left">
                {duplicatedCompanies.map((company, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 mx-3 w-20 h-12 sm:w-24 sm:h-14 lg:w-28 lg:h-16 bg-white rounded-lg   transition-shadow duration-300 p-2 flex items-center justify-center  "
                  >
                    <img
                      src={`/company/${company}`}
                      alt={`Company ${index + 1}`}
                      className="max-w-full max-h-full object-contain filter hover:brightness-110 transition-all duration-300"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 3: Placement Partners - Scroll Right */}
          <div className="relative">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Placement Partners
            </h3>
            <div className="overflow-hidden">
              <div className="flex animate-scroll-right-slow">
                {duplicatedColleges.map((college, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 mx-4 w-20 h-12 sm:w-24 sm:h-14 lg:w-28 lg:h-16 bg-white rounded-lg   transition-shadow duration-300 p-2 flex items-center justify-center "
                  >
                    <img
                      src={`/colleges/${college}`}
                      alt={`College ${index + 1}`}
                      className="max-w-full max-h-full object-contain filter hover:brightness-110 transition-all duration-300"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarqueeSection;
