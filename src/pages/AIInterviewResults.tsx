
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Brain, 
  MessageSquare,
  TrendingUp,
  Download,
  Share2,
  Home,
  RotateCcw,
  Star,
  Award,
  Target,
  BarChart3
} from 'lucide-react';

interface InterviewResults {
  interviewData: {
    jobTitle: string;
    experienceLevel: string;
  };
  questions: Array<{
    id: number;
    question: string;
    type: string;
  }>;
  responses: string[];
  scores: {
    overall: number;
    technical: number;
    communication: number;
    behavioral: number;
  };
  duration: number;
  completedAt: string;
}

const AIInterviewResults = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState<InterviewResults | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedResults = localStorage.getItem('aiInterviewResults');
    if (savedResults) {
      setResults(JSON.parse(savedResults));
    } else {
      // Redirect to interview if no results found
      navigate('/ai-interview');
    }
    setLoading(false);
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return null;
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} minutes`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { variant: 'default' as const, text: 'Excellent' };
    if (score >= 80) return { variant: 'default' as const, text: 'Very Good' };
    if (score >= 70) return { variant: 'secondary' as const, text: 'Good' };
    if (score >= 60) return { variant: 'secondary' as const, text: 'Average' };
    return { variant: 'destructive' as const, text: 'Needs Work' };
  };

  const handleDownloadReport = () => {
    const reportContent = `
AI Interview Report
===================
Position: ${results.interviewData.jobTitle}
Date: ${new Date(results.completedAt).toLocaleDateString()}
Duration: ${formatTime(results.duration)}

Overall Score: ${Math.round(results.scores.overall)}/100
Technical: ${Math.round(results.scores.technical)}/100
Communication: ${Math.round(results.scores.communication)}/100
Behavioral: ${Math.round(results.scores.behavioral)}/100

Questions Answered: ${results.questions.length}
`;
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AI_Interview_Report_${results.interviewData.jobTitle.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My AI Interview Results',
        text: `I scored ${Math.round(results.scores.overall)}/100 in my AI interview for ${results.interviewData.jobTitle}!`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(`I scored ${Math.round(results.scores.overall)}/100 in my AI interview for ${results.interviewData.jobTitle}!`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Trophy className="h-16 w-16 text-yellow-500" />
              {results.scores.overall >= 80 && (
                <Star className="h-6 w-6 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
              )}
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Interview Complete!</h1>
          <p className="text-xl text-gray-600 mb-2">
            Your AI interview for <span className="font-semibold text-blue-600">{results.interviewData.jobTitle}</span>
          </p>
          <p className="text-gray-500">
            Completed on {new Date(results.completedAt).toLocaleDateString()} • Duration: {formatTime(results.duration)}
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Overall Score Card */}
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white mb-8">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <Award className="h-8 w-8 mr-3" />
                  <h2 className="text-3xl font-bold">Overall Score</h2>
                </div>
                <div className="text-7xl font-bold mb-6">{Math.round(results.scores.overall)}</div>
                <div className="text-2xl mb-4">out of 100</div>
                <div className="flex items-center justify-center space-x-8 text-sm opacity-90">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{formatTime(results.duration)}</span>
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    <span>{results.questions.length} questions</span>
                  </div>
                  <div className="flex items-center">
                    <Target className="h-4 w-4 mr-2" />
                    <span>{results.interviewData.experienceLevel} level</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Results Tabs */}
          <Tabs defaultValue="scores" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="scores" className="flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                Score Breakdown
              </TabsTrigger>
              <TabsTrigger value="feedback" className="flex items-center">
                <Brain className="h-4 w-4 mr-2" />
                AI Feedback
              </TabsTrigger>
              <TabsTrigger value="responses" className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                Your Responses
              </TabsTrigger>
            </TabsList>

            <TabsContent value="scores" className="space-y-6">
              {/* Score Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Brain className="h-5 w-5 mr-2 text-blue-600" />
                        Technical Skills
                      </div>
                      <Badge {...getScoreBadge(results.scores.technical)}>
                        {getScoreBadge(results.scores.technical).text}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className={`text-3xl font-bold ${getScoreColor(results.scores.technical)}`}>
                          {Math.round(results.scores.technical)}
                        </span>
                        <span className="text-gray-500">/100</span>
                      </div>
                      <Progress value={results.scores.technical} className="h-3" />
                      <p className="text-sm text-gray-600">
                        {results.scores.technical >= 80 
                          ? "Excellent technical knowledge and problem-solving skills demonstrated."
                          : results.scores.technical >= 60
                          ? "Good technical foundation with room for deeper expertise."
                          : "Focus on strengthening core technical concepts and practical application."}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        <MessageSquare className="h-5 w-5 mr-2 text-green-600" />
                        Communication
                      </div>
                      <Badge {...getScoreBadge(results.scores.communication)}>
                        {getScoreBadge(results.scores.communication).text}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className={`text-3xl font-bold ${getScoreColor(results.scores.communication)}`}>
                          {Math.round(results.scores.communication)}
                        </span>
                        <span className="text-gray-500">/100</span>
                      </div>
                      <Progress value={results.scores.communication} className="h-3" />
                      <p className="text-sm text-gray-600">
                        {results.scores.communication >= 80 
                          ? "Outstanding communication skills with clear, professional delivery."
                          : results.scores.communication >= 60
                          ? "Good communication with clear expression of ideas."
                          : "Work on articulation and structuring responses more clearly."}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
                        Behavioral
                      </div>
                      <Badge {...getScoreBadge(results.scores.behavioral)}>
                        {getScoreBadge(results.scores.behavioral).text}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className={`text-3xl font-bold ${getScoreColor(results.scores.behavioral)}`}>
                          {Math.round(results.scores.behavioral)}
                        </span>
                        <span className="text-gray-500">/100</span>
                      </div>
                      <Progress value={results.scores.behavioral} className="h-3" />
                      <p className="text-sm text-gray-600">
                        {results.scores.behavioral >= 80 
                          ? "Excellent examples and strong understanding of workplace dynamics."
                          : results.scores.behavioral >= 60
                          ? "Good behavioral responses with relevant examples."
                          : "Prepare more specific examples using the STAR method."}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="feedback" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Strengths */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-green-700">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Key Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {results.scores.communication >= 80 && (
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">Excellent communication and articulation skills</span>
                        </li>
                      )}
                      {results.scores.technical >= 75 && (
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">Strong technical knowledge and problem-solving approach</span>
                        </li>
                      )}
                      {results.scores.behavioral >= 70 && (
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">Good examples of teamwork and leadership</span>
                        </li>
                      )}
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Professional demeanor throughout the interview</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Good time management and interview preparation</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Improvement Areas */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-orange-700">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Areas for Growth
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {results.scores.technical < 75 && (
                        <li className="flex items-start">
                          <TrendingUp className="h-4 w-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">Deepen technical knowledge in core areas</span>
                        </li>
                      )}
                      {results.scores.behavioral < 75 && (
                        <li className="flex items-start">
                          <TrendingUp className="h-4 w-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">Use more specific examples in behavioral questions</span>
                        </li>
                      )}
                      {results.scores.communication < 80 && (
                        <li className="flex items-start">
                          <TrendingUp className="h-4 w-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">Structure responses more clearly</span>
                        </li>
                      )}
                      <li className="flex items-start">
                        <TrendingUp className="h-4 w-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Practice system design questions for senior roles</span>
                      </li>
                      <li className="flex items-start">
                        <TrendingUp className="h-4 w-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Research company-specific information before interviews</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="responses" className="space-y-4">
              {results.questions.map((question, index) => (
                <Card key={question.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Question {index + 1}: {question.type.charAt(0).toUpperCase() + question.type.slice(1)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-medium text-gray-900 mb-2">Question:</p>
                      <p className="text-gray-700">{question.question}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="font-medium text-blue-900 mb-2">Your Response:</p>
                      <p className="text-blue-800">
                        {results.responses[index] || "Response was provided verbally during the interview."}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 pt-8 border-t">
            <Button onClick={handleDownloadReport} className="bg-blue-600 hover:bg-blue-700">
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share Results
            </Button>
            <Button variant="outline" onClick={() => navigate('/ai-interview')}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Try Another Interview
            </Button>
            <Button variant="outline" onClick={() => navigate('/')}>
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInterviewResults;
