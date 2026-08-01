import React, { useState, useEffect } from 'react';
import { getFile } from '../utils/storage';

interface StorageImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fileId?: string | null;
  fallbackBase64?: string | null;
  fallbackIcon?: React.ReactNode;
}

export function StorageImage({ fileId, fallbackBase64, fallbackIcon, className, alt, ...props }: StorageImageProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchImage = async () => {
      if (fileId && fileId.startsWith('file_')) {
        setLoading(true);
        try {
          const data = await getFile(fileId);
          if (isMounted) {
            setImgSrc(data);
          }
        } catch (e) {
          console.error("Failed to load image from storage", e);
        } finally {
          if (isMounted) setLoading(false);
        }
      } else if (fileId) {
        // In case it's actually a base64 string directly (legacy)
        setImgSrc(fileId);
      } else if (fallbackBase64) {
        setImgSrc(fallbackBase64);
      } else {
        setImgSrc(null);
      }
    };

    fetchImage();
    return () => { isMounted = false; };
  }, [fileId, fallbackBase64]);

  if (loading) {
    return <div className={`flex items-center justify-center bg-slate-100 animate-pulse ${className || ''}`} />;
  }

  if (!imgSrc) {
    if (fallbackIcon) {
      return <div className={`flex items-center justify-center ${className || ''}`}>{fallbackIcon}</div>;
    }
    return <div className={`bg-slate-100 ${className || ''}`} />;
  }

  return <img src={imgSrc} alt={alt || "Image"} className={className} {...props} />;
}
