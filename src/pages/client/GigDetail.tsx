
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useParams } from "react-router-dom";
import { 
  ArrowLeft, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  MessageSquare,
  Download,
  FileText,
  Calendar,
  User,
  Star
} from "lucide-react";

const GigDetail = () => {
  const { id } = useParams();
  const [selectedMilestone, setSelectedMilestone] = useState(0);

  // Mock data - replace with actual API call
  const gigData = {
    id: id,
    title: "E-commerce Website Development",
    description: "Build a complete e-commerce website with React.js, payment integration, and admin dashboard.",
    budget: 2500,
    status: "In Progress",
    progress: 75,
    freelancer: {
      name: "Alex Johnson",
      avatar: "/api/placeholder/50/50",
      rating: 4.9,
      completedProjects: 47
    },
    startDate: "2024-12-01",
    deadline: "2024-12-30",
    milestones: [
      {
        id: 1,
        title: "UI/UX Design",
        description: "Complete mockups and wireframes",
        amount: 800,
        status: "completed",
        dueDate: "2024-12-10",
        submittedFiles: ["design-mockups.fig", "wireframes.pdf"]
      },
      {
        id: 2,
        title: "Frontend Development",
        description: "Implement React components and responsive design",
        amount: 1000,
        status: "in-review",
        dueDate: "2024-12-20",
        submittedFiles: ["frontend-build.zip", "component-demo.mp4"]
      },
      {
        id: 3,
        title: "Backend & Payment Integration",
        description: "Set up API endpoints and payment processing",
        amount: 700,
        status: "pending",
        dueDate: "2024-12-30",
        submittedFiles: []
      }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in-review': return 'bg-yellow-100 text-yellow-700';
      case 'pending': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in-review': return AlertCircle;
      case 'pending': return Clock;
      default: return Clock;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/client/dashboard" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat with Freelancer
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Project Overview */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{gigData.title}</h1>
              <div className="flex items-center space-x-4 text-gray-600">
                <span className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  ${gigData.budget.toLocaleString()}
                </span>
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Due: Dec 30, 2024
                </span>
                <Badge className={getStatusColor('in-progress')}>
                  In Progress
                </Badge>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center space-x-3 mb-2">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={gigData.freelancer.avatar} />
                  <AvatarFallback>{gigData.freelancer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{gigData.freelancer.name}</p>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span>{gigData.freelancer.rating}</span>
                    <span>({gigData.freelancer.completedProjects} projects)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-gray-600">{gigData.progress}%</span>
            </div>
            <Progress value={gigData.progress} className="h-2" />
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="milestones" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="details">Project Details</TabsTrigger>
            <TabsTrigger value="files">Files & Deliverables</TabsTrigger>
          </TabsList>

          {/* Milestones Tab */}
          <TabsContent value="milestones" className="space-y-6">
            <div className="grid gap-6">
              {gigData.milestones.map((milestone, index) => {
                const StatusIcon = getStatusIcon(milestone.status);
                return (
                  <Card key={milestone.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center space-x-3">
                          <StatusIcon className="h-5 w-5" />
                          <span>{milestone.title}</span>
                        </CardTitle>
                        <div className="flex items-center space-x-3">
                          <Badge className={getStatusColor(milestone.status)}>
                            {milestone.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                          <span className="text-sm font-semibold text-green-600">
                            ${milestone.amount}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                          <p className="text-gray-700 mb-3">{milestone.description}</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            Due: {milestone.dueDate}
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          {milestone.submittedFiles.length > 0 && (
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-2">Submitted Files:</p>
                              <div className="space-y-1">
                                {milestone.submittedFiles.map((file, fileIndex) => (
                                  <div key={fileIndex} className="flex items-center justify-between text-sm">
                                    <span className="flex items-center">
                                      <FileText className="h-4 w-4 mr-1 text-gray-500" />
                                      {file}
                                    </span>
                                    <Button variant="ghost" size="sm">
                                      <Download className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {milestone.status === 'in-review' && (
                            <div className="flex space-x-2">
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button size="sm" variant="outline">
                                Request Changes
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Project Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{gigData.description}</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Files Tab */}
          <TabsContent value="files" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Project Files</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {gigData.milestones.flatMap(m => m.submittedFiles).map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-gray-500" />
                        <span>{file}</span>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GigDetail;
