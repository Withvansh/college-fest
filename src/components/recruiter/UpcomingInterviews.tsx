
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Video, Calendar, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Interview {
  id: string;
  dateTime: string;
  candidateName: string;
  jobRole: string;
  status: 'Scheduled' | 'Rescheduled' | 'Completed';
  type: 'Video' | 'Phone' | 'In-person';
  duration: number;
  meetingLink?: string;
}

const UpcomingInterviews = () => {
  const { toast } = useToast();
  
  const [interviews] = useState<Interview[]>([
    {
      id: '1',
      dateTime: '2024-01-18T10:00:00',
      candidateName: 'John Smith',
      jobRole: 'Senior Frontend Developer',
      status: 'Scheduled',
      type: 'Video',
      duration: 60,
      meetingLink: 'https://meet.google.com/abc-def-ghi'
    },
    {
      id: '2',
      dateTime: '2024-01-18T14:30:00',
      candidateName: 'Sarah Johnson',
      jobRole: 'Product Manager',
      status: 'Scheduled',
      type: 'Video',
      duration: 45,
      meetingLink: 'https://meet.google.com/xyz-123-456'
    },
    {
      id: '3',
      dateTime: '2024-01-19T09:00:00',
      candidateName: 'Mike Chen',
      jobRole: 'Backend Engineer',
      status: 'Rescheduled',
      type: 'Phone',
      duration: 30
    },
    {
      id: '4',
      dateTime: '2024-01-19T16:00:00',
      candidateName: 'Emily Davis',
      jobRole: 'UX Designer',
      status: 'Scheduled',
      type: 'In-person',
      duration: 90
    }
  ]);

  const handleViewDetails = (interviewId: string, candidateName: string) => {
    toast({
      title: "Interview Details",
      description: `Viewing details for ${candidateName}'s interview`,
    });
  };

  const handleJoinMeeting = (interviewId: string, candidateName: string, meetingLink?: string) => {
    if (meetingLink) {
      toast({
        title: "Joining Meeting",
        description: `Opening meeting with ${candidateName}`,
      });
      // In a real app, this would open the meeting link
    } else {
      toast({
        title: "No Meeting Link",
        description: "This interview doesn't have a meeting link",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Rescheduled': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Video': return <Video className="h-4 w-4" />;
      case 'Phone': return <Calendar className="h-4 w-4" />;
      case 'In-person': return <Clock className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Upcoming Interviews</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {interviews.map((interview) => (
            <div key={interview.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{interview.candidateName}</h3>
                    <Badge className={getStatusColor(interview.status)}>
                      {interview.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">Position: {interview.jobRole}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(interview.dateTime).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(interview.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="flex items-center gap-1">
                      {getTypeIcon(interview.type)}
                      {interview.type}
                    </span>
                    <span>{interview.duration} minutes</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleViewDetails(interview.id, interview.candidateName)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>
                {interview.type === 'Video' && interview.meetingLink && (
                  <Button 
                    size="sm" 
                    variant="default"
                    onClick={() => handleJoinMeeting(interview.id, interview.candidateName, interview.meetingLink)}
                  >
                    <Video className="h-4 w-4 mr-1" />
                    Join Meeting
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingInterviews;
