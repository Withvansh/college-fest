
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Plus, Edit, Trash2, Search, Filter, Eye, Clock, User, Video } from 'lucide-react';

const ManageInterviews = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isScheduling, setIsScheduling] = useState(false);

  // Mock data
  const [interviews] = useState([
    { 
      id: 1, 
      candidate: 'John Doe', 
      position: 'Frontend Developer',
      interviewer: 'Jane Smith',
      date: '2024-02-15',
      time: '10:00 AM',
      status: 'Scheduled',
      type: 'Technical',
      duration: 60,
      location: 'Video Call'
    },
    { 
      id: 2, 
      candidate: 'Sarah Wilson', 
      position: 'Product Manager',
      interviewer: 'Bob Johnson',
      date: '2024-02-16',
      time: '2:00 PM',
      status: 'Completed',
      type: 'Behavioral',
      duration: 45,
      location: 'Office - Room 301'
    },
    { 
      id: 3, 
      candidate: 'Mike Chen', 
      position: 'Data Scientist',
      interviewer: 'Emily Davis',
      date: '2024-02-17',
      time: '11:30 AM',
      status: 'Scheduled',
      type: 'Technical',
      duration: 90,
      location: 'Video Call'
    },
    { 
      id: 4, 
      candidate: 'Lisa Brown', 
      position: 'UX Designer',
      interviewer: 'Alex Lee',
      date: '2024-02-14',
      time: '3:30 PM',
      status: 'Cancelled',
      type: 'Portfolio Review',
      duration: 60,
      location: 'Video Call'
    },
  ]);

  const filteredInterviews = interviews.filter(interview => {
    const matchesSearch = interview.candidate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         interview.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         interview.interviewer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || interview.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'default';
      case 'Completed': return 'secondary';
      case 'Cancelled': return 'destructive';
      case 'Rescheduled': return 'outline';
      default: return 'secondary';
    }
  };

  const ScheduleInterviewForm = () => (
    <Dialog open={isScheduling} onOpenChange={setIsScheduling}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Schedule New Interview</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="candidate">Candidate</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select candidate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="john-doe">John Doe</SelectItem>
                  <SelectItem value="sarah-wilson">Sarah Wilson</SelectItem>
                  <SelectItem value="mike-chen">Mike Chen</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="interviewer">Interviewer</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select interviewer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jane-smith">Jane Smith</SelectItem>
                  <SelectItem value="bob-johnson">Bob Johnson</SelectItem>
                  <SelectItem value="emily-davis">Emily Davis</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="position">Position</Label>
            <Input id="position" placeholder="e.g. Frontend Developer" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" />
            </div>
            <div>
              <Label htmlFor="time">Time</Label>
              <Input id="time" type="time" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Interview Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="behavioral">Behavioral</SelectItem>
                  <SelectItem value="portfolio">Portfolio Review</SelectItem>
                  <SelectItem value="cultural">Cultural Fit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="90">90 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="location">Location/Link</Label>
            <Input id="location" placeholder="e.g. Video Call, Office Room 301" />
          </div>
          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={() => setIsScheduling(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsScheduling(false)}>
              Schedule Interview
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Interviews</h1>
          <p className="text-gray-600">Schedule and manage all candidate interviews</p>
        </div>
        <Button onClick={() => setIsScheduling(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Schedule Interview
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Interviews</p>
                <p className="text-2xl font-bold">{interviews.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold">{interviews.filter(i => i.status === 'Scheduled').length}</p>
              </div>
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold">{interviews.filter(i => i.status === 'Completed').length}</p>
              </div>
              <div className="h-3 w-3 rounded-full bg-blue-500"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <div className="h-3 w-3 rounded-full bg-purple-500"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interviews Management */}
      <Card>
        <CardHeader>
          <CardTitle>Interview Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by candidate, position, or interviewer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Interviewer</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInterviews.map((interview) => (
                <TableRow key={interview.id}>
                  <TableCell className="font-medium">{interview.candidate}</TableCell>
                  <TableCell>{interview.position}</TableCell>
                  <TableCell>{interview.interviewer}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{interview.date}</div>
                      <div className="text-gray-500">{interview.time}</div>
                    </div>
                  </TableCell>
                  <TableCell>{interview.type}</TableCell>
                  <TableCell>{interview.duration}m</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(interview.status)}>
                      {interview.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      {interview.location.includes('Video') ? (
                        <Video className="h-4 w-4 mr-1" />
                      ) : (
                        <User className="h-4 w-4 mr-1" />
                      )}
                      {interview.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Clock className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ScheduleInterviewForm />
    </div>
  );
};

export default ManageInterviews;
