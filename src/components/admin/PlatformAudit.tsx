import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
// Supabase removed

import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Database, 
  Users, 
  Shield, 
  Code, 
  Zap,
  FileText,
  BarChart3,
  RefreshCw
} from 'lucide-react';

interface AuditResult {
  category: string;
  name: string;
  status: 'completed' | 'partial' | 'missing' | 'broken';
  description: string;
  lastUpdated?: string;
  issues?: string[];
  recommendations?: string[];
}

const PlatformAudit = () => {
  const [auditResults, setAuditResults] = useState<AuditResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastAuditTime, setLastAuditTime] = useState<Date | null>(null);

  const performAudit = async () => {
    setLoading(true);
    setLastAuditTime(new Date());

    try {
      // Check database tables (mock for now - in real app use direct SQL query)
      const existingTables = new Set([
        'profiles', 'jobs', 'job_applications', 'tests', 'test_attempts',
        'employees', 'attendance_records', 'leave_applications', 'payslips', 
        'freelance_gigs', 'freelance_proposals', 'freelance_contracts',
        'blog_posts', 'notifications', 'audit_logs', 'admin_users', 'ai_interviews'
      ]);
      
      // Define expected tables and their status
      const expectedTables = [
        'profiles', 'jobs', 'job_applications', 'tests', 'test_attempts',
        'employees', 'attendance_records', 'leave_applications', 'payslips',
        'freelance_gigs', 'freelance_proposals', 'freelance_contracts',
        'blog_posts', 'notifications', 'audit_logs', 'admin_users'
      ];

      const results: AuditResult[] = [
        // Authentication & Users
        {
          category: 'Authentication',
          name: 'User Registration & Login',
          status: existingTables.has('profiles') ? 'completed' : 'missing',
          description: 'User authentication and profile management',
          issues: !existingTables.has('profiles') ? ['Profiles table missing'] : []
        },
        {
          category: 'Authentication', 
          name: 'Role-Based Access Control',
          status: 'partial',
          description: 'Multi-role authentication system',
          issues: ['Missing role-based routing', 'Insufficient RLS policies'],
          recommendations: ['Implement comprehensive role checks', 'Add RLS policies for all tables']
        },

        // Job Management
        {
          category: 'Job Management',
          name: 'Job Posting System',
          status: existingTables.has('jobs') ? 'completed' : 'missing',
          description: 'Job creation and management',
        },
        {
          category: 'Job Management',
          name: 'Application Management',
          status: existingTables.has('job_applications') ? 'completed' : 'missing',
          description: 'Job application tracking and management',
        },

        // Testing System
        {
          category: 'Testing & Assessment',
          name: 'Skill Assessment Tests',
          status: existingTables.has('tests') && existingTables.has('test_attempts') ? 'completed' : 'partial',
          description: 'AI-powered skill testing system',
        },
        {
          category: 'Testing & Assessment',
          name: 'AI Interview System',
          status: existingTables.has('ai_interviews') ? 'completed' : 'missing',
          description: 'AI-powered interview platform',
        },

        // HRMS
        {
          category: 'HRMS',
          name: 'Employee Management',
          status: existingTables.has('employees') ? 'partial' : 'missing',
          description: 'Employee data and directory management',
          issues: ['UI exists but needs database integration'],
          recommendations: ['Connect to real employee data', 'Add employee CRUD operations']
        },
        {
          category: 'HRMS',
          name: 'Attendance Tracking',
          status: existingTables.has('attendance_records') ? 'partial' : 'missing',
          description: 'Employee attendance management',
          issues: ['Static UI, no real data integration']
        },
        {
          category: 'HRMS',
          name: 'Leave Management',
          status: existingTables.has('leave_applications') ? 'partial' : 'missing',
          description: 'Leave application and approval system',
        },
        {
          category: 'HRMS',
          name: 'Payroll System',
          status: existingTables.has('payslips') ? 'partial' : 'missing',
          description: 'Salary and payroll management',
          issues: ['Currency still in USD', 'No real payroll processing']
        },

        // Freelance Platform
        {
          category: 'Freelance Marketplace',
          name: 'Gig Management',
          status: existingTables.has('freelance_gigs') ? 'completed' : 'missing',
          description: 'Freelance project posting and management',
        },
        {
          category: 'Freelance Marketplace',
          name: 'Proposal System',
          status: existingTables.has('freelance_proposals') ? 'completed' : 'missing',
          description: 'Freelancer proposal submission and management',
        },
        {
          category: 'Freelance Marketplace',
          name: 'Contract Management',
          status: existingTables.has('freelance_contracts') ? 'completed' : 'missing',
          description: 'Contract creation and milestone tracking',
        },

        // Content Management
        {
          category: 'Content Management',
          name: 'Blog System',
          status: existingTables.has('blog_posts') ? 'completed' : 'missing',
          description: 'Blog creation and management system',
        },
        {
          category: 'Content Management',
          name: 'Notification System',
          status: existingTables.has('notifications') ? 'partial' : 'missing',
          description: 'In-app notifications and alerts',
          issues: ['Limited notification types', 'No real-time updates']
        },

        // Admin Panel
        {
          category: 'Admin Panel',
          name: 'Super Admin Dashboard',
          status: existingTables.has('admin_users') ? 'completed' : 'missing',
          description: 'Super admin control panel',
        },
        {
          category: 'Admin Panel',
          name: 'Analytics Dashboard',
          status: 'partial',
          description: 'Platform analytics and reporting',
          issues: ['Mock data only', 'No real analytics integration']
        },

        // Security & Compliance
        {
          category: 'Security',
          name: 'Data Audit Logs',
          status: existingTables.has('audit_logs') ? 'partial' : 'missing',
          description: 'System activity and change tracking',
        },
        {
          category: 'Security',
          name: 'Row Level Security',
          status: 'partial',
          description: 'Database-level access control',
          issues: ['Incomplete RLS policies', 'Some tables lack proper isolation'],
          recommendations: ['Add RLS to all user-data tables', 'Test policy effectiveness']
        }
      ];

      setAuditResults(results);
    } catch (error) {
      console.error('Audit failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    performAudit();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'partial':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'missing':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'broken':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      completed: 'default',
      partial: 'secondary', 
      missing: 'destructive',
      broken: 'destructive'
    };
    return <Badge variant={variants[status] || 'secondary'}>{status.toUpperCase()}</Badge>;
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, any> = {
      'Authentication': Shield,
      'Job Management': FileText,
      'Testing & Assessment': Zap,
      'HRMS': Users,
      'Freelance Marketplace': Code,
      'Content Management': FileText,
      'Admin Panel': BarChart3,
      'Security': Shield
    };
    const Icon = icons[category] || Database;
    return <Icon className="h-5 w-5" />;
  };

  const categoryStats = auditResults.reduce((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = { total: 0, completed: 0, partial: 0, missing: 0, broken: 0 };
    }
    acc[result.category].total++;
    acc[result.category][result.status as keyof typeof acc[string]]++;
    return acc;
  }, {} as Record<string, any>);

  const overallStats = auditResults.reduce((acc, result) => {
    acc.total++;
    acc[result.status as keyof typeof acc]++;
    return acc;
  }, { total: 0, completed: 0, partial: 0, missing: 0, broken: 0 });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Platform Audit Report</h1>
          <p className="text-gray-600 mt-1">
            Complete analysis of MinuteHire platform features and functionality
          </p>
          {lastAuditTime && (
            <p className="text-sm text-gray-500 mt-1">
              Last updated: {lastAuditTime.toLocaleString()}
            </p>
          )}
        </div>
        <Button onClick={performAudit} disabled={loading}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Audit
        </Button>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-green-600">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{overallStats.completed}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-yellow-600">Partial</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{overallStats.partial}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-red-600">Missing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overallStats.missing}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((overallStats.completed / overallStats.total) * 100)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <div className="grid gap-6">
        {Object.entries(categoryStats).map(([category, stats]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getCategoryIcon(category)}
                {category}
                <Badge variant="outline" className="ml-auto">
                  {stats.completed}/{stats.total} Complete
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {auditResults
                  .filter(result => result.category === category)
                  .map((result, index) => (
                    <div key={index} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getStatusIcon(result.status)}
                          <h4 className="font-medium">{result.name}</h4>
                          {getStatusBadge(result.status)}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{result.description}</p>
                        
                        {result.issues && result.issues.length > 0 && (
                          <div className="mb-2">
                            <p className="text-xs font-medium text-red-600 mb-1">Issues:</p>
                            <ul className="text-xs text-red-600 list-disc list-inside">
                              {result.issues.map((issue, i) => (
                                <li key={i}>{issue}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {result.recommendations && result.recommendations.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-blue-600 mb-1">Recommendations:</p>
                            <ul className="text-xs text-blue-600 list-disc list-inside">
                              {result.recommendations.map((rec, i) => (
                                <li key={i}>{rec}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle>Priority Action Items for MVP Launch</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-medium text-red-800 mb-2">Critical Issues (Must Fix)</h4>
              <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
                <li>Implement proper user authentication with Supabase Auth</li>
                <li>Connect all HRMS modules to real database</li>
                <li>Convert all currency displays from USD to INR</li>
                <li>Fix logout functionality across all admin panels</li>
                <li>Add comprehensive RLS policies for data security</li>
              </ul>
            </div>
            
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">Important Improvements</h4>
              <ul className="text-sm text-yellow-700 list-disc list-inside space-y-1">
                <li>Complete freelance marketplace contract management</li>
                <li>Implement real-time notifications</li>
                <li>Add comprehensive analytics and reporting</li>
                <li>Enhance test scoring and AI interview features</li>
                <li>Add email/SMS notification system</li>
              </ul>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Future Enhancements</h4>
              <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
                <li>Mobile app development</li>
                <li>Advanced AI matching algorithms</li>
                <li>Video interview capabilities</li>
                <li>Advanced analytics and insights</li>
                <li>Third-party integrations (LinkedIn, GitHub, etc.)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlatformAudit;