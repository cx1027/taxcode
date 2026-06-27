"use client";

import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Upload, FileUp, X, AlertCircle } from "lucide-react";

interface UploadPanelProps {
  onFilesSelected: (files: File[]) => void;
  maxSizeMB?: number;
  accept?: string;
  multiple?: boolean;
}

interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  error?: string;
}

const ACCEPTED_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function UploadPanel({
  onFilesSelected,
  maxSizeMB = 10,
  accept: acceptProp,
  multiple = true,
}: UploadPanelProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedAccept = acceptProp ?? ACCEPTED_TYPES.join(",");

  const validateFile = useCallback(
    (file: File): string | null => {
      const maxSize = maxSizeMB * 1024 * 1024;
      if (file.size > maxSize) {
        return `File exceeds ${maxSizeMB}MB limit`;
      }
      if (!ACCEPTED_TYPES.includes(file.type)) {
        return "Only PDF, PNG, JPG, and WEBP files are accepted";
      }
      return null;
    },
    [maxSizeMB]
  );

  const processFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const validFiles: File[] = [];
      const newUploading: UploadingFile[] = [];

      fileArray.forEach((file) => {
        const error = validateFile(file);
        const id = `${file.name}-${Date.now()}-${Math.random()}`;
        if (error) {
          newUploading.push({ id, file, progress: 0, error });
        } else {
          validFiles.push(file);
          newUploading.push({ id, file, progress: 0 });
        }
      });

      setUploadingFiles((prev) => [...prev, ...newUploading]);

      // Simulate upload progress for valid files
      validFiles.forEach((file) => {
        const id = newUploading.find((u) => u.file === file)?.id;
        if (id) simulateUploadProgress(id);
      });

      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
    },
    [validateFile, onFilesSelected]
  );

  const simulateUploadProgress = useCallback((id: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30 + 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        // Remove from uploading after a brief pause
        setTimeout(() => {
          setUploadingFiles((prev) => prev.filter((f) => f.id !== id));
        }, 500);
      }
      setUploadingFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, progress: Math.min(100, progress) } : f))
      );
    }, 200);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files);
      }
    },
    [processFiles]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        processFiles(e.target.files);
        // Reset input so same file can be re-selected
        e.target.value = "";
      }
    },
    [processFiles]
  );

  const removeUploadingFile = useCallback((id: string) => {
    setUploadingFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "relative flex cursor-pointer flex-col items-center justify-center rounded-card border-2 border-dashed p-8 transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-secondary/20"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedAccept}
          multiple={multiple}
          onChange={handleFileInput}
          className="hidden"
          aria-label="Upload documents"
        />
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full transition-colors",
            isDragging ? "bg-primary/20" : "bg-secondary"
          )}
        >
          <Upload
            className={cn("h-6 w-6", isDragging ? "text-primary" : "text-muted-foreground")}
          />
        </div>
        <p className="mt-3 text-sm font-medium text-foreground">
          {isDragging ? "Drop files here" : "Drag & drop files here"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          or <span className="text-primary font-medium">browse files</span>
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          PDF, PNG, JPG, WEBP · Max {maxSizeMB}MB per file
        </p>
      </div>

      {/* Uploading files list */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          {uploadingFiles.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
            >
              <FileUp className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="truncate text-sm font-medium text-foreground">
                    {item.file.name}
                  </p>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {formatFileSize(item.file.size)}
                  </span>
                </div>
                {item.error ? (
                  <div className="mt-1 flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="h-3 w-3" />
                    {item.error}
                  </div>
                ) : (
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-200"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                )}
              </div>
              <button
                onClick={() => removeUploadingFile(item.id)}
                className="flex-shrink-0 text-muted-foreground hover:text-foreground"
                aria-label="Remove"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
