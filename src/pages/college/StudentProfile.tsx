import { Button } from '@/components/ui/button';
import studentAPI from '@/lib/api/student';
import { ArrowLeft } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Define the student interface based on the actual API response
interface IStudent {
  _id: string;
  full_name: string;
  email: string;
  enrollment_no: string;
  course: string;
  year: number;
  department?: string;
  college_id?: {
    _id: string;
    role: string;
  };
  phone?: string;
  cgpa?: number;
  resume_url?: string;
  skills?: string[];
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  date_of_birth?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  father_name?: string;
  mother_name?: string;
  emergency_contact?: string;
  blood_group?: string;
  profile_complete?: boolean;
  verify?: boolean;
  tenth_percentage?: number;
  twelfth_percentage?: number;
  graduation_percentage?: number;
}

function ViewStudentProfile() {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<IStudent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!id) {
          throw new Error('No student ID provided');
        }

        const response: any = await studentAPI.getStudentProfile(id);
        console.log(response);
        // Check if response has the expected structure
        if (response) {
          setStudent(response);
        } else {
          throw new Error('Invalid response format from server');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <h2 className="font-bold text-lg">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <h2 className="font-bold text-lg">Not Found</h2>
          <p>Student not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <Button
            onClick={() => navigate(-1)}
            className="flex items-center text-sm sm:text-base h-9 sm:h-10 px-3 sm:px-4"
            variant="outline"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            <span className="hidden sm:inline">Back to Dashboard</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </div>

        {/* Profile Header */}
        <div className="bg-white/80 backdrop-blur-sm shadow-sm rounded-lg mb-6 sm:mb-8 overflow-hidden">
          <div className="px-4 sm:px-6 py-6 sm:py-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="flex-shrink-0">
                <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-gradient-to-r from-orange-500 to-blue-600 flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-lg">
                  {student.full_name?.charAt(0).toUpperCase() || 'S'}
                </div>
              </div>
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
                  {student.full_name}
                </h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">{student.enrollment_no}</p>
                <div className="mt-2 space-y-1">
                  <p className="text-gray-600 text-sm sm:text-base">
                    {student.course} • Year {student.year}
                    {student.department && ` • ${student.department}`}
                  </p>
                  {student.college_id && (
                    <p className="text-gray-500 text-xs sm:text-sm">
                      College ID: {student.college_id._id}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Column - Personal Info */}
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="bg-white/80 backdrop-blur-sm shadow-sm rounded-lg p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
                Personal Information
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                  <span className="text-gray-600 text-sm sm:text-base font-medium">Email:</span>
                  <span className="text-gray-900 text-sm sm:text-base break-all sm:break-normal">
                    {student.email}
                  </span>
                </div>
                {student.phone && (
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                    <span className="text-gray-600 text-sm sm:text-base font-medium">Phone:</span>
                    <span className="text-gray-900 text-sm sm:text-base">{student.phone}</span>
                  </div>
                )}
                {student.date_of_birth && (
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                    <span className="text-gray-600 text-sm sm:text-base font-medium">
                      Date of Birth:
                    </span>
                    <span className="text-gray-900 text-sm sm:text-base">
                      {new Date(student.date_of_birth).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {student.blood_group && (
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                    <span className="text-gray-600 text-sm sm:text-base font-medium">
                      Blood Group:
                    </span>
                    <span className="text-gray-900 text-sm sm:text-base">
                      {student.blood_group}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Address Information */}
            {(student.address || student.city || student.state || student.pincode) && (
              <div className="bg-white/80 backdrop-blur-sm shadow-sm rounded-lg p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
                  Address
                </h2>
                <div className="space-y-2 text-gray-900 text-sm sm:text-base">
                  {student.address && <p className="leading-relaxed">{student.address}</p>}
                  {(student.city || student.state || student.pincode) && (
                    <p className="leading-relaxed">
                      {student.city && `${student.city}, `}
                      {student.state && `${student.state} - `}
                      {student.pincode}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Family Information */}
            {(student.father_name || student.mother_name || student.emergency_contact) && (
              <div className="bg-white/80 backdrop-blur-sm shadow-sm rounded-lg p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
                  Family & Emergency
                </h2>
                <div className="space-y-3 sm:space-y-4">
                  {student.father_name && (
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                      <span className="text-gray-600 text-sm sm:text-base font-medium">
                        Father's Name:
                      </span>
                      <span className="text-gray-900 text-sm sm:text-base">
                        {student.father_name}
                      </span>
                    </div>
                  )}
                  {student.mother_name && (
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                      <span className="text-gray-600 text-sm sm:text-base font-medium">
                        Mother's Name:
                      </span>
                      <span className="text-gray-900 text-sm sm:text-base">
                        {student.mother_name}
                      </span>
                    </div>
                  )}
                  {student.emergency_contact && (
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                      <span className="text-gray-600 text-sm sm:text-base font-medium">
                        Emergency Contact:
                      </span>
                      <span className="text-gray-900 text-sm sm:text-base">
                        {student.emergency_contact}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Academic & Professional Info */}
          <div className="space-y-6">
            {/* Academic Performance */}
            <div className="bg-white/80 backdrop-blur-sm shadow-sm rounded-lg p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
                Academic Performance
              </h2>
              <div className="space-y-3 sm:space-y-4">
                {student.cgpa && (
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                    <span className="text-gray-600 text-sm sm:text-base font-medium">CGPA:</span>
                    <span className="text-gray-900 text-sm sm:text-base font-semibold">
                      {student.cgpa}/10
                    </span>
                  </div>
                )}
                {student.tenth_percentage && (
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                    <span className="text-gray-600 text-sm sm:text-base font-medium">
                      10th Percentage:
                    </span>
                    <span className="text-gray-900 text-sm sm:text-base">
                      {student.tenth_percentage}%
                    </span>
                  </div>
                )}
                {student.twelfth_percentage && (
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                    <span className="text-gray-600 text-sm sm:text-base font-medium">
                      12th Percentage:
                    </span>
                    <span className="text-gray-900 text-sm sm:text-base">
                      {student.twelfth_percentage}%
                    </span>
                  </div>
                )}
                {student.graduation_percentage && (
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                    <span className="text-gray-600 text-sm sm:text-base font-medium">
                      Graduation Percentage:
                    </span>
                    <span className="text-gray-900 text-sm sm:text-base">
                      {student.graduation_percentage}%
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Skills */}
            {student.skills && student.skills.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm shadow-sm rounded-lg p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {student.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-orange-100 to-blue-100 text-orange-800 text-xs sm:text-sm font-medium rounded-full border border-orange-200 hover:shadow-sm transition-shadow"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            {(student.resume_url ||
              student.linkedin_url ||
              student.github_url ||
              student.portfolio_url) && (
              <div className="bg-white/80 backdrop-blur-sm shadow-sm rounded-lg p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
                  Links
                </h2>
                <div className="space-y-3 sm:space-y-4">
                  {student.resume_url && (
                    <div>
                      <a
                        href={student.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-600 hover:text-orange-800 flex items-center text-sm sm:text-base p-2 sm:p-3 rounded-lg hover:bg-orange-50 transition-colors"
                      >
                        <span className="mr-3 text-lg">📄</span>
                        <span className="font-medium">Resume</span>
                      </a>
                    </div>
                  )}
                  {student.linkedin_url && (
                    <div>
                      <a
                        href={student.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center text-sm sm:text-base p-2 sm:p-3 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <span className="mr-3 text-lg">💼</span>
                        <span className="font-medium">LinkedIn</span>
                      </a>
                    </div>
                  )}
                  {student.github_url && (
                    <div>
                      <a
                        href={student.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-700 hover:text-gray-900 flex items-center text-sm sm:text-base p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <span className="mr-3 text-lg">🐱</span>
                        <span className="font-medium">GitHub</span>
                      </a>
                    </div>
                  )}
                  {student.portfolio_url && (
                    <div>
                      <a
                        href={student.portfolio_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-800 flex items-center text-sm sm:text-base p-2 sm:p-3 rounded-lg hover:bg-green-50 transition-colors"
                      >
                        <span className="mr-3 text-lg">🌐</span>
                        <span className="font-medium">Portfolio</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Profile Status */}
            <div className="bg-white/80 backdrop-blur-sm shadow-sm rounded-lg p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
                Profile Status
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full mr-3 ${
                      student.profile_complete ? 'bg-green-500' : 'bg-yellow-500'
                    }`}
                  ></div>
                  <span className="text-gray-900 text-sm sm:text-base font-medium">
                    Profile: {student.profile_complete ? 'Complete' : 'Incomplete'}
                  </span>
                </div>
                <div className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full mr-3 ${
                      student.verify ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  ></div>
                  <span className="text-gray-900 text-sm sm:text-base font-medium">
                    Status: {student.verify ? 'Verified' : 'Not Verified'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewStudentProfile;
