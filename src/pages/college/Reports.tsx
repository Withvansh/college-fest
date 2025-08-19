
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { 
  Download, 
  ArrowLeft,
  BarChart3,
  FileText,
  TrendingUp,
  Calendar,
  Users,
  Building2
} from "lucide-react";

const Reports = () => {
  const [dateRange, setDateRange] = useState('last-6-months');
  const [reportType, setReportType] = useState('placement');

  // Mock data for charts
  const placementData = [
    { department: 'CSE', placed: 85, total: 100, percentage: 85 },
    { department: 'ECE', placed: 72, total: 95, percentage: 76 },
    { department: 'Mechanical', placed: 45, total: 80, percentage: 56 },
    { department: 'Civil', placed: 38, total: 75, percentage: 51 },
    { department: 'IT', placed: 65, total: 75, percentage: 87 }
  ];

  const packageData = [
    { range: '0-5 LPA', count: 45 },
    { range: '5-10 LPA', count: 120 },
    { range: '10-15 LPA', count: 85 },
    { range: '15-20 LPA', count: 35 },
    { range: '20+ LPA', count: 20 }
  ];

  const monthlyTrends = [
    { month: 'Jul', placements: 15 },
    { month: 'Aug', placements: 28 },
    { month: 'Sep', placements: 45 },
    { month: 'Oct', placements: 78 },
    { month: 'Nov', placements: 95 },
    { month: 'Dec', placements: 120 }
  ];

  const topCompanies = [
    { name: 'Google', hires: 25, package: '₹18-25 LPA' },
    { name: 'Microsoft', hires: 20, package: '₹15-22 LPA' },
    { name: 'Amazon', hires: 18, package: '₹12-18 LPA' },
    { name: 'TCS', hires: 45, package: '₹3.5-7 LPA' },
    { name: 'Infosys', hires: 35, package: '₹4-8 LPA' }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const handleExportReport = (type: string) => {
    let csvContent = '';
    let filename = '';

    switch (type) {
      case 'placement':
        csvContent = [
          ['Department', 'Placed', 'Total', 'Percentage'],
          ...placementData.map(item => [item.department, item.placed, item.total, item.percentage + '%'])
        ].map(row => row.join(',')).join('\n');
        filename = 'placement-report.csv';
        break;
      
      case 'package':
        csvContent = [
          ['Package Range', 'Count'],
          ...packageData.map(item => [item.range, item.count])
        ].map(row => row.join(',')).join('\n');
        filename = 'package-analysis.csv';
        break;
      
      case 'companies':
        csvContent = [
          ['Company', 'Hires', 'Package Range'],
          ...topCompanies.map(item => [item.name, item.hires, item.package])
        ].map(row => row.join(',')).join('\n');
        filename = 'top-companies.csv';
        break;
      
      default:
        csvContent = 'No data available';
        filename = 'report.csv';
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} report exported successfully!`);
  };

  const handleGenerateCustomReport = () => {
    toast.success("Custom report generated and downloaded!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/college/dashboard" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                  <SelectItem value="last-6-months">Last 6 Months</SelectItem>
                  <SelectItem value="current-year">Current Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Total Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">425</div>
              <p className="text-xs text-gray-600">Final year eligible</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Placed Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">305</div>
              <p className="text-xs text-green-600">71.8% placement rate</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Building2 className="h-4 w-4 mr-2" />
                Companies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87</div>
              <p className="text-xs text-gray-600">Participated in drives</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                Avg Package
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹8.5 LPA</div>
              <p className="text-xs text-blue-600">+12% from last year</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="placement" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="placement">Placement Report</TabsTrigger>
            <TabsTrigger value="package">Package Analysis</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="custom">Custom Reports</TabsTrigger>
          </TabsList>

          {/* Placement Report */}
          <TabsContent value="placement" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Department-wise Placement Statistics</h2>
              <Button onClick={() => handleExportReport('placement')} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Placement Percentage by Department</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={placementData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="department" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="percentage" fill="#f97316" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Placement Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={placementData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ department, percentage }) => `${department}: ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="placed"
                      >
                        {placementData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Department Details Table */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Department</th>
                        <th className="text-left p-2">Total Students</th>
                        <th className="text-left p-2">Placed</th>
                        <th className="text-left p-2">Percentage</th>
                        <th className="text-left p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {placementData.map((dept, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-2 font-medium">{dept.department}</td>
                          <td className="p-2">{dept.total}</td>
                          <td className="p-2 text-green-600">{dept.placed}</td>
                          <td className="p-2">
                            <div className="flex items-center">
                              <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                                <div 
                                  className="bg-orange-600 h-2 rounded-full" 
                                  style={{ width: `${dept.percentage}%` }}
                                ></div>
                              </div>
                              {dept.percentage}%
                            </div>
                          </td>
                          <td className="p-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              dept.percentage >= 80 ? 'bg-green-100 text-green-700' :
                              dept.percentage >= 60 ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {dept.percentage >= 80 ? 'Excellent' : dept.percentage >= 60 ? 'Good' : 'Needs Improvement'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Package Analysis */}
          <TabsContent value="package" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Package Distribution Analysis</h2>
              <Button onClick={() => handleExportReport('package')} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Package Range Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={packageData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Hiring Companies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topCompanies.map((company, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{company.name}</p>
                          <p className="text-sm text-gray-600">{company.package}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-orange-600">{company.hires}</p>
                          <p className="text-xs text-gray-500">hires</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Trends */}
          <TabsContent value="trends" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Placement Trends</h2>
              <Button onClick={() => handleExportReport('trends')} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Monthly Placement Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="placements" stroke="#f97316" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Custom Reports */}
          <TabsContent value="custom" className="space-y-6">
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Generate Custom Reports</h3>
              <p className="text-gray-600 mb-6">Create customized reports based on your specific requirements</p>
              
              <div className="max-w-md mx-auto space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Report Type</label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="placement">Placement Summary</SelectItem>
                      <SelectItem value="departmental">Department-wise Analysis</SelectItem>
                      <SelectItem value="company">Company Performance</SelectItem>
                      <SelectItem value="salary">Salary Trends</SelectItem>
                      <SelectItem value="comprehensive">Comprehensive Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Date Range</label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="last-month">Last Month</SelectItem>
                      <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                      <SelectItem value="last-6-months">Last 6 Months</SelectItem>
                      <SelectItem value="current-year">Current Year</SelectItem>
                      <SelectItem value="last-year">Last Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  onClick={handleGenerateCustomReport}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                  size="lg"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Generate Report
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Reports;
