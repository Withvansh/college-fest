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

        const response:any = await studentAPI.getStudentProfile(id);
        console.log(response)
        // Check if response has the expected structure
        if (response ) {
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */} 
        <Button onClick={(()=>(navigate(-1)))}  className='mb-4'>
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Button>
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-6 py-8">
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                <div className="h-24 w-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                  {student.full_name?.charAt(0).toUpperCase() || 'S'}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-gray-900 truncate">
                  {student.full_name}
                </h1>
                <p className="text-gray-600 mt-1">{student.enrollment_no}</p>
                <p className="text-gray-600">
                  {student.course} • Year {student.year}
                  {student.department && ` • ${student.department}`}
                </p>
                {student.college_id && (
                  <p className="text-gray-600 mt-1">College ID: {student.college_id._id}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Personal Info */}
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="text-gray-900">{student.email}</span>
                </div>
                {student.phone && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="text-gray-900">{student.phone}</span>
                  </div>
                )}
                {student.date_of_birth && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date of Birth:</span>
                    <span className="text-gray-900">
                      {new Date(student.date_of_birth).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {student.blood_group && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Blood Group:</span>
                    <span className="text-gray-900">{student.blood_group}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Address Information */}
            {(student.address || student.city || student.state || student.pincode) && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Address</h2>
                <div className="space-y-2 text-gray-900">
                  {student.address && <p>{student.address}</p>}
                  {(student.city || student.state || student.pincode) && (
                    <p>
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
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Family & Emergency</h2>
                <div className="space-y-3">
                  {student.father_name && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Father's Name:</span>
                      <span className="text-gray-900">{student.father_name}</span>
                    </div>
                  )}
                  {student.mother_name && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mother's Name:</span>
                      <span className="text-gray-900">{student.mother_name}</span>
                    </div>
                  )}
                  {student.emergency_contact && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Emergency Contact:</span>
                      <span className="text-gray-900">{student.emergency_contact}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Academic & Professional Info */}
          <div className="space-y-6">
            {/* Academic Performance */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Academic Performance</h2>
              <div className="space-y-3">
                {student.cgpa && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">CGPA:</span>
                    <span className="text-gray-900">{student.cgpa}/10</span>
                  </div>
                )}
                {student.tenth_percentage && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">10th Percentage:</span>
                    <span className="text-gray-900">{student.tenth_percentage}%</span>
                  </div>
                )}
                {student.twelfth_percentage && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">12th Percentage:</span>
                    <span className="text-gray-900">{student.twelfth_percentage}%</span>
                  </div>
                )}
                {student.graduation_percentage && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Graduation Percentage:</span>
                    <span className="text-gray-900">{student.graduation_percentage}%</span>
                  </div>
                )}
              </div>
            </div>

            {/* Skills */}
            {student.skills && student.skills.length > 0 && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {student.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            {(student.resume_url || student.linkedin_url || student.github_url || student.portfolio_url) && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Links</h2>
                <div className="space-y-2">
                  {student.resume_url && (
                    <div>
                      <a
                        href={student.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <span className="mr-2">📄</span>
                        Resume
                      </a>
                    </div>
                  )}
                  {student.linkedin_url && (
                    <div>
                      <a
                        href={student.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <span className="mr-2">💼</span>
                        LinkedIn
                      </a>
                    </div>
                  )}
                  {student.github_url && (
                    <div>
                      <a
                        href={student.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <span className="mr-2">🐱</span>
                        GitHub
                      </a>
                    </div>
                  )}
                  {student.portfolio_url && (
                    <div>
                      <a
                        href={student.portfolio_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <span className="mr-2">🌐</span>
                        Portfolio
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Profile Status */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Status</h2>
              <div className="flex items-center">
                <div
                  className={`w-3 h-3 rounded-full mr-2 ${
                    student.profile_complete ? 'bg-green-500' : 'bg-yellow-500'
                  }`}
                ></div>
                <span className="text-gray-900">
                  {student.profile_complete ? 'Complete' : 'Incomplete'}
                </span>
              </div>
              <div className="flex items-center mt-2">
                <div
                  className={`w-3 h-3 rounded-full mr-2 ${
                    student.verify ? 'bg-green-500' : 'bg-red-500'
                  }`}
                ></div>
                <span className="text-gray-900">
                  {student.verify ? 'Verified' : 'Not Verified'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewStudentProfile;