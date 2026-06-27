"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Trash2,
  Eye,
  Download,
  File,
  Image,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DataTable, type Column } from "@/components/ui/data-table";
import { DocumentStatusBadge } from "./document-status-badge";
import { DocumentFilters } from "./document-filters";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import type { MockDocument } from "@/lib/schemas/filing";

interface DocumentTableProps {
  documents: MockDocument[];
  onDelete: (id: string) => void;
  onPreview: (doc: MockDocument) => void;
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
    month: "short",
    day: "numeric",
  });
}

function getFileIcon(type: string) {
  if (type === "Receipt" || type === "ID") return Image;
  return FileText;
}

export function DocumentTable({ documents, onDelete, onPreview }: DocumentTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleDeleteConfirm = useCallback(() => {
    if (deleteTarget) {
      onDelete(deleteTarget);
      setDeleteTarget(null);
    }
  }, [deleteTarget, onDelete]);

  const columns: Column<MockDocument>[] = [
    {
      key: "name",
      header: "File Name",
      className: "w-[35%]",
      render: (doc) => {
        const Icon = getFileIcon(doc.documentType);
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {doc.fileName}
              </p>
              <p className="text-xs text-muted-foreground">{doc.documentType}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: "filingId",
      header: "Linked Filing",
      className: "w-[20%]",
      render: (doc) => (
        <span className="text-sm text-foreground truncate">
          {doc.filingName || "—"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      className: "w-[13%]",
      render: (doc) => <DocumentStatusBadge status={doc.status} size="sm" />,
    },
    {
      key: "size",
      header: "Size",
      className: "w-[10%]",
      render: (doc) => (
        <span className="text-sm text-muted-foreground tabular-nums">
          {formatFileSize(doc.size)}
        </span>
      ),
    },
    {
      key: "uploadedAt",
      header: "Uploaded",
      className: "w-[12%]",
      render: (doc) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(doc.uploadedAt)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "w-[10%]",
      cellClassName: "text-right",
      render: (doc) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPreview(doc);
            }}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Preview"
            title="Preview"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Download placeholder
            }}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Download"
            title="Download"
          >
            <Download className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteTarget(doc.id);
            }}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            aria-label="Delete"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={documents}
        keyExtractor={(doc) => doc.id}
        onRowClick={onPreview}
        emptyMessage="No documents found. Upload your first document to get started."
      />

      <ConfirmationDialog
        open={deleteTarget !== null}
        title="Delete Document"
        message="Are you sure you want to delete this document? This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
