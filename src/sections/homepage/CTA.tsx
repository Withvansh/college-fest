import { Button } from '@/components/ui/button'
import React from 'react'
import { Link } from 'react-router-dom'

const CTA = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 w-full">
        <div className="w-full container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Transform Your Hiring?</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Join 10,000+ companies using MinuteHire to build better teams faster
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/recruiter">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 rounded-xl shadow-2xl">
                Start Free Trial
              </Button>
            </Link>
            <Link to="/free-test">
              <Button size="lg" variant="outline" className="border-2 border-white bg-blue text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4 rounded-xl">
                Take a Free Test
              </Button>
            </Link>
          </div>
        </div>
      </div>
  )
}

export default CTA