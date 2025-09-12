import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { companyInviteAPI, CompanyInviteResponse } from '@/lib/api/CompanyInvite';

// Define interfaces based on the actual API response
interface College {
  _id: string;
  full_name: string;
  email: string;
  college_name: string;
  tpo_name: string;
  tpo_mobile: string;
  tpo_email: string;
  remainingCredits: number;
}

interface Drive {
  _id: string;
  college_id: College;
  recruiter_id: string;
  students: string[];
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  // These fields might be present in some cases
  companyName?: string;
  contactEmail?: string;
  job_role?: string;
  package?: string;
  location?: string;
  drive_date?: string;
}

function ManageDrives() {
  const navigate = useNavigate();
  const [drives, setDrives] = useState<Drive[]>([]);
  const [filteredDrives, setFilteredDrives] = useState<Drive[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<{[key: string]: string}>({});
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [collegeFilter, setCollegeFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [collegeOptions, setCollegeOptions] = useState<string[]>([]);

  useEffect(() => {
    fetchDrives();
  }, []);

  useEffect(() => {
    // Update filtered drives when drives or filters change
    filterDrives();
    
    // Extract unique college names for filter dropdown
    const colleges = Array.from(
      new Set(drives.map(drive => drive.college_id.college_name || drive.college_id.full_name))
    );
    setCollegeOptions(colleges);
  }, [drives, statusFilter, collegeFilter, dateFilter]);

  const fetchDrives = async () => {
    try {
      setLoading(true);
      // Get recruiter ID from localStorage
      const recruiterId = localStorage.getItem("user_id");
      if (!recruiterId) {
        setError('Recruiter ID not found. Please log in again.');
        setLoading(false);
        return;
      }
      
      const response: CompanyInviteResponse = await companyInviteAPI.getInvitesByRecruiter(recruiterId);
      
      if (response.success) {
        setDrives(response.data || []);
        // Initialize status for each drive
        const statusMap: {[key: string]: string} = {};
        response.data.forEach((drive: Drive) => {
          statusMap[drive._id] = drive.status;
        });
        setSelectedStatus(statusMap);
      } else {
        setError(response.message || 'Failed to fetch drives');
      }
    } catch (err) {
      setError('An error occurred while fetching drives');
      console.error('Error fetching drives:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterDrives = () => {
    let filtered = drives;

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(drive => drive.status === statusFilter);
    }

    // Apply college filter
    if (collegeFilter) {
      filtered = filtered.filter(drive => 
        (drive.college_id.college_name || drive.college_id.full_name).toLowerCase().includes(collegeFilter.toLowerCase())
      );
    }

    // Apply date filter
    if (dateFilter) {
      filtered = filtered.filter(drive => {
        const driveDate = new Date(drive.createdAt).toISOString().split('T')[0];
        return driveDate === dateFilter;
      });
    }

    setFilteredDrives(filtered);
  };

  const handleStatusUpdate = async (driveId: string, newStatus: string) => {
    try {
      const response: CompanyInviteResponse = await companyInviteAPI.updateInviteStatus(driveId, newStatus);
      
      if (response.success) {
        // Update the local state with the new status
        setDrives(prevDrives => 
          prevDrives.map(drive => 
            drive._id === driveId ? { ...drive, status: newStatus } : drive
          )
        );
        setSelectedStatus(prev => ({...prev, [driveId]: newStatus}));
      } else {
        setError(response.message || 'Failed to update drive status');
      }
    } catch (err) {
      setError('An error occurred while updating drive status');
      console.error('Error updating drive status:', err);
    }
  };

  const handleDeleteDrive = async (driveId: string) => {
    if (!window.confirm('Are you sure you want to delete this drive?')) return;
    
    try {
      const response: CompanyInviteResponse = await companyInviteAPI.deleteInvite(driveId);
      
      if (response.success) {
        // Remove the drive from the local state
        setDrives(prevDrives => prevDrives.filter(drive => drive._id !== driveId));
      } else {
        setError(response.message || 'Failed to delete drive');
      }
    } catch (err) {
      setError('An error occurred while deleting the drive');
      console.error('Error deleting drive:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const clearFilters = () => {
    setStatusFilter('all');
    setCollegeFilter('');
    setDateFilter('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-red-500 mb-4">{error}</div>
          <button 
            onClick={() => navigate(`/recuriter/dashboard/${localStorage.getItem("user_id")}`)}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Drives</h1>
          <button
             onClick={() => navigate(`/recruiter/dashboard/${localStorage.getItem("user_id")}`)}
            className="flex items-center px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Go Back
          </button>
        </div>

        {/* Filters Section */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="college-filter" className="block text-sm font-medium text-gray-700 mb-1">
                College
              </label>
              <select
                id="college-filter"
                value={collegeFilter}
                onChange={(e) => setCollegeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Colleges</option>
                {collegeOptions.map((college, index) => (
                  <option key={index} value={college}>
                    {college}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Created Date
              </label>
              <input
                type="date"
                id="date-filter"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {filteredDrives.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-500">No drives found.</p>
            {(statusFilter !== 'all' || collegeFilter || dateFilter) && (
              <button
                onClick={clearFilters}
                className="mt-2 px-4 py-2 text-blue-600 hover:text-blue-800"
              >
                Clear filters to see all drives
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      College
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      TPO Contact
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Message
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Students
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDrives.map((drive) => (
                    <tr key={drive._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {drive.college_id.college_name || drive.college_id.full_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {drive.college_id.email}
                        </div>
                        <div className="text-xs text-gray-400">
                          Credits: {drive.college_id.remainingCredits}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {drive.college_id.tpo_name || 'Not specified'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {drive.college_id.tpo_mobile}
                        </div>
                        <div className="text-sm text-gray-500">
                          {drive.college_id.tpo_email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {drive.message}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {drive.students?.length || 0} students
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(drive.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={selectedStatus[drive._id] || drive.status}
                          onChange={(e) => handleStatusUpdate(drive._id, e.target.value)}
                          className={`text-xs px-2 py-1 rounded-full ${getStatusColor(selectedStatus[drive._id] || drive.status)}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="accepted">Accepted</option>
                          <option value="rejected">Rejected</option>
                          <option value="completed">Completed</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                       
                        <button
                          onClick={() => navigate(`/recruiter/drive-details/${drive._id}`)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageDrives;