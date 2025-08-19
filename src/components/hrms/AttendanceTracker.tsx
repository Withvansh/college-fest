
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { hrmsApi } from '@/lib/api/hrms';
import { toast } from 'sonner';
import { Clock, MapPin, Calendar, CheckCircle } from 'lucide-react';

const AttendanceTracker = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [todayRecord, setTodayRecord] = useState<any>(null);
  const [recentRecords, setRecentRecords] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      loadAttendanceData();
    }
  }, [user]);

  const loadAttendanceData = async () => {
    try {
      // Get employee record first
      const { data: employees } = await supabase
        .from('employees')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (employees) {
        const records = await hrmsApi.getAttendanceRecords(employees.id);
        const today = new Date().toISOString().split('T')[0];
        
        setTodayRecord(records.find(r => r.date === today));
        setRecentRecords(records.slice(0, 7));
      }
    } catch (error) {
      console.error('Error loading attendance:', error);
    }
  };

  const handlePunchIn = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Get location if supported
      let location = null;
      if (navigator.geolocation) {
        await new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              location = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              };
              resolve(location);
            },
            () => resolve(null)
          );
        });
      }

      // Get employee ID
      const { data: employee } = await supabase
        .from('employees')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (employee) {
        await hrmsApi.punchIn(employee.id, location);
        toast.success('Punched in successfully!');
        loadAttendanceData();
      }
    } catch (error: any) {
      console.error('Punch in error:', error);
      toast.error(error.message || 'Failed to punch in');
    } finally {
      setLoading(false);
    }
  };

  const handlePunchOut = async () => {
    if (!todayRecord) return;

    setLoading(true);
    try {
      await hrmsApi.punchOut(todayRecord.id);
      toast.success('Punched out successfully!');
      loadAttendanceData();
    } catch (error: any) {
      console.error('Punch out error:', error);
      toast.error(error.message || 'Failed to punch out');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (record: any) => {
    if (!record) return <Badge variant="outline">Not Marked</Badge>;
    
    if (record.check_in_time && !record.check_out_time) {
      return <Badge className="bg-green-500">Checked In</Badge>;
    }
    
    if (record.check_in_time && record.check_out_time) {
      return <Badge className="bg-blue-500">Completed</Badge>;
    }
    
    return <Badge variant="outline">{record.status}</Badge>;
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Today's Attendance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Today's Attendance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date().toLocaleDateString()}</span>
                {getStatusBadge(todayRecord)}
              </div>
              
              {todayRecord && (
                <div className="text-sm text-gray-600 space-y-1">
                  {todayRecord.check_in_time && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Checked in at {formatTime(todayRecord.check_in_time)}
                    </div>
                  )}
                  {todayRecord.check_out_time && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      Checked out at {formatTime(todayRecord.check_out_time)}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-x-2">
              {!todayRecord || !todayRecord.check_in_time ? (
                <Button onClick={handlePunchIn} disabled={loading}>
                  {loading ? 'Punching In...' : 'Punch In'}
                </Button>
              ) : !todayRecord.check_out_time ? (
                <Button onClick={handlePunchOut} disabled={loading} variant="outline">
                  {loading ? 'Punching Out...' : 'Punch Out'}
                </Button>
              ) : (
                <Button disabled variant="outline">
                  Day Complete
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Attendance */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentRecords.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4" />
                  <div>
                    <div className="font-medium">
                      {new Date(record.date).toLocaleDateString()}
                    </div>
                    {record.check_in_time && (
                      <div className="text-sm text-gray-600">
                        {formatTime(record.check_in_time)} - {record.check_out_time ? formatTime(record.check_out_time) : 'In Progress'}
                      </div>
                    )}
                  </div>
                </div>
                {getStatusBadge(record)}
              </div>
            ))}
            
            {recentRecords.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                No attendance records found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceTracker;
