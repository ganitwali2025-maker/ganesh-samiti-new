import React, { useRef, useState } from 'react';
import { Camera, Upload, Loader2, X } from 'lucide-react';
import { saveFile } from '../utils/storage';

interface ImageUploaderProps {
  label?: string;
  onUpload: (fileId: string) => void;
  className?: string;
}

export function ImageUploader({ label = "Upload Photo", onUpload, className = "" }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // Create a local preview immediately
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      // Read file and compress it slightly using Canvas
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = async () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Max dimension 1200px
          const MAX_SIZE = 1200;
          if (width > height && width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          } else if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Convert to Base64 (JPEG, 0.8 quality)
          const base64Data = canvas.toDataURL('image/jpeg', 0.8);
          
          // Save to IndexedDB
          const fileId = await saveFile(base64Data);
          onUpload(fileId);
          setIsUploading(false);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading file:", error);
      setIsUploading(false);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onUpload(''); // Trigger clear
  };

  return (
    <div className={`relative ${className}`}>
      <input 
        type="file" 
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      
      {!preview ? (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-24 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors"
        >
          {isUploading ? (
            <Loader2 className="w-6 h-6 animate-spin text-theme-primary mb-1" />
          ) : (
            <Camera className="w-6 h-6 mb-1 opacity-70" />
          )}
          <span className="text-[12px] font-bold">{isUploading ? 'Saving...' : label}</span>
        </button>
      ) : (
        <div className="relative w-full h-24 rounded-2xl overflow-hidden border border-slate-200">
          <img src={preview} alt="Upload preview" className="w-full h-full object-cover" />
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white backdrop-blur-sm">
              <Loader2 className="w-6 h-6 animate-spin mb-1" />
              <span className="text-[10px] font-bold">Saving...</span>
            </div>
          )}
          {!isUploading && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute top-2 right-2 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-white backdrop-blur-sm shadow-sm"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
