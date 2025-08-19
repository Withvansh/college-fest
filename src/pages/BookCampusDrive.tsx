
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Building2, 
  Users, 
  FileText, 
  ArrowLeft, 
  ArrowRight,
  CheckCircle,
  Clock,
  MapPin
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BookCampusDrive = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    website: '',
    driveDate: '',
    preferredTime: '',
    jobTitle: '',
    jobType: '',
    experience: '',
    ctc: '',
    location: '',
    eligibility: [],
    branches: [],
    cgpaCutoff: '',
    jobDescription: '',
    requirements: '',
    benefits: '',
    colleges: [],
    expectedCandidates: '',
    interviewRounds: '',
    additionalNotes: ''
  });
  const { toast } = useToast();

  const branches = [
    'Computer Science Engineering',
    'Information Technology',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering',
    'Chemical Engineering',
    'Biotechnology',
    'MBA',
    'MCA'
  ];

  const colleges = [
    'MIT College of Engineering',
    'IIT Bombay',
    'IIT Delhi',
    'NIT Trichy',
    'BITS Pilani',
    'VIT Vellore',
    'SRM University',
    'Manipal Institute of Technology'
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    toast({
      title: 'Campus Drive Booked!',
      description: 'Your campus recruitment drive has been successfully scheduled. We will contact you within 24 hours.',
    });
    // Reset form or redirect
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  placeholder="Enter company name"
                  value={formData.companyName}
                  onChange={(e) => updateFormData('companyName', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Company Website</Label>
                <Input
                  id="website"
                  placeholder="https://company.com"
                  value={formData.website}
                  onChange={(e) => updateFormData('website', e.target.value)}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person *</Label>
                <Input
                  id="contactPerson"
                  placeholder="HR Manager name"
                  value={formData.contactPerson}
                  onChange={(e) => updateFormData('contactPerson', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="hr@company.com"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => updateFormData('phone', e.target.value)}
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="driveDate">Preferred Drive Date *</Label>
                <Input
                  id="driveDate"
                  type="date"
                  value={formData.driveDate}
                  onChange={(e) => updateFormData('driveDate', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preferredTime">Preferred Time</Label>
                <Select onValueChange={(value) => updateFormData('preferredTime', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (9:00 AM - 12:00 PM)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (1:00 PM - 5:00 PM)</SelectItem>
                    <SelectItem value="full-day">Full Day (9:00 AM - 5:00 PM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Target Colleges *</Label>
              <div className="grid md:grid-cols-2 gap-3 mt-2">
                {colleges.map((college) => (
                  <div key={college} className="flex items-center space-x-2">
                    <Checkbox
                      id={college}
                      checked={formData.colleges.includes(college)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateFormData('colleges', [...formData.colleges, college]);
                        } else {
                          updateFormData('colleges', formData.colleges.filter(c => c !== college));
                        }
                      }}
                    />
                    <Label htmlFor={college} className="text-sm">{college}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectedCandidates">Expected Number of Candidates</Label>
              <Select onValueChange={(value) => updateFormData('expectedCandidates', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1-10 candidates</SelectItem>
                  <SelectItem value="11-25">11-25 candidates</SelectItem>
                  <SelectItem value="26-50">26-50 candidates</SelectItem>
                  <SelectItem value="51-100">51-100 candidates</SelectItem>
                  <SelectItem value="100+">100+ candidates</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title *</Label>
                <Input
                  id="jobTitle"
                  placeholder="Software Engineer"
                  value={formData.jobTitle}
                  onChange={(e) => updateFormData('jobTitle', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobType">Job Type *</Label>
                <Select onValueChange={(value) => updateFormData('jobType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full Time</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="experience">Experience Level</Label>
                <Select onValueChange={(value) => updateFormData('experience', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fresher">Fresher (0 years)</SelectItem>
                    <SelectItem value="0-1">0-1 years</SelectItem>
                    <SelectItem value="1-2">1-2 years</SelectItem>
                    <SelectItem value="2-3">2-3 years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ctc">CTC Package *</Label>
                <Input
                  id="ctc"
                  placeholder="₹8-12 LPA"
                  value={formData.ctc}
                  onChange={(e) => updateFormData('ctc', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Job Location *</Label>
              <Input
                id="location"
                placeholder="Bangalore, Mumbai, Remote"
                value={formData.location}
                onChange={(e) => updateFormData('location', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Eligible Branches *</Label>
              <div className="grid md:grid-cols-2 gap-3 mt-2">
                {branches.map((branch) => (
                  <div key={branch} className="flex items-center space-x-2">
                    <Checkbox
                      id={branch}
                      checked={formData.branches.includes(branch)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateFormData('branches', [...formData.branches, branch]);
                        } else {
                          updateFormData('branches', formData.branches.filter(b => b !== branch));
                        }
                      }}
                    />
                    <Label htmlFor={branch} className="text-sm">{branch}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cgpaCutoff">Minimum CGPA Requirement</Label>
              <Select onValueChange={(value) => updateFormData('cgpaCutoff', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select CGPA cutoff" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6.0">6.0 and above</SelectItem>
                  <SelectItem value="6.5">6.5 and above</SelectItem>
                  <SelectItem value="7.0">7.0 and above</SelectItem>
                  <SelectItem value="7.5">7.5 and above</SelectItem>
                  <SelectItem value="8.0">8.0 and above</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="jobDescription">Job Description *</Label>
              <Textarea
                id="jobDescription"
                placeholder="Detailed job description..."
                rows={4}
                value={formData.jobDescription}
                onChange={(e) => updateFormData('jobDescription', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Key Requirements</Label>
              <Textarea
                id="requirements"
                placeholder="Technical skills, qualifications, experience..."
                rows={3}
                value={formData.requirements}
                onChange={(e) => updateFormData('requirements', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="benefits">Benefits & Perks</Label>
              <Textarea
                id="benefits"
                placeholder="Health insurance, flexible hours, learning opportunities..."
                rows={3}
                value={formData.benefits}
                onChange={(e) => updateFormData('benefits', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interviewRounds">Interview Process</Label>
              <Select onValueChange={(value) => updateFormData('interviewRounds', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select interview rounds" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Round (Final Interview)</SelectItem>
                  <SelectItem value="2">2 Rounds (Technical + HR)</SelectItem>
                  <SelectItem value="3">3 Rounds (Aptitude + Technical + HR)</SelectItem>
                  <SelectItem value="custom">Custom Process</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalNotes">Additional Notes</Label>
              <Textarea
                id="additionalNotes"
                placeholder="Any special requirements or additional information..."
                rows={3}
                value={formData.additionalNotes}
                onChange={(e) => updateFormData('additionalNotes', e.target.value)}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const stepTitles = [
    'Company Information',
    'Drive Details',
    'Job Requirements',
    'Additional Information'
  ];

  const stepIcons = [
    <Building2 className="h-5 w-5" />,
    <Calendar className="h-5 w-5" />,
    <Users className="h-5 w-5" />,
    <FileText className="h-5 w-5" />
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/campus-hiring" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Campus Hiring
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Campus Drive</h1>
            <p className="text-gray-600">Schedule your recruitment drive with top colleges</p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-between mb-8">
            {stepTitles.map((title, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  currentStep > index + 1 
                    ? 'bg-green-500 text-white' 
                    : currentStep === index + 1 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {currentStep > index + 1 ? <CheckCircle className="h-5 w-5" /> : stepIcons[index]}
                </div>
                <span className={`text-sm ${currentStep === index + 1 ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>
                  {title}
                </span>
              </div>
            ))}
          </div>

          {/* Form Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                {stepIcons[currentStep - 1]}
                <span className="ml-2">Step {currentStep}: {stepTitles[currentStep - 1]}</span>
              </CardTitle>
              <CardDescription>
                Please fill in the required information to proceed
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderStep()}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button 
                  variant="outline" 
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                {currentStep === 4 ? (
                  <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Book Campus Drive
                  </Button>
                ) : (
                  <Button onClick={handleNext}>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Support Info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Need help? Contact our placement team at{' '}
              <a href="mailto:placements@minutehire.com" className="text-blue-600 hover:underline">
                placements@minutehire.com
              </a>{' '}
              or call{' '}
              <a href="tel:+919876543210" className="text-blue-600 hover:underline">
                +91 98765 43210
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCampusDrive;
