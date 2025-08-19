
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Pause, BarChart3, Users, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Test {
  id: string;
  name: string;
  linkedJob: string;
  attempts: number;
  avgScore: number;
  createdDate: string;
  status: 'Active' | 'Inactive';
  duration: number;
  questions: number;
}

const TestListCard = () => {
  const { toast } = useToast();
  
  const [tests] = useState<Test[]>([
    {
      id: '1',
      name: 'Frontend Development Assessment',
      linkedJob: 'Senior Frontend Developer',
      attempts: 23,
      avgScore: 78,
      createdDate: '2024-01-10',
      status: 'Active',
      duration: 60,
      questions: 25
    },
    {
      id: '2',
      name: 'Product Management Case Study',
      linkedJob: 'Product Manager',
      attempts: 18,
      avgScore: 82,
      createdDate: '2024-01-08',
      status: 'Active',
      duration: 90,
      questions: 15
    },
    {
      id: '3',
      name: 'UX Design Portfolio Review',
      linkedJob: 'UX Designer',
      attempts: 12,
      avgScore: 85,
      createdDate: '2024-01-05',
      status: 'Inactive',
      duration: 120,
      questions: 10
    },
    {
      id: '4',
      name: 'Backend Engineering Challenge',
      linkedJob: 'Backend Engineer',
      attempts: 31,
      avgScore: 74,
      createdDate: '2024-01-03',
      status: 'Active',
      duration: 90,
      questions: 30
    }
  ]);

  const handleViewSubmissions = (testId: string, testName: string) => {
    toast({
      title: "Viewing Submissions",
      description: `Opening submissions for ${testName}`,
    });
  };

  const handleEditTest = (testId: string, testName: string) => {
    toast({
      title: "Edit Test",
      description: `Editing ${testName}`,
    });
  };

  const handleDeactivateTest = (testId: string, testName: string) => {
    toast({
      title: "Test Deactivated",
      description: `${testName} has been deactivated`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Active Tests</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tests.map((test) => (
            <div key={test.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{test.name}</h3>
                    <Badge variant={test.status === 'Active' ? 'default' : 'secondary'}>
                      {test.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">Linked to: {test.linkedJob}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {test.attempts} attempts
                    </span>
                    <span className="flex items-center gap-1">
                      <BarChart3 className="h-3 w-3" />
                      {test.avgScore}% avg score
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Created: {new Date(test.createdDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{test.duration} minutes</span>
                    <span>{test.questions} questions</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleViewSubmissions(test.id, test.name)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View Submissions
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleEditTest(test.id, test.name)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit Test
                </Button>
                {test.status === 'Active' && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDeactivateTest(test.id, test.name)}
                  >
                    <Pause className="h-4 w-4 mr-1" />
                    Deactivate
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TestListCard;
