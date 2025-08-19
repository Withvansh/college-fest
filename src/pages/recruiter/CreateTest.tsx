
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const CreateTest = () => {
  const [testData, setTestData] = useState({
    title: "",
    role: "",
    duration: "",
    level: "",
    description: ""
  });

  const [questions, setQuestions] = useState([
    { id: 1, type: "mcq", question: "", options: ["", "", "", ""], correct: 0 }
  ]);

  const addQuestion = (type: string) => {
    const newQuestion = {
      id: Date.now(),
      type,
      question: "",
      options: type === "mcq" ? ["", "", "", ""] : [],
      correct: 0
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (id: number) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id: number, field: string, value: any) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Test created:", { testData, questions });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center">
            <Link to="/recruiter/dashboard" className="mr-4">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Create Assessment Test</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <Tabs defaultValue="details" className="space-y-6">
          <TabsList>
            <TabsTrigger value="details">Test Details</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Test Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="title">Test Title</Label>
                    <Input
                      id="title"
                      value={testData.title}
                      onChange={(e) => setTestData({...testData, title: e.target.value})}
                      placeholder="e.g. Frontend Developer Assessment"
                    />
                  </div>

                  <div>
                    <Label htmlFor="role">Test For Role</Label>
                    <Select onValueChange={(value) => setTestData({...testData, role: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="frontend">Frontend Developer</SelectItem>
                        <SelectItem value="backend">Backend Developer</SelectItem>
                        <SelectItem value="fullstack">Full Stack Developer</SelectItem>
                        <SelectItem value="designer">UI/UX Designer</SelectItem>
                        <SelectItem value="qa">QA Engineer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={testData.duration}
                      onChange={(e) => setTestData({...testData, duration: e.target.value})}
                      placeholder="60"
                    />
                  </div>

                  <div>
                    <Label htmlFor="level">Test Level</Label>
                    <Select onValueChange={(value) => setTestData({...testData, level: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-6">
                  <Label htmlFor="description">Test Description</Label>
                  <Textarea
                    id="description"
                    value={testData.description}
                    onChange={(e) => setTestData({...testData, description: e.target.value})}
                    placeholder="Describe what this test evaluates..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="questions">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Test Questions</h3>
                <div className="space-x-2">
                  <Button onClick={() => addQuestion("mcq")} variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add MCQ
                  </Button>
                  <Button onClick={() => addQuestion("coding")} variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Coding
                  </Button>
                </div>
              </div>

              {questions.map((q, index) => (
                <Card key={q.id}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base">
                        Question {index + 1} ({q.type.toUpperCase()})
                      </CardTitle>
                      <Button
                        onClick={() => removeQuestion(q.id)}
                        variant="ghost"
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label>Question</Label>
                        <Textarea
                          value={q.question}
                          onChange={(e) => updateQuestion(q.id, "question", e.target.value)}
                          placeholder={q.type === "mcq" ? "Enter your question..." : "Enter coding problem description..."}
                          rows={3}
                        />
                      </div>

                      {q.type === "mcq" && (
                        <div className="space-y-2">
                          <Label>Options</Label>
                          {q.options.map((option, optIndex) => (
                            <div key={optIndex} className="flex items-center space-x-2">
                              <Input
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [...q.options];
                                  newOptions[optIndex] = e.target.value;
                                  updateQuestion(q.id, "options", newOptions);
                                }}
                                placeholder={`Option ${optIndex + 1}`}
                              />
                              <input
                                type="radio"
                                name={`correct-${q.id}`}
                                checked={q.correct === optIndex}
                                onChange={() => updateQuestion(q.id, "correct", optIndex)}
                                className="text-blue-600"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Test Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Live Test</h4>
                      <p className="text-sm text-gray-600">Make this test available to candidates</p>
                    </div>
                    <Button variant="outline">Activate</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Test Tracking</h4>
                      <p className="text-sm text-gray-600">Enable candidate progress tracking</p>
                    </div>
                    <Button variant="outline">Enable</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex gap-4">
          <Button onClick={handleSubmit} className="flex-1">
            Create Test
          </Button>
          <Button variant="outline" className="flex-1">
            Save Draft
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateTest;
