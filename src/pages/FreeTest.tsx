import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Code, Brain, Globe, Users, Clock, Star, CheckCircle, Play } from "lucide-react";
import { useState } from "react";

const FreeTest = () => {
  const [selectedTest, setSelectedTest] = useState("");
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    experience: ""
  });
  const navigate = useNavigate();

  const testCategories = [
    {
      id: "programming",
      title: "Programming Skills",
      icon: Code,
      description: "Test your coding abilities across multiple languages",
      duration: "45 minutes",
      questions: 25,
      difficulty: "Intermediate",
      skills: ["JavaScript", "Python", "React", "Data Structures"]
    },
    {
      id: "cognitive",
      title: "Cognitive Ability",
      icon: Brain,
      description: "Assess logical reasoning and problem-solving skills",
      duration: "30 minutes",
      questions: 40,
      difficulty: "All Levels",
      skills: ["Logical Reasoning", "Pattern Recognition", "Numerical", "Verbal"]
    },
    {
      id: "personality",
      title: "Personality & Culture",
      icon: Users,
      description: "Discover your work style and cultural preferences",
      duration: "20 minutes",
      questions: 50,
      difficulty: "No Difficulty",
      skills: ["Work Style", "Communication", "Leadership", "Team Fit"]
    },
    {
      id: "language",
      title: "Language Proficiency",
      icon: Globe,
      description: "Evaluate your language skills and communication",
      duration: "35 minutes",
      questions: 30,
      difficulty: "All Levels",
      skills: ["Grammar", "Vocabulary", "Reading", "Writing"]
    }
  ];

  const handleLinkedInImport = () => {
    // Mock LinkedIn import functionality
    setUserInfo({
      name: "John Doe",
      email: "john.doe@example.com",
      experience: "3-5 years"
    });
  };

  const startTest = () => {
    if (!selectedTest || !userInfo.name || !userInfo.email) {
      alert("Please select a test and fill in your information");
      return;
    }
    
    // Store user info for the test session
    sessionStorage.setItem('testUserInfo', JSON.stringify(userInfo));
    
    // Navigate to the test interface
    navigate(`/take-test/${selectedTest}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
        <div className="container mx-auto px-6 py-8">
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 group">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to home
          </Link>
          
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Take a Free Skills Test</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover your strengths and showcase your abilities to potential employers
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Test Selection */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Choose Your Test Category</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {testCategories.map((test) => (
                <div
                  key={test.id}
                  onClick={() => setSelectedTest(test.id)}
                  className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    selectedTest === test.id 
                      ? 'border-blue-500 bg-blue-50/50 shadow-lg' 
                      : 'border-gray-200/50 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${
                      selectedTest === test.id ? 'bg-blue-600' : 'bg-gray-100'
                    }`}>
                      <test.icon className={`h-6 w-6 ${
                        selectedTest === test.id ? 'text-white' : 'text-gray-600'
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{test.title}</h3>
                      <p className="text-sm text-gray-600">{test.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Duration: {test.duration}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span>{test.questions} questions • {test.difficulty}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {test.skills.map((skill, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Benefits Section */}
            <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Why Take Our Tests?</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <Star className="h-6 w-6 mr-3 mt-1 text-yellow-300" />
                  <div>
                    <h4 className="font-semibold mb-1">Industry-Standard</h4>
                    <p className="text-blue-100 text-sm">Tests designed by experts and used by top companies</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 mr-3 mt-1 text-green-300" />
                  <div>
                    <h4 className="font-semibold mb-1">Instant Results</h4>
                    <p className="text-blue-100 text-sm">Get detailed feedback and scores immediately</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Users className="h-6 w-6 mr-3 mt-1 text-purple-300" />
                  <div>
                    <h4 className="font-semibold mb-1">Recruiter Visibility</h4>
                    <p className="text-blue-100 text-sm">Share results with potential employers</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Brain className="h-6 w-6 mr-3 mt-1 text-pink-300" />
                  <div>
                    <h4 className="font-semibold mb-1">Skill Development</h4>
                    <p className="text-blue-100 text-sm">Identify areas for improvement and growth</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* User Information Form */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50 sticky top-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Information</h3>
              
              {/* LinkedIn Import */}
              <Button 
                onClick={handleLinkedInImport}
                variant="outline" 
                className="w-full mb-6 border-2 border-blue-700 text-blue-700 hover:bg-blue-50"
              >
                <div className="w-5 h-5 bg-blue-700 rounded mr-3 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">in</span>
                </div>
                Import from LinkedIn
              </Button>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={userInfo.name}
                    onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={userInfo.email}
                    onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                  <select
                    value={userInfo.experience}
                    onChange={(e) => setUserInfo({...userInfo, experience: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select experience</option>
                    <option value="entry">Entry Level (0-2 years)</option>
                    <option value="mid">Mid Level (3-5 years)</option>
                    <option value="senior">Senior Level (6+ years)</option>
                  </select>
                </div>
              </div>

              {/* Selected Test Summary */}
              {selectedTest && (
                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-2">Selected Test:</h4>
                  <p className="text-blue-700 font-medium">
                    {testCategories.find(t => t.id === selectedTest)?.title}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {testCategories.find(t => t.id === selectedTest)?.duration}
                  </p>
                </div>
              )}

              <Button 
                onClick={startTest}
                size="lg" 
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg py-6 rounded-xl shadow-lg"
                disabled={!selectedTest || !userInfo.name || !userInfo.email}
              >
                <Play className="mr-3 h-6 w-6" />
                Start Test Now
              </Button>

              <p className="text-xs text-gray-500 mt-4 text-center">
                By starting the test, you agree to our terms and privacy policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeTest;
