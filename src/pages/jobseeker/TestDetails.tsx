
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Clock, FileText, CheckCircle, Users } from "lucide-react";

const TestDetails = () => {
  const { id } = useParams();
  const [testStarted, setTestStarted] = useState(false);
  
  // Mock test data
  const test = {
    id: 1,
    title: "Frontend Developer Assessment",
    company: "TechCorp Inc.",
    duration: "90 minutes",
    totalQuestions: 45,
    sections: [
      { name: "JavaScript Fundamentals", questions: 15, type: "MCQ" },
      { name: "React & TypeScript", questions: 20, type: "MCQ" },
      { name: "Coding Challenge", questions: 2, type: "Coding" },
      { name: "System Design", questions: 8, type: "MCQ" }
    ],
    level: "Intermediate",
    attempts: 1,
    instructions: [
      "Ensure you have a stable internet connection",
      "Use a laptop or desktop for the coding sections",
      "You cannot pause the test once started",
      "All questions must be completed within the time limit",
      "Results will be shared within 24 hours"
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <Link to="/jobseeker/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900 group text-sm md:text-base">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Jobs
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-6 py-4 md:py-8">
        <div className="max-w-4xl mx-auto">
          {!testStarted ? (
            <>
              {/* Test Overview */}
              <div className="bg-white rounded-2xl shadow-lg p-4 md:p-8 mb-4 md:mb-6">
                <div className="text-center mb-4 md:mb-8">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 px-2">{test.title}</h1>
                  <p className="text-gray-600 text-sm md:text-base">{test.company}</p>
                  
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-3 md:gap-6 mt-4 md:mt-6">
                    <div className="flex items-center text-gray-600 text-sm md:text-base">
                      <Clock className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                      {test.duration}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm md:text-base">
                      <FileText className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                      {test.totalQuestions} Questions
                    </div>
                    <div className="flex items-center text-gray-600 text-sm md:text-base">
                      <Users className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                      {test.level} Level
                    </div>
                  </div>
                </div>

                {/* Test Sections */}
                <div className="mb-6 md:mb-8">
                  <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">Test Sections</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    {test.sections.map((section, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-3 md:p-4">
                        <h3 className="font-medium text-gray-900 mb-2 text-sm md:text-base">{section.name}</h3>
                        <div className="flex justify-between text-xs md:text-sm text-gray-600">
                          <span>{section.questions} Questions</span>
                          <span className="font-medium text-blue-600">{section.type}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Instructions */}
                <div className="mb-6 md:mb-8">
                  <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">Instructions</h2>
                  <div className="bg-gray-50 rounded-lg p-4 md:p-6">
                    <ul className="space-y-2 md:space-y-3">
                      {test.instructions.map((instruction, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="mr-2 md:mr-3 h-4 w-4 md:h-5 md:w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-xs md:text-sm">{instruction}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Start Test Button */}
                <div className="text-center">
                  <Button
                    onClick={() => setTestStarted(true)}
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 px-6 md:px-8 py-3 md:py-4 text-sm md:text-lg w-full sm:w-auto"
                  >
                    Start Assessment
                  </Button>
                  <p className="text-xs md:text-sm text-gray-500 mt-2">
                    You have {test.attempts} attempt remaining
                  </p>
                </div>
              </div>
            </>
          ) : (
            /* Test Interface */
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-8">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-8 gap-4">
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">JavaScript Fundamentals</h1>
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                  <div className="text-center sm:text-right">
                    <div className="text-xs md:text-sm text-gray-600">Time Remaining</div>
                    <div className="text-base md:text-lg font-bold text-red-600">01:23:45</div>
                  </div>
                  <div className="text-center sm:text-right">
                    <div className="text-xs md:text-sm text-gray-600">Progress</div>
                    <div className="text-base md:text-lg font-bold text-blue-600">1 / 45</div>
                  </div>
                </div>
              </div>

              {/* Question */}
              <div className="mb-6 md:mb-8">
                <h2 className="text-base md:text-lg font-medium text-gray-900 mb-3 md:mb-4">
                  Question 1: What is the output of the following JavaScript code?
                </h2>
                
                <div className="bg-gray-100 rounded-lg p-3 md:p-4 mb-4 md:mb-6 font-mono text-xs md:text-sm overflow-x-auto">
                  <pre>{`console.log(typeof null);
console.log(typeof undefined);
console.log(typeof NaN);`}</pre>
                </div>

                <div className="space-y-2 md:space-y-3">
                  {["object, undefined, number", "null, undefined, number", "object, undefined, undefined", "null, null, number"].map((option, index) => (
                    <label key={index} className="flex items-center p-3 md:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input type="radio" name="question1" value={option} className="mr-2 md:mr-3" />
                      <span className="text-sm md:text-base">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex flex-col sm:flex-row justify-between gap-3">
                <Button variant="outline" disabled className="sm:w-auto">
                  Previous
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 sm:w-auto">
                  Next Question
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestDetails;
