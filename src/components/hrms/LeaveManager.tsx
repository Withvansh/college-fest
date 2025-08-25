import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { CheckCircle, XCircle, Clock, Search } from 'lucide-react';
import { toast } from 'sonner';
import { hrmsApi } from '@/lib/api/hrms';
import { useAuth } from '@/hooks/useAuth';

const LeaveManager = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaveApplications();
  }, []);

  const loadLeaveApplications = async () => {
    if (!user?._id) return;

    try {
      setLoading(true);
      const applications = await hrmsApi.getLeaveApplications();

      // Transform backend data to match UI expectations
      if (Array.isArray(applications)) {
        const transformedApplications = applications.map((app: any) => ({
          id: app._id || app.id,
          employee: app.employee_name || app.employee,
          type: app.leave_type || app.type,
          startDate: app.start_date || app.startDate,
          endDate: app.end_date || app.endDate,
          days: app.total_days || app.days,
          reason: app.reason,
          status:
            app.status === 'pending'
              ? 'Pending'
              : app.status === 'approved'
                ? 'Approved'
                : app.status === 'rejected'
                  ? 'Rejected'
                  : app.status,
          appliedOn: app.applied_date || app.appliedOn,
        }));

        setLeaveRequests(transformedApplications);
      } else {
        setLeaveRequests([]);
      }
    } catch (error) {
      console.error('Error loading leave applications:', error);
      toast.error('Failed to load leave applications. Showing sample data.');

      // Fallback to mock data
      const mockRequests = [
        {
          id: 1,
          employee: 'John Doe',
          type: 'Sick',
          startDate: '2024-01-20',
          endDate: '2024-01-22',
          days: 3,
          reason: 'Fever and cold',
          status: 'Pending',
          appliedOn: '2024-01-18',
        },
        {
          id: 2,
          employee: 'Jane Smith',
          type: 'Casual',
          startDate: '2024-01-25',
          endDate: '2024-01-25',
          days: 1,
          reason: 'Personal work',
          status: 'Approved',
          appliedOn: '2024-01-15',
        },
      ];
      setLeaveRequests(mockRequests);
    } finally {
      setLoading(false);
    }
  };

  const leaveBalances = [
    { type: 'Sick Leave', allocated: 12, used: 3, remaining: 9 },
    { type: 'Casual Leave', allocated: 12, used: 5, remaining: 7 },
    { type: 'Earned Leave', allocated: 21, used: 8, remaining: 13 },
  ];

  const handleApprove = async (id: number) => {
    try {
      await hrmsApi.updateLeaveApplication(id.toString(), { status: 'approved' });

      // Update local state
      setLeaveRequests(prev =>
        prev.map(req => (req.id === id ? { ...req, status: 'Approved' } : req))
      );

      toast.success('Leave request approved successfully');
    } catch (error) {
      console.error('Error approving leave:', error);
      toast.error('Failed to approve leave request');
    }
  };

  const handleReject = async (id: number) => {
    try {
      await hrmsApi.updateLeaveApplication(id.toString(), { status: 'rejected' });

      // Update local state
      setLeaveRequests(prev =>
        prev.map(req => (req.id === id ? { ...req, status: 'Rejected' } : req))
      );

      toast.success('Leave request rejected successfully');
    } catch (error) {
      console.error('Error rejecting leave:', error);
      toast.error('Failed to reject leave request');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Sick':
        return 'bg-red-50 text-red-700';
      case 'Casual':
        return 'bg-blue-50 text-blue-700';
      case 'Earned':
        return 'bg-green-50 text-green-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const filteredRequests = leaveRequests.filter(
    req =>
      req.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Leave Balances */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {leaveBalances.map((balance, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{balance.type}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Allocated:</span>
                  <span className="font-medium">{balance.allocated}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Used:</span>
                  <span className="font-medium text-red-600">{balance.used}</span>
                </div>
                <div className="flex justify-between text-sm border-t pt-2">
                  <span>Remaining:</span>
                  <span className="font-bold text-green-600">{balance.remaining}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Leave Requests */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Leave Requests</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search employees or leave type..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map(request => (
                <div key={request.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium">{request.employee}</h3>
                        <Badge className={getTypeColor(request.type)}>{request.type} Leave</Badge>
                        <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                      </div>

                      <div className="text-sm text-gray-600">
                        <p>
                          <strong>Duration:</strong> {request.startDate} to {request.endDate} (
                          {request.days} days)
                        </p>
                        <p>
                          <strong>Reason:</strong> {request.reason}
                        </p>
                        <p>
                          <strong>Applied on:</strong> {request.appliedOn}
                        </p>
                      </div>
                    </div>

                    {request.status === 'Pending' && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(request.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(request.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {filteredRequests.length === 0 && !loading && (
                <div className="text-center text-gray-500 py-8">No leave requests found.</div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaveManager;
