
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, DollarSign, Clock, User } from "lucide-react";
import { toast } from "sonner";

interface Gig {
  id: string;
  title: string;
  description: string;
  budget_min: number;
  budget_max: number;
  duration_days: number;
  skills_required?: string[];
  project_type: string;
}

interface SubmitProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  gig: Gig | null;
}

const SubmitProposalModal = ({ isOpen, onClose, gig }: SubmitProposalModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [proposalData, setProposalData] = useState({
    coverLetter: '',
    proposedAmount: '',
    deliveryDays: ''
  });

  const handleSubmit = async () => {
    if (!gig) return;
    
    if (!proposalData.coverLetter || !proposalData.proposedAmount || !proposalData.deliveryDays) {
      toast.error('Please fill in all required fields');
      return;
    }

    const amount = parseInt(proposalData.proposedAmount);
    if (amount < gig.budget_min || amount > gig.budget_max) {
      toast.error(`Proposed amount must be between ₹${gig.budget_min} and ₹${gig.budget_max}`);
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success(`Proposal submitted successfully for ${gig.title}!`);
      setIsSubmitting(false);
      setProposalData({ coverLetter: '', proposedAmount: '', deliveryDays: '' });
      onClose();
    }, 2000);
  };

  if (!gig) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Send className="h-6 w-6 mr-2 text-purple-600" />
            Submit Proposal
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Gig Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{gig.title}</CardTitle>
              <div className="flex items-center space-x-4 text-gray-600">
                <span className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  ${gig.budget_min?.toLocaleString()} - ${gig.budget_max?.toLocaleString()}
                </span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {gig.duration_days} days
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-3 line-clamp-3">{gig.description}</p>
              {gig.skills_required && (
                <div className="flex flex-wrap gap-2">
                  {gig.skills_required.slice(0, 5).map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {gig.skills_required.length > 5 && (
                    <Badge variant="outline" className="text-xs">
                      +{gig.skills_required.length - 5} more
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Proposal Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Letter *
              </label>
              <Textarea
                value={proposalData.coverLetter}
                onChange={(e) => setProposalData({...proposalData, coverLetter: e.target.value})}
                placeholder="Explain why you're the perfect fit for this project. Highlight your relevant experience, skills, and approach..."
                rows={6}
                className="resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Tip: Personalize your proposal by addressing the specific requirements mentioned in the gig description.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proposed Amount (₹) *
                </label>
                <Input
                  type="number"
                  value={proposalData.proposedAmount}
                  onChange={(e) => setProposalData({...proposalData, proposedAmount: e.target.value})}
                  placeholder={`${gig.budget_min} - ${gig.budget_max}`}
                  min={gig.budget_min}
                  max={gig.budget_max}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Budget range: ${gig.budget_min?.toLocaleString()} - ${gig.budget_max?.toLocaleString()}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Time (days) *
                </label>
                <Input
                  type="number"
                  value={proposalData.deliveryDays}
                  onChange={(e) => setProposalData({...proposalData, deliveryDays: e.target.value})}
                  placeholder={`Max ${gig.duration_days} days`}
                  max={gig.duration_days}
                  min={1}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Maximum allowed: {gig.duration_days} days
                </p>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Proposal Tips:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Be specific about your approach and methodology</li>
                <li>• Mention relevant experience and portfolio items</li>
                <li>• Ask clarifying questions if needed</li>
                <li>• Be realistic with your timeline and budget</li>
              </ul>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Proposal
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubmitProposalModal;
