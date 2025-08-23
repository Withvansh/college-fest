import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';

import { hrmsApi } from '@/lib/api/hrms';
import { toast } from 'sonner';
import { Clock, MapPin, Calendar, CheckCircle } from 'lucide-react';

const AttendanceTracker = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [todayRecord, setTodayRecord] = useState<{
    id: string;
    check_in_time?: string;
    check_out_time?: string;
    date: string;
    total_hours?: number;
  } | null>(null);
  const [recentRecords, setRecentRecords] = useState<
    Array<{
      id: string;
      date: string;
      check_in_time?: string;
      check_out_time?: string;
      total_hours?: number;
    }>
  >([]);

  useEffect(() => {
    if (user) {
      loadAttendanceData();
    }
  }, [user]);

  const loadAttendanceData = async () => {
    // Mock data
    const mockRecord = {
      id: '1',
      date: new Date().toISOString().split('T')[0],
      check_in_time: new Date().toISOString(),
      check_out_time: null,
      status: 'present',
    };
    setTodayRecord(mockRecord);
    setRecentRecords([mockRecord]);
  };

  const handlePunchIn = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Get location if supported
      let location = null;
      if (navigator.geolocation) {
        await new Promise(resolve => {
          navigator.geolocation.getCurrentPosition(
            position => {
              location = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              resolve(location);
            },
            () => resolve(null)
          );
        });
      }

      // Mock punch in
      toast.success('Punched in successfully!');
      loadAttendanceData();
    } catch (error: unknown) {
      console.error('Punch in error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to punch in';
      toast.error(errorMessage);
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
    } catch (error: unknown) {
      console.error('Punch out error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to punch out';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (
    record: {
      check_in_time?: string;
      check_out_time?: string;
    } | null
  ) => {
    if (!record) return <Badge variant="outline">Not Marked</Badge>;

    if (record.check_in_time && !record.check_out_time) {
      return <Badge className="bg-green-500">Checked In</Badge>;
    }

    if (record.check_in_time && record.check_out_time) {
      return <Badge className="bg-blue-500">Completed</Badge>;
    }

    return <Badge variant="outline">Pending</Badge>;
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
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
            {recentRecords.map(record => (
              <div
                key={record.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4" />
                  <div>
                    <div className="font-medium">{new Date(record.date).toLocaleDateString()}</div>
                    {record.check_in_time && (
                      <div className="text-sm text-gray-600">
                        {formatTime(record.check_in_time)} -{' '}
                        {record.check_out_time ? formatTime(record.check_out_time) : 'In Progress'}
                      </div>
                    )}
                  </div>
                </div>
                {getStatusBadge(record)}
              </div>
            ))}

            {recentRecords.length === 0 && (
              <div className="text-center text-gray-500 py-4">No attendance records found</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceTracker;
