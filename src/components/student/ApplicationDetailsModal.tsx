import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Calendar, FileText, TrendingUp, MapPin, Users } from 'lucide-react';

interface Application {
  id: number;
  company: string;
  role: string;
  appliedDate: string;
  status: string;
  testScore: string;
  nextRound: string;
}

interface ApplicationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application | null;
}

const ApplicationDetailsModal = ({
  isOpen,
  onClose,
  application,
}: ApplicationDetailsModalProps) => {
  if (!application) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto mx-4">
        <DialogHeader>
          <DialogTitle className="flex items-center text-lg sm:text-xl">
            <Building2 className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-purple-600" />
            <span className="truncate">{application.company} - Application Details</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Application Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="line-clamp-2">{application.role}</span>
                <Badge
                  variant={application.status === 'Selected' ? 'secondary' : 'outline'}
                  className={`${application.status === 'Selected' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'} w-fit`}
                >
                  {application.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <p className="text-sm text-gray-600">Applied Date</p>
                  <p className="font-semibold">{application.appliedDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Test Score</p>
                  <p className="font-semibold text-purple-600">{application.testScore}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Next Round</p>
                  <p className="font-semibold">{application.nextRound}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Company Size</p>
                  <p className="font-semibold">10,000+ employees</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Industry</p>
                  <p className="font-semibold">Technology</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-semibold">Bangalore, India</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Work Mode</p>
                  <p className="font-semibold">Hybrid</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Job Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-2">Responsibilities:</h4>
                  <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
                    <li>Develop and maintain web applications using modern technologies</li>
                    <li>
                      Collaborate with cross-functional teams to deliver high-quality software
                    </li>
                    <li>Participate in code reviews and maintain coding standards</li>
                    <li>Debug and resolve technical issues</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Required Skills:</h4>
                  <div className="flex flex-wrap gap-2">
                    {['React.js', 'Node.js', 'JavaScript', 'TypeScript', 'MongoDB', 'AWS'].map(
                      skill => (
                        <Badge key={skill} variant="outline">
                          {skill}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selection Process */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Selection Process
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    ✓
                  </div>
                  <div>
                    <p className="font-semibold">Application Submitted</p>
                    <p className="text-sm text-gray-600">Completed on {application.appliedDate}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    ✓
                  </div>
                  <div>
                    <p className="font-semibold">Online Assessment</p>
                    <p className="text-sm text-gray-600">Score: {application.testScore}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    →
                  </div>
                  <div>
                    <p className="font-semibold">{application.nextRound}</p>
                    <p className="text-sm text-gray-600">Upcoming round</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationDetailsModal;
