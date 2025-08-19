
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { TestTube, Plus, Edit, Trash2, Search, Eye, BarChart3, Link, Download } from 'lucide-react';

const HRTests = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreatingTest, setIsCreatingTest] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);

  // Mock data for HR tests
  const [tests] = useState([
    { 
      id: 1, 
      name: 'Frontend Development Assessment', 
      role: 'Frontend Developer',
      questions: 15,
      duration: 60,
      attempts: 23,
      avgScore: 78,
      status: 'Active',
      dateCreated: '2024-01-10'
    },
    { 
      id: 2, 
      name: 'UX Design Portfolio Review', 
      role: 'UX Designer',
      questions: 8,
      duration: 45,
      attempts: 12,
      avgScore: 85,
      status: 'Active',
      dateCreated: '2024-01-15'
    },
    { 
      id: 3, 
      name: 'Product Management Skills', 
      role: 'Product Manager',
      questions: 20,
      duration: 90,
      attempts: 8,
      avgScore: 72,
      status: 'Draft',
      dateCreated: '2024-01-20'
    },
  ]);

  // Mock test results data
  const [testResults] = useState([
    { id: 1, candidateName: 'John Smith', testName: 'Frontend Development Assessment', score: 85, timeTaken: 45, date: '2024-01-25', status: 'Passed' },
    { id: 2, candidateName: 'Sarah Johnson', testName: 'UX Design Portfolio Review', score: 92, timeTaken: 40, date: '2024-01-24', status: 'Passed' },
    { id: 3, candidateName: 'Mike Chen', testName: 'Frontend Development Assessment', score: 65, timeTaken: 58, date: '2024-01-23', status: 'Failed' },
  ]);

  const filteredTests = tests.filter(test => 
    test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateTest = () => {
    setIsCreatingTest(false);
    toast({
      title: "Test Created",
      description: "Your assessment test has been successfully created.",
    });
  };

  const CreateTestForm = () => (
    <Dialog open={isCreatingTest} onOpenChange={setIsCreatingTest}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Create Assessment Test</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="details" className="space-y-4">
          <TabsList>
            <TabsTrigger value="details">Test Details</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="testName">Test Name</Label>
                <Input id="testName" placeholder="e.g. Frontend Development Assessment" />
              </div>
              <div>
                <Label htmlFor="role">Target Role</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="frontend">Frontend Developer</SelectItem>
                    <SelectItem value="backend">Backend Developer</SelectItem>
                    <SelectItem value="designer">UX Designer</SelectItem>
                    <SelectItem value="pm">Product Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input id="duration" type="number" placeholder="60" />
              </div>
              <div>
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <Select>
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
            <div>
              <Label htmlFor="description">Test Description</Label>
              <Textarea id="description" placeholder="Describe what this test evaluates..." rows={3} />
            </div>
          </TabsContent>

          <TabsContent value="questions" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Test Questions</h3>
              <div className="space-x-2">
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add MCQ
                </Button>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Coding
                </Button>
              </div>
            </div>
            <div className="border rounded-lg p-4 bg-gray-50">
              <p className="text-gray-600 text-center">Add questions to your test using the buttons above</p>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Randomize Questions</h4>
                  <p className="text-sm text-gray-600">Shuffle question order for each candidate</p>
                </div>
                <Button variant="outline" size="sm">Enable</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Time Limit</h4>
                  <p className="text-sm text-gray-600">Enforce strict time limits</p>
                </div>
                <Button variant="outline" size="sm">Enable</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex gap-2 justify-end pt-4">
          <Button variant="outline" onClick={() => setIsCreatingTest(false)}>
            Save Draft
          </Button>
          <Button onClick={handleCreateTest}>
            Create Test
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assessment Tests</h1>
          <p className="text-gray-600">Create and manage tests for candidate evaluation</p>
        </div>
        <Button onClick={() => setIsCreatingTest(true)}>
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
                <p className="text-sm text-gray-600">Total Attempts</p>
                <p className="text-2xl font-bold">{tests.reduce((sum, test) => sum + test.attempts, 0)}</p>
              </div>
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
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
              <div className="h-3 w-3 rounded-full bg-purple-500"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Tests</p>
                <p className="text-2xl font-bold">{tests.filter(t => t.status === 'Active').length}</p>
              </div>
              <div className="h-3 w-3 rounded-full bg-orange-500"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tests" className="space-y-6">
        <TabsList>
          <TabsTrigger value="tests">My Tests</TabsTrigger>
          <TabsTrigger value="results">Test Results</TabsTrigger>
        </TabsList>

        <TabsContent value="tests">
          <Card>
            <CardHeader>
              <CardTitle>Your Assessment Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search tests by name or role..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Questions</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Attempts</TableHead>
                    <TableHead>Avg Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTests.map((test) => (
                    <TableRow key={test.id}>
                      <TableCell className="font-medium">{test.name}</TableCell>
                      <TableCell>{test.role}</TableCell>
                      <TableCell>{test.questions}</TableCell>
                      <TableCell>{test.duration}m</TableCell>
                      <TableCell>{test.attempts}</TableCell>
                      <TableCell>{test.avgScore}%</TableCell>
                      <TableCell>
                        <Badge variant={test.status === 'Active' ? 'default' : 'secondary'}>
                          {test.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Link className="h-4 w-4" />
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
        </TabsContent>

        <TabsContent value="results">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Test Results</CardTitle>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Results
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Test</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Time Taken</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testResults.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell className="font-medium">{result.candidateName}</TableCell>
                      <TableCell>{result.testName}</TableCell>
                      <TableCell>
                        <Badge variant={result.score >= 70 ? 'default' : 'destructive'}>
                          {result.score}%
                        </Badge>
                      </TableCell>
                      <TableCell>{result.timeTaken}m</TableCell>
                      <TableCell>{result.date}</TableCell>
                      <TableCell>
                        <Badge variant={result.status === 'Passed' ? 'default' : 'destructive'}>
                          {result.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
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
      </Tabs>

      <CreateTestForm />
    </div>
  );
};

export default HRTests;
