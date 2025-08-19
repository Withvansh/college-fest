
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  Trophy, 
  Clock, 
  Target, 
  Download, 
  Share2, 
  RotateCcw, 
  CheckCircle, 
  XCircle,
  ArrowLeft,
  Award
} from "lucide-react";

const TestResults = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);

  useEffect(() => {
    const savedResults = localStorage.getItem('testResults');
    if (savedResults) {
      const parsedResults = JSON.parse(savedResults);
      console.log('Loaded test results:', parsedResults);
      setResults(parsedResults);
    } else {
      navigate('/free-test');
    }
  }, [navigate]);

  if (!results) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your results...</p>
      </div>
    </div>;
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score) => {
    if (score >= 80) return { label: 'Excellent', color: 'bg-green-100 text-green-800' };
    if (score >= 60) return { label: 'Good', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Needs Improvement', color: 'bg-red-100 text-red-800' };
  };

  const getTestTitle = () => {
    switch(testId) {
      case 'language': return 'Language Proficiency Test';
      case 'programming': return 'Programming Skills Test';
      case 'cognitive': return 'Cognitive Ability Test';
      case 'personality': return 'Personality & Culture Test';
      default: return 'Skills Assessment';
    }
  };

  const scoreBadge = getScoreBadge(results.score);

  // Enhanced category breakdown based on test type
  const getCategoryBreakdown = () => {
    if (testId === 'language') {
      return [
        { name: 'Grammar', score: results.score >= 80 ? 85 : results.score >= 60 ? 75 : 45, total: 2, correct: results.score >= 60 ? 2 : 1 },
        { name: 'Vocabulary', score: results.score >= 80 ? 90 : results.score >= 60 ? 70 : 50, total: 1, correct: results.score >= 60 ? 1 : 0 },
        { name: 'Reading Comprehension', score: results.score >= 80 ? 95 : results.score >= 60 ? 80 : 60, total: 1, correct: 1 },
        { name: 'Fill in the Blank', score: results.score >= 80 ? 80 : results.score >= 60 ? 65 : 40, total: 1, correct: results.score >= 60 ? 1 : 0 }
      ];
    }
    return [
      { name: 'Section 1', score: results.score, total: 2, correct: Math.floor(results.score/50) },
      { name: 'Section 2', score: results.score, total: 2, correct: Math.floor(results.score/50) }
    ];
  };

  const categoryBreakdown = getCategoryBreakdown();

  const handleRetakeTest = () => {
    localStorage.removeItem('testResults');
    navigate('/free-test');
  };

  const handleDownloadResults = () => {
    const dataStr = JSON.stringify({
      testName: getTestTitle(),
      score: results.score,
      timeElapsed: formatTime(results.timeElapsed),
      totalQuestions: results.totalQuestions || 5,
      answeredQuestions: Object.keys(results.answers).length,
      categoryBreakdown,
      completedAt: new Date().toISOString()
    }, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${testId}-test-results.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleShareResults = () => {
    const shareText = `I just completed a ${getTestTitle()} and scored ${results.score}%! 🎉`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Test Results',
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
      alert('Results link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
        <div className="container mx-auto px-6 py-6">
          <Link to="/free-test" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 group">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Tests
          </Link>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Trophy className="h-12 w-12 text-yellow-500 mr-3" />
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Test Completed!</h1>
                <p className="text-xl text-gray-600">{getTestTitle()} Results</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Overall Score Card */}
          <Card className="mb-8 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center mb-4">
                <div className={`text-6xl font-bold ${getScoreColor(results.score)}`}>
                  {results.score}%
                </div>
                <div className="ml-4">
                  <Badge className={scoreBadge.color}>
                    {scoreBadge.label}
                  </Badge>
                  {results.score >= 80 && (
                    <div className="flex items-center mt-2">
                      <Award className="h-5 w-5 text-yellow-500 mr-1" />
                      <span className="text-sm font-medium text-yellow-700">Certificate Earned!</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Clock className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">Time Taken</span>
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {formatTime(results.timeElapsed)}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Target className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">Questions Answered</span>
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {Object.keys(results.answers).length} / {results.totalQuestions || 5}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <CheckCircle className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">Accuracy</span>
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {results.score}%
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Category Breakdown */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-6 w-6 mr-2 text-blue-600" />
                Performance Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {categoryBreakdown.map((category, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                      <div className="flex items-center">
                        <span className={`font-bold ${getScoreColor(category.score)}`}>
                          {category.score}%
                        </span>
                        <span className="text-gray-500 ml-2">
                          ({category.correct}/{category.total})
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          category.score >= 80 ? 'bg-green-500' : 
                          category.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${category.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Button 
              onClick={handleRetakeTest}
              className="bg-blue-600 hover:bg-blue-700 flex items-center justify-center py-6"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Retake Test
            </Button>
            
            <Button 
              onClick={handleDownloadResults}
              variant="outline"
              className="flex items-center justify-center py-6"
            >
              <Download className="h-5 w-5 mr-2" />
              Download Results
            </Button>
            
            <Button 
              onClick={handleShareResults}
              variant="outline"
              className="flex items-center justify-center py-6"
            >
              <Share2 className="h-5 w-5 mr-2" />
              Share Results
            </Button>
          </div>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-6 w-6 mr-2 text-purple-600" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.score >= 80 ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">Excellent Performance!</h4>
                    <p className="text-green-700">
                      You demonstrate strong language proficiency. Consider taking advanced level tests or 
                      applying for positions that require excellent communication skills.
                    </p>
                  </div>
                ) : results.score >= 60 ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">Good Foundation</h4>
                    <p className="text-yellow-700">
                      You have a solid understanding of the language. Focus on areas where you scored lower 
                      to improve your overall proficiency.
                    </p>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-2">Room for Improvement</h4>
                    <p className="text-red-700">
                      Consider additional practice and training in language fundamentals. 
                      Focus on grammar, vocabulary, and reading comprehension.
                    </p>
                  </div>
                )}
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Next Steps</h4>
                  <ul className="text-blue-700 space-y-1">
                    <li>• Share your results with potential employers</li>
                    <li>• Take additional skill tests to showcase your abilities</li>
                    <li>• Update your profile with your test scores</li>
                    <li>• Consider retaking the test after additional practice</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TestResults;
