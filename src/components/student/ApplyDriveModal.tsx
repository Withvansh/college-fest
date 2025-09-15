import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Calendar, CheckCircle, MapPin, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

interface Drive {
  id: number;
  company: string;
  role: string;
  date: string;
  deadline: string;
  package: string;
  eligibility: string;
  status: string;
}

interface ApplyDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  drive: Drive | null;
}

const ApplyDriveModal = ({ isOpen, onClose, drive }: ApplyDriveModalProps) => {
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = async () => {
    if (!drive) return;

    setIsApplying(true);

    // Simulate API call
    setTimeout(() => {
      toast.success(`Successfully applied to ${drive.company} for ${drive.role} position!`);
      setIsApplying(false);
      onClose();
    }, 2000);
  };

  if (!drive) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-lg sm:text-xl">
            <Building2 className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-purple-600" />
            <span className="truncate">Apply to {drive.company}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg line-clamp-2">{drive.role}</CardTitle>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <Badge variant="secondary" className="bg-green-100 text-green-700 w-fit">
                  {drive.status}
                </Badge>
                <span className="text-base sm:text-lg font-bold text-green-600">
                  {drive.package}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Drive Date</p>
                    <p className="font-semibold">{drive.date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-red-500" />
                  <div>
                    <p className="text-sm text-gray-600">Application Deadline</p>
                    <p className="font-semibold text-red-600">{drive.deadline}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600">Eligibility Criteria</p>
                <p className="font-semibold">{drive.eligibility}</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Important Information:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Ensure your profile is complete before applying</li>
                  <li>• Upload your latest resume</li>
                  <li>• Check your email regularly for updates</li>
                  <li>• Be prepared for online assessments</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            disabled={isApplying}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isApplying ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Applying...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirm Application
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApplyDriveModal;
