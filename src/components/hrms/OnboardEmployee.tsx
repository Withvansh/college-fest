import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Upload, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';
// import { supabase } from "@/integrations/supabase/client";
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { hrmsApi } from '@/lib/api/hrms';

interface EmployeeFormData {
  fullName: string;
  email: string;
  phone: string;
  aadhar: string;
  pan: string;
  department: string;
  designation: string;
  manager: string;
  joiningDate: Date | undefined;
  location: string;
  salary: {
    base: number;
    hra: number;
    allowance: number;
    bonus: number;
    deductions: number;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
}

const OnboardEmployee = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<EmployeeFormData>({
    fullName: '',
    email: '',
    phone: '',
    aadhar: '',
    pan: '',
    department: '',
    designation: '',
    manager: '',
    joiningDate: undefined,
    location: '',
    salary: {
      base: 0,
      hra: 0,
      allowance: 0,
      bonus: 0,
      deductions: 0,
    },
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
    },
  });

  const departments = [
    'Engineering',
    'Human Resources',
    'Sales',
    'Marketing',
    'Finance',
    'Operations',
    'Customer Support',
    'Design',
  ];

  const designations = [
    'Software Engineer',
    'Senior Software Engineer',
    'Tech Lead',
    'Manager',
    'HR Executive',
    'HR Manager',
    'Sales Executive',
    'Marketing Executive',
    'Finance Analyst',
    'Operations Executive',
    'Customer Support Executive',
  ];

  const relationships = ['Spouse', 'Father', 'Mother', 'Brother', 'Sister', 'Friend'];

  const handleInputChange = (
    field: keyof EmployeeFormData,
    value: string | number | boolean | Date
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSalaryChange = (field: keyof typeof formData.salary, value: number) => {
    setFormData(prev => ({
      ...prev,
      salary: {
        ...prev.salary,
        [field]: value,
      },
    }));
  };

  const handleEmergencyContactChange = (
    field: keyof typeof formData.emergencyContact,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [field]: value,
      },
    }));
  };

  const generateEmployeeId = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    return `EMP${year}${month}${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to onboard employees');
      return;
    }

    // Validation
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.department ||
      !formData.designation ||
      !formData.joiningDate
    ) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      console.log('Onboarding employee for user:', user._id);

      // Generate unique employee ID
      const employeeId = generateEmployeeId();

      // Create employee record with proper data structure
      const employeeData = {
        created_by: user._id, // The current user who is creating this employee
        employee_id: employeeId,
        department: formData.department,
        designation: formData.designation,
        joining_date: formData.joiningDate?.toISOString().split('T')[0],
        work_location: formData.location,
        salary_structure: {
          base: formData.salary.base,
          hra: formData.salary.hra,
          allowance: formData.salary.allowance,
          bonus: formData.salary.bonus,
          deductions: formData.salary.deductions,
          total:
            formData.salary.base +
            formData.salary.hra +
            formData.salary.allowance +
            formData.salary.bonus -
            formData.salary.deductions,
        },
        emergency_contact: {
          name: formData.emergencyContact.name,
          relationship: formData.emergencyContact.relationship,
          phone: formData.emergencyContact.phone,
        },
        employment_status: 'probation' as const,
        employee_type: 'full_time',
        // Store additional info in a metadata field if needed
        metadata: {
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          aadhar: formData.aadhar,
          pan: formData.pan,
          manager: formData.manager,
        },
      };

      console.log('Employee data to be saved:', employeeData);

      const employee = await hrmsApi.createEmployee(employeeData);

      toast.success(`Employee onboarded successfully! Employee ID: ${employeeId}`);
      console.log('Employee created:', employee);

      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        aadhar: '',
        pan: '',
        department: '',
        designation: '',
        manager: '',
        joiningDate: undefined,
        location: '',
        salary: {
          base: 0,
          hra: 0,
          allowance: 0,
          bonus: 0,
          deductions: 0,
        },
        emergencyContact: {
          name: '',
          relationship: '',
          phone: '',
        },
      });
    } catch (error: unknown) {
      console.error('Error onboarding employee:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to onboard employee. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Onboard New Employee</CardTitle>
          <p className="text-sm text-gray-600">
            Add a new employee to your organization. All data will be saved securely and associated
            with your account.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={e => handleInputChange('fullName', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={e => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={e => handleInputChange('phone', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="aadhar">Aadhar Number</Label>
                  <Input
                    id="aadhar"
                    value={formData.aadhar}
                    onChange={e => handleInputChange('aadhar', e.target.value)}
                    placeholder="xxxx-xxxx-xxxx"
                  />
                </div>
                <div>
                  <Label htmlFor="pan">PAN Number</Label>
                  <Input
                    id="pan"
                    value={formData.pan}
                    onChange={e => handleInputChange('pan', e.target.value)}
                    placeholder="ABCDE1234F"
                  />
                </div>
              </div>
            </div>

            {/* Job Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Job Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="department">Department *</Label>
                  <Select
                    value={formData.department}
                    onValueChange={value => handleInputChange('department', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="designation">Designation *</Label>
                  <Select
                    value={formData.designation}
                    onValueChange={value => handleInputChange('designation', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Designation" />
                    </SelectTrigger>
                    <SelectContent>
                      {designations.map(designation => (
                        <SelectItem key={designation} value={designation}>
                          {designation}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="manager">Reporting Manager</Label>
                  <Input
                    id="manager"
                    value={formData.manager}
                    onChange={e => handleInputChange('manager', e.target.value)}
                    placeholder="Manager's name"
                  />
                </div>
                <div>
                  <Label>Joining Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !formData.joiningDate && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.joiningDate ? format(formData.joiningDate, 'PPP') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.joiningDate}
                        onSelect={date => handleInputChange('joiningDate', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="location">Work Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={e => handleInputChange('location', e.target.value)}
                    placeholder="Office location"
                  />
                </div>
              </div>
            </div>

            {/* Salary Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Salary Structure</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="base">Base Salary (₹)</Label>
                  <Input
                    id="base"
                    type="number"
                    value={formData.salary.base}
                    onChange={e => handleSalaryChange('base', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="hra">HRA (₹)</Label>
                  <Input
                    id="hra"
                    type="number"
                    value={formData.salary.hra}
                    onChange={e => handleSalaryChange('hra', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="allowance">Allowances (₹)</Label>
                  <Input
                    id="allowance"
                    type="number"
                    value={formData.salary.allowance}
                    onChange={e => handleSalaryChange('allowance', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="bonus">Bonus (₹)</Label>
                  <Input
                    id="bonus"
                    type="number"
                    value={formData.salary.bonus}
                    onChange={e => handleSalaryChange('bonus', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="deductions">Deductions (₹)</Label>
                  <Input
                    id="deductions"
                    type="number"
                    value={formData.salary.deductions}
                    onChange={e => handleSalaryChange('deductions', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label>Total CTC</Label>
                  <div className="p-2 bg-gray-100 rounded">
                    ₹
                    {(
                      formData.salary.base +
                      formData.salary.hra +
                      formData.salary.allowance +
                      formData.salary.bonus -
                      formData.salary.deductions
                    ).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="emergencyName">Contact Name</Label>
                  <Input
                    id="emergencyName"
                    value={formData.emergencyContact.name}
                    onChange={e => handleEmergencyContactChange('name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="relationship">Relationship</Label>
                  <Select
                    value={formData.emergencyContact.relationship}
                    onValueChange={value => handleEmergencyContactChange('relationship', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      {relationships.map(rel => (
                        <SelectItem key={rel} value={rel}>
                          {rel}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="emergencyPhone">Phone Number</Label>
                  <Input
                    id="emergencyPhone"
                    value={formData.emergencyContact.phone}
                    onChange={e => handleEmergencyContactChange('phone', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFormData({
                    fullName: '',
                    email: '',
                    phone: '',
                    aadhar: '',
                    pan: '',
                    department: '',
                    designation: '',
                    manager: '',
                    joiningDate: undefined,
                    location: '',
                    salary: {
                      base: 0,
                      hra: 0,
                      allowance: 0,
                      bonus: 0,
                      deductions: 0,
                    },
                    emergencyContact: {
                      name: '',
                      relationship: '',
                      phone: '',
                    },
                  });
                }}
              >
                Reset Form
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Submit & Generate ID'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardEmployee;
