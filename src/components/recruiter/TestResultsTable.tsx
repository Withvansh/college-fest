
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar, Search, Filter } from "lucide-react";

interface TestResult {
  id: string;
  candidateName: string;
  testName: string;
  score: number;
  status: 'Passed' | 'Failed';
  attemptDate: string;
  email: string;
  jobApplied: string;
}

const TestResultsTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTest, setFilterTest] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  
  const [testResults] = useState<TestResult[]>([
    {
      id: '1',
      candidateName: 'John Smith',
      testName: 'Frontend Development Assessment',
      score: 85,
      status: 'Passed',
      attemptDate: '2024-01-16',
      email: 'john.smith@email.com',
      jobApplied: 'Senior Frontend Developer'
    },
    {
      id: '2',
      candidateName: 'Sarah Johnson',
      testName: 'Product Management Case Study',
      score: 92,
      status: 'Passed',
      attemptDate: '2024-01-15',
      email: 'sarah.johnson@email.com',
      jobApplied: 'Product Manager'
    },
    {
      id: '3',
      candidateName: 'Mike Chen',
      testName: 'Backend Engineering Challenge',
      score: 68,
      status: 'Failed',
      attemptDate: '2024-01-14',
      email: 'mike.chen@email.com',
      jobApplied: 'Backend Engineer'
    },
    {
      id: '4',
      candidateName: 'Emily Davis',
      testName: 'UX Design Portfolio Review',
      score: 78,
      status: 'Passed',
      attemptDate: '2024-01-13',
      email: 'emily.davis@email.com',
      jobApplied: 'UX Designer'
    },
    {
      id: '5',
      candidateName: 'Alex Rodriguez',
      testName: 'Frontend Development Assessment',
      score: 56,
      status: 'Failed',
      attemptDate: '2024-01-12',
      email: 'alex.rodriguez@email.com',
      jobApplied: 'Senior Frontend Developer'
    }
  ]);

  const filteredResults = testResults.filter(result => {
    const matchesSearch = result.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.testName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTest = filterTest === 'all' || result.testName === filterTest;
    const matchesDate = dateRange === 'all' || 
                       (dateRange === 'week' && new Date(result.attemptDate) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
                       (dateRange === 'month' && new Date(result.attemptDate) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    
    return matchesSearch && matchesTest && matchesDate;
  });

  const getStatusColor = (status: string) => {
    return status === 'Passed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 font-semibold';
    if (score >= 70) return 'text-yellow-600 font-semibold';
    return 'text-red-600 font-semibold';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Test Results Snapshot</CardTitle>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search candidates or tests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={filterTest} onValueChange={setFilterTest}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by test" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tests</SelectItem>
              <SelectItem value="Frontend Development Assessment">Frontend Assessment</SelectItem>
              <SelectItem value="Product Management Case Study">Product Management</SelectItem>
              <SelectItem value="Backend Engineering Challenge">Backend Challenge</SelectItem>
              <SelectItem value="UX Design Portfolio Review">UX Design</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-full sm:w-48">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Test</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Attempt Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResults.map((result) => (
                <TableRow key={result.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{result.candidateName}</div>
                      <div className="text-sm text-gray-500">{result.email}</div>
                      <div className="text-xs text-gray-400">Applied for: {result.jobApplied}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{result.testName}</div>
                  </TableCell>
                  <TableCell>
                    <div className={`text-lg ${getScoreColor(result.score)}`}>
                      {result.score}%
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(result.status)}>
                      {result.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(result.attemptDate).toLocaleDateString()}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {filteredResults.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No test results found matching your filters.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TestResultsTable;
