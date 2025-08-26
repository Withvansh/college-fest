import React, { useState, useEffect } from 'react';
import axios from '../../lib/utils/axios';
import { useParams, useNavigate } from 'react-router-dom';

// Define TypeScript interfaces based on the provided schema
type ApplicationStatus = 
  | "applied"
  | "reviewed"
  | "shortlisted"
  | "interview_scheduled"
  | "interviewed"
  | "selected"
  | "rejected"
  | "withdrawn";

interface IApplicant {
  _id: string;
  job_id: string;
  applicant_id: {
    _id: string;
   full_name: string;
    email: string;
    phone?: string;
    profile_picture?: string;
  };
  status: ApplicationStatus;
  cover_letter?: string;
  resume_url?: string;
  portfolio_url?: string;
  expected_salary?: number;
  test_score?: number;
  interview_score?: number;
  interview_date?: Date;
  interview_notes?: string;
  rejection_reason?: string;
  notes?: string;
  applied_at?: Date;
  updated_at?: Date;
}

interface IJob {
  _id: string;
  title: string;
  company_name: string;
}

const JobApplicants: React.FC = () => {
  const [applicants, setApplicants] = useState<IApplicant[]>([]);
  const [job, setJob] = useState<IJob | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplicant, setSelectedApplicant] = useState<IApplicant | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchJobAndApplicants(id);
    }
  }, [id]);

  const goBack = () => {
    navigate(-1); // Go back to previous page
  };

  const fetchJobAndApplicants = async (jobId: string) => {
    try {
      setLoading(true);
      
      // Fetch job details
      const jobResponse = await axios.get(`/jobs/${jobId}`);
      setJob(jobResponse.data.data);
      
      // Fetch applicants for this job
      const applicantsResponse = await axios.get(`/job-applications/job/${jobId}`);
      setApplicants(applicantsResponse.data.data || applicantsResponse.data);
    } catch (err) {
      setError('Failed to fetch job applicants');
      console.error('Error fetching job applicants:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId: string, newStatus: ApplicationStatus) => {
    try {
      await axios.patch(`/job-applications/${applicationId}/status`, { status: newStatus });
      
      // Update local state
      setApplicants(prev => prev.map(app => 
        app._id === applicationId ? { ...app, status: newStatus } : app
      ));
      
      // If we have a selected applicant open, update that too
      if (selectedApplicant && selectedApplicant._id === applicationId) {
        setSelectedApplicant({ ...selectedApplicant, status: newStatus });
      }
    } catch (err) {
      console.error('Error updating application status:', err);
      alert('Failed to update application status');
    }
  };

  const viewApplicantDetails = (applicant: IApplicant) => {
    setSelectedApplicant(applicant);
    setShowModal(true);
  };

  const formatDate = (dateString?: Date) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
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
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClasses[status]}`}>
        {statusLabels[status]}
      </span>
    );
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
      <div className="max-w-6xl mx-auto px-4 py-8">
        <button 
          onClick={goBack}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Go Back
        </button>
        
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          <div className="flex items-start">
            <svg className="w-6 h-6 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-bold">Error</h3>
              <p className="mt-1">{error}</p>
            </div>
          </div>
          <button 
            onClick={() => id && fetchJobAndApplicants(id)}
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
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Applicants for {job?.title}</h1>
          <p className="text-gray-600 mt-1">{job?.company_name}</p>
        </div>
        <div className="ml-auto bg-blue-50 text-blue-700 px-4 py-2 rounded-md">
          <span className="font-semibold">{applicants.length}</span> applicant{applicants.length !== 1 ? 's' : ''}
        </div>
      </div>
      
      {applicants.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-6 py-5 rounded-lg">
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>No applicants have applied for this job yet.</span>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applicant
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied On
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expected Salary
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applicants.map((applicant) => (
                    <tr key={applicant._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {applicant.applicant_id.profile_picture ? (
                              <img className="h-10 w-10 rounded-full" src={applicant.applicant_id.profile_picture} alt="" />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-600 font-medium">
                                  {applicant.applicant_id?.full_name?.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{applicant.applicant_id.full_name}</div>
                            <div className="text-sm text-gray-500">{applicant.applicant_id.email}</div>
                            {applicant.applicant_id.phone && (
                              <div className="text-sm text-gray-500">{applicant.applicant_id.phone}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(applicant.applied_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(applicant.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {applicant.expected_salary ? `₹${applicant.expected_salary.toLocaleString()}` : 'Not specified'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => viewApplicantDetails(applicant)}
                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50 transition-colors"
                            title="View Details"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <select
                            value={applicant.status}
                            onChange={(e) => handleStatusChange(applicant._id, e.target.value as ApplicationStatus)}
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

          {/* Applicant Detail Modal */}
          {showModal && selectedApplicant && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50 px-4">
              <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-auto max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-800">Applicant Details</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600 rounded-full p-1 hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="flex items-start mb-6">
                    <div className="flex-shrink-0 h-16 w-16 mr-4">
                      {selectedApplicant.applicant_id.profile_picture ? (
                        <img className="h-16 w-16 rounded-full" src={selectedApplicant.applicant_id.profile_picture} alt="" />
                      ) : (
                        <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-600 font-medium text-xl">
                            {selectedApplicant.applicant_id.full_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <h2 className="text-2xl font-bold text-gray-800">{selectedApplicant.applicant_id.full_name}</h2>
                      <p className="text-gray-600">{selectedApplicant.applicant_id.email}</p>
                      {selectedApplicant.applicant_id.phone && (
                        <p className="text-gray-600">{selectedApplicant.applicant_id.phone}</p>
                      )}
                    </div>
                    <div className="ml-4">
                      {getStatusBadge(selectedApplicant.status)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">Application Details</h4>
                      <div className="space-y-2">
                        <p><span className="font-medium text-gray-700">Applied on:</span> {formatDate(selectedApplicant.applied_at)}</p>
                        <p><span className="font-medium text-gray-700">Last updated:</span> {formatDate(selectedApplicant.updated_at)}</p>
                        {selectedApplicant.expected_salary && (
                          <p><span className="font-medium text-gray-700">Expected salary:</span> ₹{selectedApplicant.expected_salary.toLocaleString()}</p>
                        )}
                        {selectedApplicant.test_score && (
                          <p><span className="font-medium text-gray-700">Test score:</span> {selectedApplicant.test_score}%</p>
                        )}
                        {selectedApplicant.interview_score && (
                          <p><span className="font-medium text-gray-700">Interview score:</span> {selectedApplicant.interview_score}%</p>
                        )}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">Documents & Links</h4>
                      <div className="space-y-2">
                        {selectedApplicant.resume_url && (
                          <p>
                            <span className="font-medium text-gray-700">Resume:</span>{' '}
                            <a href={selectedApplicant.resume_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center">
                              View Resume
                              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          </p>
                        )}
                        {selectedApplicant.portfolio_url && (
                          <p>
                            <span className="font-medium text-gray-700">Portfolio:</span>{' '}
                            <a href={selectedApplicant.portfolio_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center">
                              View Portfolio
                              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {selectedApplicant.cover_letter && (
                    <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">Cover Letter</h4>
                      <div className="p-4 rounded border bg-white">
                        <p className="whitespace-pre-line text-gray-700">{selectedApplicant.cover_letter}</p>
                      </div>
                    </div>
                  )}

                  {selectedApplicant.interview_date && (
                    <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">Interview Details</h4>
                      <div className="space-y-2">
                        <p><span className="font-medium text-gray-700">Scheduled for:</span> {formatDate(selectedApplicant.interview_date)}</p>
                        {selectedApplicant.interview_notes && (
                          <div className="mt-3">
                            <span className="font-medium text-gray-700">Interview Notes:</span>
                            <div className="bg-white p-4 rounded border mt-1">
                              <p className="whitespace-pre-line text-gray-700">{selectedApplicant.interview_notes}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedApplicant.rejection_reason && (
                    <div className="mb-6 bg-red-50 p-4 rounded-lg">
                      <h4 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">Rejection Reason</h4>
                      <div className="p-4 rounded border bg-white">
                        <p className="whitespace-pre-line text-gray-700">{selectedApplicant.rejection_reason}</p>
                      </div>
                    </div>
                  )}

                  {selectedApplicant.notes && (
                    <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">Additional Notes</h4>
                      <div className="p-4 rounded border bg-white">
                        <p className="whitespace-pre-line text-gray-700">{selectedApplicant.notes}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-6 pt-4 border-t">
                    <select
                      value={selectedApplicant.status}
                      onChange={(e) => handleStatusChange(selectedApplicant._id, e.target.value as ApplicationStatus)}
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
                    
                    <button
                      onClick={() => setShowModal(false)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default JobApplicants;