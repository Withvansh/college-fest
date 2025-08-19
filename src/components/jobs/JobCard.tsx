import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bookmark, MapPin, Clock, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Job {
  id: string;
  title: string;
  company_name: string;
  location: string;
  job_type: string;
  min_salary?: number;
  max_salary?: number;
  description: string;
  skills_required?: string[];
  created_at: string;
  remote_allowed?: boolean;
}

interface JobCardProps {
  job: Job;
  onBookmark?: (jobId: string) => void;
}

const JobCard = ({ job, onBookmark }: JobCardProps) => {
  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const posted = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }
  };

  const getCompanyInitials = (company: string) => {
    return company.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="bg-white rounded-lg border border-border p-4 hover:bg-job-tag-bg/30 transition-colors cursor-pointer group">
      <div className="flex items-start justify-between">
        {/* Left Content */}
        <div className="flex items-start space-x-4 flex-1">
          {/* Company Logo */}
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-primary font-medium text-sm">
              {getCompanyInitials(job.company_name)}
            </span>
          </div>

          {/* Job Details */}
          <div className="flex-1 min-w-0">
            {/* Job Title & Company */}
            <div className="mb-2">
              <h3 className="font-semibold text-job-text-primary text-base mb-1 group-hover:text-primary transition-colors">
                {job.title}
              </h3>
              <p className="text-sm text-job-text-secondary">{job.company_name}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="secondary" className="bg-job-tag-bg text-job-text-secondary text-xs px-2 py-1">
                {job.job_type.replace('_', ' ')}
              </Badge>
              {job.remote_allowed && (
                <Badge variant="secondary" className="bg-job-tag-bg text-job-text-secondary text-xs px-2 py-1">
                  Remote
                </Badge>
              )}
              {job.skills_required?.slice(0, 2).map((skill, index) => (
                <Badge key={index} variant="secondary" className="bg-job-tag-bg text-job-text-secondary text-xs px-2 py-1">
                  {skill}
                </Badge>
              ))}
            </div>

            {/* Location & Time */}
            <div className="flex items-center justify-between text-sm text-job-text-secondary">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{getTimeAgo(job.created_at)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-start space-x-2 ml-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onBookmark?.(job.id)}
            className="h-8 w-8 hover:bg-job-tag-bg"
          >
            <Bookmark className="h-4 w-4 text-job-text-secondary hover:text-job-text-primary" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;