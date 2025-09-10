import React, { useState, useEffect } from 'react';
import axios from '../../lib/utils/axios';
import { useNavigate } from 'react-router-dom';

// Define TypeScript interfaces based on the provided schema
type JobType = 'full_time' | 'part_time' | 'contract' | 'internship' | 'freelance';
type JobStatus = 'draft' | 'active' | 'paused' | 'closed' | 'expired';

interface IJob {
  _id: string;
  title: string;
  description: string;
  requirements: string;
  company_name: string;
  location: string;
  job_type: JobType;
  employment_type?: string;
  min_salary?: number;
  max_salary?: number;
  currency?: string;
  experience_required?: number;
  experience_level?: string;
  skills_required?: string[];
  education_requirements?: string[];
  certifications_required?: string[];
  benefits?: string[];
  department?: string;
  job_category?: string;
  travel_required?: string;
  urgency_level?: string;
  remote_allowed?: boolean;
  application_deadline?: Date;
  recruiter_id?: string;
  company_id?: string;
  hiring_manager_id?: string;
  status?: JobStatus;
  budget_min?: number;
  budget_max?: number;
  created_at?: Date;
  updated_at?: Date;
}

// Main component to display all job postings
const JobPostings: React.FC = () => {
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState<any>({});
  const limit = 10;
  const navigate = useNavigate();

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [jobTypeFilter, setJobTypeFilter] = useState<string>('');
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [companyNameFilter, setCompanyNameFilter] = useState<string>('');
  const [titleFilter, setTitleFilter] = useState<string>('');
  const [experienceLevelFilter, setExperienceLevelFilter] = useState<string>('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('');
  const [remoteAllowedFilter, setRemoteAllowedFilter] = useState<string>('');

  useEffect(() => {
    fetchJobs();
  }, [
    page,
    statusFilter,
    jobTypeFilter,
    locationFilter,
    companyNameFilter,
    titleFilter,
    experienceLevelFilter,
    departmentFilter,
    remoteAllowedFilter,
  ]);

  useEffect(() => {
    setPage(1); // Reset to first page when filters change
  }, [
    statusFilter,
    jobTypeFilter,
    locationFilter,
    companyNameFilter,
    titleFilter,
    experienceLevelFilter,
    departmentFilter,
    remoteAllowedFilter,
  ]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      const recruiterId = localStorage.getItem('user_id');
      if (!recruiterId) {
        setError('Recruiter ID not found. Please log in again.');
        setLoading(false);
        return;
      }

      const filters = {
        status: statusFilter,
        job_type: jobTypeFilter,
        location: locationFilter,
        company_name: companyNameFilter,
        title: titleFilter,
        experience_level: experienceLevelFilter,
        department: departmentFilter,
        remote_allowed:
          remoteAllowedFilter === 'true'
            ? true
            : remoteAllowedFilter === 'false'
              ? false
              : undefined,
      };

      const response = await axios.get(
        `/jobs/recruiter/${recruiterId}?page=${page}&limit=${limit}`,
        {
          params: filters,
        }
      );

      const data = response.data.data || response.data;
      setJobs(data.data || data || []);
      setTotal(data.total || 0);
      setPagination(data.pagination || {});
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch job postings');
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleJobClick = (jobId: string) => {
    navigate(`/recruiter/jobs/${jobId}`);
  };

  const goBack = () => {
    navigate(-1); // Go back to previous page
  };

  const formatDate = (dateString?: Date) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (status?: JobStatus) => {
    if (!status) return null;

    const statusClasses: Record<JobStatus, string> = {
      draft: 'bg-gray-100 text-gray-800 border border-gray-300',
      active: 'bg-green-100 text-green-800 border border-green-300',
      paused: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
      closed: 'bg-red-100 text-red-800 border border-red-300',
      expired: 'bg-purple-100 text-purple-800 border border-purple-300',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getJobTypeDisplay = (type: JobType) => {
    const typeMap: Record<JobType, string> = {
      full_time: 'Full Time',
      part_time: 'Part Time',
      contract: 'Contract',
      internship: 'Internship',
      freelance: 'Freelance',
    };
    return typeMap[type] || type;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={goBack}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Go Back
        </button>

        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          <div className="flex items-start">
            <svg
              className="w-6 h-6 mr-3 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h3 className="font-bold">Error</h3>
              <p className="mt-1">{error}</p>
            </div>
          </div>
          <button
            onClick={fetchJobs}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <button
          onClick={goBack}
          className="flex items-center text-blue-600 hover:text-blue-800 mr-4 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Your Job Postings</h1>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="closed">Closed</option>
              <option value="expired">Expired</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
            <select
              value={jobTypeFilter}
              onChange={e => setJobTypeFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Types</option>
              <option value="full_time">Full Time</option>
              <option value="part_time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
              <option value="freelance">Freelance</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              value={locationFilter}
              onChange={e => setLocationFilter(e.target.value)}
              placeholder="Search by location"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
            <input
              type="text"
              value={companyNameFilter}
              onChange={e => setCompanyNameFilter(e.target.value)}
              placeholder="Search by company"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
            <input
              type="text"
              value={titleFilter}
              onChange={e => setTitleFilter(e.target.value)}
              placeholder="Search by title"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
            <input
              type="text"
              value={experienceLevelFilter}
              onChange={e => setExperienceLevelFilter(e.target.value)}
              placeholder="e.g., junior, senior"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <input
              type="text"
              value={departmentFilter}
              onChange={e => setDepartmentFilter(e.target.value)}
              placeholder="Search by department"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Remote Work</label>
            <select
              value={remoteAllowedFilter}
              onChange={e => setRemoteAllowedFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All</option>
              <option value="true">Remote Only</option>
              <option value="false">On-site Only</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => {
              setStatusFilter('');
              setJobTypeFilter('');
              setLocationFilter('');
              setCompanyNameFilter('');
              setTitleFilter('');
              setExperienceLevelFilter('');
              setDepartmentFilter('');
              setRemoteAllowedFilter('');
              setPage(1);
            }}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>
      {/* Results Summary */}
      {!loading && !error && (
        <div className="mb-4 text-sm text-gray-600">
          Showing {jobs.length} of {total} job postings
        </div>
      )}

      {jobs.length === 0 && !loading ? (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-6 py-5 rounded-lg">
          <div className="flex items-center">
            <svg
              className="w-6 h-6 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="font-medium">No job postings found</p>
              <p className="text-sm mt-1">
                {Object.values({
                  statusFilter,
                  jobTypeFilter,
                  locationFilter,
                  companyNameFilter,
                  titleFilter,
                  experienceLevelFilter,
                  departmentFilter,
                  remoteAllowedFilter,
                }).some(v => v)
                  ? 'Try adjusting your filters to see more results.'
                  : "You haven't posted any jobs yet. Create your first job posting to get started."}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map(job => (
            <div
              key={job._id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer transform hover:-translate-y-1"
              onClick={() => handleJobClick(job._id)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 line-clamp-2">{job.title}</h2>
                  {getStatusBadge(job.status)}
                </div>

                <div className="flex items-center text-gray-600 mb-3">
                  <svg
                    className="w-4 h-4 mr-1.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <span className="text-sm">{job.company_name}</span>
                </div>

                <div className="flex items-center text-gray-600 mb-4">
                  <svg
                    className="w-4 h-4 mr-1.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-sm">{job.location}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full">
                    {getJobTypeDisplay(job.job_type)}
                  </span>
                  {job.remote_allowed && (
                    <span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full">
                      Remote
                    </span>
                  )}
                  {job.experience_required && (
                    <span className="bg-purple-100 text-purple-700 text-xs font-medium px-3 py-1.5 rounded-full">
                      {job.experience_required}+ years
                    </span>
                  )}
                </div>

                <p className="text-gray-600 text-sm mb-5 line-clamp-3">{job.description}</p>

                <div className="flex justify-between items-center text-xs text-gray-500 pt-4 border-t border-gray-100">
                  <div className="flex items-center">
                    <svg
                      className="w-3.5 h-3.5 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>Posted: {formatDate(job.created_at)}</span>
                  </div>

                  {job.application_deadline && (
                    <div className="flex items-center">
                      <svg
                        className="w-3.5 h-3.5 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>Deadline: {formatDate(job.application_deadline)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-between items-center mt-8 mb-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={!pagination.hasPrev}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 flex items-center hover:bg-gray-300 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={!pagination.hasNext}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 flex items-center hover:bg-gray-300 transition-colors"
          >
            Next
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default JobPostings;
