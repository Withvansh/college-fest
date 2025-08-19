
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Edit, X, Users, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JobPost {
  id: string;
  title: string;
  postedOn: string;
  applicants: number;
  status: 'Open' | 'Closed';
  location: string;
  type: string;
}

const JobPostListCard = () => {
  const { toast } = useToast();
  const [sortBy, setSortBy] = useState('newest');
  
  const [jobPosts] = useState<JobPost[]>([
    {
      id: '1',
      title: 'Senior Frontend Developer',
      postedOn: '2024-01-15',
      applicants: 45,
      status: 'Open',
      location: 'Remote',
      type: 'Full-time'
    },
    {
      id: '2',
      title: 'Product Manager',
      postedOn: '2024-01-10',
      applicants: 32,
      status: 'Open',
      location: 'New York',
      type: 'Full-time'
    },
    {
      id: '3',
      title: 'UX Designer',
      postedOn: '2024-01-08',
      applicants: 28,
      status: 'Closed',
      location: 'San Francisco',
      type: 'Contract'
    },
    {
      id: '4',
      title: 'Backend Engineer',
      postedOn: '2024-01-05',
      applicants: 51,
      status: 'Open',
      location: 'Remote',
      type: 'Full-time'
    }
  ]);

  const sortedJobs = [...jobPosts].sort((a, b) => {
    switch (sortBy) {
      case 'most-applicants':
        return b.applicants - a.applicants;
      case 'least-applicants':
        return a.applicants - b.applicants;
      case 'oldest':
        return new Date(a.postedOn).getTime() - new Date(b.postedOn).getTime();
      case 'newest':
      default:
        return new Date(b.postedOn).getTime() - new Date(a.postedOn).getTime();
    }
  });

  const handleViewApplicants = (jobId: string, jobTitle: string) => {
    toast({
      title: "Viewing Applicants",
      description: `Opening applicants for ${jobTitle}`,
    });
  };

  const handleEditJob = (jobId: string, jobTitle: string) => {
    toast({
      title: "Edit Job",
      description: `Editing ${jobTitle}`,
    });
  };

  const handleCloseJob = (jobId: string, jobTitle: string) => {
    toast({
      title: "Job Closed",
      description: `${jobTitle} has been closed`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-lg">Active Job Posts</CardTitle>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="most-applicants">Most Applicants</SelectItem>
              <SelectItem value="least-applicants">Least Applicants</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedJobs.map((job) => (
            <div key={job.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg">{job.title}</h3>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Posted: {new Date(job.postedOn).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {job.applicants} applicants
                    </span>
                    <span>{job.location}</span>
                    <span>{job.type}</span>
                  </div>
                </div>
                <Badge variant={job.status === 'Open' ? 'default' : 'secondary'}>
                  {job.status}
                </Badge>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleViewApplicants(job.id, job.title)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View Applicants
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleEditJob(job.id, job.title)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit Job
                </Button>
                {job.status === 'Open' && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleCloseJob(job.id, job.title)}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Close Job
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

export default JobPostListCard;
