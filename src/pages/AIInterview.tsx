
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { 
  Bot, 
  Video, 
  MessageSquare, 
  Brain, 
  Shield, 
  Globe, 
  Clock,
  CheckCircle,
  Play
} from 'lucide-react';

const AIInterview = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [interviewType, setInterviewType] = useState('');
  const navigate = useNavigate();

  const handleStartInterview = () => {
    if (!jobDescription || !jobTitle || !experienceLevel || !interviewType) {
      alert('Please fill in all required fields');
      return;
    }

    const interviewData = {
      jobDescription,
      jobTitle,
      experienceLevel,
      interviewType
    };

    if (interviewType === 'text') {
      navigate('/ai-interview/text', { state: interviewData });
    } else {
      navigate('/ai-interview/video', { state: interviewData });
    }
  };

  const features = [
    {
      icon: <Brain className="h-6 w-6 text-blue-600" />,
      title: "Dynamic Question Generation",
      description: "AI generates questions based on your job description and field expertise"
    },
    {
      icon: <Bot className="h-6 w-6 text-green-600" />,
      title: "Human-like Interaction",
      description: "Natural conversation flow with follow-up questions and clarifications"
    },
    {
      icon: <Shield className="h-6 w-6 text-red-600" />,
      title: "Cheating Detection",
      description: "Advanced monitoring for tab switching, copy-paste, and suspicious behavior"
    },
    {
      icon: <Globe className="h-6 w-6 text-purple-600" />,
      title: "Multilingual Support",
      description: "Conduct interviews in multiple languages with real-time translation"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Bot className="h-12 w-12 text-blue-600 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              AI-Based Interview
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the future of hiring with our AI interviewer that conducts realistic, 
            dynamic interviews tailored to your job requirements.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Interview Setup */}
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Play className="h-6 w-6 mr-2 text-blue-600" />
                Start Your AI Interview
              </CardTitle>
              <CardDescription>
                Fill in the details below to customize your interview experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Job Title */}
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title *</Label>
                <Input
                  id="jobTitle"
                  placeholder="e.g., Frontend Developer, Data Scientist, Marketing Manager"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Experience Level */}
              <div className="space-y-2">
                <Label htmlFor="experience">Experience Level *</Label>
                <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                    <SelectItem value="mid">Mid Level (2-5 years)</SelectItem>
                    <SelectItem value="senior">Senior Level (5-10 years)</SelectItem>
                    <SelectItem value="lead">Lead/Principal (10+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Interview Type */}
              <div className="space-y-2">
                <Label htmlFor="interviewType">Interview Type *</Label>
                <Select value={interviewType} onValueChange={setInterviewType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select interview type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Text-Based Interview
                      </div>
                    </SelectItem>
                    <SelectItem value="video">
                      <div className="flex items-center">
                        <Video className="h-4 w-4 mr-2" />
                        Video Interview (Coming Soon)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Job Description */}
              <div className="space-y-2">
                <Label htmlFor="jobDescription">Job Description *</Label>
                <Textarea
                  id="jobDescription"
                  placeholder="Paste the complete job description here. Include required skills, responsibilities, and qualifications..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[150px] w-full"
                />
                <p className="text-sm text-gray-500">
                  The AI will analyze this description to generate relevant interview questions
                </p>
              </div>

              {/* Interview Process Info */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-4">
                  <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    What to Expect
                  </h4>
                  <div className="space-y-2 text-sm text-blue-800">
                    <div className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>5-10 dynamically generated questions based on the job description</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Mix of technical, behavioral, and situational questions</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>AI will ask follow-up questions based on your responses</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Estimated duration: 15-30 minutes</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Detailed feedback and scoring at the end</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Start Button */}
              <Button 
                onClick={handleStartInterview}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
                size="lg"
              >
                <Bot className="h-5 w-5 mr-2" />
                Start AI Interview
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIInterview;
