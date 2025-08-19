import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Clock, 
  Bot, 
  Send,
  Camera,
  AlertCircle,
  CheckCircle,
  Play,
  Square
} from 'lucide-react';

const AIVideoInterview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  // Interview state
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [isRecording, setIsRecording] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [responses, setResponses] = useState<string[]>([]);
  const [currentResponse, setCurrentResponse] = useState('');
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  
  // Get interview data from location state
  const interviewData = location.state || {
    jobTitle: 'Software Engineer',
    experienceLevel: 'mid',
    jobDescription: 'We are looking for a skilled software engineer...'
  };

  // Demo interview questions
  const questions = [
    {
      id: 1,
      question: "Tell me about yourself and your background in software development.",
      type: "introduction",
      expectedDuration: 180 // 3 minutes
    },
    {
      id: 2,
      question: `What interests you about the ${interviewData.jobTitle} position at our company?`,
      type: "motivation",
      expectedDuration: 120
    },
    {
      id: 3,
      question: "Describe a challenging project you've worked on and how you overcame the obstacles.",
      type: "technical",
      expectedDuration: 240
    },
    {
      id: 4,
      question: "How do you handle working in a team environment, especially when there are conflicts?",
      type: "behavioral",
      expectedDuration: 180
    },
    {
      id: 5,
      question: "Where do you see yourself in 5 years, and how does this role fit into your career goals?",
      type: "career",
      expectedDuration: 150
    }
  ];

  // Setup camera and microphone
  useEffect(() => {
    const setupMedia = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    setupMedia();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Timer countdown
  useEffect(() => {
    if (interviewStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleCompleteInterview();
    }
  }, [timeLeft, interviewStarted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const startInterview = () => {
    setInterviewStarted(true);
    setIsRecording(true);
  };

  const handleNextQuestion = () => {
    // Save current response
    const newResponses = [...responses];
    newResponses[currentQuestion] = currentResponse;
    setResponses(newResponses);
    setCurrentResponse('');

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowSubmitDialog(true);
    }
  };

  const handleCompleteInterview = () => {
    // Save final response
    const finalResponses = [...responses];
    finalResponses[currentQuestion] = currentResponse;
    
    // Calculate scores (demo scoring)
    const scores = {
      overall: Math.floor(Math.random() * 30) + 70, // 70-100
      technical: Math.floor(Math.random() * 25) + 75,
      communication: Math.floor(Math.random() * 20) + 80,
      behavioral: Math.floor(Math.random() * 35) + 65
    };

    const results = {
      interviewData,
      questions,
      responses: finalResponses,
      scores,
      duration: 1800 - timeLeft,
      completedAt: new Date().toISOString()
    };

    localStorage.setItem('aiInterviewResults', JSON.stringify(results));
    navigate('/ai-interview/results');
  };

  const confirmSubmission = () => {
    setShowSubmitDialog(false);
    handleCompleteInterview();
  };

  if (!interviewStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">AI Video Interview</h1>
              <p className="text-lg text-gray-600">Get ready for your interview experience</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Camera Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Camera className="h-5 w-5 mr-2" />
                    Camera Setup
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      className="w-full h-64 bg-gray-900 rounded-lg object-cover"
                    />
                    {!videoEnabled && (
                      <div className="absolute inset-0 bg-gray-900 rounded-lg flex items-center justify-center">
                        <VideoOff className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-center gap-4 mt-4">
                    <Button
                      variant={videoEnabled ? "default" : "destructive"}
                      size="sm"
                      onClick={toggleVideo}
                    >
                      {videoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant={audioEnabled ? "default" : "destructive"}
                      size="sm"
                      onClick={toggleAudio}
                    >
                      {audioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Interview Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Interview Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Position</h3>
                    <p className="text-gray-600">{interviewData.jobTitle}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Experience Level</h3>
                    <Badge variant="outline">{interviewData.experienceLevel}</Badge>
                  </div>
                  <div>
                    <h3 className="font-semibold">Duration</h3>
                    <p className="text-gray-600">Approximately 30 minutes</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Questions</h3>
                    <p className="text-gray-600">{questions.length} questions</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pre-interview Checklist */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  Before We Start
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Ensure good lighting on your face
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Test your camera and microphone
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Find a quiet environment
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Stable internet connection
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Professional attire recommended
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Have your resume/portfolio ready
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center mt-8">
              <Button
                onClick={startInterview}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                disabled={!stream}
              >
                <Play className="h-5 w-5 mr-2" />
                Start Interview
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Bot className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">AI Video Interview</h1>
              <Badge variant="outline">{interviewData.jobTitle}</Badge>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-sm text-gray-600">Time Remaining</div>
                <div className={`text-lg font-bold ${timeLeft < 300 ? 'text-red-600' : 'text-blue-600'}`}>
                  <Clock className="inline h-4 w-4 mr-1" />
                  {formatTime(timeLeft)}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-gray-600">Question</div>
                <div className="text-lg font-bold text-blue-600">
                  {currentQuestion + 1} / {questions.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Video Feed */}
          <div className="lg:col-span-1">
            <Card className="sticky top-28">
              <CardHeader>
                <CardTitle className="text-lg">Your Video</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full h-48 bg-gray-900 rounded-lg object-cover"
                  />
                  {!videoEnabled && (
                    <div className="absolute inset-0 bg-gray-900 rounded-lg flex items-center justify-center">
                      <VideoOff className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  {isRecording && (
                    <div className="absolute top-2 right-2 flex items-center bg-red-600 text-white px-2 py-1 rounded text-xs">
                      <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
                      REC
                    </div>
                  )}
                </div>
                
                <div className="flex justify-center gap-2 mt-4">
                  <Button
                    variant={videoEnabled ? "default" : "destructive"}
                    size="sm"
                    onClick={toggleVideo}
                  >
                    {videoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant={audioEnabled ? "default" : "destructive"}
                    size="sm"
                    onClick={toggleAudio}
                  >
                    {audioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Interview Content */}
          <div className="lg:col-span-2">
            <Card className="min-h-[600px]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Bot className="h-5 w-5 mr-2 text-blue-600" />
                    AI Interviewer
                  </CardTitle>
                  <Badge variant="outline" className="capitalize">
                    {questions[currentQuestion]?.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Question */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Question {currentQuestion + 1}
                  </h2>
                  <p className="text-lg text-gray-800 leading-relaxed">
                    {questions[currentQuestion]?.question}
                  </p>
                  <div className="mt-4 text-sm text-gray-600">
                    Expected response time: {Math.floor(questions[currentQuestion]?.expectedDuration / 60)} minutes
                  </div>
                </div>

                {/* Response Input */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Your Response (Optional - you can also just speak)
                  </label>
                  <textarea
                    value={currentResponse}
                    onChange={(e) => setCurrentResponse(e.target.value)}
                    placeholder="You can type key points here while speaking, or leave blank if you prefer to only speak..."
                    className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                  />
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center pt-6 border-t">
                  <div className="text-sm text-gray-500">
                    {isRecording ? (
                      <div className="flex items-center text-red-600">
                        <div className="w-2 h-2 bg-red-600 rounded-full mr-2 animate-pulse"></div>
                        Recording your response...
                      </div>
                    ) : (
                      "Click 'Next Question' when you're ready to continue"
                    )}
                  </div>

                  <div className="flex space-x-3">
                    {currentQuestion === questions.length - 1 ? (
                      <Button
                        onClick={handleNextQuestion}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Square className="h-4 w-4 mr-2" />
                        Finish Interview
                      </Button>
                    ) : (
                      <Button
                        onClick={handleNextQuestion}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Next Question
                        <Send className="h-4 w-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress Indicator */}
            <Card className="mt-6">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Interview Progress</span>
                  <span className="text-sm text-gray-500">
                    {currentQuestion + 1} of {questions.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-orange-500" />
              Submit Interview?
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to submit your interview? Once submitted, you cannot make any changes to your responses.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Interview Summary</h4>
              <div className="space-y-1 text-sm text-blue-800">
                <div>Questions answered: {questions.length}</div>
                <div>Time used: {formatTime(1800 - timeLeft)}</div>
                <div>Position: {interviewData.jobTitle}</div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>
              Continue Interview
            </Button>
            <Button onClick={confirmSubmission} className="bg-green-600 hover:bg-green-700">
              Submit Interview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AIVideoInterview;
