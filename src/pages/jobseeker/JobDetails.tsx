
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, DollarSign, Clock, FileText, Building } from "lucide-react";

const JobDetails = () => {
  const { id } = useParams();
  
  // Mock job data - in real app, fetch based on ID
  const job = {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    salary: "₹10L - ₹12.5L",
    type: "Full-time",
    experience: "3-5 years",
    skills: ["React", "TypeScript", "Node.js", "GraphQL", "AWS"],
    hasTest: true,
    description: `We are looking for a Senior Frontend Developer to join our growing team. You will be responsible for building and maintaining high-quality web applications using modern technologies.`,
    requirements: [
      "Bachelor's degree in Computer Science or related field",
      "3+ years of experience with React and TypeScript",
      "Strong understanding of modern JavaScript (ES6+)",
      "Experience with state management (Redux/Context API)",
      "Knowledge of testing frameworks (Jest, React Testing Library)",
      "Familiarity with GraphQL and REST APIs"
    ],
    responsibilities: [
      "Develop and maintain frontend applications using React and TypeScript",
      "Collaborate with designers to implement pixel-perfect UI/UX",
      "Write clean, maintainable, and well-tested code",
      "Participate in code reviews and technical discussions",
      "Mentor junior developers and contribute to best practices"
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <Link to="/jobseeker/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900 group">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Jobs
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{job.title}</h1>
                
                <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
                  <div className="flex items-center">
                    <Building className="mr-2 h-4 w-4" />
                    {job.company}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    {job.location}
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    {job.type}
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="mr-2 h-4 w-4" />
                    {job.salary}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {job.skills.map((skill) => (
                    <span key={skill} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
                <p className="text-gray-700 mb-6">{job.description}</p>

                <h3 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h3>
                <ul className="space-y-2 mb-6">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-4">Responsibilities</h3>
                <ul className="space-y-2">
                  {job.responsibilities.map((resp, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Apply for this position</h3>
                
                {job.hasTest && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center mb-2">
                      <FileText className="mr-2 h-4 w-4 text-yellow-600" />
                      <span className="font-medium text-yellow-800">Test Required</span>
                    </div>
                    <p className="text-sm text-yellow-700">
                      This position requires completing a technical assessment before applying.
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {job.hasTest ? (
                  <>
                    <Link to={`/jobseeker/test/${job.id}`} className="block">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        <FileText className="mr-2 h-4 w-4" />
                        Take Assessment First
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full" disabled>
                      Apply (Complete test first)
                    </Button>
                  </>
                ) : (
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Apply Now
                  </Button>
                )}
                
                <Button variant="outline" className="w-full">
                  Save Job
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Job Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Experience:</span>
                    <span className="text-gray-900">{job.experience}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="text-gray-900">{job.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Salary:</span>
                    <span className="text-gray-900">{job.salary}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
