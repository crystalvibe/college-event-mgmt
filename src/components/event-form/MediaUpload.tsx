import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { FileIcon, XIcon } from "lucide-react";
import * as pdfjsLib from 'pdfjs-dist';
import { getDocument } from 'pdfjs-dist';
import { storage } from "@/lib/firebase"; // Add your Firebase config
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface MediaUploadProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function MediaUpload({ formData, setFormData }: MediaUploadProps) {
  const [uploading, setUploading] = useState(false);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    const mediaFiles = Array.from(files);
    
    try {
      const mediaPromises = mediaFiles.map(async file => {
        const url = await uploadFile(file);
        return {
          name: file.name,
          type: file.type,
          size: file.size,
          url: url,
          file: file
        };
      });

      const mediaResults = await Promise.all(mediaPromises);
      setFormData({
        ...formData,
        media: [...(formData.media || []), ...mediaResults]
      });

      toast({
        title: "Success",
        description: "Media files uploaded successfully"
      });
    } catch (error) {
      console.error("Error uploading files:", error);
      toast({
        title: "Error",
        description: "Failed to upload media files",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const removeMedia = (index: number) => {
    const updatedMedia = formData.media.filter((_: any, i: number) => i !== index);
    setFormData({
      ...formData,
      media: updatedMedia
    });
  };

  const getFilePreview = (item: any) => {
    if (item.type.startsWith('image/')) {
      return (
        <img
          src={item.url}
          alt={item.name}
          className="w-full h-24 object-cover rounded"
        />
      );
    } else if (item.type === 'application/pdf') {
      return (
        <div className="flex items-center justify-center h-24 bg-gray-100 rounded">
          <FileIcon className="w-8 h-8 text-red-500" />
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="ml-2 text-sm text-blue-500 hover:underline">
            {item.name}
          </a>
        </div>
      );
    } else if (item.type.startsWith('video/')) {
      return (
        <video
          src={item.url}
          className="w-full h-24 object-cover rounded"
          controls
        />
      );
    } else if (item.type.startsWith('audio/')) {
      return (
        <audio
          src={item.url}
          className="w-full h-12"
          controls
        />
      );
    } else {
      return (
        <div className="flex items-center justify-center h-24 bg-gray-100 rounded">
          <FileIcon className="w-8 h-8 text-gray-500" />
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="ml-2 text-sm text-blue-500 hover:underline">
            {item.name}
          </a>
        </div>
      );
    }
  };

  const uploadFile = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('https://0x0.st', {
        method: 'POST',
        body: formData
      });
      
      const url = await response.text();
      return url.trim(); // Returns direct file URL
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      const downloadUrl = await uploadFile(file);
      
      const mediaItem = {
        type: file.type,
        name: file.name,
        url: downloadUrl
      };

      setFormData(prev => ({
        ...prev,
        media: [...(prev.media || []), mediaItem]
      }));

    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4 w-full">
      <div className="w-full">
        <label className="text-sm font-medium block mb-1.5">Upload Media Files</label>
        <Input
          type="file"
          multiple
          accept="image/*,video/*,audio/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip,.rar,.7z"
          onChange={handleFileChange}
          disabled={uploading}
          className="w-full"
        />
        <p className="text-sm text-gray-500 mt-1">
          Supported files: Images, Videos, Audio, Documents (PDF, Word, Excel, PowerPoint), Text files, Archives
        </p>
      </div>

      {formData.media && formData.media.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {formData.media.map((item: any, index: number) => (
            <div key={index} className="relative group">
              {getFilePreview(item)}
              <button
                onClick={() => removeMedia(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove file"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}