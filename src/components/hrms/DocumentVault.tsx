
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Upload, 
  FileText, 
  Download, 
  Eye, 
  Trash2,
  Search,
  Filter,
  Plus,
  File,
  Image,
  Calendar,
  User,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";
import { toast } from "sonner";

interface Document {
  id: string;
  name: string;
  type: string;
  category: string;
  employee_name: string;
  employee_id: string;
  file_size: number;
  mime_type: string;
  uploaded_date: string;
  uploaded_by: string;
  expiry_date?: string;
  is_verified: boolean;
  is_mandatory: boolean;
  version: number;
  status: 'active' | 'expired' | 'pending_verification';
  file_url: string;
}

const DocumentVault = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [newDocument, setNewDocument] = useState({
    name: '',
    type: '',
    category: '',
    employee_id: '',
    expiry_date: '',
    is_mandatory: false,
    file: null as File | null
  });

  const documentCategories = [
    'Identity Proof',
    'Address Proof',
    'Educational Certificates',
    'Experience Letters',
    'Contracts',
    'Policies',
    'Payslips',
    'Tax Documents',
    'Insurance',
    'Other'
  ];

  const documentTypes = [
    'Aadhar Card',
    'PAN Card',
    'Passport',
    'Driving License',
    'Voter ID',
    'Degree Certificate',
    'Marksheet',
    'Experience Letter',
    'Offer Letter',
    'Contract',
    'Payslip',
    'Form 16',
    'Insurance Policy',
    'Other'
  ];

  // Sample data - replace with Supabase integration
  useEffect(() => {
    const sampleDocuments: Document[] = [
      {
        id: '1',
        name: 'Aadhar Card - John Doe',
        type: 'Aadhar Card',
        category: 'Identity Proof',
        employee_name: 'John Doe',
        employee_id: 'EMP001',
        file_size: 245760,
        mime_type: 'application/pdf',
        uploaded_date: '2024-12-01T10:00:00Z',
        uploaded_by: 'HR Manager',
        expiry_date: '2034-12-01',
        is_verified: true,
        is_mandatory: true,
        version: 1,
        status: 'active',
        file_url: '/documents/aadhar_john.pdf'
      },
      {
        id: '2',
        name: 'Experience Letter - Jane Smith',
        type: 'Experience Letter',
        category: 'Experience Letters',
        employee_name: 'Jane Smith',
        employee_id: 'EMP002',
        file_size: 189440,
        mime_type: 'application/pdf',
        uploaded_date: '2024-11-28T14:30:00Z',
        uploaded_by: 'Jane Smith',
        is_verified: false,
        is_mandatory: false,
        version: 1,
        status: 'pending_verification',
        file_url: '/documents/exp_letter_jane.pdf'
      },
      {
        id: '3',
        name: 'Driving License - Mike Johnson',
        type: 'Driving License',
        category: 'Identity Proof',
        employee_name: 'Mike Johnson',
        employee_id: 'EMP003',
        file_size: 156728,
        mime_type: 'image/jpeg',
        uploaded_date: '2024-10-15T09:15:00Z',
        uploaded_by: 'Mike Johnson',
        expiry_date: '2024-12-15',
        is_verified: true,
        is_mandatory: false,
        version: 1,
        status: 'expired',
        file_url: '/documents/dl_mike.jpg'
      }
    ];
    setDocuments(sampleDocuments);
    setFilteredDocuments(sampleDocuments);
  }, []);

  useEffect(() => {
    let filtered = documents;

    if (searchTerm) {
      filtered = filtered.filter(doc => 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter(doc => doc.category === categoryFilter);
    }

    if (statusFilter) {
      filtered = filtered.filter(doc => doc.status === statusFilter);
    }

    setFilteredDocuments(filtered);
  }, [documents, searchTerm, categoryFilter, statusFilter]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'expired': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending_verification': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'expired': return AlertTriangle;
      case 'pending_verification': return Clock;
      default: return FileText;
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return Image;
    return File;
  };

  const handleUploadDocument = async () => {
    try {
      setLoading(true);
      // Simulate file upload
      const document: Document = {
        id: Date.now().toString(),
        name: newDocument.name,
        type: newDocument.type,
        category: newDocument.category,
        employee_name: 'Current User', // Get from auth context
        employee_id: newDocument.employee_id,
        file_size: newDocument.file?.size || 0,
        mime_type: newDocument.file?.type || '',
        uploaded_date: new Date().toISOString(),
        uploaded_by: 'Current User',
        expiry_date: newDocument.expiry_date,
        is_verified: false,
        is_mandatory: newDocument.is_mandatory,
        version: 1,
        status: 'pending_verification',
        file_url: `/documents/${newDocument.file?.name}`
      };
      
      setDocuments(prev => [document, ...prev]);
      setShowUploadDialog(false);
      setNewDocument({
        name: '',
        type: '',
        category: '',
        employee_id: '',
        expiry_date: '',
        is_mandatory: false,
        file: null
      });
      toast.success('Document uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload document');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyDocument = async (documentId: string) => {
    try {
      setDocuments(prev => prev.map(doc => 
        doc.id === documentId 
          ? { ...doc, is_verified: true, status: 'active' as const }
          : doc
      ));
      toast.success('Document verified successfully');
    } catch (error) {
      toast.error('Failed to verify document');
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      toast.success('Document deleted successfully');
    } catch (error) {
      toast.error('Failed to delete document');
    }
  };

  const stats = {
    total: documents.length,
    verified: documents.filter(doc => doc.is_verified).length,
    pending: documents.filter(doc => doc.status === 'pending_verification').length,
    expired: documents.filter(doc => doc.status === 'expired').length
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Vault</h1>
          <p className="text-gray-600">Secure storage and management of employee documents</p>
        </div>
        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Upload New Document</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Document Name</Label>
                <Input
                  value={newDocument.name}
                  onChange={(e) => setNewDocument(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter document name"
                />
              </div>
              
              <div>
                <Label>Document Type</Label>
                <Select value={newDocument.type} onValueChange={(value) => setNewDocument(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Category</Label>
                <Select value={newDocument.category} onValueChange={(value) => setNewDocument(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentCategories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Employee ID</Label>
                <Input
                  value={newDocument.employee_id}
                  onChange={(e) => setNewDocument(prev => ({ ...prev, employee_id: e.target.value }))}
                  placeholder="Enter employee ID"
                />
              </div>
              
              <div>
                <Label>Expiry Date (Optional)</Label>
                <Input
                  type="date"
                  value={newDocument.expiry_date}
                  onChange={(e) => setNewDocument(prev => ({ ...prev, expiry_date: e.target.value }))}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="mandatory"
                  checked={newDocument.is_mandatory}
                  onChange={(e) => setNewDocument(prev => ({ ...prev, is_mandatory: e.target.checked }))}
                />
                <Label htmlFor="mandatory">Mandatory Document</Label>
              </div>
              
              <div>
                <Label>Upload File</Label>
                <Input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={(e) => setNewDocument(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
                />
                <p className="text-xs text-gray-500 mt-1">Supported formats: PDF, JPG, PNG, DOC, DOCX</p>
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUploadDocument} disabled={loading}>
                  {loading ? 'Uploading...' : 'Upload'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Documents</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Verified</p>
                <p className="text-2xl font-bold">{stats.verified}</p>
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
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Expired</p>
                <p className="text-2xl font-bold">{stats.expired}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search documents, employees, or types..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {documentCategories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending_verification">Pending</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((document) => {
                  const StatusIcon = getStatusIcon(document.status);
                  const FileIcon = getFileIcon(document.mime_type);
                  
                  return (
                    <TableRow key={document.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <FileIcon className="h-8 w-8 text-gray-500" />
                          <div>
                            <p className="font-medium">{document.name}</p>
                            <p className="text-sm text-gray-500">{document.type}</p>
                            {document.is_mandatory && (
                              <Badge variant="outline" className="text-xs">Mandatory</Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{document.employee_name}</p>
                          <p className="text-sm text-gray-500">{document.employee_id}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{document.category}</Badge>
                      </TableCell>
                      <TableCell>{formatFileSize(document.file_size)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(document.status)}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {document.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{new Date(document.uploaded_date).toLocaleDateString()}</p>
                          <p className="text-xs text-gray-500">by {document.uploaded_by}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4" />
                          </Button>
                          {document.status === 'pending_verification' && (
                            <Button size="sm" onClick={() => handleVerifyDocument(document.id)} className="bg-green-600 hover:bg-green-700">
                              <Shield className="h-4 w-4" />
                            </Button>
                          )}
                          <Button size="sm" variant="outline" onClick={() => handleDeleteDocument(document.id)} className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
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

export default DocumentVault;
