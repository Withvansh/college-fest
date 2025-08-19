
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Clock, 
  CreditCard, 
  FileText, 
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Calendar,
  Building,
  MapPin,
  Award,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
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

const HRAnalyticsDashboard = () => {
  // Sample data - replace with real data from Supabase
  const departmentData = [
    { name: 'Engineering', employees: 45, budget: 450000 },
    { name: 'Sales', employees: 32, budget: 320000 },
    { name: 'Marketing', employees: 18, budget: 180000 },
    { name: 'HR', employees: 12, budget: 120000 },
    { name: 'Finance', employees: 8, budget: 80000 },
  ];

  const attendanceData = [
    { month: 'Jan', present: 92, absent: 8 },
    { month: 'Feb', present: 89, absent: 11 },
    { month: 'Mar', present: 95, absent: 5 },
    { month: 'Apr', present: 91, absent: 9 },
    { month: 'May', present: 94, absent: 6 },
    { month: 'Jun', present: 88, absent: 12 },
  ];

  const performanceData = [
    { quarter: 'Q1', avgRating: 4.2, goals: 85 },
    { quarter: 'Q2', avgRating: 4.5, goals: 90 },
    { quarter: 'Q3', avgRating: 4.3, goals: 88 },
    { quarter: 'Q4', avgRating: 4.6, goals: 92 },
  ];

  const statusDistribution = [
    { name: 'Active', value: 145, color: '#10B981' },
    { name: 'Probation', value: 23, color: '#F59E0B' },
    { name: 'Notice', value: 8, color: '#EF4444' },
    { name: 'Remote', value: 34, color: '#8B5CF6' },
  ];

  const leaveData = [
    { type: 'Annual', used: 234, remaining: 156 },
    { type: 'Sick', used: 89, remaining: 211 },
    { type: 'Personal', used: 45, remaining: 155 },
    { type: 'Maternity', used: 12, remaining: 8 },
  ];

  const metrics = [
    {
      title: "Total Employees",
      value: "210",
      change: "+12",
      changeType: "increase",
      icon: Users,
      description: "Active employees"
    },
    {
      title: "Attendance Rate",
      value: "94.2%",
      change: "+2.1%",
      changeType: "increase",
      icon: Clock,
      description: "This month"
    },
    {
      title: "Avg Performance",
      value: "4.5/5",
      change: "+0.3",
      changeType: "increase",
      icon: Award,
      description: "Overall rating"
    },
    {
      title: "Turnover Rate",
      value: "8.2%",
      change: "-1.5%",
      changeType: "decrease",
      icon: TrendingDown,
      description: "Annual rate"
    },
    {
      title: "Open Positions",
      value: "15",
      change: "+5",
      changeType: "increase",
      icon: Target,
      description: "Urgent hiring"
    },
    {
      title: "Training Hours",
      value: "1,240",
      change: "+180",
      changeType: "increase",
      icon: Activity,
      description: "This quarter"
    }
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">HR Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive insights into your workforce</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            All Systems Operational
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <div className="flex items-center gap-1 text-xs">
                    {metric.changeType === 'increase' ? (
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-600" />
                    )}
                    <span className={`font-medium ${
                      metric.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.change}
                    </span>
                    <span className="text-gray-500">{metric.description}</span>
                  </div>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <metric.icon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Department Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="employees" fill="#3B82F6" name="Employees" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Employee Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Employee Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Attendance Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="present" 
                  stackId="1"
                  stroke="#10B981" 
                  fill="#10B981" 
                  fillOpacity={0.6}
                  name="Present %" 
                />
                <Area 
                  type="monotone" 
                  dataKey="absent" 
                  stackId="1"
                  stroke="#EF4444" 
                  fill="#EF4444" 
                  fillOpacity={0.6}
                  name="Absent %" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quarter" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="avgRating" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  name="Avg Rating" 
                />
                <Line 
                  type="monotone" 
                  dataKey="goals" 
                  stroke="#F59E0B" 
                  strokeWidth={3}
                  name="Goals %" 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Leave Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Leave Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={leaveData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="used" fill="#EF4444" name="Used" />
              <Bar dataKey="remaining" fill="#10B981" name="Remaining" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-800">High Performers</h3>
                <p className="text-sm text-gray-600">23 employees exceeded targets this quarter</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
              <div>
                <h3 className="font-semibold text-yellow-800">Attention Needed</h3>
                <p className="text-sm text-gray-600">5 employees with low attendance</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="font-semibold text-blue-800">Hiring Goals</h3>
                <p className="text-sm text-gray-600">80% progress on Q4 hiring targets</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HRAnalyticsDashboard;
