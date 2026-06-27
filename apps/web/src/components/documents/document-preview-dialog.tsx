"use client";

import { useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { X, Download, ExternalLink, FileText } from "lucide-react";
import type { MockDocument } from "@/lib/schemas/filing";
import { DocumentStatusBadge } from "./document-status-badge";

interface DocumentPreviewDialogProps {
  document: MockDocument | null;
  onClose: () => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function DocumentPreviewDialog({
  document,
  onClose,
}: DocumentPreviewDialogProps) {
  // Close on Escape key
  const stableOnClose = useCallback(onClose, [onClose]);

  useEffect(() => {
    if (!document) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") stableOnClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [document, stableOnClose]);

  if (!document) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col rounded-card border border-border bg-card shadow-soft-lg animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-base font-semibold text-foreground">
                {document.fileName}
              </h2>
              <p className="text-xs text-muted-foreground">
                {document.documentType} · {formatFileSize(document.size)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Preview area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Placeholder preview */}
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-surface-subtle py-16">
            <FileText className="h-16 w-16 text-muted-foreground/30" />
            <p className="mt-4 text-sm text-muted-foreground">
              Preview not available in demo mode
            </p>
            <p className="mt-1 text-xs text-muted-foreground/60">
              File type: {document.documentType}
            </p>
          </div>

          {/* Metadata */}
          <div className="mt-6 space-y-4">
            <h3 className="text-sm font-medium text-foreground">Document Details</h3>
            <div className="grid gap-3 rounded-lg border border-border p-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <div className="mt-1">
                  <DocumentStatusBadge status={document.status} size="sm" />
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Uploaded</p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {formatDate(document.uploadedAt)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Linked Filing</p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {document.filingName || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">File Size</p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {formatFileSize(document.size)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            Close
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            onClick={() => {
              // Download placeholder
            }}
          >
            <Download className="h-4 w-4" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
}
