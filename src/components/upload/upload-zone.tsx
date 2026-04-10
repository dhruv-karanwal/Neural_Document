"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileImage, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  onUpload: (file: File) => void;
  isUploading: boolean;
}

export function UploadZone({ onUpload, isUploading }: UploadZoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onUpload(acceptedFiles[0]);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
    disabled: isUploading,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative group cursor-pointer w-full h-full min-h-[400px] flex flex-col items-center justify-center rounded-3xl border-2 border-dashed transition-all duration-300",
        isDragActive 
          ? "border-primary bg-primary/5 scale-[0.98]" 
          : "border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5",
        isUploading && "pointer-events-none opacity-50"
      )}
    >
      <input {...getInputProps()} />
      
      <AnimatePresence mode="wait">
        {isUploading ? (
          <motion.div
            key="uploading"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="relative">
              <Loader2 className="w-16 h-16 text-primary animate-spin" />
              <div className="absolute inset-0 bg-primary/20 blur-xl animate-pulse" />
            </div>
            <p className="text-lg font-medium animate-pulse">Processing Document...</p>
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center gap-6 text-center px-6"
          >
            <div className="relative p-6 rounded-3xl bg-primary/10 group-hover:bg-primary/20 transition-all duration-500">
              <Upload className="w-12 h-12 text-primary group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full animate-ping" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold tracking-tight">Upload Document</h3>
              <p className="text-muted-foreground max-w-[280px]">
                Drag and drop your image here, or click to browse files
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground/60">
              <div className="flex items-center gap-1">
                <FileImage className="w-4 h-4" />
                PNG, JPG, WEBP
              </div>
              <span>•</span>
              <div>Max 10MB</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
