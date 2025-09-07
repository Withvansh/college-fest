import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Bookmark,
  MapPin,
  Clock,
  DollarSign,
  Building2,
  Briefcase,
  Star,
  Zap,
  Users,
  ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { type Job } from '@/services/jobsService';

interface JobCardProps {
  job: Job;
  onBookmark?: (jobId: string) => void;
}

const JobCard = ({ job, onBookmark }: JobCardProps) => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const posted = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just posted';
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const formatSalary = (min?: number, max?: number, currency = 'INR') => {
    if (!min && !max) return null;
    const symbol = currency === 'USD' ? '$' : '₹';
    if (min && max) {
      return `${symbol}${min.toLocaleString()}-${max.toLocaleString()}`;
    }
    if (min) return `${symbol}${min.toLocaleString()}+`;
    if (max) return `Up to ${symbol}${max.toLocaleString()}`;
  };

  const getJobTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'full_time':
      case 'full-time':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'part_time':
      case 'part-time':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'contract':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'internship':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getExperienceColor = (level?: string) => {
    switch (level?.toLowerCase()) {
      case 'entry':
        return 'bg-emerald-100 text-emerald-700';
      case 'mid':
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700';
      case 'senior':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  // Simple heuristic: jobs posted in last 3 days are considered urgent
  const isUrgent = new Date(job.created_at) > new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
  const isNew = new Date(job.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000);

  const getCompanyInitials = (company: string) => {
    return company
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    onBookmark?.(job._id);
  };

  const handleNavigate = () => {
    navigate(`/jobs/${job._id}`);
  };

  return (
    <Card
      className={`
        group relative overflow-hidden border-0 shadow-sm hover:shadow-xl 
        transition-all duration-300 cursor-pointer
        bg-gradient-to-br from-white to-gray-50/30
        hover:from-white hover:to-blue-50/40
        ${isUrgent ? 'ring-2 ring-red-200 bg-gradient-to-br from-red-50/30 to-white' : ''}
      `}
      onClick={handleNavigate}
    >
      {/* Status Indicators */}
      <div className="absolute top-4 right-4 flex gap-2">
        {isNew && (
          <Badge className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 text-xs font-medium animate-pulse">
            <Star className="w-3 h-3 mr-1" />
            New
          </Badge>
        )}
        {isUrgent && (
          <Badge className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-xs font-medium animate-pulse">
            <Zap className="w-3 h-3 mr-1" />
            Urgent
          </Badge>
        )}
      </div>

      <div className="p-6">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            {/* Company Avatar */}
            <Avatar className="h-12 w-12 border-2 border-white shadow-md">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm">
                {getCompanyInitials(job.company)}
              </AvatarFallback>
            </Avatar>

            {/* Job Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {job.title}
                </h3>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className="text-sm text-gray-600 font-medium">{job.company}</span>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{job.location}</span>
                  {job.remote_work && (
                    <Badge
                      variant="outline"
                      className="ml-2 px-2 py-0.5 text-xs bg-green-50 text-green-700 border-green-200"
                    >
                      Remote
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 flex-shrink-0" />
                  <span>{getTimeAgo(job.created_at)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bookmark Button */}
          {/* <Button
            variant="ghost"
            size="sm"
            onClick={handleBookmark}
            className={`
              h-9 w-9 rounded-full transition-all duration-200
              ${
                isBookmarked
                  ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
              }
            `}
          >
            <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </Button> */}
        </div>

        {/* Tags Section */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge
            variant="outline"
            className={`capitalize text-xs font-medium ${getJobTypeColor(job.job_type)}`}
          >
            <Briefcase className="w-3 h-3 mr-1" />
            {job.job_type.replace(/_/g, ' ')}
          </Badge>

          {job.experience_level && (
            <Badge
              variant="outline"
              className={`text-xs font-medium ${getExperienceColor(job.experience_level)}`}
            >
              <Users className="w-3 h-3 mr-1" />
              {job.experience_level} Level
            </Badge>
          )}

          {job.skills_required?.slice(0, isMobile ? 2 : 3).map((skill, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              {skill}
            </Badge>
          ))}

          {job.skills_required && job.skills_required.length > (isMobile ? 2 : 3) && (
            <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
              +{job.skills_required.length - (isMobile ? 2 : 3)} more
            </Badge>
          )}
        </div>

        {/* Footer Section */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {/* Salary */}
          <div className="flex items-center gap-1">
            {formatSalary(
              job.salary_range?.min,
              job.salary_range?.max,
              job.salary_range?.currency
            ) ? (
              <>
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="font-semibold text-green-600 text-sm">
                  {formatSalary(
                    job.salary_range?.min,
                    job.salary_range?.max,
                    job.salary_range?.currency
                  )}
                </span>
                <span className="text-xs text-gray-500">per year</span>
              </>
            ) : (
              <span className="text-sm text-gray-500">Salary negotiable</span>
            )}
          </div>

          {/* View Details */}
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-all duration-200 group/button"
          >
            <span className="text-sm font-medium">View Details</span>
            <ArrowRight className="w-4 h-4 ml-1 group-hover/button:translate-x-0.5 transition-transform duration-200" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default JobCard;
