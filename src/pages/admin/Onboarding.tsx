
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Upload, CheckCircle } from 'lucide-react';

const Onboarding = () => {
  const { toast } = useToast();
  const [candidates] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@email.com',
      position: 'Software Engineer',
      testScore: 85,
      interviewStatus: 'Passed',
      status: 'Pending Onboarding'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      position: 'UI/UX Designer',
      testScore: 92,
      interviewStatus: 'Passed',
      status: 'Pending Onboarding'
    },
    {
      id: 3,
      name: 'Mike Davis',
      email: 'mike.davis@email.com',
      position: 'Product Manager',
      testScore: 88,
      interviewStatus: 'Passed',
      status: 'Pending Onboarding'
    }
  ]);

  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isOnboarding, setIsOnboarding] = useState(false);

  const handleOnboard = async (candidateId: number) => {
    setIsOnboarding(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsOnboarding(false);
    toast({
      title: "Candidate Onboarded",
      description: "The candidate has been successfully onboarded as an employee.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Onboard Candidates</h1>
        <p className="text-gray-600">Convert successful candidates into employees</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserPlus className="h-5 w-5 mr-2" />
            Candidates Ready for Onboarding
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Test Score</TableHead>
                <TableHead>Interview</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {candidates.map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{candidate.name}</p>
                      <p className="text-sm text-gray-500">{candidate.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{candidate.position}</TableCell>
                  <TableCell>
                    <Badge variant={candidate.testScore >= 80 ? "default" : "secondary"}>
                      {candidate.testScore}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {candidate.interviewStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{candidate.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" onClick={() => setSelectedCandidate(candidate)}>
                          Onboard
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Onboard {candidate.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="employee-id">Employee ID</Label>
                              <Input id="employee-id" placeholder="EMP001" />
                            </div>
                            <div>
                              <Label htmlFor="start-date">Start Date</Label>
                              <Input id="start-date" type="date" />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="department">Department</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="engineering">Engineering</SelectItem>
                                  <SelectItem value="design">Design</SelectItem>
                                  <SelectItem value="product">Product</SelectItem>
                                  <SelectItem value="marketing">Marketing</SelectItem>
                                  <SelectItem value="sales">Sales</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="manager">Reporting Manager</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select manager" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="john-doe">John Doe - Engineering Lead</SelectItem>
                                  <SelectItem value="jane-smith">Jane Smith - Design Lead</SelectItem>
                                  <SelectItem value="bob-wilson">Bob Wilson - Product Lead</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="salary">Annual Salary</Label>
                            <Input id="salary" placeholder="₹6.3L" />
                          </div>

                          <div>
                            <Label htmlFor="offer-letter">Upload Offer Letter</Label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                              <Upload className="mx-auto h-8 w-8 text-gray-400" />
                              <p className="text-sm text-gray-600">Click to upload offer letter (PDF)</p>
                            </div>
                          </div>

                          <div className="flex gap-2 justify-end">
                            <Button variant="outline">Cancel</Button>
                            <Button onClick={() => handleOnboard(candidate.id)} disabled={isOnboarding}>
                              {isOnboarding ? 'Onboarding...' : 'Complete Onboarding'}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
