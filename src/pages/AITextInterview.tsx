
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { 
  MessageCircle, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Mic,
  MicOff,
  Play,
  Square
} from "lucide-react";

interface Question {
  type: string;
  question: string;
  category: string;
}

interface InterviewState {
  id: string | null;
  status: 'setup' | 'in_progress' | 'completed';
  questions: Question[];
  currentQuestionIndex: number;
  responses: string[];
  startTime: Date | null;
  jobTitle: string;
  jobDescription: string;
  industry: string;
}

const AITextInterview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [interview, setInterview] = useState<InterviewState>({
    id: null,
    status: 'setup',
    questions: [],
    currentQuestionIndex: 0,
    responses: [],
    startTime: null,
    jobTitle: '',
    jobDescription: '',
    industry: ''
  });
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes per question
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (interview.status === 'in_progress' && timeRemaining > 0) {
      timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && interview.status === 'in_progress') {
      handleNextQuestion();
    }
    return () => clearTimeout(timer);
  }, [interview.status, timeRemaining]);

  const startInterview = async () => {
    if (!user || !interview.jobTitle) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-interview', {
        body: {
          action: 'start',
          jobTitle: interview.jobTitle,
          jobDescription: interview.jobDescription,
          industry: interview.industry
        }
      });

      if (error) throw error;

      setInterview(prev => ({
        ...prev,
        id: data.interviewId,
        status: 'in_progress',
        questions: data.questions,
        startTime: new Date(),
        responses: new Array(data.questions.length).fill('')
      }));
      
      setTimeRemaining(300); // Reset timer for first question
      toast.success("Interview started! Good luck!");
    } catch (error) {
      console.error('Error starting interview:', error);
      toast.error("Failed to start interview. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuestion = async () => {
    if (!interview.id || !currentAnswer.trim()) {
      toast.error("Please provide an answer before continuing");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('ai-interview', {
        body: {
          action: 'answer',
          interviewId: interview.id,
          answer: currentAnswer,
          questionIndex: interview.currentQuestionIndex
        }
      });

      if (error) throw error;

      // Update responses
      const newResponses = [...interview.responses];
      newResponses[interview.currentQuestionIndex] = currentAnswer;
      
      setInterview(prev => ({
        ...prev,
        responses: newResponses,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }));

      setCurrentAnswer('');
      setTimeRemaining(300); // Reset timer for next question

      // Check if interview is complete
      if (interview.currentQuestionIndex + 1 >= interview.questions.length) {
        await completeInterview();
      }
    } catch (error) {
      console.error('Error processing answer:', error);
      toast.error("Failed to process answer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const completeInterview = async () => {
    if (!interview.id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-interview', {
        body: {
          action: 'complete',
          interviewId: interview.id
        }
      });

      if (error) throw error;

      setInterview(prev => ({ ...prev, status: 'completed' }));
      
      toast.success("Interview completed! Redirecting to results...");
      
      // Redirect to results page
      setTimeout(() => {
        navigate('/ai-interview/results', { 
          state: { 
            interviewId: interview.id,
            scores: data.scores,
            feedback: data.feedback
          }
        });
      }, 2000);
    } catch (error) {
      console.error('Error completing interview:', error);
      toast.error("Failed to complete interview. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = interview.questions.length > 0 
    ? ((interview.currentQuestionIndex) / interview.questions.length) * 100 
    : 0;

  if (interview.status === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
        <div className="max-w-2xl mx-auto px-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center mb-4">
                <MessageCircle className="h-8 w-8 text-blue-600 mr-3" />
                AI Text Interview Setup
              </CardTitle>
              <p className="text-gray-600">
                Prepare for your interview by providing some context about the role you're applying for.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="jobTitle">Job Title *</Label>
                <Input
                  id="jobTitle"
                  value={interview.jobTitle}
                  onChange={(e) => setInterview(prev => ({ ...prev, jobTitle: e.target.value }))}
                  placeholder="e.g. Frontend Developer, Data Scientist"
                  required
                />
              </div>

              <div>
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={interview.industry}
                  onChange={(e) => setInterview(prev => ({ ...prev, industry: e.target.value }))}
                  placeholder="e.g. Tech, Healthcare, Finance"
                />
              </div>

              <div>
                <Label htmlFor="jobDescription">Job Description (Optional)</Label>
                <Textarea
                  id="jobDescription"
                  value={interview.jobDescription}
                  onChange={(e) => setInterview(prev => ({ ...prev, jobDescription: e.target.value }))}
                  placeholder="Paste the job description here to get more relevant questions..."
                  rows={4}
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Interview Format:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• 5 questions covering technical, behavioral, and industry knowledge</li>
                  <li>• 5 minutes per question</li>
                  <li>• Type your responses in the text area</li>
                  <li>• AI-powered scoring and feedback</li>
                </ul>
              </div>

              <Button 
                onClick={startInterview} 
                className="w-full" 
                size="lg"
                disabled={loading || !interview.jobTitle}
              >
                {loading ? "Starting Interview..." : "Start Interview"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (interview.status === 'in_progress') {
    const currentQuestion = interview.questions[interview.currentQuestionIndex];
    const isLastQuestion = interview.currentQuestionIndex === interview.questions.length - 1;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
        <div className="max-w-4xl mx-auto px-6">
          {/* Progress Header */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold">AI Interview in Progress</h2>
                  <p className="text-gray-600">Question {interview.currentQuestionIndex + 1} of {interview.questions.length}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-lg font-mono">
                    <Clock className="h-5 w-5 mr-2" />
                    <span className={timeRemaining < 60 ? "text-red-600" : "text-gray-900"}>
                      {formatTime(timeRemaining)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">Time remaining</p>
                </div>
              </div>
              <Progress value={progress} className="h-2" />
            </CardContent>
          </Card>

          {/* Question Card */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Interview Question
                </CardTitle>
                <Badge variant="outline">
                  {currentQuestion?.type || 'General'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed">{currentQuestion?.question}</p>
            </CardContent>
          </Card>

          {/* Answer Card */}
          <Card>
            <CardHeader>
              <CardTitle>Your Answer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Type your answer here..."
                rows={8}
                className="resize-none"
              />
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {currentAnswer.length} characters • {currentAnswer.split(' ').filter(word => word.length > 0).length} words
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (interview.currentQuestionIndex > 0) {
                        setInterview(prev => ({
                          ...prev,
                          currentQuestionIndex: prev.currentQuestionIndex - 1
                        }));
                        setCurrentAnswer(interview.responses[interview.currentQuestionIndex - 1] || '');
                      }
                    }}
                    disabled={interview.currentQuestionIndex === 0}
                  >
                    Previous
                  </Button>
                  
                  <Button
                    onClick={isLastQuestion ? completeInterview : handleNextQuestion}
                    disabled={loading || !currentAnswer.trim()}
                  >
                    {loading ? "Processing..." : isLastQuestion ? "Complete Interview" : "Next Question"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (interview.status === 'completed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="p-8">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Interview Completed!</h2>
            <p className="text-gray-600 mb-6">
              Your responses have been analyzed. Redirecting to results...
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default AITextInterview;
