import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, Download, Trash2, Filter } from 'lucide-react';

const ManageDocuments = () => {
  const { toast } = useToast();
  const [filter, setFilter] = useState('all');
  const [documents] = useState([
    {
      id: 1,
      name: 'Employee Handbook.pdf',
      type: 'PDF',
      assignedTo: 'All Employees',
      uploadedDate: '2024-01-15',
      size: '2.3 MB',
    },
    {
      id: 2,
      name: 'Job Description Template.docx',
      type: 'DOCX',
      assignedTo: 'HR Team',
      uploadedDate: '2024-01-10',
      size: '856 KB',
    },
    {
      id: 3,
      name: 'Onboarding Checklist.pdf',
      type: 'PDF',
      assignedTo: 'HR Team',
      uploadedDate: '2024-01-08',
      size: '1.2 MB',
    },
    {
      id: 4,
      name: 'Interview Guidelines.pdf',
      type: 'PDF',
      assignedTo: 'Recruiters',
      uploadedDate: '2024-01-05',
      size: '945 KB',
    },
  ]);

  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    setIsUploading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsUploading(false);
    toast({
      title: 'Document Uploaded',
      description: 'Your document has been successfully uploaded.',
    });
  };

  const handleDelete = (id: number) => {
    toast({
      title: 'Document Deleted',
      description: 'The document has been removed from the system.',
    });
  };

  const getFileIcon = (type: string) => {
    return <FileText className="h-4 w-4" />;
  };

  const filteredDocuments = documents.filter(doc => {
    if (filter === 'all') return true;
    return doc.type.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Documents</h1>
          <p className="text-gray-600">Upload and manage platform documents</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Upload New Document</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="file">Choose File</Label>
                <Input id="file" type="file" accept=".pdf,.doc,.docx" />
                <p className="text-xs text-gray-500 mt-1">Supported: PDF, DOC, DOCX. Max 10MB</p>
              </div>

              <div>
                <Label htmlFor="assign-to">Assign To</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select user group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="hr">HR Team</SelectItem>
                    <SelectItem value="recruiters">Recruiters</SelectItem>
                    <SelectItem value="employees">Employees</SelectItem>
                    <SelectItem value="candidates">Candidates</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Input id="description" placeholder="Brief description of the document" />
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Drag and drop your file here, or click to browse
                </p>
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleUpload} disabled={isUploading}>
                  {isUploading ? 'Uploading...' : 'Upload'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="pdf">PDF Files</SelectItem>
                <SelectItem value="docx">Word Documents</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Search documents..." className="w-full sm:w-64" />
          </div>
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Documents Library</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map(doc => (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getFileIcon(doc.type)}
                        <span className="font-medium">{doc.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{doc.type}</Badge>
                    </TableCell>
                    <TableCell>{doc.assignedTo}</TableCell>
                    <TableCell>{doc.uploadedDate}</TableCell>
                    <TableCell>{doc.size}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(doc.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageDocuments;
