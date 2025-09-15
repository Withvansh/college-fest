import React, { useEffect, useState } from 'react';
import recruiterApi from '@/lib/api/recruiter-dashboard';
import { useNavigate } from 'react-router-dom';
// Define TypeScript interfaces
type ApplicationStatus =
  | 'applied'
  | 'reviewed'
  | 'shortlisted'
  | 'interview_scheduled'
  | 'interviewed'
  | 'selected'
  | 'rejected'
  | 'withdrawn';

interface Applicant {
  _id: string;
  full_name: string;
  email: string;
  phone?: string;
  profile_picture?: string;
}

interface Job {
  _id: string;
  title: string;
  company_name: string;
}

interface Application {
  _id: string;
  job_id: string | Job;
  applicant_id: string | Applicant;
  status: ApplicationStatus;
  cover_letter?: string;
  resume_url?: string;
  portfolio_url?: string;
  expected_salary?: number;
  test_score?: number;
  interview_score?: number;
  interview_date?: string | Date;
  interview_notes?: string;
  rejection_reason?: string;
  notes?: string;
  applied_at?: string | Date;
  updated_at?: string | Date;
}

function AllApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [pagination, setPagination] = useState<any>({});
  const limit = 10;
  const navigate = useNavigate();
  const recruiterId = localStorage.getItem('user_id');

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [jobTitleFilter, setJobTitleFilter] = useState<string>('');
  const [applicantNameFilter, setApplicantNameFilter] = useState<string>('');
  const [companyNameFilter, setCompanyNameFilter] = useState<string>('');
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [jobTypeFilter, setJobTypeFilter] = useState<string>('');

  // Filter visibility state for mobile
  const [filtersVisible, setFiltersVisible] = useState<boolean>(false);

  useEffect(() => {
    if (!recruiterId) {
      setError('Recruiter ID not found. Please log in again.');
      setLoading(false);
      return;
    }
    fetchData();
  }, [
    page,
    statusFilter,
    jobTitleFilter,
    applicantNameFilter,
    companyNameFilter,
    locationFilter,
    jobTypeFilter,
  ]);

  useEffect(() => {
    setPage(1); // Reset to first page when filters change
  }, [
    statusFilter,
    jobTitleFilter,
    applicantNameFilter,
    companyNameFilter,
    locationFilter,
    jobTypeFilter,
  ]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const filters = {
        status: statusFilter,
        jobTitle: jobTitleFilter,
        applicantName: applicantNameFilter,
        companyName: companyNameFilter,
        location: locationFilter,
        jobType: jobTypeFilter,
      };
      const res = await recruiterApi.getApplications(recruiterId, page, limit, filters);

      setApplications(res.applications);

      setTotal(res.total);
      setPagination(res.pagination);
    } catch (err) {
      console.error('Failed to load applications', err);
      setError('Failed to load applications. Please try again.');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId: string, newStatus: ApplicationStatus) => {
    try {
      await recruiterApi.updateApplicationStatus(applicationId, newStatus);

      // Update local state
      setApplications(prev =>
        prev.map(app => (app._id === applicationId ? { ...app, status: newStatus } : app))
      );

      // If we have a selected application open, update that too
      if (selectedApplication && selectedApplication._id === applicationId) {
        setSelectedApplication({ ...selectedApplication, status: newStatus });
      }
    } catch (err) {
      console.error('Error updating application status:', err);
      alert('Failed to update application status');
    }
  };

  const viewApplicationDetails = (application: Application) => {
    setSelectedApplication(application);
    setShowModal(true);
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    const statusClasses: Record<ApplicationStatus, string> = {
      applied: 'bg-blue-100 text-blue-800 border border-blue-200',
      reviewed: 'bg-purple-100 text-purple-800 border border-purple-200',
      shortlisted: 'bg-amber-100 text-amber-800 border border-amber-200',
      interview_scheduled: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
      interviewed: 'bg-teal-100 text-teal-800 border border-teal-200',
      selected: 'bg-green-100 text-green-800 border border-green-200',
      rejected: 'bg-red-100 text-red-800 border border-red-200',
      withdrawn: 'bg-gray-100 text-gray-800 border border-gray-200',
    };

    const statusLabels: Record<ApplicationStatus, string> = {
      applied: 'Applied',
      reviewed: 'Reviewed',
      shortlisted: 'Shortlisted',
      interview_scheduled: 'Interview Scheduled',
      interviewed: 'Interviewed',
      selected: 'Selected',
      rejected: 'Rejected',
      withdrawn: 'Withdrawn',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusClasses[status]}`}>
        {statusLabels[status]}
      </span>
    );
  };

  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return '-';
    try {
      const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
      return date.toLocaleDateString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return '-';
    }
  };

  if (loading && applications.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  const goBack = () => {
    navigate(-1);
  };
  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Responsive Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center">
            <button
              onClick={goBack}
              className="flex items-center text-blue-600 hover:text-blue-800 mr-3 sm:mr-4 transition-colors text-sm md:text-base"
            >
              <svg
                className="w-4 h-4 md:w-5 md:h-5"
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
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
              All Applications
            </h2>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow-md rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
          {/* Mobile Filter Toggle */}
          <div className="sm:hidden">
            <button
              onClick={() => setFiltersVisible(!filtersVisible)}
              className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
            >
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                <span className="font-medium text-gray-800">Filters</span>
                {Object.values({
                  statusFilter,
                  jobTitleFilter,
                  applicantNameFilter,
                  companyNameFilter,
                  locationFilter,
                  jobTypeFilter,
                }).some(v => v) && (
                  <span className="ml-2 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                    Active
                  </span>
                )}
              </div>
              <svg
                className={`w-5 h-5 text-gray-600 transform transition-transform ${filtersVisible ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>

          {/* Desktop Filter Header */}
          <div className="hidden sm:block">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800">
              Filters
            </h3>
          </div>

          {/* Filter Content */}
          <div
            className={`sm:block ${filtersVisible ? 'block' : 'hidden'} transition-all duration-300 ease-in-out`}
          >
            <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={e => {
                    setStatusFilter(e.target.value);
                    if (window.innerWidth < 640) setFiltersVisible(false); // Auto-close on mobile
                  }}
                  className="w-full border border-gray-300 rounded-md px-2 sm:px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="applied">Applied</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="interview_scheduled">Interview Scheduled</option>
                  <option value="interviewed">Interviewed</option>
                  <option value="selected">Selected</option>
                  <option value="rejected">Rejected</option>
                  <option value="withdrawn">Withdrawn</option>
                </select>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  value={jobTitleFilter}
                  onChange={e => setJobTitleFilter(e.target.value)}
                  placeholder="Search by job title"
                  className="w-full border border-gray-300 rounded-md px-2 sm:px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Applicant Name
                </label>
                <input
                  type="text"
                  value={applicantNameFilter}
                  onChange={e => setApplicantNameFilter(e.target.value)}
                  placeholder="Search by applicant name"
                  className="w-full border border-gray-300 rounded-md px-2 sm:px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  value={companyNameFilter}
                  onChange={e => setCompanyNameFilter(e.target.value)}
                  placeholder="Search by company name"
                  className="w-full border border-gray-300 rounded-md px-2 sm:px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={locationFilter}
                  onChange={e => setLocationFilter(e.target.value)}
                  placeholder="Search by location"
                  className="w-full border border-gray-300 rounded-md px-2 sm:px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Job Type
                </label>
                <select
                  value={jobTypeFilter}
                  onChange={e => setJobTypeFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-2 sm:px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="full_time">Full Time</option>
                  <option value="part_time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:gap-4">
              <button
                onClick={() => {
                  setStatusFilter('');
                  setJobTitleFilter('');
                  setApplicantNameFilter('');
                  setCompanyNameFilter('');
                  setLocationFilter('');
                  setJobTypeFilter('');
                  setPage(1);
                  setFiltersVisible(false); // Close filters on mobile after clearing
                }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors text-sm flex-1 sm:flex-none"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 sm:px-6 py-4 rounded-lg mb-4 sm:mb-6">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 mr-3 flex-shrink-0 mt-0.5"
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
                <h3 className="font-bold text-base sm:text-lg">Error</h3>
                <p className="mt-1 text-sm sm:text-base">{error}</p>
              </div>
            </div>
            <button
              onClick={fetchData}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors text-sm sm:text-base"
            >
              Try Again
            </button>
          </div>
        )}

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Mobile Card Layout */}
          <div className="block md:hidden">
            {Array.isArray(applications) && applications.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {applications.map(app => (
                  <div key={app._id} className="p-4 sm:p-5 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center flex-1 min-w-0">
                        <div className="flex-shrink-0 h-12 w-12 sm:h-14 sm:w-14 mr-3 sm:mr-4">
                          {typeof app.applicant_id !== 'string' &&
                          app.applicant_id.profile_picture ? (
                            <img
                              className="h-12 w-12 sm:h-14 sm:w-14 rounded-full object-cover"
                              src={app.applicant_id.profile_picture}
                              alt=""
                            />
                          ) : (
                            <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-600 font-medium text-lg sm:text-xl">
                                {typeof app.applicant_id !== 'string'
                                  ? app.applicant_id.full_name?.charAt(0).toUpperCase()
                                  : 'A'}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                            {typeof app.applicant_id === 'string'
                              ? app.applicant_id
                              : app.applicant_id.full_name}
                          </h3>
                          <p className="text-sm sm:text-base text-gray-500 truncate">
                            {typeof app.applicant_id === 'string' ? 'N/A' : app.applicant_id.email}
                          </p>
                          {typeof app.applicant_id !== 'string' && app.applicant_id.phone && (
                            <p className="text-sm text-gray-400 mt-1">
                              📞 {app.applicant_id.phone}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="ml-3 flex-shrink-0">{getStatusBadge(app.status)}</div>
                    </div>

                    <div className="mb-4 space-y-2">
                      <p className="text-sm sm:text-base text-gray-600">
                        <span className="font-medium text-gray-900">Job:</span>{' '}
                        <span className="text-gray-700">
                          {typeof app.job_id === 'string'
                            ? app.job_id
                            : `${app.job_id?.title || ''} @ ${app.job_id?.company_name || ''}`}
                        </span>
                      </p>
                      <p className="text-sm sm:text-base text-gray-600">
                        <span className="font-medium text-gray-900">Applied:</span>{' '}
                        <span className="text-gray-700">{formatDate(app.applied_at)}</span>
                      </p>
                      {app.expected_salary && (
                        <p className="text-sm text-green-600">
                          💰 Expected: ₹{app.expected_salary.toLocaleString()}
                        </p>
                      )}
                      {app.test_score && (
                        <p className="text-sm text-blue-600">📊 Test Score: {app.test_score}%</p>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">
                      <button
                        onClick={() => viewApplicationDetails(app)}
                        className="flex items-center justify-center text-indigo-600 hover:text-indigo-900 p-3 sm:p-2 rounded-lg sm:rounded-full hover:bg-indigo-50 transition-colors touch-manipulation border border-indigo-200 sm:border-0"
                        title="View Details"
                      >
                        <svg
                          className="w-5 h-5 sm:w-5 sm:h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        <span className="ml-2 font-medium sm:hidden">View Details</span>
                      </button>
                      <select
                        value={app.status}
                        onChange={e =>
                          handleStatusChange(app._id, e.target.value as ApplicationStatus)
                        }
                        className="text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="applied">Applied</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="interview_scheduled">Interview Scheduled</option>
                        <option value="interviewed">Interviewed</option>
                        <option value="selected">Selected</option>
                        <option value="rejected">Rejected</option>
                        <option value="withdrawn">Withdrawn</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 sm:p-12 text-center">
                <svg
                  className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-gray-500 text-base sm:text-lg mb-2">No applications found.</p>
                <p className="text-sm sm:text-base text-gray-400 mb-4">
                  Try adjusting your filters or check back later for new applications.
                </p>
              </div>
            )}
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Applicant
                    </th>
                    <th
                      scope="col"
                      className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Job
                    </th>
                    <th
                      scope="col"
                      className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Applied At
                    </th>
                    <th
                      scope="col"
                      className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Array.isArray(applications) &&
                    applications.map(app => (
                      <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {typeof app.applicant_id !== 'string' &&
                              app.applicant_id.profile_picture ? (
                                <img
                                  className="h-10 w-10 rounded-full object-cover"
                                  src={app.applicant_id.profile_picture}
                                  alt=""
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  <span className="text-gray-600 font-medium text-sm">
                                    {typeof app.applicant_id !== 'string'
                                      ? app.applicant_id.full_name?.charAt(0).toUpperCase()
                                      : 'A'}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="ml-4 min-w-0 flex-1">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {typeof app.applicant_id === 'string'
                                  ? app.applicant_id
                                  : app.applicant_id.full_name}
                              </div>
                              <div className="text-sm text-gray-500 truncate">
                                {typeof app.applicant_id === 'string'
                                  ? 'N/A'
                                  : app.applicant_id.email}
                              </div>
                              {typeof app.applicant_id !== 'string' && app.applicant_id.phone && (
                                <div className="text-xs text-gray-400 mt-1">
                                  📞 {app.applicant_id.phone}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 max-w-xs">
                            <div className="font-medium truncate">
                              {typeof app.job_id === 'string'
                                ? app.job_id
                                : app.job_id?.title || 'N/A'}
                            </div>
                            <div className="text-gray-500 truncate">
                              {typeof app.job_id === 'string' ? '' : app.job_id?.company_name || ''}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(app.status)}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(app.applied_at)}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => viewApplicationDetails(app)}
                              className="text-indigo-600 hover:text-indigo-900 p-1.5 rounded-full hover:bg-indigo-50 transition-colors"
                              title="View Details"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                            </button>
                            <select
                              value={app.status}
                              onChange={e =>
                                handleStatusChange(app._id, e.target.value as ApplicationStatus)
                              }
                              className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="applied">Applied</option>
                              <option value="reviewed">Reviewed</option>
                              <option value="shortlisted">Shortlisted</option>
                              <option value="interview_scheduled">Interview Scheduled</option>
                              <option value="interviewed">Interviewed</option>
                              <option value="selected">Selected</option>
                              <option value="rejected">Rejected</option>
                              <option value="withdrawn">Withdrawn</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {applications.length === 0 && !loading && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 sm:px-6 py-4 sm:py-5 rounded-lg mt-4 sm:mt-6">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 mr-3 flex-shrink-0"
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
              <span className="text-sm sm:text-base">No applications found.</span>
            </div>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-4 sm:px-6 py-4 bg-white border-t border-gray-200">
            <div className="text-sm text-gray-700 text-center sm:text-left">
              Page {pagination.page} of {pagination.totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={!pagination.hasPrev}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span className="hidden sm:inline ml-1">Previous</span>
              </button>

              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.page >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        pagination.page === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setPage(p => p + 1)}
                disabled={!pagination.hasNext}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                <span className="hidden sm:inline mr-1">Next</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Application Detail Modal */}
        {showModal && selectedApplication && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl w-full mx-auto max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex justify-between items-center rounded-t-lg">
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 pr-2 sm:pr-4 truncate">
                  Application Details
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 rounded-full p-1.5 sm:p-1 hover:bg-gray-100 transition-colors flex-shrink-0"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="p-3 sm:p-4 md:p-6">
                {/* Profile Section */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start mb-4 sm:mb-6 gap-3 sm:gap-4">
                  <div className="flex-shrink-0 h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20">
                    {typeof selectedApplication.applicant_id !== 'string' &&
                    selectedApplication.applicant_id.profile_picture ? (
                      <img
                        className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 rounded-full object-cover"
                        src={selectedApplication.applicant_id.profile_picture}
                        alt=""
                      />
                    ) : (
                      <div className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-600 font-medium text-lg sm:text-xl md:text-2xl">
                          {typeof selectedApplication.applicant_id !== 'string'
                            ? selectedApplication.applicant_id.full_name?.charAt(0).toUpperCase()
                            : 'A'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-grow text-center sm:text-left min-w-0">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 truncate">
                      {typeof selectedApplication.applicant_id === 'string'
                        ? selectedApplication.applicant_id
                        : selectedApplication.applicant_id.full_name}
                    </h2>
                    <p className="text-gray-600 text-xs sm:text-sm md:text-base truncate">
                      {typeof selectedApplication.applicant_id === 'string'
                        ? 'N/A'
                        : selectedApplication.applicant_id.email}
                    </p>
                    {typeof selectedApplication.applicant_id !== 'string' &&
                      selectedApplication.applicant_id.phone && (
                        <p className="text-gray-600 text-xs sm:text-sm md:text-base truncate">
                          {selectedApplication.applicant_id.phone}
                        </p>
                      )}
                  </div>
                  <div className="flex-shrink-0 mt-2 sm:mt-0">
                    {getStatusBadge(selectedApplication.status)}
                  </div>
                </div>
                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3 text-gray-800 border-b pb-1 sm:pb-2">
                      Application Details
                    </h4>
                    <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm md:text-base">
                      <p>
                        <span className="font-medium text-gray-700">Applied on:</span>{' '}
                        <span className="text-gray-600">
                          {formatDate(selectedApplication.applied_at)}
                        </span>
                      </p>
                      <p>
                        <span className="font-medium text-gray-700">Last updated:</span>{' '}
                        <span className="text-gray-600">
                          {formatDate(selectedApplication.updated_at)}
                        </span>
                      </p>
                      {selectedApplication.expected_salary && (
                        <p>
                          <span className="font-medium text-gray-700">Expected salary:</span>{' '}
                          <span className="text-gray-600">
                            ₹{selectedApplication.expected_salary.toLocaleString()}
                          </span>
                        </p>
                      )}
                      {selectedApplication.test_score && (
                        <p>
                          <span className="font-medium text-gray-700">Test score:</span>{' '}
                          <span className="text-gray-600">{selectedApplication.test_score}%</span>
                        </p>
                      )}
                      {selectedApplication.interview_score && (
                        <p>
                          <span className="font-medium text-gray-700">Interview score:</span>{' '}
                          <span className="text-gray-600">
                            {selectedApplication.interview_score}%
                          </span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3 text-gray-800 border-b pb-1 sm:pb-2">
                      Job Details
                    </h4>
                    <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm md:text-base">
                      <p>
                        <span className="font-medium text-gray-700">Position:</span>{' '}
                        <span className="text-gray-600 truncate block">
                          {typeof selectedApplication.job_id === 'string'
                            ? selectedApplication.job_id
                            : selectedApplication.job_id.title}
                        </span>
                      </p>
                      <p>
                        <span className="font-medium text-gray-700">Company:</span>{' '}
                        <span className="text-gray-600 truncate block">
                          {typeof selectedApplication.job_id === 'string'
                            ? 'N/A'
                            : selectedApplication.job_id.company_name}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>{' '}
                {/* Additional Sections */}
                {selectedApplication.cover_letter && (
                  <div className="mb-3 sm:mb-4 md:mb-6 bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3 text-gray-800 border-b pb-1 sm:pb-2">
                      Cover Letter
                    </h4>
                    <div className="p-2 sm:p-3 md:p-4 rounded border bg-white max-h-32 sm:max-h-40 md:max-h-48 overflow-y-auto">
                      <p className="whitespace-pre-line text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed">
                        {selectedApplication.cover_letter}
                      </p>
                    </div>
                  </div>
                )}
                {selectedApplication.interview_date && (
                  <div className="mb-3 sm:mb-4 md:mb-6 bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3 text-gray-800 border-b pb-1 sm:pb-2">
                      Interview Details
                    </h4>
                    <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm md:text-base">
                      <p>
                        <span className="font-medium text-gray-700">Scheduled for:</span>{' '}
                        <span className="text-gray-600">
                          {formatDate(selectedApplication.interview_date)}
                        </span>
                      </p>
                      {selectedApplication.interview_notes && (
                        <div className="mt-2 sm:mt-3">
                          <span className="font-medium text-gray-700 block mb-1">
                            Interview Notes:
                          </span>
                          <div className="bg-white p-2 sm:p-3 md:p-4 rounded border max-h-24 sm:max-h-32 md:max-h-40 overflow-y-auto">
                            <p className="whitespace-pre-line text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed">
                              {selectedApplication.interview_notes}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {selectedApplication.rejection_reason && (
                  <div className="mb-3 sm:mb-4 md:mb-6 bg-red-50 p-3 sm:p-4 rounded-lg">
                    <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3 text-gray-800 border-b pb-1 sm:pb-2">
                      Rejection Reason
                    </h4>
                    <div className="p-2 sm:p-3 md:p-4 rounded border bg-white max-h-24 sm:max-h-32 md:max-h-40 overflow-y-auto">
                      <p className="whitespace-pre-line text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed">
                        {selectedApplication.rejection_reason}
                      </p>
                    </div>
                  </div>
                )}
                {selectedApplication.notes && (
                  <div className="mb-3 sm:mb-4 md:mb-6 bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3 text-gray-800 border-b pb-1 sm:pb-2">
                      Additional Notes
                    </h4>
                    <div className="p-2 sm:p-3 md:p-4 rounded border bg-white max-h-24 sm:max-h-32 md:max-h-40 overflow-y-auto">
                      <p className="whitespace-pre-line text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed">
                        {selectedApplication.notes}
                      </p>
                    </div>
                  </div>
                )}
                {/* Action Buttons */}
                <div className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center mt-4 sm:mt-6 pt-3 sm:pt-4 border-t gap-3 sm:gap-4">
                  <div className="w-full sm:w-auto">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2 sm:hidden">
                      Update Status:
                    </label>
                    <select
                      value={selectedApplication.status}
                      onChange={e =>
                        handleStatusChange(
                          selectedApplication._id,
                          e.target.value as ApplicationStatus
                        )
                      }
                      className="w-full sm:w-auto text-xs sm:text-sm border border-gray-300 rounded-md px-2 sm:px-3 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      <option value="applied">Applied</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="interview_scheduled">Interview Scheduled</option>
                      <option value="interviewed">Interviewed</option>
                      <option value="selected">Selected</option>
                      <option value="rejected">Rejected</option>
                      <option value="withdrawn">Withdrawn</option>
                    </select>
                  </div>

                  <button
                    onClick={() => setShowModal(false)}
                    className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2.5 sm:py-2 px-4 sm:px-6 rounded-md transition-colors text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AllApplications;
