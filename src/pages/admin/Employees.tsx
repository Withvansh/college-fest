import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Users, Filter, Download, Eye, Archive } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { hrmsApi } from '@/lib/api/hrms';

const Employees = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [employees, setEmployees] = useState<
    Array<{
      id: string;
      employee_id: string;
      name: string;
      email: string;
      department: string;
      position: string;
      designation?: string;
      status: string;
      employment_status?: string;
      joinDate: string;
      joining_date?: string;
      work_location?: string;
      salary?: number;
      profiles?: {
        full_name?: string;
        email?: string;
      };
    }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const loadEmployees = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await hrmsApi.getEmployees(user._id);
      setEmployees(data || []);
    } catch (error) {
      console.error('Error loading employees:', error);
      toast({
        title: 'Error',
        description: 'Failed to load employees data.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const handleExportData = () => {
    // Create CSV data
    const csvData = employees.map(emp => ({
      'Employee ID': emp.employee_id,
      Name: emp.profiles?.full_name || 'N/A',
      Email: emp.profiles?.email || 'N/A',
      Department: emp.department || 'N/A',
      Designation: emp.designation || 'N/A',
      Status: emp.employment_status || 'N/A',
      'Joining Date': emp.joining_date || 'N/A',
      Location: emp.work_location || 'N/A',
    }));

    // Convert to CSV string
    const headers = Object.keys(csvData[0] || {});
    const csvContent = [
      headers.join(','),
      ...csvData.map(row =>
        headers.map(header => `"${row[header as keyof typeof row]}"`).join(',')
      ),
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `employees_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: 'Export Started',
      description: 'Employee data has been exported to CSV.',
    });
  };

  const handleArchiveEmployee = (id: string) => {
    toast({
      title: 'Employee Archived',
      description: 'Employee has been moved to archived status.',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'probation':
        return 'secondary';
      case 'inactive':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const deptMatch = filterDepartment === 'all' || emp.department === filterDepartment;
    const statusMatch = filterStatus === 'all' || emp.employment_status === filterStatus;
    const searchMatch =
      searchTerm === '' ||
      emp.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employee_id?.toLowerCase().includes(searchTerm.toLowerCase());
    return deptMatch && statusMatch && searchMatch;
  });

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Employees</h1>
          <p className="text-gray-600">View and manage your employee information</p>
        </div>
        <Button onClick={handleExportData} disabled={employees.length === 0}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold">{employees.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold">
                  {employees.filter(e => e.employment_status === 'active').length}
                </p>
              </div>
              <div className="h-3 w-3 bg-green-500 rounded-full"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">On Probation</p>
                <p className="text-2xl font-bold">
                  {employees.filter(e => e.employment_status === 'probation').length}
                </p>
              </div>
              <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inactive</p>
                <p className="text-2xl font-bold">
                  {employees.filter(e => e.employment_status === 'inactive').length}
                </p>
              </div>
              <div className="h-3 w-3 bg-red-500 rounded-full"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Human Resources">Human Resources</SelectItem>
                <SelectItem value="Sales">Sales</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Operations">Operations</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="probation">Probation</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Search by name..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />

            <Button
              variant="outline"
              onClick={() => {
                setFilterDepartment('all');
                setFilterStatus('all');
                setSearchTerm('');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Employees Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Directory</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredEmployees.length === 0 ? (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {employees.length === 0 ? 'No employees yet' : 'No employees match your filters'}
              </h3>
              <p className="text-gray-500 mb-4">
                {employees.length === 0
                  ? 'Start by onboarding your first employee to see them here.'
                  : 'Try adjusting your search criteria or filters.'}
              </p>
              {employees.length === 0 && (
                <Button asChild>
                  <a href="/recruiter/hrms/onboard">Onboard Employee</a>
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Designation</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joining Date</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map(employee => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{employee.profiles?.full_name || 'N/A'}</p>
                          <p className="text-sm text-gray-500">
                            {employee.profiles?.email || 'N/A'}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">{employee.employee_id}</TableCell>
                      <TableCell>{employee.department || 'N/A'}</TableCell>
                      <TableCell>{employee.designation || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(employee.employment_status)}>
                          {employee.employment_status || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell>{employee.joining_date || 'N/A'}</TableCell>
                      <TableCell>{employee.work_location || 'N/A'}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleArchiveEmployee(employee.id)}
                          >
                            <Archive className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Employees;
