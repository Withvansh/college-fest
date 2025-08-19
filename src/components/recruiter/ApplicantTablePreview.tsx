
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Eye, Calendar, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Applicant {
  id: string;
  name: string;
  appliedFor: string;
  resumeUrl: string;
  status: 'New' | 'Reviewed' | 'Shortlisted' | 'Rejected';
  appliedDate: string;
  email: string;
  phone: string;
}

const ApplicantTablePreview = () => {
  const { toast } = useToast();
  
  const [applicants] = useState<Applicant[]>([
    {
      id: '1',
      name: 'John Smith',
      appliedFor: 'Senior Frontend Developer',
      resumeUrl: '/resume1.pdf',
      status: 'New',
      appliedDate: '2024-01-16',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      appliedFor: 'Product Manager',
      resumeUrl: '/resume2.pdf',
      status: 'Reviewed',
      appliedDate: '2024-01-15',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 234-5678'
    },
    {
      id: '3',
      name: 'Mike Chen',
      appliedFor: 'Backend Engineer',
      resumeUrl: '/resume3.pdf',
      status: 'Shortlisted',
      appliedDate: '2024-01-14',
      email: 'mike.chen@email.com',
      phone: '+1 (555) 345-6789'
    },
    {
      id: '4',
      name: 'Emily Davis',
      appliedFor: 'UX Designer',
      resumeUrl: '/resume4.pdf',
      status: 'New',
      appliedDate: '2024-01-13',
      email: 'emily.davis@email.com',
      phone: '+1 (555) 456-7890'
    },
    {
      id: '5',
      name: 'Alex Rodriguez',
      appliedFor: 'Senior Frontend Developer',
      resumeUrl: '/resume5.pdf',
      status: 'Reviewed',
      appliedDate: '2024-01-12',
      email: 'alex.rodriguez@email.com',
      phone: '+1 (555) 567-8901'
    }
  ]);

  const handleDownloadResume = (applicantName: string, resumeUrl: string) => {
    toast({
      title: "Downloading Resume",
      description: `Downloading ${applicantName}'s resume`,
    });
  };

  const handleViewProfile = (applicantId: string, applicantName: string) => {
    toast({
      title: "Viewing Profile",
      description: `Opening ${applicantName}'s profile`,
    });
  };

  const handleScheduleInterview = (applicantId: string, applicantName: string) => {
    toast({
      title: "Schedule Interview",
      description: `Scheduling interview with ${applicantName}`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Reviewed': return 'bg-yellow-100 text-yellow-800';
      case 'Shortlisted': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-lg">Recent Applicants</CardTitle>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            View All Applications
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Applied For</TableHead>
                <TableHead>Resume</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applicants.map((applicant) => (
                <TableRow key={applicant.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{applicant.name}</div>
                      <div className="text-sm text-gray-500">{applicant.email}</div>
                      <div className="text-xs text-gray-400">
                        Applied: {new Date(applicant.appliedDate).toLocaleDateString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{applicant.appliedFor}</div>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDownloadResume(applicant.name, applicant.resumeUrl)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(applicant.status)}>
                      {applicant.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewProfile(applicant.id, applicant.name)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Profile
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleScheduleInterview(applicant.id, applicant.name)}
                      >
                        <Calendar className="h-4 w-4 mr-1" />
                        Interview
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicantTablePreview;
