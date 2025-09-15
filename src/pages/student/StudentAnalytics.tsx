import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  FileText,
  Target,
  TrendingUp,
  Award,
  Calendar,
  PieChart,
  BarChart3,
  Loader,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import studentAPI, { StudentAnalytics as StudentAnalyticsType } from '@/lib/api/student';

const StudentAnalytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<StudentAnalyticsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?._id) {
      loadAnalytics();
    }
  }, [user]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await studentAPI.getStudentAnalytics(user!._id);
      setAnalytics(data);
    } catch (error) {
      toast.error('Failed to load analytics data');
      console.error('Analytics error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = () => {
    if (!analytics) return;

    const reportContent = `Student Performance Analytics Report

Performance Summary:
- Total Applications: ${analytics.performanceData.totalApplications}
- Tests Completed: ${analytics.performanceData.testsCompleted}
- Average Score: ${analytics.performanceData.averageScore}%
- Shortlisted: ${analytics.performanceData.shortlisted}
- Interviews: ${analytics.performanceData.interviews}
- Offers: ${analytics.performanceData.offers}

Application Outcomes:
${analytics.applicationOutcomes
  .map(outcome => `${outcome.company} - ${outcome.status} - Applied: ${outcome.appliedDate}`)
  .join('\n')}

Test History:
${analytics.testHistory
  .map(
    test => `${test.company} - Score: ${test.score}% - Status: ${test.status} - Date: ${test.date}`
  )
  .join('\n')}`;

    const element = document.createElement('a');
    element.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(reportContent);
    element.download = 'student-analytics-report.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Analytics report downloaded successfully!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load analytics data</p>
          <Button onClick={loadAnalytics} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link to="/student/dashboard" className="flex items-center">
                <Button variant="outline" size="sm" className="flex-shrink-0">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Back to Dashboard</span>
                  <span className="sm:hidden">Back</span>
                </Button>
              </Link>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                  Performance Analytics
                </h1>
                <p className="text-gray-600 text-sm hidden sm:block">
                  Detailed insights into your placement journey
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportReport}
              className="w-full sm:w-auto"
            >
              <Download className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Export Report</span>
              <span className="sm:hidden">Export</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-3 sm:p-4 text-center">
              <FileText className="h-4 w-4 sm:h-6 sm:w-6 mx-auto mb-1 sm:mb-2" />
              <div className="text-lg sm:text-2xl font-bold">
                {analytics.performanceData.totalApplications}
              </div>
              <p className="text-xs text-blue-100">Applications</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-3 sm:p-4 text-center">
              <Target className="h-4 w-4 sm:h-6 sm:w-6 mx-auto mb-1 sm:mb-2" />
              <div className="text-lg sm:text-2xl font-bold">
                {analytics.performanceData.testsCompleted}
              </div>
              <p className="text-xs text-purple-100">Tests</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-6 w-6 mx-auto mb-2" />
              <div className="text-2xl font-bold">{analytics.performanceData.averageScore}%</div>
              <p className="text-xs text-green-100">Avg Score</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-4 text-center">
              <Award className="h-6 w-6 mx-auto mb-2" />
              <div className="text-2xl font-bold">{analytics.performanceData.shortlisted}</div>
              <p className="text-xs text-orange-100">Shortlisted</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
            <CardContent className="p-4 text-center">
              <Calendar className="h-6 w-6 mx-auto mb-2" />
              <div className="text-2xl font-bold">{analytics.performanceData.interviews}</div>
              <p className="text-xs text-indigo-100">Interviews</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-pink-500 to-pink-600 text-white">
            <CardContent className="p-4 text-center">
              <Award className="h-6 w-6 mx-auto mb-2" />
              <div className="text-2xl font-bold">{analytics.performanceData.offers}</div>
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
                {analytics.testHistory.map((test, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-semibold">{test.company}</p>
                      <p className="text-sm text-gray-600">{studentAPI.formatDate(test.date)}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-purple-600">{test.score}%</span>
                        <Badge
                          variant={test.status === 'Qualified' ? 'secondary' : 'outline'}
                          className={
                            test.status === 'Qualified'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }
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
                {analytics.monthlyProgress.map((month, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">
                        {new Date(month._id.year, month._id.month - 1).toLocaleString('default', {
                          month: 'long',
                        })}{' '}
                        {month._id.year}
                      </h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-xl font-bold text-blue-600">{month.applications}</div>
                        <p className="text-gray-600">Applications</p>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-green-600">{month.selected}</div>
                        <p className="text-gray-600">Selected</p>
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
              {analytics.applicationOutcomes.map((outcome, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-lg">{outcome.company}</h4>
                      <Badge
                        variant="secondary"
                        className={
                          outcome.status === 'Selected'
                            ? 'bg-green-100 text-green-700'
                            : outcome.status === 'Under Review'
                              ? 'bg-yellow-100 text-yellow-700'
                              : outcome.status === 'Rejected'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-blue-100 text-blue-700'
                        }
                      >
                        {outcome.status}
                      </Badge>
                    </div>
                    <div className="mt-2 grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <p>
                        <strong>Package:</strong> {outcome.package || 'Not disclosed'}
                      </p>
                      <p>
                        <strong>Applied:</strong> {studentAPI.formatDate(outcome.appliedDate)}
                      </p>
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
