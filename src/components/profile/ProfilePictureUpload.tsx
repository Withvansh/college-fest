import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Loader2, User } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from '../../hooks/use-toast';
import { uploadProfilePicture, deleteProfilePicture } from '../../services/userService';

interface ProfilePictureUploadProps {
  userId: string;
  currentAvatarUrl?: string;
  onAvatarUpdate: (newAvatarUrl: string | null) => void;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  isEditing?: boolean; // New prop to control edit mode
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  userId,
  currentAvatarUrl,
  onAvatarUpdate,
  size = 'medium',
  className = '',
  isEditing = false, // Default to false (read-only mode)
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32',
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload the file
    handleUpload(file);
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    
    try {
      const result = await uploadProfilePicture(userId, file);
      
      if (result.success && result.avatar_url) {
        toast({
          title: "Success",
          description: result.message,
        });
        setPreviewUrl(null);
        onAvatarUpdate(result.avatar_url);
      } else {
        toast({
          title: "Upload Failed",
          description: result.message,
          variant: "destructive",
        });
        setPreviewUrl(null);
      }
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload profile picture",
        variant: "destructive",
      });
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      const result = await deleteProfilePicture(userId);
      
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
        onAvatarUpdate(null);
      } else {
        toast({
          title: "Delete Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete profile picture",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClick = () => {
    if (!isUploading && !isDeleting && isEditing) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Avatar Display */}
      <div 
        className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200 relative ${
          isEditing ? 'cursor-pointer group' : 'cursor-default'
        }`}
        onClick={handleClick}
        title={isEditing ? 'Click to change profile picture' : 'Enable edit mode to change profile picture'}
      >
        {/* Loading Overlay */}
        {(isUploading || isDeleting) && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
        )}

        {/* Image */}
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : currentAvatarUrl ? (
          <img
            src={currentAvatarUrl}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <User className="w-8 h-8" />
          </div>
        )}

        {/* Hover Overlay */}
        {!isUploading && !isDeleting && isEditing && (
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
            <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div>
        )}
      </div>

      {/* Action Buttons - Only show when editing */}
      {isEditing && (
        <div className="absolute -bottom-2 -right-2 flex gap-1">
          <Button
            size="sm"
            variant="outline"
            className="w-8 h-8 rounded-full p-0 bg-white shadow-md"
            onClick={handleClick}
            disabled={isUploading || isDeleting}
          >
            <Upload className="w-4 h-4" />
          </Button>
          
          {currentAvatarUrl && (
            <Button
              size="sm"
              variant="outline"
              className="w-8 h-8 rounded-full p-0 bg-white shadow-md text-red-500 hover:text-red-700"
              onClick={handleDelete}
              disabled={isUploading || isDeleting}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading || isDeleting || !isEditing}
      />
    </div>
  );
};

export default ProfilePictureUpload;
