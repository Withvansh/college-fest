import React, { useEffect, useState } from "react";
import recruiterApi from "@/lib/api/recruiter-dashboard";
import {useNavigate } from 'react-router-dom';
// Define TypeScript interfaces
type ApplicationStatus = 
  | "applied"
  | "reviewed"
  | "shortlisted"
  | "interview_scheduled"
  | "interviewed"
  | "selected"
  | "rejected"
  | "withdrawn";

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
  interview_date?: Date;
  interview_notes?: string;
  rejection_reason?: string;
  notes?: string;
  applied_at?: Date;
  updated_at?: Date;
}

function AllApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showModal, setShowModal] = useState(false);
  const limit = 10;
const navigate = useNavigate();
  const recruiterId = localStorage.getItem("user_id");

  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await recruiterApi.getApplications(recruiterId, page, limit);
      setApplications(res.applications);
      setTotal(res.total);
    } catch (err) {
      console.error("Failed to load applications", err);
      setError("Failed to load applications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId: string, newStatus: ApplicationStatus) => {
    try {
      
      await recruiterApi.updateApplicationStatus(applicationId, newStatus);
      
      // Update local state
      setApplications(prev => prev.map(app => 
        app._id === applicationId ? { ...app, status: newStatus } : app
      ));
      
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
      applied: "bg-blue-100 text-blue-800 border border-blue-200",
      reviewed: "bg-purple-100 text-purple-800 border border-purple-200",
      shortlisted: "bg-amber-100 text-amber-800 border border-amber-200",
      interview_scheduled: "bg-indigo-100 text-indigo-800 border border-indigo-200",
      interviewed: "bg-teal-100 text-teal-800 border border-teal-200",
      selected: "bg-green-100 text-green-800 border border-green-200",
      rejected: "bg-red-100 text-red-800 border border-red-200",
      withdrawn: "bg-gray-100 text-gray-800 border border-gray-200",
    };
    
    const statusLabels: Record<ApplicationStatus, string> = {
      applied: "Applied",
      reviewed: "Reviewed",
      shortlisted: "Shortlisted",
      interview_scheduled: "Interview Scheduled",
      interviewed: "Interviewed",
      selected: "Selected",
      rejected: "Rejected",
      withdrawn: "Withdrawn",
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusClasses[status]}`}>
        {statusLabels[status]}
      </span>
    );
  };

  const formatDate = (dateString?: Date) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  if (loading && applications.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
 const goBack = () => {
    navigate(-1); // Go back to previous page
  };
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">All Applications</h2>
    <button 
          onClick={goBack}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Go Back
        </button>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
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
            onClick={fetchData}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied At
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((app) => (
                <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {typeof app.applicant_id !== "string" && app.applicant_id.profile_picture ? (
                          <img className="h-10 w-10 rounded-full" src={app.applicant_id.profile_picture} alt="" />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-600 font-medium">
                              {typeof app.applicant_id !== "string" 
                                ? app.applicant_id.full_name?.charAt(0).toUpperCase() 
                                : "A"}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {typeof app.applicant_id === "string" 
                            ? app.applicant_id 
                            : app.applicant_id.full_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {typeof app.applicant_id === "string" 
                            ? "N/A" 
                            : app.applicant_id.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {typeof app.job_id === "string"
                      ? app.job_id
                      : `${app.job_id?.title || ""} @ ${app.job_id?.company_name || ""}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(app.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(app.applied_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => viewApplicationDetails(app)}
                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50 transition-colors"
                        title="View Details"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app._id, e.target.value as ApplicationStatus)}
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

      {applications.length === 0 && !loading && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-6 py-5 rounded-lg mt-6">
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>No applications found.</span>
          </div>
        </div>
      )}

      {/* Pagination */}
      {total > limit && (
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {page} of {Math.ceil(total / limit) || 1}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page * limit >= total}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 flex items-center"
          >
            Next
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* Application Detail Modal */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50 px-4">
          <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-auto max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">Application Details</h3>
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
                  {typeof selectedApplication.applicant_id !== "string" && selectedApplication.applicant_id.profile_picture ? (
                    <img className="h-16 w-16 rounded-full" src={selectedApplication.applicant_id.profile_picture} alt="" />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-600 font-medium text-xl">
                        {typeof selectedApplication.applicant_id !== "string" 
                          ? selectedApplication.applicant_id.full_name?.charAt(0).toUpperCase() 
                          : "A"}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {typeof selectedApplication.applicant_id === "string" 
                      ? selectedApplication.applicant_id 
                      : selectedApplication.applicant_id.full_name}
                  </h2>
                  <p className="text-gray-600">
                    {typeof selectedApplication.applicant_id === "string" 
                      ? "N/A" 
                      : selectedApplication.applicant_id.email}
                  </p>
                  {typeof selectedApplication.applicant_id !== "string" && selectedApplication.applicant_id.phone && (
                    <p className="text-gray-600">{selectedApplication.applicant_id.phone}</p>
                  )}
                </div>
                <div className="ml-4">
                  {getStatusBadge(selectedApplication.status)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">Application Details</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium text-gray-700">Applied on:</span> {formatDate(selectedApplication.applied_at)}</p>
                    <p><span className="font-medium text-gray-700">Last updated:</span> {formatDate(selectedApplication.updated_at)}</p>
                    {selectedApplication.expected_salary && (
                      <p><span className="font-medium text-gray-700">Expected salary:</span> ₹{selectedApplication.expected_salary.toLocaleString()}</p>
                    )}
                    {selectedApplication.test_score && (
                      <p><span className="font-medium text-gray-700">Test score:</span> {selectedApplication.test_score}%</p>
                    )}
                    {selectedApplication.interview_score && (
                      <p><span className="font-medium text-gray-700">Interview score:</span> {selectedApplication.interview_score}%</p>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">Job Details</h4>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium text-gray-700">Position:</span>{" "}
                      {typeof selectedApplication.job_id === "string" 
                        ? selectedApplication.job_id 
                        : selectedApplication.job_id.title}
                    </p>
                    <p>
                      <span className="font-medium text-gray-700">Company:</span>{" "}
                      {typeof selectedApplication.job_id === "string" 
                        ? "N/A" 
                        : selectedApplication.job_id.company_name}
                    </p>
                  </div>
                </div>
              </div>

              {selectedApplication.cover_letter && (
                <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">Cover Letter</h4>
                  <div className="p-4 rounded border bg-white">
                    <p className="whitespace-pre-line text-gray-700">{selectedApplication.cover_letter}</p>
                  </div>
                </div>
              )}

              {selectedApplication.interview_date && (
                <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">Interview Details</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium text-gray-700">Scheduled for:</span> {formatDate(selectedApplication.interview_date)}</p>
                    {selectedApplication.interview_notes && (
                      <div className="mt-3">
                        <span className="font-medium text-gray-700">Interview Notes:</span>
                        <div className="bg-white p-4 rounded border mt-1">
                          <p className="whitespace-pre-line text-gray-700">{selectedApplication.interview_notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedApplication.rejection_reason && (
                <div className="mb-6 bg-red-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">Rejection Reason</h4>
                  <div className="p-4 rounded border bg-white">
                    <p className="whitespace-pre-line text-gray-700">{selectedApplication.rejection_reason}</p>
                  </div>
                </div>
              )}

              {selectedApplication.notes && (
                <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">Additional Notes</h4>
                  <div className="p-4 rounded border bg-white">
                    <p className="whitespace-pre-line text-gray-700">{selectedApplication.notes}</p>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center mt-6 pt-4 border-t">
                <select
                  value={selectedApplication.status}
                  onChange={(e) => handleStatusChange(selectedApplication._id, e.target.value as ApplicationStatus)}
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
    </div>
  );
}

export default AllApplications;