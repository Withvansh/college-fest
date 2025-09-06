import { Button } from '@/components/ui/button';
import React from 'react';
import { Link } from 'react-router-dom';

const CTA = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-12 sm:py-16 lg:py-20 w-full">
      <div className="w-full container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight">
          Ready to Transform Your Hiring?
        </h2>
        <p className="text-base sm:text-lg lg:text-xl text-blue-100 mb-6 sm:mb-8 max-w-xs sm:max-w-xl lg:max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
          Join 10,000+ companies using MinuteHire to build better teams faster
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 justify-center items-center px-4 sm:px-0">
          <Link to="/auth/recruiter" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100 text-base sm:text-lg font-semibold px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-lg sm:rounded-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
            >
              Start Free Trial
            </Button>
          </Link>
          <Link to="/free-test" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-2 border-white bg-transparent text-white hover:bg-white hover:text-blue-600 text-base sm:text-lg font-semibold px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-lg sm:rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Take a Free Test
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CTA;
