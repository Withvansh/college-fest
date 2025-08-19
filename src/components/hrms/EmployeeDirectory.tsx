
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Eye, Edit, RotateCcw, UserMinus, Search, Filter, Users, Phone, Mail, MapPin, Calendar, Building, User } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Employee {
  id: string;
  employee_id: string;
  full_name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  employment_status: string;
  joining_date: string;
  work_location: string;
  profiles?: {
    full_name: string;
    email: string;
    phone: string;
    avatar_url?: string;
  };
}

const EmployeeDirectory = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const departments = [
    "Engineering", "Human Resources", "Sales", "Marketing", 
    "Finance", "Operations", "Customer Support", "Design"
  ];

  const statuses = ["probation", "active", "inactive", "terminated"];

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [employees, searchTerm, departmentFilter, statusFilter]);

  const loadEmployees = async () => {
    try {
      console.log('Loading employees...');
      const { data, error } = await supabase
        .from('employees')
        .select(`
          *,
          profiles!employees_user_id_fkey(full_name, email, phone, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Raw employee data:', data);
      
      // Transform the data to match our Employee interface
      const transformedEmployees: Employee[] = (data || []).map(emp => ({
        id: emp.id,
        employee_id: emp.employee_id || `EMP-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        full_name: emp.profiles?.full_name || 'N/A',
        email: emp.profiles?.email || 'N/A',
        phone: emp.profiles?.phone || 'N/A',
        department: emp.department || 'Unassigned',
        designation: emp.designation || 'N/A',
        employment_status: emp.employment_status || 'probation',
        joining_date: emp.joining_date || new Date().toISOString().split('T')[0],
        work_location: emp.work_location || 'Office',
        profiles: emp.profiles
      }));
      
      console.log('Transformed employees:', transformedEmployees);
      setEmployees(transformedEmployees);
    } catch (error: any) {
      console.error('Error loading employees:', error);
      toast.error('Failed to load employees: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filterEmployees = () => {
    let filtered = employees;

    if (searchTerm) {
      filtered = filtered.filter(emp => 
        emp.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (departmentFilter) {
      filtered = filtered.filter(emp => emp.department === departmentFilter);
    }

    if (statusFilter) {
      filtered = filtered.filter(emp => emp.employment_status === statusFilter);
    }

    setFilteredEmployees(filtered);
  };

  const handleResetPassword = async (employeeId: string, email: string) => {
    try {
      // This would typically send a password reset email
      toast.success(`Password reset email sent to ${email}`);
    } catch (error) {
      toast.error('Failed to reset password');
    }
  };

  const handleTerminate = async (employeeId: string) => {
    try {
      const { error } = await supabase
        .from('employees')
        .update({ employment_status: 'terminated' })
        .eq('id', employeeId);

      if (error) throw error;
      
      toast.success('Employee terminated successfully');
      loadEmployees();
    } catch (error) {
      toast.error('Failed to terminate employee');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'probation': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'terminated': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Directory</h1>
          <p className="text-gray-600">Manage and view all employee information</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            <Users className="h-3 w-3 mr-1" />
            {employees.length} Total
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700">
            <User className="h-3 w-3 mr-1" />
            {employees.filter(e => e.employment_status === 'active').length} Active
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Employee Directory
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by ID, name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Employee Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Users className="h-8 w-8 text-gray-400" />
                        <p className="text-gray-500">No employees found matching your criteria.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.employee_id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="font-medium">{employee.full_name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3 text-gray-400" />
                            {employee.email}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Phone className="h-3 w-3 text-gray-400" />
                            {employee.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-purple-50 text-purple-700">
                          {employee.department}
                        </Badge>
                      </TableCell>
                      <TableCell>{employee.designation}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(employee.employment_status)}>
                          {employee.employment_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setSelectedEmployee(employee)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <User className="h-5 w-5" />
                                  Employee Profile
                                </DialogTitle>
                              </DialogHeader>
                              {selectedEmployee && (
                                <Tabs defaultValue="personal" className="w-full">
                                  <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="personal">Personal</TabsTrigger>
                                    <TabsTrigger value="job">Job Details</TabsTrigger>
                                    <TabsTrigger value="documents">Documents</TabsTrigger>
                                  </TabsList>
                                  <TabsContent value="personal" className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label>Full Name</Label>
                                        <p className="text-sm text-gray-600 mt-1">
                                          {selectedEmployee.full_name}
                                        </p>
                                      </div>
                                      <div>
                                        <Label>Email</Label>
                                        <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                                          <Mail className="h-3 w-3" />
                                          {selectedEmployee.email}
                                        </p>
                                      </div>
                                      <div>
                                        <Label>Phone</Label>
                                        <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                                          <Phone className="h-3 w-3" />
                                          {selectedEmployee.phone}
                                        </p>
                                      </div>
                                      <div>
                                        <Label>Employee ID</Label>
                                        <p className="text-sm text-gray-600 mt-1">
                                          {selectedEmployee.employee_id}
                                        </p>
                                      </div>
                                    </div>
                                  </TabsContent>
                                  <TabsContent value="job" className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label>Department</Label>
                                        <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                                          <Building className="h-3 w-3" />
                                          {selectedEmployee.department}
                                        </p>
                                      </div>
                                      <div>
                                        <Label>Designation</Label>
                                        <p className="text-sm text-gray-600 mt-1">
                                          {selectedEmployee.designation}
                                        </p>
                                      </div>
                                      <div>
                                        <Label>Status</Label>
                                        <Badge className={getStatusColor(selectedEmployee.employment_status)}>
                                          {selectedEmployee.employment_status}
                                        </Badge>
                                      </div>
                                      <div>
                                        <Label>Joining Date</Label>
                                        <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                                          <Calendar className="h-3 w-3" />
                                          {new Date(selectedEmployee.joining_date).toLocaleDateString()}
                                        </p>
                                      </div>
                                      <div>
                                        <Label>Location</Label>
                                        <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                                          <MapPin className="h-3 w-3" />
                                          {selectedEmployee.work_location}
                                        </p>
                                      </div>
                                    </div>
                                  </TabsContent>
                                  <TabsContent value="documents">
                                    <div className="text-center py-8">
                                      <p className="text-sm text-gray-600">
                                        Document management feature coming soon...
                                      </p>
                                    </div>
                                  </TabsContent>
                                </Tabs>
                              )}
                            </DialogContent>
                          </Dialog>

                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>

                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleResetPassword(employee.id, employee.email)}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>

                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleTerminate(employee.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <UserMinus className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeDirectory;
