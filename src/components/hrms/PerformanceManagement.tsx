import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, 
  Target, 
  Award, 
  TrendingUp,
  Calendar,
  User,
  Star,
  CheckCircle,
  Clock,
  AlertTriangle,
  Edit,
  Eye,
  BarChart3
} from "lucide-react";
import { toast } from "sonner";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

interface Goal {
  id: string;
  employee_id: string;
  employee_name: string;
  title: string;
  description: string;
  category: string;
  target_value: number;
  current_value: number;
  unit: string;
  due_date: string;
  status: 'active' | 'completed' | 'overdue' | 'paused';
  priority: 'low' | 'medium' | 'high';
  created_date: string;
  assigned_by: string;
}

interface PerformanceReview {
  id: string;
  employee_id: string;
  employee_name: string;
  reviewer_name: string;
  review_period: string;
  overall_rating: number;
  ratings: {
    technical_skills: number;
    communication: number;
    teamwork: number;
    leadership: number;
    problem_solving: number;
  };
  strengths: string;
  areas_for_improvement: string;
  goals_for_next_period: string;
  status: 'draft' | 'submitted' | 'approved';
  created_date: string;
}

const PerformanceManagement = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [reviews, setReviews] = useState<PerformanceReview[]>([]);
  const [activeTab, setActiveTab] = useState("goals");
  const [showNewGoalDialog, setShowNewGoalDialog] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState<PerformanceReview | null>(null);
  const [newGoal, setNewGoal] = useState<{
    employee_id: string;
    title: string;
    description: string;
    category: string;
    target_value: number;
    unit: string;
    due_date: string;
    priority: 'low' | 'medium' | 'high';
  }>({
    employee_id: '',
    title: '',
    description: '',
    category: '',
    target_value: 0,
    unit: '',
    due_date: '',
    priority: 'medium'
  });
  const [newReview, setNewReview] = useState({
    employee_id: '',
    review_period: '',
    ratings: {
      technical_skills: 3,
      communication: 3,
      teamwork: 3,
      leadership: 3,
      problem_solving: 3
    },
    strengths: '',
    areas_for_improvement: '',
    goals_for_next_period: ''
  });

  // Sample data
  useEffect(() => {
    const sampleGoals: Goal[] = [
      {
        id: '1',
        employee_id: 'EMP001',
        employee_name: 'John Doe',
        title: 'Complete React certification',
        description: 'Obtain React developer certification by end of quarter',
        category: 'skill_development',
        target_value: 1,
        current_value: 0.7,
        unit: 'certification',
        due_date: '2024-12-31',
        status: 'active',
        priority: 'high',
        created_date: '2024-10-01',
        assigned_by: 'Manager'
      },
      {
        id: '2',
        employee_id: 'EMP002',
        employee_name: 'Jane Smith',
        title: 'Increase sales by 25%',
        description: 'Achieve 25% increase in quarterly sales targets',
        category: 'performance',
        target_value: 25,
        current_value: 18,
        unit: 'percentage',
        due_date: '2024-12-31',
        status: 'active',
        priority: 'high',
        created_date: '2024-10-01',
        assigned_by: 'Sales Manager'
      },
      {
        id: '3',
        employee_id: 'EMP003',
        employee_name: 'Mike Johnson',
        title: 'Mentor junior developers',
        description: 'Provide mentorship to 2 junior developers',
        category: 'leadership',
        target_value: 2,
        current_value: 2,
        unit: 'people',
        due_date: '2024-11-30',
        status: 'completed',
        priority: 'medium',
        created_date: '2024-09-01',
        assigned_by: 'Tech Lead'
      }
    ];

    const sampleReviews: PerformanceReview[] = [
      {
        id: '1',
        employee_id: 'EMP001',
        employee_name: 'John Doe',
        reviewer_name: 'Manager Smith',
        review_period: 'Q3 2024',
        overall_rating: 4.2,
        ratings: {
          technical_skills: 4,
          communication: 4,
          teamwork: 5,
          leadership: 3,
          problem_solving: 5
        },
        strengths: 'Strong technical skills, excellent problem-solving abilities',
        areas_for_improvement: 'Leadership skills, presentation abilities',
        goals_for_next_period: 'Complete leadership training, lead a project team',
        status: 'approved',
        created_date: '2024-10-15'
      }
    ];

    setGoals(sampleGoals);
    setReviews(sampleReviews);
  }, []);

  const goalCategories = [
    'performance',
    'skill_development',
    'leadership',
    'teamwork',
    'innovation',
    'customer_satisfaction',
    'other'
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      case 'paused': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'active': return Clock;
      case 'overdue': return AlertTriangle;
      case 'paused': return Clock;
      default: return Clock;
    }
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const handleCreateGoal = async () => {
    try {
      const goal: Goal = {
        id: Date.now().toString(),
        employee_id: newGoal.employee_id,
        employee_name: 'Employee Name', // Get from employee lookup
        title: newGoal.title,
        description: newGoal.description,
        category: newGoal.category,
        target_value: newGoal.target_value,
        current_value: 0,
        unit: newGoal.unit,
        due_date: newGoal.due_date,
        status: 'active',
        priority: newGoal.priority,
        created_date: new Date().toISOString().split('T')[0],
        assigned_by: 'HR Manager'
      };
      
      setGoals(prev => [goal, ...prev]);
      setShowNewGoalDialog(false);
      setNewGoal({
        employee_id: '',
        title: '',
        description: '',
        category: '',
        target_value: 0,
        unit: '',
        due_date: '',
        priority: 'medium'
      });
      toast.success('Goal created successfully');
    } catch (error) {
      toast.error('Failed to create goal');
    }
  };

  const handleCreateReview = async () => {
    try {
      const review: PerformanceReview = {
        id: Date.now().toString(),
        employee_id: newReview.employee_id,
        employee_name: 'Employee Name', // Get from employee lookup
        reviewer_name: 'Current User',
        review_period: newReview.review_period,
        overall_rating: Object.values(newReview.ratings).reduce((a, b) => a + b, 0) / 5,
        ratings: newReview.ratings,
        strengths: newReview.strengths,
        areas_for_improvement: newReview.areas_for_improvement,
        goals_for_next_period: newReview.goals_for_next_period,
        status: 'draft',
        created_date: new Date().toISOString().split('T')[0]
      };
      
      setReviews(prev => [review, ...prev]);
      setShowReviewDialog(false);
      toast.success('Performance review created successfully');
    } catch (error) {
      toast.error('Failed to create review');
    }
  };

  const radarData = selectedReview ? [
    { subject: 'Technical Skills', A: selectedReview.ratings.technical_skills },
    { subject: 'Communication', A: selectedReview.ratings.communication },
    { subject: 'Teamwork', A: selectedReview.ratings.teamwork },
    { subject: 'Leadership', A: selectedReview.ratings.leadership },
    { subject: 'Problem Solving', A: selectedReview.ratings.problem_solving }
  ] : [];

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Performance Management</h1>
          <p className="text-gray-600">Track goals, conduct reviews, and drive performance</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showNewGoalDialog} onOpenChange={setShowNewGoalDialog}>
            <DialogTrigger asChild>
              <Button>
                <Target className="h-4 w-4 mr-2" />
                New Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Goal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Employee ID</Label>
                  <Input
                    value={newGoal.employee_id}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, employee_id: e.target.value }))}
                    placeholder="Enter employee ID"
                  />
                </div>
                <div>
                  <Label>Goal Title</Label>
                  <Input
                    value={newGoal.title}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter goal title"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={newGoal.description}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the goal..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Category</Label>
                  <Select value={newGoal.category} onValueChange={(value) => setNewGoal(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {goalCategories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category.replace('_', ' ').toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Target Value</Label>
                    <Input
                      type="number"
                      value={newGoal.target_value}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, target_value: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                  <div>
                    <Label>Unit</Label>
                    <Input
                      value={newGoal.unit}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, unit: e.target.value }))}
                      placeholder="e.g., %, items, hours"
                    />
                  </div>
                </div>
                <div>
                  <Label>Due Date</Label>
                  <Input
                    type="date"
                    value={newGoal.due_date}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, due_date: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Priority</Label>
                  <Select value={newGoal.priority} onValueChange={(value: 'low' | 'medium' | 'high') => setNewGoal(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowNewGoalDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateGoal}>
                    Create Goal
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Award className="h-4 w-4 mr-2" />
                New Review
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Performance Review</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Employee ID</Label>
                    <Input
                      value={newReview.employee_id}
                      onChange={(e) => setNewReview(prev => ({ ...prev, employee_id: e.target.value }))}
                      placeholder="Enter employee ID"
                    />
                  </div>
                  <div>
                    <Label>Review Period</Label>
                    <Input
                      value={newReview.review_period}
                      onChange={(e) => setNewReview(prev => ({ ...prev, review_period: e.target.value }))}
                      placeholder="e.g., Q4 2024"
                    />
                  </div>
                </div>

                <div>
                  <Label>Ratings (1-5 scale)</Label>
                  <div className="space-y-3 mt-2">
                    {Object.entries(newReview.ratings).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{key.replace('_', ' ')}</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(rating => (
                            <button
                              key={rating}
                              onClick={() => setNewReview(prev => ({
                                ...prev,
                                ratings: { ...prev.ratings, [key]: rating }
                              }))}
                              className={`w-8 h-8 rounded-full ${
                                rating <= value ? 'bg-blue-500 text-white' : 'bg-gray-200'
                              }`}
                            >
                              {rating}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Strengths</Label>
                  <Textarea
                    value={newReview.strengths}
                    onChange={(e) => setNewReview(prev => ({ ...prev, strengths: e.target.value }))}
                    placeholder="Highlight key strengths..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Areas for Improvement</Label>
                  <Textarea
                    value={newReview.areas_for_improvement}
                    onChange={(e) => setNewReview(prev => ({ ...prev, areas_for_improvement: e.target.value }))}
                    placeholder="Areas that need development..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Goals for Next Period</Label>
                  <Textarea
                    value={newReview.goals_for_next_period}
                    onChange={(e) => setNewReview(prev => ({ ...prev, goals_for_next_period: e.target.value }))}
                    placeholder="Set goals for the upcoming period..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowReviewDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateReview}>
                    Create Review
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="goals">Goals & Objectives</TabsTrigger>
          <TabsTrigger value="reviews">Performance Reviews</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="goals" className="space-y-6">
          {/* Goals Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Target className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Goals</p>
                    <p className="text-2xl font-bold">{goals.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-2xl font-bold">{goals.filter(g => g.status === 'completed').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-8 w-8 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active</p>
                    <p className="text-2xl font-bold">{goals.filter(g => g.status === 'active').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Overdue</p>
                    <p className="text-2xl font-bold">{goals.filter(g => g.status === 'overdue').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Goals Table */}
          <Card>
            <CardHeader>
              <CardTitle>Goals & Objectives</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Goal</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {goals.map((goal) => {
                    const StatusIcon = getStatusIcon(goal.status);
                    const progress = calculateProgress(goal.current_value, goal.target_value);
                    
                    return (
                      <TableRow key={goal.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{goal.title}</p>
                            <p className="text-sm text-gray-500">{goal.category.replace('_', ' ')}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{goal.employee_name}</p>
                            <p className="text-sm text-gray-500">{goal.employee_id}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{goal.current_value} / {goal.target_value} {goal.unit}</span>
                              <span>{progress.toFixed(0)}%</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(goal.priority)}>
                            {goal.priority.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(goal.due_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(goal.status)}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {goal.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-6">
          {/* Reviews Table */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Reviewer</TableHead>
                    <TableHead>Overall Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{review.employee_name}</p>
                          <p className="text-sm text-gray-500">{review.employee_id}</p>
                        </div>
                      </TableCell>
                      <TableCell>{review.review_period}</TableCell>
                      <TableCell>{review.reviewer_name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(review.overall_rating)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium">{review.overall_rating.toFixed(1)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(review.status)}>
                          {review.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" onClick={() => setSelectedReview(review)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                              <DialogHeader>
                                <DialogTitle>Performance Review Details</DialogTitle>
                              </DialogHeader>
                              {selectedReview && (
                                <div className="space-y-6">
                                  <div className="grid grid-cols-2 gap-6">
                                    <div>
                                      <h3 className="font-semibold mb-4">Review Information</h3>
                                      <div className="space-y-2">
                                        <p><strong>Employee:</strong> {selectedReview.employee_name}</p>
                                        <p><strong>Period:</strong> {selectedReview.review_period}</p>
                                        <p><strong>Reviewer:</strong> {selectedReview.reviewer_name}</p>
                                        <p><strong>Overall Rating:</strong> {selectedReview.overall_rating.toFixed(1)}/5</p>
                                      </div>
                                    </div>
                                    <div>
                                      <h3 className="font-semibold mb-4">Skills Assessment</h3>
                                      <ResponsiveContainer width="100%" height={200}>
                                        <RadarChart data={radarData}>
                                          <PolarGrid />
                                          <PolarAngleAxis dataKey="subject" />
                                          <PolarRadiusAxis domain={[0, 5]} />
                                          <Radar
                                            name="Rating"
                                            dataKey="A"
                                            stroke="#3B82F6"
                                            fill="#3B82F6"
                                            fillOpacity={0.6}
                                          />
                                        </RadarChart>
                                      </ResponsiveContainer>
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 gap-4">
                                    <div>
                                      <h4 className="font-semibold">Strengths</h4>
                                      <p className="text-sm text-gray-600 mt-1 p-3 bg-gray-50 rounded">
                                        {selectedReview.strengths}
                                      </p>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold">Areas for Improvement</h4>
                                      <p className="text-sm text-gray-600 mt-1 p-3 bg-gray-50 rounded">
                                        {selectedReview.areas_for_improvement}
                                      </p>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold">Goals for Next Period</h4>
                                      <p className="text-sm text-gray-600 mt-1 p-3 bg-gray-50 rounded">
                                        {selectedReview.goals_for_next_period}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Goal Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { category: 'Performance', completed: 2, total: 5 },
                    { category: 'Skill Development', completed: 3, total: 4 },
                    { category: 'Leadership', completed: 1, total: 2 },
                    { category: 'Innovation', completed: 0, total: 1 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="completed" fill="#10B981" name="Completed" />
                    <Bar dataKey="total" fill="#E5E7EB" name="Total" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Ratings Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { rating: '5 Stars', count: 1 },
                    { rating: '4 Stars', count: 3 },
                    { rating: '3 Stars', count: 2 },
                    { rating: '2 Stars', count: 0 },
                    { rating: '1 Star', count: 0 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="rating" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#F59E0B" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceManagement;
