import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { recruiterProfileAPI, RecruiterProfile } from '@/lib/api/Recuriter';
import { 
  ArrowLeft, 
  Building, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  BadgeCheck, 
  Factory,
  Calendar,
  Package
} from 'lucide-react';

function ViewCompany() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recruiter, setRecruiter] = useState<RecruiterProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!id) {
      setError('No recruiter ID provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await recruiterProfileAPI.getRecruiterById(id);
      setRecruiter(res);
    } catch (err: any) {
      console.error('Error fetching recruiter:', err);
      setError(err.response?.data?.message || 'Failed to fetch recruiter details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <button 
          onClick={handleGoBack}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </button>
      </div>
    );
  }

  if (!recruiter) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          Recruiter not found
        </div>
        <button 
          onClick={handleGoBack}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Back Button */}
      <button 
        onClick={handleGoBack}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </button>

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0">
            {recruiter.avatar_url ? (
              <img 
                src={recruiter.avatar_url} 
                alt={recruiter.company_name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-blue-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow">
                {recruiter.company_name?.charAt(0) || 'C'}
              </div>
            )}
          </div>
          
          <div className="flex-grow">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{recruiter.company_name}</h1>
              {recruiter.verify && (
                <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full flex items-center">
                  <BadgeCheck className="mr-1 h-4 w-4" /> Verified
                </span>
              )}
            </div>
            
            <h2 className="text-xl text-gray-700 mb-2">{recruiter.full_name}</h2>
            
            {recruiter.industry && (
              <span className="inline-flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                <Factory className="mr-1 h-4 w-4" /> {recruiter.industry}
              </span>
            )}
          </div>
        </div>

        <div className="p-6">
          {/* Contact Information */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recruiter.email && (
                <div className="flex items-center">
                  <Mail className="text-blue-600 mr-3 h-5 w-5" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <a href={`mailto:${recruiter.email}`} className="text-gray-900 hover:text-blue-600">
                      {recruiter.email}
                    </a>
                  </div>
                </div>
              )}
              
              {recruiter.phone && (
                <div className="flex items-center">
                  <Phone className="text-blue-600 mr-3 h-5 w-5" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <a href={`tel:${recruiter.phone}`} className="text-gray-900 hover:text-blue-600">
                      {recruiter.phone}
                    </a>
                  </div>
                </div>
              )}
              
              {recruiter.location && (
                <div className="flex items-center">
                  <MapPin className="text-blue-600 mr-3 h-5 w-5" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-gray-900">{recruiter.location}</p>
                  </div>
                </div>
              )}
              
              {recruiter.company_website && (
                <div className="flex items-center">
                  <Globe className="text-blue-600 mr-3 h-5 w-5" />
                  <div>
                    <p className="text-sm text-gray-500">Website</p>
                    <a 
                      href={recruiter.company_website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {recruiter.company_website}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">Company Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recruiter.created_at && (
                <div className="flex items-center">
                  <Calendar className="text-blue-600 mr-3 h-5 w-5" />
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="text-gray-900">
                      {new Date(recruiter.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              )}
              
              {recruiter.package_purchased && recruiter.package_purchased.length > 0 && (
                <div className="flex items-start">
                  <Package className="text-blue-600 mr-3 h-5 w-5 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Purchased Packages</p>
                    <div className="flex flex-wrap gap-2">
                      {recruiter.package_purchased.map((pkg, index) => (
                        <span key={index} className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          {pkg}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bio Section */}
          {recruiter.bio && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">About Us</h3>
              <p className="text-gray-700 leading-relaxed">{recruiter.bio}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewCompany;