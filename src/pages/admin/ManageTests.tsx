
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { TestTube, Plus, Edit, Trash2, Search, Filter, Eye, BarChart3 } from 'lucide-react';

const ManageTests = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isAddingTest, setIsAddingTest] = useState(false);

  // Mock data
  const [tests] = useState([
    { 
      id: 1, 
      name: 'Frontend Development Assessment', 
      type: 'Technical',
      category: 'Coding',
      questions: 15,
      duration: 60,
      difficulty: 'Intermediate',
      attempts: 156,
      avgScore: 78,
      createdBy: 'Admin',
      dateCreated: '2024-01-10'
    },
    { 
      id: 2, 
      name: 'Project Management Skills', 
      type: 'Soft Skills',
      category: 'Management',
      questions: 20,
      duration: 45,
      difficulty: 'Beginner',
      attempts: 89,
      avgScore: 82,
      createdBy: 'HR Team',
      dateCreated: '2024-01-15'
    },
    { 
      id: 3, 
      name: 'Data Science Challenge', 
      type: 'Technical',
      category: 'Analytics',
      questions: 12,
      duration: 90,
      difficulty: 'Advanced',
      attempts: 67,
      avgScore: 65,
      createdBy: 'Tech Lead',
      dateCreated: '2024-01-20'
    },
    { 
      id: 4, 
      name: 'Communication Assessment', 
      type: 'Behavioral',
      category: 'Communication',
      questions: 25,
      duration: 30,
      difficulty: 'Beginner',
      attempts: 234,
      avgScore: 85,
      createdBy: 'HR Team',
      dateCreated: '2024-01-25'
    },
  ]);

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || test.type === filterType;
    return matchesSearch && matchesType;
  });

  const getDifficultyBadgeVariant = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'secondary';
      case 'Intermediate': return 'default';
      case 'Advanced': return 'destructive';
      default: return 'secondary';
    }
  };

  const AddTestForm = () => (
    <Dialog open={isAddingTest} onOpenChange={setIsAddingTest}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Test</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <Label htmlFor="testName">Test Name</Label>
            <Input id="testName" placeholder="e.g. Frontend Development Assessment" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Test Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="soft-skills">Soft Skills</SelectItem>
                  <SelectItem value="behavioral">Behavioral</SelectItem>
                  <SelectItem value="cognitive">Cognitive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="coding">Coding</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="management">Management</SelectItem>
                  <SelectItem value="analytics">Analytics</SelectItem>
                  <SelectItem value="communication">Communication</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="questions">Questions</Label>
              <Input id="questions" type="number" placeholder="15" />
            </div>
            <div>
              <Label htmlFor="duration">Duration (min)</Label>
              <Input id="duration" type="number" placeholder="60" />
            </div>
            <div>
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="description">Test Description</Label>
            <Textarea id="description" placeholder="Describe what this test evaluates..." rows={3} />
          </div>
          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={() => setIsAddingTest(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsAddingTest(false)}>
              Create Test
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Tests</h1>
          <p className="text-gray-600">Create and manage assessment tests for candidates</p>
        </div>
        <Button onClick={() => setIsAddingTest(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Test
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tests</p>
                <p className="text-2xl font-bold">{tests.length}</p>
              </div>
              <TestTube className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Technical Tests</p>
                <p className="text-2xl font-bold">{tests.filter(t => t.type === 'Technical').length}</p>
              </div>
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Attempts</p>
                <p className="text-2xl font-bold">{tests.reduce((sum, test) => sum + test.attempts, 0)}</p>
              </div>
              <div className="h-3 w-3 rounded-full bg-purple-500"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Score</p>
                <p className="text-2xl font-bold">{Math.round(tests.reduce((sum, test) => sum + test.avgScore, 0) / tests.length)}%</p>
              </div>
              <div className="h-3 w-3 rounded-full bg-orange-500"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tests Management */}
      <Card>
        <CardHeader>
          <CardTitle>Test Library</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search tests by name or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Technical">Technical</SelectItem>
                <SelectItem value="Soft Skills">Soft Skills</SelectItem>
                <SelectItem value="Behavioral">Behavioral</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Test Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Questions</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Attempts</TableHead>
                <TableHead>Avg Score</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTests.map((test) => (
                <TableRow key={test.id}>
                  <TableCell className="font-medium">{test.name}</TableCell>
                  <TableCell>{test.type}</TableCell>
                  <TableCell>{test.category}</TableCell>
                  <TableCell>{test.questions}</TableCell>
                  <TableCell>{test.duration}m</TableCell>
                  <TableCell>
                    <Badge variant={getDifficultyBadgeVariant(test.difficulty)}>
                      {test.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell>{test.attempts}</TableCell>
                  <TableCell>{test.avgScore}%</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddTestForm />
    </div>
  );
};

export default ManageTests;
