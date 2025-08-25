import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Download, Plus, Search, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { hrmsApi } from '@/lib/api/hrms';
import { useAuth } from '@/hooks/useAuth';

const PayrollPage = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [payrollData, setPayrollData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayrollData();
  }, []);

  const loadPayrollData = async () => {
    try {
      setLoading(true);
      const data = await hrmsApi.getPayrollData();
      if (Array.isArray(data)) {
        setPayrollData(data);
      } else {
        setPayrollData([]);
      }
    } catch (error) {
      console.error('Error loading payroll data:', error);
      toast.error('Failed to load payroll data. Showing sample data.');

      // Fallback to mock data
      const mockData = [
        {
          id: 1,
          employee: 'John Doe',
          department: 'Engineering',
          basicSalary: 80000,
          allowances: 15000,
          deductions: 8000,
          netSalary: 87000,
          status: 'Generated',
          month: 'January 2024',
        },
        {
          id: 2,
          employee: 'Jane Smith',
          department: 'Marketing',
          basicSalary: 65000,
          allowances: 12000,
          deductions: 6500,
          netSalary: 70500,
          status: 'Pending',
          month: 'January 2024',
        },
        {
          id: 3,
          employee: 'Mike Johnson',
          department: 'Sales',
          basicSalary: 55000,
          allowances: 10000,
          deductions: 5500,
          netSalary: 59500,
          status: 'Generated',
          month: 'January 2024',
        },
      ];
      setPayrollData(mockData);
    } finally {
      setLoading(false);
    }
  };

  const payrollSummary = {
    totalEmployees: 890,
    totalPayroll: 45500000,
    processed: 678,
    pending: 212,
    avgSalary: 51124,
  };

  const handleGeneratePayslip = async (employeeId: number) => {
    try {
      await hrmsApi.generatePayslip(employeeId);

      // Update local state
      setPayrollData(prev =>
        prev.map(emp => (emp.id === employeeId ? { ...emp, status: 'Generated' } : emp))
      );

      toast.success('Payslip generated successfully and sent to employee');
    } catch (error) {
      console.error('Error generating payslip:', error);
      toast.error('Failed to generate payslip');
    }
  };

  const handleDownloadPayslip = async (employeeId: number) => {
    try {
      await hrmsApi.downloadPayslip(employeeId);
      toast.success('Payslip PDF download started');
    } catch (error) {
      console.error('Error downloading payslip:', error);
      toast.error('Failed to download payslip');
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'Generated' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  const filteredPayroll = payrollData.filter(
    emp =>
      emp.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Payroll Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold text-blue-600">{payrollSummary.totalEmployees}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Payroll</p>
              <p className="text-2xl font-bold text-green-600">
                ₹{(payrollSummary.totalPayroll / 1000000).toFixed(1)}M
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Processed</p>
              <p className="text-2xl font-bold text-green-600">{payrollSummary.processed}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-orange-600">{payrollSummary.pending}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Avg Salary</p>
              <p className="text-2xl font-bold text-purple-600">
                ₹{payrollSummary.avgSalary.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payroll Management */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Payroll Management</CardTitle>
            <div className="flex items-center space-x-2">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Generate Bulk Payroll
              </Button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPayroll.map(emp => (
              <div key={emp.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-medium">{emp.employee}</h3>
                      <Badge variant="outline">{emp.department}</Badge>
                      <Badge className={getStatusColor(emp.status)}>{emp.status}</Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Basic Salary</p>
                        <p className="font-medium">₹{emp.basicSalary.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Allowances</p>
                        <p className="font-medium text-green-600">
                          +₹{emp.allowances.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Deductions</p>
                        <p className="font-medium text-red-600">
                          -₹{emp.deductions.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Net Salary</p>
                        <p className="font-bold text-blue-600">₹{emp.netSalary.toLocaleString()}</p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-500">Period: {emp.month}</p>
                  </div>

                  <div className="flex flex-col space-y-2">
                    {emp.status === 'Pending' ? (
                      <Button size="sm" onClick={() => handleGeneratePayslip(emp.id)}>
                        <CreditCard className="h-4 w-4 mr-1" />
                        Generate
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadPayslip(emp.id)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PayrollPage;
