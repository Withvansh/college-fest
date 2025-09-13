import React, { useState, useEffect } from 'react';
import axios from '../../lib/utils/axios';
import {
  Search,
  Filter,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Building,
  Calendar,
  MapPin,
  DollarSign,
  User,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Download,
  Eye,
  ArrowLeft,
} from 'lucide-react';
import { Link } from 'react-router-dom';

function ManageCollegeInvite() {
  const [invites, setInvites] = useState([]);
  const [filteredInvites, setFilteredInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'ascending' });
  const [selectedInvite, setSelectedInvite] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  // Fetch invites on component mount
  useEffect(() => {
    fetchInvites();
  }, []);

  // Filter and sort invites when search term, status filter, or sort config changes
  useEffect(() => {
    let result = invites;

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        invite =>
          invite.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (invite.job_role && invite.job_role.toLowerCase().includes(searchTerm.toLowerCase())) ||
          invite.contactEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(invite => invite.status === statusFilter);
    }

    // Apply sorting
    if (sortConfig.key) {
      result = [...result].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredInvites(result);
  }, [invites, searchTerm, statusFilter, sortConfig]);

  const fetchInvites = async () => {
    try {
      setLoading(true);
      // Replace with actual college ID
      const collegeId = localStorage.getItem('user_id');
      const response = await axios.get(`/company-invite/college/${collegeId}`);
      if (response.data.success) {
        // Map API response to match component expectations
        const mappedInvites = response.data.data.map(invite => ({
          _id: invite._id,
          companyName: invite.recruiter_id?.company_name || 'Unknown Company',
          contactEmail: invite.recruiter_id?.email || '',
          job_role: 'Not specified', // This field doesn't exist in the API response
          package: 'Not specified', // This field doesn't exist in the API response
          location: invite.recruiter_id?.location || 'Not specified',
          drive_date: new Date().toISOString(), // This field doesn't exist in the API response
          status: invite.status,
          message: invite.message,
          students: invite.students,
          createdAt: invite.createdAt,
          updatedAt: invite.updatedAt,
          // Include original data for reference
          originalData: invite,
        }));
        setInvites(mappedInvites);
      } else {
        setError('Failed to fetch invites');
      }
    } catch (err) {
      setError('Error fetching invites. Please try again.');
      console.error('Error fetching invites:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = key => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      setActionLoading(true);
      const response = await axios.put(`/company-invite/invite/${id}/status`, { status });
      if (response.data.success) {
        setInvites(invites.map(invite => (invite._id === id ? { ...invite, status } : invite)));
        setActionSuccess(`Status updated to ${status}`);
        setTimeout(() => setActionSuccess(''), 3000);
      } else {
        setError('Failed to update status');
      }
    } catch (err) {
      setError('Error updating status. Please try again.');
      console.error('Error updating status:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this invite?')) return;

    try {
      setActionLoading(true);
      const response = await axios.delete(`/company-invite/invite/${id}`);
      if (response.data.success) {
        // Remove from local state
        setInvites(invites.filter(invite => invite._id !== id));
        setActionSuccess('Invite deleted successfully');
        setTimeout(() => setActionSuccess(''), 3000);
      } else {
        setError('Failed to delete invite');
      }
    } catch (err) {
      setError('Error deleting invite. Please try again.');
      console.error('Error deleting invite:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const viewInviteDetails = invite => {
    setSelectedInvite(invite);
    setIsModalOpen(true);
  };

  const getStatusIcon = status => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = status => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-3 sm:p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 sm:mt-4 text-gray-600 text-sm sm:text-base">Loading invites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                Manage College Invites
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
                Manage company invites for your college
              </p>
            </div>
            <Link to={'/college/companies'}>
              <div className="flex items-center gap-1.5 sm:gap-2 bg-white hover:bg-gray-50 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg shadow-sm border transition-colors w-fit">
                <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                <p className="text-xs sm:text-sm font-medium hidden xs:inline">Go back</p>
                <p className="text-xs sm:text-sm font-medium xs:hidden">Back</p>
              </div>
            </Link>
          </div>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded mb-3 sm:mb-4 lg:mb-6 text-sm sm:text-base">
            {error}
          </div>
        )}

        {actionSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-3 sm:px-4 py-2 sm:py-3 rounded mb-3 sm:mb-4 lg:mb-6 text-sm sm:text-base">
            {actionSuccess}
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6 mb-3 sm:mb-4 lg:mb-6">
          <div className="flex flex-col gap-2.5 sm:gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search companies, roles, emails..."
                className="pl-8 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-2.5 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base h-10 sm:h-auto"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 lg:gap-4">
              <div className="flex items-center flex-1 sm:flex-initial">
                <Filter className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-600 mr-1.5 sm:mr-2 hidden sm:inline">
                  Status:
                </span>
                <select
                  className="border border-gray-300 rounded-lg px-2.5 sm:px-3 py-2.5 sm:py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-auto text-sm sm:text-base h-10 sm:h-auto"
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <button
                onClick={fetchInvites}
                className="flex items-center justify-center gap-1.5 sm:gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 sm:px-4 py-2.5 sm:py-2 rounded-lg transition-colors w-full sm:w-auto text-sm sm:text-base h-10 sm:h-auto"
              >
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Invites Table/Cards */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('companyName')}
                  >
                    <div className="flex items-center">
                      Company
                      {sortConfig.key === 'companyName' &&
                        (sortConfig.direction === 'ascending' ? (
                          <ChevronUp className="w-4 h-4 ml-1" />
                        ) : (
                          <ChevronDown className="w-4 h-4 ml-1" />
                        ))}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center">
                      Invited On
                      {sortConfig.key === 'createdAt' &&
                        (sortConfig.direction === 'ascending' ? (
                          <ChevronUp className="w-4 h-4 ml-1" />
                        ) : (
                          <ChevronDown className="w-4 h-4 ml-1" />
                        ))}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvites.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      No invites found
                    </td>
                  </tr>
                ) : (
                  filteredInvites.map(invite => (
                    <tr key={invite._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Building className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {invite.companyName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {invite.originalData.recruiter_id?.full_name || 'Unknown Recruiter'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <Mail className="w-4 h-4 mr-1" />
                          {invite.contactEmail}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {invite.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(invite.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invite.status)}`}
                        >
                          {getStatusIcon(invite.status)}
                          <span className="ml-1 capitalize">{invite.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => viewInviteDetails(invite)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          {invite.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(invite._id, 'accepted')}
                                className="text-green-600 hover:text-green-900"
                                title="Accept"
                                disabled={actionLoading}
                              >
                                <CheckCircle className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(invite._id, 'rejected')}
                                className="text-red-600 hover:text-red-900"
                                title="Reject"
                                disabled={actionLoading}
                              >
                                <XCircle className="w-5 h-5" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDelete(invite._id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                            disabled={actionLoading}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden">
            {filteredInvites.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No invites found</div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredInvites.map(invite => (
                  <div key={invite._id} className="p-4 sm:p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Building className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-base font-medium text-gray-900">
                            {invite.companyName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {invite.originalData.recruiter_id?.full_name || 'Unknown Recruiter'}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invite.status)}`}
                      >
                        {getStatusIcon(invite.status)}
                        <span className="ml-1 capitalize">{invite.status}</span>
                      </span>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      <div>
                        <div className="text-gray-500 text-xs uppercase tracking-wide">
                          Contact Email
                        </div>
                        <div className="text-sm text-gray-900 flex items-start mt-1">
                          <Mail className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                          <span className="break-all">{invite.contactEmail}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs uppercase tracking-wide">
                          Location
                        </div>
                        <div className="text-sm text-gray-900 flex items-center mt-1">
                          <MapPin className="w-4 h-4 mr-1" />
                          {invite.location}
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <div className="text-gray-500 text-xs uppercase tracking-wide">
                          Invited On
                        </div>
                        <div className="text-sm text-gray-900 flex items-center mt-1">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(invite.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => viewInviteDetails(invite)}
                        className="flex-1 sm:flex-none bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </button>
                      {invite.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(invite._id, 'accepted')}
                            className="flex-1 sm:flex-none bg-green-50 hover:bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center"
                            disabled={actionLoading}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Accept
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(invite._id, 'rejected')}
                            className="flex-1 sm:flex-none bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center"
                            disabled={actionLoading}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(invite._id)}
                        className="bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm font-medium flex items-center"
                        disabled={actionLoading}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Invite Detail Modal */}
        {isModalOpen && selectedInvite && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Invite Details</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              <div className="px-4 sm:px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-1 md:col-span-2">
                    <h4 className="text-md font-medium text-gray-900 mb-2">Company Information</h4>
                    <div className="flex items-center mb-4">
                      <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Building className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-lg font-medium text-gray-900">
                          {selectedInvite.companyName}
                        </div>
                        <div className="text-sm text-gray-500">
                          Contact:{' '}
                          {selectedInvite.originalData.recruiter_id?.full_name || 'Unknown'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contact Email</label>
                    <p className="mt-1 text-sm text-gray-900 flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      <span className="break-all">{selectedInvite.contactEmail}</span>
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedInvite.originalData.recruiter_id?.phone || 'Not specified'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <p className="mt-1 text-sm text-gray-900 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {selectedInvite.location}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Website</label>
                    <p className="mt-1 text-sm text-gray-900 break-all">
                      {selectedInvite.originalData.recruiter_id?.company_website || 'Not specified'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Invited On</label>
                    <p className="mt-1 text-sm text-gray-900 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(selectedInvite.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <p className="mt-1">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedInvite.status)}`}
                      >
                        {getStatusIcon(selectedInvite.status)}
                        <span className="ml-1 capitalize">{selectedInvite.status}</span>
                      </span>
                    </p>
                  </div>

                  {selectedInvite.message && (
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Message</label>
                      <p className="mt-1 text-sm text-gray-900 break-words">
                        {selectedInvite.message}
                      </p>
                    </div>
                  )}

                  {selectedInvite.students && selectedInvite.students.length > 0 && (
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Targeted Students
                      </label>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {selectedInvite.students.map((student, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            <User className="w-3 h-3 mr-1" />
                            {student}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Close
                </button>
                {selectedInvite.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedInvite._id, 'accepted');
                        setIsModalOpen(false);
                      }}
                      className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Accept
                    </button>
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedInvite._id, 'rejected');
                        setIsModalOpen(false);
                      }}
                      className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center justify-center"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageCollegeInvite;
