
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import { Clock, ChevronLeft, ChevronRight, FileText, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const TakeTest = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(35 * 60); // 35 minutes in seconds
  const [answers, setAnswers] = useState({});
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Sample questions for Language Proficiency Test
  const questions = [
    {
      id: 1,
      type: "mcq",
      question: "What is the correct past tense of 'go'?",
      options: ["goed", "gone", "went", "goes"],
      correct: 2
    },
    {
      id: 2,
      type: "mcq", 
      question: "Choose the correct sentence:",
      options: [
        "She go to school every day",
        "She goes to school every day", 
        "She gone to school",
        "She going to school"
      ],
      correct: 1
    },
    {
      id: 3,
      type: "fill",
      question: "Fill in the blank: 'He has been working here ___ 2019.'",
      placeholder: "Enter your answer",
      correct: "since"
    },
    {
      id: 4,
      type: "reading",
      passage: "The rapid advancement of technology has transformed the way we communicate. Social media platforms have become integral to our daily lives, connecting people across vast distances instantly. However, this digital revolution has also brought challenges, including privacy concerns and the spread of misinformation.",
      question: "According to the passage, what is one challenge brought by the digital revolution?",
      options: [
        "Slow communication",
        "Privacy concerns and misinformation",
        "Lack of connection between people",
        "Reduced technology advancement"
      ],
      correct: 1
    },
    {
      id: 5,
      type: "mcq",
      question: "Which word is a synonym for 'enormous'?",
      options: ["tiny", "huge", "medium", "small"],
      correct: 1
    }
  ];

  const totalQuestions = questions.length;

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      handleSubmitTest();
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (answer) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answer
    }));
    console.log(`Question ${currentQuestion + 1} answered:`, answer);
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitTest = () => {
    const results = {
      testId,
      answers,
      timeElapsed: (35 * 60) - timeLeft,
      score: calculateScore(),
      totalQuestions: questions.length
    };
    
    console.log('Test submitted with results:', results);
    localStorage.setItem('testResults', JSON.stringify(results));
    navigate(`/results/${testId}`);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, index) => {
      if (q.type === 'mcq' || q.type === 'reading') {
        if (answers[index] === q.correct) correct++;
      } else if (q.type === 'fill') {
        const userAnswer = answers[index];
        const correctAnswer = q.correct;
        if (typeof userAnswer === 'string' && typeof correctAnswer === 'string') {
          if (userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase()) correct++;
        }
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  const currentQ = questions[currentQuestion];

  const renderQuestion = () => {
    switch (currentQ.type) {
      case 'mcq':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {currentQ.question}
            </h2>
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <label key={index} className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  answers[currentQuestion] === index 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}>
                  <input
                    type="radio"
                    name={`question-${currentQuestion}`}
                    value={index}
                    checked={answers[currentQuestion] === index}
                    onChange={() => handleAnswer(index)}
                    className="mr-3 text-blue-600"
                  />
                  <span className="text-gray-800">{option}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'fill':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {currentQ.question}
            </h2>
            <input
              type="text"
              value={answers[currentQuestion] || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder={currentQ.placeholder}
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
            />
          </div>
        );

      case 'reading':
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg border">
              <h3 className="font-semibold text-gray-900 mb-3">Reading Passage:</h3>
              <p className="text-gray-700 leading-relaxed">{currentQ.passage}</p>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900">
              {currentQ.question}
            </h2>
            
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <label key={index} className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  answers[currentQuestion] === index 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}>
                  <input
                    type="radio"
                    name={`question-${currentQuestion}`}
                    value={index}
                    checked={answers[currentQuestion] === index}
                    onChange={() => handleAnswer(index)}
                    className="mr-3 text-blue-600"
                  />
                  <span className="text-gray-800">{option}</span>
                </label>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Get test title based on testId
  const getTestTitle = () => {
    switch(testId) {
      case 'language': return 'Language Proficiency Test';
      case 'programming': return 'Programming Skills Test';
      case 'cognitive': return 'Cognitive Ability Test';
      case 'personality': return 'Personality & Culture Test';
      default: return 'Skills Assessment';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <FileText className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">{getTestTitle()}</h1>
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
                <div className="text-sm text-gray-600">Progress</div>
                <div className="text-lg font-bold text-blue-600">
                  {currentQuestion + 1} / {totalQuestions}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Question Navigator Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-28">
              <h3 className="font-semibold text-gray-900 mb-4">Questions</h3>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                      index === currentQuestion
                        ? 'bg-blue-600 text-white'
                        : answers.hasOwnProperty(index)
                        ? 'bg-green-100 text-green-700 border border-green-300'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              
              <div className="mt-6 space-y-2 text-sm">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-600 rounded mr-2"></div>
                  <span className="text-gray-600">Current</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-100 border border-green-300 rounded mr-2"></div>
                  <span className="text-gray-600">Answered</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-100 rounded mr-2"></div>
                  <span className="text-gray-600">Not Answered</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Question Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-8 min-h-[500px]">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-blue-600">
                    Question {currentQuestion + 1} of {totalQuestions}
                  </span>
                  <span className="text-sm text-gray-500 capitalize">
                    {currentQ.type === 'mcq' ? 'Multiple Choice' : 
                     currentQ.type === 'fill' ? 'Fill in the Blank' : 'Reading Comprehension'}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
                  ></div>
                </div>
              </div>

              {renderQuestion()}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className="flex items-center"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>

                <div className="flex space-x-3">
                  {currentQuestion === totalQuestions - 1 ? (
                    <Button
                      onClick={() => setShowSubmitModal(true)}
                      className="bg-green-600 hover:bg-green-700 flex items-center"
                    >
                      Submit Test
                      <FileText className="h-4 w-4 ml-1" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      className="bg-blue-600 hover:bg-blue-700 flex items-center"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      <Dialog open={showSubmitModal} onOpenChange={setShowSubmitModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
              Submit Test
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to submit your test? You have answered {Object.keys(answers).length} out of {totalQuestions} questions. 
              Once submitted, you cannot make any changes.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubmitModal(false)}>
              Continue Test
            </Button>
            <Button onClick={handleSubmitTest} className="bg-green-600 hover:bg-green-700">
              Submit Test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TakeTest;
