import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Briefcase, Code, Building2, GraduationCap, School } from 'lucide-react';

interface DemoCredential {
  role: string;
  email: string;
  password: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

interface DemoCredentialsProps {
  userType: string;
  onFillCredentials: (email: string, password: string) => void;
}

const demoCredentials: DemoCredential[] = [
  {
    role: 'jobseeker',
    email: 'demo.candidate@minutehire.com',
    password: 'Candidate123',
    name: 'Demo Candidate',
    icon: <User className="h-4 w-4" />,
    description: 'Job seeker looking for opportunities'
  },
  {
    role: 'recruiter',
    email: 'demo.hr@minutehire.com',
    password: 'HRaccess123',
    name: 'Demo HR Manager',
    icon: <Briefcase className="h-4 w-4" />,
    description: 'HR manager posting jobs'
  },
  {
    role: 'freelancer',
    email: 'demo.freelancer@minutehire.com',
    password: 'Freelance123',
    name: 'Demo Freelancer',
    icon: <Code className="h-4 w-4" />,
    description: 'Freelancer offering services'
  },
  {
    role: 'client',
    email: 'demo.client@minutehire.com',
    password: 'Client123',
    name: 'Demo Client',
    icon: <Building2 className="h-4 w-4" />,
    description: 'Client hiring freelancers'
  },
  {
    role: 'student',
    email: 'demo.student@minutehire.com',
    password: 'Student123',
    name: 'Demo Student',
    icon: <GraduationCap className="h-4 w-4" />,
    description: 'Student seeking campus opportunities'
  },
  {
    role: 'college',
    email: 'demo.college@minutehire.com',
    password: 'College123',
    name: 'Demo College Admin',
    icon: <School className="h-4 w-4" />,
    description: 'College managing campus drives'
  }
];

const DemoCredentials = ({ userType, onFillCredentials }: DemoCredentialsProps) => {
  const currentRoleCredential = demoCredentials.find(cred => cred.role === userType);
  const otherCredentials = demoCredentials.filter(cred => cred.role !== userType);

  return (
    <div className="space-y-4">
      {/* Current Role Demo Button */}
      {currentRoleCredential && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">
              Quick Demo Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start text-left border-blue-300 hover:bg-blue-100"
              onClick={() => onFillCredentials(currentRoleCredential.email, currentRoleCredential.password)}
            >
              <div className="flex items-center space-x-2">
                {currentRoleCredential.icon}
                <div>
                  <div className="font-medium">{currentRoleCredential.name}</div>
                  <div className="text-xs text-gray-600">{currentRoleCredential.description}</div>
                </div>
              </div>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Other Demo Credentials */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">
            Try Other Demo Accounts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {otherCredentials.slice(0, 3).map((credential) => (
            <Button
              key={credential.role}
              type="button"
              variant="ghost"
              size="sm"
              className="w-full justify-start text-left h-auto p-2"
              onClick={() => onFillCredentials(credential.email, credential.password)}
            >
              <div className="flex items-center space-x-2">
                {credential.icon}
                <div>
                  <div className="font-medium text-sm">{credential.name}</div>
                  <div className="text-xs text-gray-500">{credential.description}</div>
                </div>
              </div>
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default DemoCredentials;
