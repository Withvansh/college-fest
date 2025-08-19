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
  Folder, 
  Users, 
  Calendar,
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle,
  Target,
  TrendingUp,
  Eye,
  Edit,
  User,
  DollarSign
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
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  start_date: string;
  end_date: string;
  budget: number;
  spent: number;
  progress: number;
  team_lead: string;
  team_members: string[];
  client: string;
  department: string;
  created_date: string;
  tasks_completed: number;
  tasks_total: number;
}

interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string;
  assignee: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date: string;
  estimated_hours: number;
  logged_hours: number;
  created_date: string;
}

const ProjectManagement = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState("projects");
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [showNewTaskDialog, setShowNewTaskDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newProject, setNewProject] = useState<{
    name: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    start_date: string;
    end_date: string;
    budget: number;
    team_lead: string;
    client: string;
    department: string;
  }>({
    name: '',
    description: '',
    priority: 'medium',
    start_date: '',
    end_date: '',
    budget: 0,
    team_lead: '',
    client: '',
    department: ''
  });
  const [newTask, setNewTask] = useState<{
    project_id: string;
    title: string;
    description: string;
    assignee: string;
    priority: 'low' | 'medium' | 'high';
    due_date: string;
    estimated_hours: number;
  }>({
    project_id: '',
    title: '',
    description: '',
    assignee: '',
    priority: 'medium',
    due_date: '',
    estimated_hours: 0
  });

  // Sample data
  useEffect(() => {
    const sampleProjects: Project[] = [
      {
        id: '1',
        name: 'HRMS Development',
        description: 'Complete HR Management System with all modules',
        status: 'active',
        priority: 'high',
        start_date: '2024-10-01',
        end_date: '2024-12-31',
        budget: 500000,
        spent: 320000,
        progress: 75,
        team_lead: 'John Doe',
        team_members: ['Jane Smith', 'Mike Johnson', 'Alice Brown'],
        client: 'Internal',
        department: 'Engineering',
        created_date: '2024-09-15',
        tasks_completed: 15,
        tasks_total: 20
      },
      {
        id: '2',
        name: 'Mobile App Development',
        description: 'Cross-platform mobile application for client',
        status: 'active',
        priority: 'medium',
        start_date: '2024-11-01',
        end_date: '2025-02-28',
        budget: 300000,
        spent: 85000,
        progress: 30,
        team_lead: 'Sarah Wilson',
        team_members: ['Tom Davis', 'Lisa Chen'],
        client: 'ABC Corp',
        department: 'Engineering',
        created_date: '2024-10-20',
        tasks_completed: 6,
        tasks_total: 18
      },
      {
        id: '3',
        name: 'Website Redesign',
        description: 'Complete redesign of company website',
        status: 'completed',
        priority: 'low',
        start_date: '2024-08-01',
        end_date: '2024-10-15',
        budget: 150000,
        spent: 145000,
        progress: 100,
        team_lead: 'David Kim',
        team_members: ['Emma White', 'Jack Taylor'],
        client: 'Marketing Dept',
        department: 'Design',
        created_date: '2024-07-20',
        tasks_completed: 12,
        tasks_total: 12
      }
    ];

    const sampleTasks: Task[] = [
      {
        id: '1',
        project_id: '1',
        title: 'Design database schema',
        description: 'Create comprehensive database design for HRMS',
        assignee: 'Jane Smith',
        status: 'completed',
        priority: 'high',
        due_date: '2024-10-15',
        estimated_hours: 20,
        logged_hours: 18,
        created_date: '2024-10-01'
      },
      {
        id: '2',
        project_id: '1',
        title: 'Implement employee management',
        description: 'Build employee CRUD operations and UI',
        assignee: 'Mike Johnson',
        status: 'in_progress',
        priority: 'high',
        due_date: '2024-12-01',
        estimated_hours: 40,
        logged_hours: 25,
        created_date: '2024-10-10'
      },
      {
        id: '3',
        project_id: '2',
        title: 'Setup React Native project',
        description: 'Initialize mobile app project structure',
        assignee: 'Tom Davis',
        status: 'completed',
        priority: 'medium',
        due_date: '2024-11-10',
        estimated_hours: 8,
        logged_hours: 8,
        created_date: '2024-11-01'
      }
    ];

    setProjects(sampleProjects);
    setTasks(sampleTasks);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'on_hold': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'planning': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'review': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'todo': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'active': case 'in_progress': return Clock;
      case 'on_hold': case 'review': return AlertTriangle;
      case 'planning': case 'todo': return Target;
      default: return Clock;
    }
  };

  const handleCreateProject = async () => {
    try {
      const project: Project = {
        id: Date.now().toString(),
        name: newProject.name,
        description: newProject.description,
        status: 'planning',
        priority: newProject.priority,
        start_date: newProject.start_date,
        end_date: newProject.end_date,
        budget: newProject.budget,
        spent: 0,
        progress: 0,
        team_lead: newProject.team_lead,
        team_members: [],
        client: newProject.client,
        department: newProject.department,
        created_date: new Date().toISOString().split('T')[0],
        tasks_completed: 0,
        tasks_total: 0
      };
      
      setProjects(prev => [project, ...prev]);
      setShowNewProjectDialog(false);
      setNewProject({
        name: '',
        description: '',
        priority: 'medium',
        start_date: '',
        end_date: '',
        budget: 0,
        team_lead: '',
        client: '',
        department: ''
      });
      toast.success('Project created successfully');
    } catch (error) {
      toast.error('Failed to create project');
    }
  };

  const handleCreateTask = async () => {
    try {
      const task: Task = {
        id: Date.now().toString(),
        project_id: newTask.project_id,
        title: newTask.title,
        description: newTask.description,
        assignee: newTask.assignee,
        status: 'todo',
        priority: newTask.priority,
        due_date: newTask.due_date,
        estimated_hours: newTask.estimated_hours,
        logged_hours: 0,
        created_date: new Date().toISOString().split('T')[0]
      };
      
      setTasks(prev => [task, ...prev]);
      setShowNewTaskDialog(false);
      setNewTask({
        project_id: '',
        title: '',
        description: '',
        assignee: '',
        priority: 'medium',
        due_date: '',
        estimated_hours: 0
      });
      toast.success('Task created successfully');
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  // Analytics data
  const projectStatusData = [
    { name: 'Active', value: projects.filter(p => p.status === 'active').length, color: '#3B82F6' },
    { name: 'Completed', value: projects.filter(p => p.status === 'completed').length, color: '#10B981' },
    { name: 'Planning', value: projects.filter(p => p.status === 'planning').length, color: '#8B5CF6' },
    { name: 'On Hold', value: projects.filter(p => p.status === 'on_hold').length, color: '#F59E0B' }
  ];

  const budgetData = projects.map(project => ({
    name: project.name.substring(0, 10) + '...',
    budget: project.budget,
    spent: project.spent,
    remaining: project.budget - project.spent
  }));

  const teamProductivityData = [
    { member: 'John Doe', tasks: 8, hours: 40 },
    { member: 'Jane Smith', tasks: 12, hours: 38 },
    { member: 'Mike Johnson', tasks: 6, hours: 35 },
    { member: 'Sarah Wilson', tasks: 9, hours: 42 },
    { member: 'Tom Davis', tasks: 4, hours: 30 }
  ];

  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'active').length,
    completedProjects: projects.filter(p => p.status === 'completed').length,
    totalBudget: projects.reduce((sum, p) => sum + p.budget, 0),
    totalSpent: projects.reduce((sum, p) => sum + p.spent, 0),
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === 'completed').length,
    overdueTasks: tasks.filter(t => new Date(t.due_date) < new Date() && t.status !== 'completed').length
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Project Management</h1>
          <p className="text-gray-600">Manage projects, tasks, and team productivity</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showNewProjectDialog} onOpenChange={setShowNewProjectDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Project Name</Label>
                  <Input
                    value={newProject.name}
                    onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter project name"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Project description..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Priority</Label>
                    <Select value={newProject.priority} onValueChange={(value: 'low' | 'medium' | 'high') => setNewProject(prev => ({ ...prev, priority: value }))}>
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
                  <div>
                    <Label>Department</Label>
                    <Input
                      value={newProject.department}
                      onChange={(e) => setNewProject(prev => ({ ...prev, department: e.target.value }))}
                      placeholder="Department"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={newProject.start_date}
                      onChange={(e) => setNewProject(prev => ({ ...prev, start_date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      value={newProject.end_date}
                      onChange={(e) => setNewProject(prev => ({ ...prev, end_date: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Budget (₹)</Label>
                    <Input
                      type="number"
                      value={newProject.budget}
                      onChange={(e) => setNewProject(prev => ({ ...prev, budget: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                  <div>
                    <Label>Team Lead</Label>
                    <Input
                      value={newProject.team_lead}
                      onChange={(e) => setNewProject(prev => ({ ...prev, team_lead: e.target.value }))}
                      placeholder="Team lead name"
                    />
                  </div>
                </div>
                <div>
                  <Label>Client</Label>
                  <Input
                    value={newProject.client}
                    onChange={(e) => setNewProject(prev => ({ ...prev, client: e.target.value }))}
                    placeholder="Client name"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowNewProjectDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateProject}>
                    Create Project
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showNewTaskDialog} onOpenChange={setShowNewTaskDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Project</Label>
                  <Select value={newTask.project_id} onValueChange={(value) => setNewTask(prev => ({ ...prev, project_id: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map(project => (
                        <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Task Title</Label>
                  <Input
                    value={newTask.title}
                    onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter task title"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Task description..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Assignee</Label>
                    <Input
                      value={newTask.assignee}
                      onChange={(e) => setNewTask(prev => ({ ...prev, assignee: e.target.value }))}
                      placeholder="Assignee name"
                    />
                  </div>
                  <div>
                    <Label>Priority</Label>
                    <Select value={newTask.priority} onValueChange={(value: 'low' | 'medium' | 'high') => setNewTask(prev => ({ ...prev, priority: value }))}>
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
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Due Date</Label>
                    <Input
                      type="date"
                      value={newTask.due_date}
                      onChange={(e) => setNewTask(prev => ({ ...prev, due_date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Estimated Hours</Label>
                    <Input
                      type="number"
                      value={newTask.estimated_hours}
                      onChange={(e) => setNewTask(prev => ({ ...prev, estimated_hours: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowNewTaskDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateTask}>
                    Create Task
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Folder className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold">{stats.totalProjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold">{stats.activeProjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold">{stats.completedProjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Budget</p>
                <p className="text-xl font-bold">₹{(stats.totalBudget / 100000).toFixed(1)}L</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-xl font-bold">₹{(stats.totalSpent / 100000).toFixed(1)}L</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-indigo-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold">{stats.totalTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-teal-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Tasks Done</p>
                <p className="text-2xl font-bold">{stats.completedTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold">{stats.overdueTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Projects Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Team Lead</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => {
                    const StatusIcon = getStatusIcon(project.status);
                    const budgetUsed = (project.spent / project.budget) * 100;
                    
                    return (
                      <TableRow key={project.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{project.name}</p>
                            <p className="text-sm text-gray-500">{project.client}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(project.status)}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {project.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(project.priority)}>
                            {project.priority.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{project.tasks_completed}/{project.tasks_total} tasks</span>
                              <span>{project.progress}%</span>
                            </div>
                            <Progress value={project.progress} className="h-2" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">
                              <span className="font-medium">₹{(project.spent / 100000).toFixed(1)}L</span>
                              <span className="text-gray-500"> / ₹{(project.budget / 100000).toFixed(1)}L</span>
                            </div>
                            <Progress value={budgetUsed} className="h-2" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            {project.team_lead}
                          </div>
                        </TableCell>
                        <TableCell>{new Date(project.end_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline" onClick={() => setSelectedProject(project)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl">
                                <DialogHeader>
                                  <DialogTitle>Project Details</DialogTitle>
                                </DialogHeader>
                                {selectedProject && (
                                  <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                      <div>
                                        <h3 className="font-semibold mb-4">Project Information</h3>
                                        <div className="space-y-2">
                                          <p><strong>Name:</strong> {selectedProject.name}</p>
                                          <p><strong>Client:</strong> {selectedProject.client}</p>
                                          <p><strong>Department:</strong> {selectedProject.department}</p>
                                          <p><strong>Team Lead:</strong> {selectedProject.team_lead}</p>
                                          <p><strong>Budget:</strong> ₹{selectedProject.budget.toLocaleString()}</p>
                                          <p><strong>Spent:</strong> ₹{selectedProject.spent.toLocaleString()}</p>
                                        </div>
                                      </div>
                                      <div>
                                        <h3 className="font-semibold mb-4">Progress & Timeline</h3>
                                        <div className="space-y-2">
                                          <p><strong>Status:</strong> 
                                            <Badge className={`ml-2 ${getStatusColor(selectedProject.status)}`}>
                                              {selectedProject.status.replace('_', ' ').toUpperCase()}
                                            </Badge>
                                          </p>
                                          <p><strong>Progress:</strong> {selectedProject.progress}%</p>
                                          <p><strong>Start Date:</strong> {new Date(selectedProject.start_date).toLocaleDateString()}</p>
                                          <p><strong>End Date:</strong> {new Date(selectedProject.end_date).toLocaleDateString()}</p>
                                          <p><strong>Tasks:</strong> {selectedProject.tasks_completed}/{selectedProject.tasks_total}</p>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <h4 className="font-semibold">Description</h4>
                                      <p className="text-sm text-gray-600 mt-1 p-3 bg-gray-50 rounded">
                                        {selectedProject.description}
                                      </p>
                                    </div>
                                    
                                    <div>
                                      <h4 className="font-semibold">Team Members</h4>
                                      <div className="flex gap-2 mt-2">
                                        {selectedProject.team_members.map((member, index) => (
                                          <Badge key={index} variant="outline">{member}</Badge>
                                        ))}
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
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tasks Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => {
                    const StatusIcon = getStatusIcon(task.status);
                    const project = projects.find(p => p.id === task.project_id);
                    const hoursProgress = (task.logged_hours / task.estimated_hours) * 100;
                    
                    return (
                      <TableRow key={task.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{task.title}</p>
                            <p className="text-sm text-gray-500 truncate max-w-xs">{task.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>{project?.name || 'Unknown'}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            {task.assignee}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(task.status)}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {task.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">
                              <span className="font-medium">{task.logged_hours}h</span>
                              <span className="text-gray-500"> / {task.estimated_hours}h</span>
                            </div>
                            <Progress value={hoursProgress} className="h-2" />
                          </div>
                        </TableCell>
                        <TableCell>{new Date(task.due_date).toLocaleDateString()}</TableCell>
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

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Project Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Project Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={projectStatusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {projectStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Budget Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Budget vs Spending</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={budgetData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="budget" fill="#3B82F6" name="Budget" />
                    <Bar dataKey="spent" fill="#EF4444" name="Spent" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Team Productivity */}
            <Card>
              <CardHeader>
                <CardTitle>Team Productivity</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={teamProductivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="member" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="tasks" fill="#10B981" name="Tasks Completed" />
                    <Bar dataKey="hours" fill="#F59E0B" name="Hours Logged" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Project Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Project Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={[
                    { month: 'Jan', projects: 2 },
                    { month: 'Feb', projects: 3 },
                    { month: 'Mar', projects: 4 },
                    { month: 'Apr', projects: 3 },
                    { month: 'May', projects: 5 },
                    { month: 'Jun', projects: 6 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="projects" 
                      stroke="#8B5CF6" 
                      fill="#8B5CF6" 
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectManagement;
