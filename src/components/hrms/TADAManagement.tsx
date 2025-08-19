
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Upload, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  DollarSign,
  Calendar,
  FileText,
  Car,
  Plane,
  MapPin,
  Receipt,
  CreditCard
} from "lucide-react";
import { toast } from "sonner";

interface TADARequest {
  id: string;
  employee_name: string;
  employee_id: string;
  claim_type: string;
  amount: number;
  description: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected' | 'reimbursed';
  receipts: string[];
  created_at: string;
  approved_by?: string;
  approved_date?: string;
  reimbursed_date?: string;
  comments?: string;
}

const TADAManagement = () => {
  const [requests, setRequests] = useState<TADARequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<TADARequest | null>(null);
  const [showNewRequestDialog, setShowNewRequestDialog] = useState(false);
  const [newRequest, setNewRequest] = useState({
    claim_type: '',
    amount: 0,
    description: '',
    date: '',
    receipts: [] as File[]
  });

  // Sample data - replace with Supabase integration
  useEffect(() => {
    const sampleRequests: TADARequest[] = [
      {
        id: '1',
        employee_name: 'John Doe',
        employee_id: 'EMP001',
        claim_type: 'travel',
        amount: 1250.50,
        description: 'Business trip to Mumbai for client meeting',
        date: '2024-12-08',
        status: 'pending',
        receipts: ['receipt1.jpg', 'receipt2.jpg'],
        created_at: '2024-12-08T10:00:00Z'
      },
      {
        id: '2',
        employee_name: 'Jane Smith',
        employee_id: 'EMP002',
        claim_type: 'accommodation',
        amount: 4500.00,
        description: 'Hotel stay for 3 days conference',
        date: '2024-12-07',
        status: 'approved',
        receipts: ['hotel_bill.pdf'],
        created_at: '2024-12-07T14:30:00Z',
        approved_by: 'HR Manager',
        approved_date: '2024-12-08T09:15:00Z'
      },
      {
        id: '3',
        employee_name: 'Mike Johnson',
        employee_id: 'EMP003',
        claim_type: 'food',
        amount: 850.25,
        description: 'Team lunch and client dinner',
        date: '2024-12-06',
        status: 'reimbursed',
        receipts: ['restaurant_bill.jpg'],
        created_at: '2024-12-06T18:00:00Z',
        approved_by: 'HR Manager',
        approved_date: '2024-12-07T10:00:00Z',
        reimbursed_date: '2024-12-08T16:30:00Z'
      }
    ];
    setRequests(sampleRequests);
  }, []);

  const claimTypes = [
    { value: 'travel', label: 'Travel', icon: Car },
    { value: 'accommodation', label: 'Accommodation', icon: MapPin },
    { value: 'food', label: 'Food & Meals', icon: Receipt },
    { value: 'transport', label: 'Local Transport', icon: Car },
    { value: 'flight', label: 'Flight', icon: Plane },
    { value: 'other', label: 'Other', icon: FileText }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'reimbursed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'approved': return CheckCircle;
      case 'rejected': return XCircle;
      case 'reimbursed': return CreditCard;
      default: return Clock;
    }
  };

  const handleSubmitRequest = async () => {
    try {
      setLoading(true);
      // Simulate API call
      const request: TADARequest = {
        id: Date.now().toString(),
        employee_name: 'Current User', // Get from auth context
        employee_id: 'EMP004',
        claim_type: newRequest.claim_type,
        amount: newRequest.amount,
        description: newRequest.description,
        date: newRequest.date,
        status: 'pending',
        receipts: newRequest.receipts.map(file => file.name),
        created_at: new Date().toISOString()
      };
      
      setRequests(prev => [request, ...prev]);
      setShowNewRequestDialog(false);
      setNewRequest({ claim_type: '', amount: 0, description: '', date: '', receipts: [] });
      toast.success('TA/DA request submitted successfully');
    } catch (error) {
      toast.error('Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async (requestId: string) => {
    try {
      setRequests(prev => prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'approved' as const, approved_by: 'HR Manager', approved_date: new Date().toISOString() }
          : req
      ));
      toast.success('Request approved successfully');
    } catch (error) {
      toast.error('Failed to approve request');
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      setRequests(prev => prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'rejected' as const, approved_by: 'HR Manager', approved_date: new Date().toISOString() }
          : req
      ));
      toast.success('Request rejected');
    } catch (error) {
      toast.error('Failed to reject request');
    }
  };

  const handleReimburseRequest = async (requestId: string) => {
    try {
      setRequests(prev => prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'reimbursed' as const, reimbursed_date: new Date().toISOString() }
          : req
      ));
      toast.success('Request reimbursed successfully');
    } catch (error) {
      toast.error('Failed to process reimbursement');
    }
  };

  const totalAmount = requests.reduce((sum, req) => sum + req.amount, 0);
  const pendingAmount = requests.filter(req => req.status === 'pending').reduce((sum, req) => sum + req.amount, 0);
  const approvedAmount = requests.filter(req => req.status === 'approved').reduce((sum, req) => sum + req.amount, 0);
  const reimbursedAmount = requests.filter(req => req.status === 'reimbursed').reduce((sum, req) => sum + req.amount, 0);

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">TA/DA Management</h1>
          <p className="text-gray-600">Manage travel allowances and daily allowances</p>
        </div>
        <Dialog open={showNewRequestDialog} onOpenChange={setShowNewRequestDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Submit TA/DA Request</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Claim Type</Label>
                <Select value={newRequest.claim_type} onValueChange={(value) => setNewRequest(prev => ({ ...prev, claim_type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select claim type" />
                  </SelectTrigger>
                  <SelectContent>
                    {claimTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Amount (₹)</Label>
                <Input
                  type="number"
                  value={newRequest.amount}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                  placeholder="Enter amount"
                />
              </div>
              
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={newRequest.date}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              
              <div>
                <Label>Description</Label>
                <Textarea
                  value={newRequest.description}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your expense..."
                  rows={3}
                />
              </div>
              
              <div>
                <Label>Upload Receipts</Label>
                <Input
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={(e) => setNewRequest(prev => ({ ...prev, receipts: Array.from(e.target.files || []) }))}
                />
                <p className="text-xs text-gray-500 mt-1">Upload receipts/bills (JPG, PNG, PDF)</p>
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowNewRequestDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitRequest} disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Request'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Claims</p>
                <p className="text-2xl font-bold">₹{totalAmount.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold">₹{pendingAmount.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold">₹{approvedAmount.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CreditCard className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Reimbursed</p>
                <p className="text-2xl font-bold">₹{reimbursedAmount.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>TA/DA Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => {
                  const StatusIcon = getStatusIcon(request.status);
                  const claimType = claimTypes.find(type => type.value === request.claim_type);
                  const ClaimIcon = claimType?.icon || FileText;
                  
                  return (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{request.employee_name}</p>
                          <p className="text-sm text-gray-500">{request.employee_id}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <ClaimIcon className="h-4 w-4 text-gray-500" />
                          <span className="capitalize">{claimType?.label || request.claim_type}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">₹{request.amount.toLocaleString()}</TableCell>
                      <TableCell>{new Date(request.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(request.status)}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" onClick={() => setSelectedRequest(request)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Request Details</DialogTitle>
                              </DialogHeader>
                              {selectedRequest && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Employee</Label>
                                      <p className="text-sm mt-1">{selectedRequest.employee_name} ({selectedRequest.employee_id})</p>
                                    </div>
                                    <div>
                                      <Label>Claim Type</Label>
                                      <p className="text-sm mt-1 capitalize">{selectedRequest.claim_type}</p>
                                    </div>
                                    <div>
                                      <Label>Amount</Label>
                                      <p className="text-sm mt-1 font-medium">₹{selectedRequest.amount.toLocaleString()}</p>
                                    </div>
                                    <div>
                                      <Label>Date</Label>
                                      <p className="text-sm mt-1">{new Date(selectedRequest.date).toLocaleDateString()}</p>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <Label>Description</Label>
                                    <p className="text-sm mt-1 p-3 bg-gray-50 rounded">{selectedRequest.description}</p>
                                  </div>
                                  
                                  <div>
                                    <Label>Receipts</Label>
                                    <div className="flex gap-2 mt-1">
                                      {selectedRequest.receipts.map((receipt, index) => (
                                        <Badge key={index} variant="outline">
                                          {receipt}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <Label>Status</Label>
                                    <div className="mt-1">
                                      <Badge className={getStatusColor(selectedRequest.status)}>
                                        <StatusIcon className="h-3 w-3 mr-1" />
                                        {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          
                          {request.status === 'pending' && (
                            <>
                              <Button size="sm" onClick={() => handleApproveRequest(request.id)} className="bg-green-600 hover:bg-green-700">
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleRejectRequest(request.id)} className="text-red-600 hover:text-red-700">
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          
                          {request.status === 'approved' && (
                            <Button size="sm" onClick={() => handleReimburseRequest(request.id)} className="bg-blue-600 hover:bg-blue-700">
                              <CreditCard className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TADAManagement;
