import React, { useState, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, Download, Trash2, RefreshCw } from 'lucide-react';
import { getFile, deleteFile } from '../utils/storage';

interface FullScreenImageViewerProps {
  fileId: string;
  onClose: () => void;
  onDelete?: (fileId: string) => void;
  onReplace?: () => void; // Could trigger a file input click in parent
  title?: string;
}

export function FullScreenImageViewer({ fileId, onClose, onDelete, onReplace, title = "Photo Preview" }: FullScreenImageViewerProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchImage = async () => {
      setLoading(true);
      try {
        const data = await getFile(fileId);
        if (isMounted) {
          setImgSrc(data);
          setLoading(false);
        }
      } catch (e) {
        console.error("Failed to load image", e);
        if (isMounted) setLoading(false);
      }
    };
    if (fileId) fetchImage();
    return () => { isMounted = false; };
  }, [fileId]);

  const handleZoomIn = () => setZoom(z => Math.min(z + 0.5, 3));
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.5, 0.5));
  const handleRotate = () => setRotation(r => r + 90);

  const handleDownload = () => {
    if (!imgSrc) return;
    const a = document.createElement('a');
    a.href = imgSrc;
    a.download = `photo_${Date.now()}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteFile(fileId);
      if (onDelete) onDelete(fileId);
      onClose();
    } catch (e) {
      console.error("Failed to delete file", e);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center backdrop-blur-md">
        <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!imgSrc) {
    return (
      <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center backdrop-blur-md p-5 text-center">
        <div className="bg-white/10 p-6 rounded-2xl">
          <p className="text-white font-bold mb-4">Image not found or deleted.</p>
          <button onClick={onClose} className="px-6 py-2 bg-white text-black font-bold rounded-xl">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/95 z-[100] flex flex-col backdrop-blur-md animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent">
        <h3 className="text-white font-bold text-[15px]">{title}</h3>
        <button onClick={onClose} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Image Area */}
      <div className="flex-1 overflow-hidden flex items-center justify-center relative touch-none">
        <div 
          className="transition-transform duration-200 ease-out"
          style={{ transform: `scale(${zoom}) rotate(${rotation}deg)` }}
        >
          <img 
            src={imgSrc} 
            alt="Preview" 
            className="max-w-full max-h-[70vh] object-contain drop-shadow-2xl"
          />
        </div>
      </div>

      {/* Controls Bar */}
      <div className="p-6 bg-gradient-to-t from-black/80 to-transparent pb-8">
        <div className="flex items-center justify-center gap-6 mb-6">
          <button onClick={handleZoomOut} className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white active:scale-95 transition-all">
            <ZoomOut className="w-6 h-6" />
          </button>
          <button onClick={handleRotate} className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white active:scale-95 transition-all">
            <RotateCw className="w-6 h-6" />
          </button>
          <button onClick={handleZoomIn} className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white active:scale-95 transition-all">
            <ZoomIn className="w-6 h-6" />
          </button>
        </div>

        <div className="flex gap-3 max-w-sm mx-auto">
          {onReplace && (
            <button onClick={onReplace} className="flex-1 py-3.5 bg-slate-800 text-white rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 border border-slate-700 active:scale-95 transition-all">
              <RefreshCw className="w-4 h-4" /> Replace
            </button>
          )}
          <button onClick={handleDownload} className="flex-1 py-3.5 bg-blue-600 text-white rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 active:scale-95 transition-all">
            <Download className="w-4 h-4" /> Save
          </button>
          {onDelete && (
            <button onClick={() => setShowConfirmDelete(true)} className="flex-1 py-3.5 bg-rose-600 text-white rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 active:scale-95 transition-all">
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="absolute inset-0 bg-black/60 z-[110] flex items-center justify-center p-5 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-[24px] p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95">
            <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Trash2 className="w-6 h-6 text-rose-600" />
            </div>
            <h3 className="text-center text-lg font-black text-slate-800 mb-2">Delete this photo?</h3>
            <p className="text-center text-sm font-medium text-slate-500 mb-6">Are you sure? This photo will be permanently deleted and cannot be recovered.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirmDelete(false)} className="flex-1 py-3.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-[14px]">Cancel</button>
              <button onClick={handleDeleteConfirm} className="flex-1 py-3.5 bg-rose-600 text-white rounded-xl font-bold text-[14px] shadow-[0_4px_12px_rgba(225,29,72,0.3)]">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
