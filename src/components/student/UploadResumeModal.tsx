import { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, FileText, CheckCircle, X } from 'lucide-react';
import { toast } from 'sonner';

interface UploadResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UploadResumeModal = ({ isOpen, onClose }: UploadResumeModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please select a PDF or Word document');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);

    // Simulate file upload
    setTimeout(() => {
      toast.success('Resume uploaded successfully!');
      setIsUploading(false);
      setSelectedFile(null);
      onClose();
    }, 3000);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg mx-4">
        <DialogHeader>
          <DialogTitle className="flex items-center text-lg sm:text-xl">
            <Upload className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-purple-600" />
            Upload Resume
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Upload Area */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              {!selectedFile ? (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center cursor-pointer hover:border-purple-400 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
                    Drop your resume here or click to browse
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                    Supported formats: PDF, DOC, DOCX (Max 5MB)
                  </p>
                  <Button
                    variant="outline"
                    className="border-purple-500 text-purple-600 hover:bg-purple-50 w-full sm:w-auto"
                  >
                    Choose File
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-green-600" />
                      <div>
                        <p className="font-semibold text-green-900">{selectedFile.name}</p>
                        <p className="text-sm text-green-700">
                          {formatFileSize(selectedFile.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveFile}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Preview Information:</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      <p>
                        <strong>File Name:</strong> {selectedFile.name}
                      </p>
                      <p>
                        <strong>File Size:</strong> {formatFileSize(selectedFile.size)}
                      </p>
                      <p>
                        <strong>Last Modified:</strong>{' '}
                        {new Date(selectedFile.lastModified).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Guidelines */}
          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Resume Guidelines:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Keep your resume to 1-2 pages maximum</li>
                <li>• Include relevant work experience and projects</li>
                <li>• Highlight technical skills and certifications</li>
                <li>• Use a professional format and clear fonts</li>
                <li>• Include contact information and LinkedIn profile</li>
              </ul>
            </CardContent>
          </Card>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Uploading...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Upload Resume
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadResumeModal;
