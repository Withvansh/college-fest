import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import JobPostForm from '@/components/jobs/JobPostForm';

const PostJob = () => {
  const navigate = useNavigate();

  const handleJobPostSuccess = () => {
    console.log('Job posted successfully, navigating back to dashboard');
    // Trigger dashboard refresh via localStorage
    localStorage.setItem('refresh-dashboard', 'true');
    // Navigate back to dashboard after successful job posting
    setTimeout(() => {
      navigate('/recruiter/dashboard');
    }, 2000); // Give time for the success message to show
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 md:mb-8">
          <Link
            to="/recruiter/dashboard"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 text-sm md:text-base"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Post a New Job</h1>
          <p className="text-gray-600 mt-2 text-sm md:text-base">
            Create a job posting to attract the best candidates
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <JobPostForm onSuccess={handleJobPostSuccess} />
        </div>
      </div>
    </div>
  );
};

export default PostJob;
