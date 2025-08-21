import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  Calendar,
  CheckCircle,
  Coffee,
  FileCheck,
  Filter,
  GraduationCap,
  MessageSquare,
  PenTool,
  Settings,
  Star,
  TestTube,
  User,
} from "lucide-react"
import { Link } from "react-router-dom"

const HowItWorks = () => {
  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-20 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-slate-900 leading-tight">
            How It Works – For Everyone
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            Simple steps to revolutionize your hiring process and career journey
          </p>
        </div>

        {/* Job Seekers & Recruiters */}
        <div className="grid md:grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto mb-16">
          {/* For Job Seekers */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl mb-4 shadow-lg">
                <User className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-3">For Job Seekers</h3>
              <p className="text-slate-600 mb-6 text-base sm:text-lg">
                Your path to finding the perfect career opportunity
              </p>
              <Link to="/auth/jobseeker">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-6 py-3 rounded-xl group shadow-lg hover:shadow-xl transition-all duration-300 text-base">
                  <User className="mr-2 h-5 w-5" />
                  Login as Job Seeker
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <div className="space-y-6">
              {[
                {
                  title: "Build Your Profile",
                  desc: "Create a rich, professional profile with your skills, experience, and preferences",
                  icon: User,
                },
                {
                  title: "Apply & Take Tests",
                  desc: "Search for jobs, apply with one click, and take role-based tests to showcase your strengths",
                  icon: TestTube,
                },
                {
                  title: "Get Hired & Onboard",
                  desc: "Track your progress, get feedback, and complete onboarding with ease",
                  icon: CheckCircle,
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 group hover:bg-blue-50/50 p-4 rounded-xl transition-all duration-300"
                >
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <item.icon className="h-7 w-7 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 pt-2">
                    <h4 className="text-lg sm:text-xl font-bold mb-2 text-slate-900">{item.title}</h4>
                    <p className="text-slate-600 leading-relaxed text-sm sm:text-base">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* For Recruiters & HR Teams */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-purple-600 mb-3">For Recruiters & HR Teams</h3>
              <p className="text-slate-600 mb-6 text-base sm:text-lg">
                Your complete hiring and employee management solution
              </p>
              <Link to="/auth/recruiter">
                <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 px-6 py-3 rounded-xl group shadow-lg hover:shadow-xl transition-all duration-300 text-base">
                  <Briefcase className="mr-2 h-5 w-5" />
                  Login as Recruiter
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <div className="space-y-6">
              {[
                {
                  title: "Post Jobs & Create Tests",
                  desc: "List openings with detailed criteria and attach smart skill assessments",
                  icon: FileCheck,
                },
                {
                  title: "Shortlist & Interview",
                  desc: "Filter candidates using test results, schedule interviews, and communicate seamlessly",
                  icon: Filter,
                },
                {
                  title: "Onboard & Manage",
                  desc: "Hire top talent, complete onboarding, and manage employees through the HRMS dashboard",
                  icon: Settings,
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 group hover:bg-purple-50/50 p-4 rounded-xl transition-all duration-300"
                >
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <item.icon className="h-7 w-7 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 pt-2">
                    <h4 className="text-lg sm:text-xl font-bold mb-2 text-slate-900">{item.title}</h4>
                    <p className="text-slate-600 leading-relaxed text-sm sm:text-base">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Freelancers & Colleges */}
        <div className="grid md:grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto">
          {/* For Freelancers & Clients */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl mb-4 shadow-lg">
                <Coffee className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-emerald-600 mb-3">For Freelancers & Clients</h3>
              <p className="text-slate-600 mb-6 text-base sm:text-lg">
                Connect, collaborate, and deliver projects seamlessly
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/freelancer-login">
                  <Button className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 px-4 py-3 rounded-xl group shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base w-full sm:w-auto">
                    <Coffee className="mr-2 h-4 w-4" />
                    Freelancer Login
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/client-login">
                  <Button
                    variant="outline"
                    className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white px-4 py-3 rounded-xl group shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base w-full sm:w-auto bg-transparent"
                  >
                    <Briefcase className="mr-2 h-4 w-4" />
                    Client Login
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="space-y-6">
              {[
                {
                  title: "Create Profile or Post Gig",
                  desc: "Freelancers list services; clients post short-term projects or hourly jobs",
                  icon: PenTool,
                },
                {
                  title: "Collaborate & Deliver",
                  desc: "Work is managed via milestones, secure chat, and file delivery system",
                  icon: MessageSquare,
                },
                {
                  title: "Payment & Rating",
                  desc: "Secure payment released after approval. Ratings help build trust",
                  icon: Star,
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 group hover:bg-emerald-50/50 p-4 rounded-xl transition-all duration-300"
                >
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <item.icon className="h-7 w-7 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 pt-2">
                    <h4 className="text-lg sm:text-xl font-bold mb-2 text-slate-900">{item.title}</h4>
                    <p className="text-slate-600 leading-relaxed text-sm sm:text-base">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* For Colleges & Students */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl mb-4 shadow-lg">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-orange-600 mb-3">For Colleges & Students</h3>
              <p className="text-slate-600 mb-6 text-base sm:text-lg">
                Streamlined campus placement and career tracking
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/college-login">
                  <Button className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 px-4 py-3 rounded-xl group shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base w-full sm:w-auto">
                    <GraduationCap className="mr-2 h-4 w-4" />
                    College Login
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/student-login">
                  <Button
                    variant="outline"
                    className="border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white px-4 py-3 rounded-xl group shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base w-full sm:w-auto bg-transparent"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Student Login
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="space-y-6">
              {[
                {
                  title: "Register as College or Student",
                  desc: "Colleges create placement drives; students build verified academic profiles",
                  icon: GraduationCap,
                },
                {
                  title: "Participate in Drives",
                  desc: "Companies book slots, post roles; students apply and take tests/interviews",
                  icon: Calendar,
                },
                {
                  title: "Track Selections & Reports",
                  desc: "Placement outcomes are auto-tracked for analytics and reporting",
                  icon: BarChart3,
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 group hover:bg-orange-50/50 p-4 rounded-xl transition-all duration-300"
                >
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <item.icon className="h-7 w-7 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 pt-2">
                    <h4 className="text-lg sm:text-xl font-bold mb-2 text-slate-900">{item.title}</h4>
                    <p className="text-slate-600 leading-relaxed text-sm sm:text-base">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HowItWorks
