import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, RefreshCw, Check, Upload, AlertCircle } from 'lucide-react';
import { compressImage, CompressionResult } from '../utils/imageCompressor';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCaptureComplete: (compressed: CompressionResult) => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCaptureComplete,
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Start Camera
  const startCamera = async (mode: 'environment' | 'user') => {
    try {
      setCameraError(null);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.warn('Camera access denied or unavailable:', err);
      setCameraError('Camera access unavailable. You can upload a photo from your gallery or files instead.');
    }
  };

  useEffect(() => {
    if (isOpen && !capturedPreview) {
      startCamera(facingMode);
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isOpen, facingMode, capturedPreview]);

  if (!isOpen) return null;

  const handleSnap = async () => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const rawDataUrl = canvas.toDataURL('image/jpeg', 0.95);
    setCapturedPreview(rawDataUrl);

    // Stop live stream while reviewing
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
  };

  const handleConfirm = async () => {
    if (!capturedPreview) return;
    setIsCompressing(true);
    try {
      const result = await compressImage(capturedPreview);
      onCaptureComplete(result);
      onClose();
    } catch (err) {
      console.error('Compression failed:', err);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleRetake = () => {
    setCapturedPreview(null);
    startCamera(facingMode);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    try {
      const result = await compressImage(file);
      onCaptureComplete(result);
      onClose();
    } catch (err) {
      console.error('Failed to compress uploaded photo:', err);
    } finally {
      setIsCompressing(false);
    }
  };

  const toggleFacing = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col justify-between p-4 animate-in fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between text-white max-w-xl mx-auto w-full z-10">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-bold tracking-tight">
            {capturedPreview ? 'Review Document Photo' : 'Align Document in Frame'}
          </span>
        </div>
        <button
          onClick={onClose}
          type="button"
          aria-label="Close camera"
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Viewport */}
      <div className="flex-1 max-w-xl mx-auto w-full my-auto flex items-center justify-center relative overflow-hidden rounded-2xl bg-black">
        {capturedPreview ? (
          <img
            src={capturedPreview}
            alt="Snapped document"
            className="w-full h-auto max-h-[65vh] object-contain rounded-2xl"
          />
        ) : cameraError ? (
          <div className="p-6 text-center text-white space-y-4">
            <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
            <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
              {cameraError}
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              type="button"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition inline-flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>Choose Photo from Gallery</span>
            </button>
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover rounded-2xl"
            />
            {/* Document viewfinder outline guide */}
            <div className="absolute inset-4 border-2 border-emerald-400/70 border-dashed rounded-xl pointer-events-none flex flex-col justify-between p-3">
              <span className="text-[10px] bg-black/60 text-emerald-300 px-2 py-0.5 rounded self-start font-mono">
                Hold still • Ensure text is clear
              </span>
              <div className="flex justify-between text-[10px] text-white/50 font-mono">
                <span>[ TOP LEFT ]</span>
                <span>[ BOTTOM RIGHT ]</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Bottom Controls */}
      <div className="max-w-xl mx-auto w-full pt-3 flex items-center justify-around z-10">
        {capturedPreview ? (
          <div className="flex items-center justify-center gap-4 w-full">
            <button
              onClick={handleRetake}
              type="button"
              disabled={isCompressing}
              className="h-12 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center gap-2 transition"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retake Photo</span>
            </button>

            <button
              onClick={handleConfirm}
              type="button"
              disabled={isCompressing}
              className="h-12 px-8 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg transition active:scale-95"
            >
              {isCompressing ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Check className="w-4 h-4 stroke-[3]" />
              )}
              <span>Analyze Now</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full px-6">
            <button
              onClick={() => fileInputRef.current?.click()}
              type="button"
              title="Upload file or gallery photo"
              className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
            >
              <Upload className="w-5 h-5" />
            </button>

            {/* Shutter Button */}
            <button
              onClick={handleSnap}
              type="button"
              aria-label="Capture document photo"
              className="w-18 h-18 rounded-full border-4 border-white flex items-center justify-center p-1 active:scale-90 transition shadow-xl"
            >
              <div className="w-full h-full bg-white rounded-full hover:bg-emerald-400 transition" />
            </button>

            {/* Switch Camera */}
            <button
              onClick={toggleFacing}
              type="button"
              title="Switch front/back camera"
              className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
