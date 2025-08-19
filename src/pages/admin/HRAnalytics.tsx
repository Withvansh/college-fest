
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Users, Briefcase, Clock, CheckCircle, Download, Calendar } from 'lucide-react';

const HRAnalytics = () => {
  const [dateRange, setDateRange] = useState('30d');
  const [reportType, setReportType] = useState('overview');

  // Mock analytics data
  const hiringFunnelData = [
    { stage: 'Applications', count: 450 },
    { stage: 'Screening', count: 200 },
    { stage: 'Interviews', count: 80 },
    { stage: 'Offers', count: 25 },
    { stage: 'Hired', count: 20 }
  ];

  const monthlyHiresData = [
    { month: 'Jan', hires: 12, applications: 180 },
    { month: 'Feb', hires: 15, applications: 220 },
    { month: 'Mar', hires: 8, applications: 190 },
    { month: 'Apr', hires: 20, applications: 250 },
    { month: 'May', hires: 18, applications: 200 },
    { month: 'Jun', hires: 22, applications: 280 }
  ];

  const departmentData = [
    { name: 'Engineering', hires: 45, color: '#8884d8' },
    { name: 'Product', hires: 20, color: '#82ca9d' },
    { name: 'Design', hires: 15, color: '#ffc658' },
    { name: 'Marketing', hires: 12, color: '#ff7300' },
    { name: 'Sales', hires: 18, color: '#0088fe' }
  ];

  const topPerformingJobs = [
    { title: 'Senior Frontend Developer', applications: 89, hired: 3, conversionRate: 3.4 },
    { title: 'Product Manager', applications: 67, hired: 2, conversionRate: 3.0 },
    { title: 'UX Designer', applications: 54, hired: 2, conversionRate: 3.7 },
    { title: 'Backend Engineer', applications: 76, hired: 2, conversionRate: 2.6 }
  ];

  const kpiData = [
    {
      title: 'Total Applications',
      value: '1,234',
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Time to Hire',
      value: '18 days',
      change: '-3 days',
      trend: 'down',
      icon: Clock,
      color: 'text-green-600'
    },
    {
      title: 'Conversion Rate',
      value: '4.2%',
      change: '+0.8%',
      trend: 'up',
      icon: CheckCircle,
      color: 'text-purple-600'
    },
    {
      title: 'Active Jobs',
      value: '24',
      change: '+5',
      trend: 'up',
      icon: Briefcase,
      color: 'text-orange-600'
    }
  ];

  const handleExportReport = () => {
    // Mock export functionality
    console.log('Exporting report...');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">HR Analytics</h1>
          <p className="text-gray-600">Track recruitment performance and hiring metrics</p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{kpi.title}</p>
                  <p className="text-2xl font-bold">{kpi.value}</p>
                  <div className="flex items-center text-sm">
                    {kpi.trend === 'up' ? (
                      <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                    )}
                    <span className={kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                      {kpi.change}
                    </span>
                  </div>
                </div>
                <kpi.icon className={`h-8 w-8 ${kpi.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hiring Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Hiring Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hiringFunnelData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stage" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Hires Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Hiring Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyHiresData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="hires" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="applications" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Hires by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="hires"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Performing Jobs */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Job Postings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformingJobs.map((job, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{job.title}</p>
                    <p className="text-sm text-gray-600">{job.applications} applications • {job.hired} hired</p>
                  </div>
                  <Badge variant="outline">
                    {job.conversionRate}% conversion
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Recruitment Metrics Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">68%</p>
              <p className="text-sm text-gray-600">Interview Show Rate</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">12.5</p>
              <p className="text-sm text-gray-600">Avg Days to First Interview</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">85%</p>
              <p className="text-sm text-gray-600">Offer Acceptance Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HRAnalytics;
