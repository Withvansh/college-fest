
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  TrendingUp, 
  Target, 
  Award, 
  FileText,
  BarChart3,
  PieChart,
  Calendar,
  Download
} from "lucide-react";

const StudentAnalytics = () => {
  const performanceData = {
    totalApplications: 12,
    testsCompleted: 8,
    averageScore: 87,
    shortlisted: 5,
    interviews: 3,
    offers: 2
  };

  const testHistory = [
    { company: "Google", date: "Dec 20, 2024", score: 95, status: "Qualified" },
    { company: "Microsoft", date: "Dec 18, 2024", score: 88, status: "Qualified" },
    { company: "Amazon", date: "Dec 15, 2024", score: 85, status: "Qualified" },
    { company: "Flipkart", date: "Dec 12, 2024", score: 92, status: "Qualified" },
    { company: "Accenture", date: "Dec 10, 2024", score: 78, status: "Not Qualified" }
  ];

  const applicationOutcomes = [
    { company: "Google", status: "Interview Scheduled", package: "₹25 LPA", applied: "Dec 20, 2024" },
    { company: "Microsoft", status: "Offer Received", package: "₹22 LPA", applied: "Dec 18, 2024" },
    { company: "Amazon", status: "Technical Round", package: "₹20 LPA", applied: "Dec 15, 2024" },
    { company: "Flipkart", status: "Offer Received", package: "₹18 LPA", applied: "Dec 12, 2024" },
    { company: "TCS", status: "Selected", package: "₹12 LPA", applied: "Dec 8, 2024" }
  ];

  const monthlyProgress = [
    { month: "Sep", applications: 2, tests: 1, offers: 0 },
    { month: "Oct", applications: 3, tests: 2, offers: 0 },
    { month: "Nov", applications: 4, tests: 3, offers: 1 },
    { month: "Dec", applications: 3, tests: 2, offers: 1 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/student/dashboard" className="flex items-center space-x-3">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Performance Analytics</h1>
                <p className="text-gray-600">Detailed insights into your placement journey</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4 text-center">
              <FileText className="h-6 w-6 mx-auto mb-2" />
              <div className="text-2xl font-bold">{performanceData.totalApplications}</div>
              <p className="text-xs text-blue-100">Applications</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4 text-center">
              <Target className="h-6 w-6 mx-auto mb-2" />
              <div className="text-2xl font-bold">{performanceData.testsCompleted}</div>
              <p className="text-xs text-purple-100">Tests</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-6 w-6 mx-auto mb-2" />
              <div className="text-2xl font-bold">{performanceData.averageScore}%</div>
              <p className="text-xs text-green-100">Avg Score</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-4 text-center">
              <Award className="h-6 w-6 mx-auto mb-2" />
              <div className="text-2xl font-bold">{performanceData.shortlisted}</div>
              <p className="text-xs text-orange-100">Shortlisted</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
            <CardContent className="p-4 text-center">
              <Calendar className="h-6 w-6 mx-auto mb-2" />
              <div className="text-2xl font-bold">{performanceData.interviews}</div>
              <p className="text-xs text-indigo-100">Interviews</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-pink-500 to-pink-600 text-white">
            <CardContent className="p-4 text-center">
              <Award className="h-6 w-6 mx-auto mb-2" />
              <div className="text-2xl font-bold">{performanceData.offers}</div>
              <p className="text-xs text-pink-100">Offers</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Test Performance Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Test Performance Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testHistory.map((test, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-semibold">{test.company}</p>
                      <p className="text-sm text-gray-600">{test.date}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-purple-600">{test.score}%</span>
                        <Badge 
                          variant={test.status === "Qualified" ? "secondary" : "outline"}
                          className={test.status === "Qualified" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}
                        >
                          {test.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Monthly Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Monthly Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyProgress.map((month, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{month.month} 2024</h4>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-xl font-bold text-blue-600">{month.applications}</div>
                        <p className="text-gray-600">Applications</p>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-purple-600">{month.tests}</div>
                        <p className="text-gray-600">Tests</p>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-green-600">{month.offers}</div>
                        <p className="text-gray-600">Offers</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Application Outcomes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              Application Outcomes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {applicationOutcomes.map((outcome, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-lg">{outcome.company}</h4>
                      <Badge 
                        variant="secondary"
                        className={
                          outcome.status === "Offer Received" ? "bg-green-100 text-green-700" :
                          outcome.status === "Selected" ? "bg-blue-100 text-blue-700" :
                          outcome.status === "Interview Scheduled" ? "bg-yellow-100 text-yellow-700" :
                          "bg-purple-100 text-purple-700"
                        }
                      >
                        {outcome.status}
                      </Badge>
                    </div>
                    <div className="mt-2 grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <p><strong>Package:</strong> {outcome.package}</p>
                      <p><strong>Applied:</strong> {outcome.applied}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Insights */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Performance Insights & Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-green-700">Strengths</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>High test scores (87% average)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Good conversion rate from applications to shortlisting (41%)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Consistent performance across months</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-orange-700">Areas for Improvement</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Interview preparation for better conversion</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Apply to more companies to increase opportunities</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Focus on skill development for higher packages</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentAnalytics;
