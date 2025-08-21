
import { Award, Target, Zap,Settings } from 'lucide-react'
import React from 'react'

const WhyChooseUs = () => {
  return (
    <div className="bg-white/50 backdrop-blur-sm py-16 w-full">
        <div className="w-full px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Why Choose MinuteHire?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">Experience the future of hiring with our comprehensive platform</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto">
            <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:bg-white/90 shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Lightning Fast</h3>
              <p className="text-gray-600 leading-relaxed">Reduce hiring time by 95% with our AI-powered matching and automated workflows.</p>
            </div>

            <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:bg-white/90 shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Target className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Perfect Matches</h3>
              <p className="text-gray-600 leading-relaxed">Advanced algorithms ensure perfect candidate-job fit based on skills and culture.</p>
            </div>

            <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:bg-white/90 shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Award className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">End-to-End Solution</h3>
              <p className="text-gray-600 leading-relaxed">From job posting to employee management - everything in one platform.</p>
            </div>

            <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:bg-white/90 shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Settings className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Integrated HRMS System</h3>
              <p className="text-gray-600 leading-relaxed">Manage employee records, leave, attendance, payroll, performance, and documents — all in one place.</p>
            </div>
          </div>
        </div>
      </div>
  )
}

export default WhyChooseUs