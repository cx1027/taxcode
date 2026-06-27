"use client";

import { useState, useMemo, useCallback } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/layout";
import { UploadPanel } from "@/components/documents/upload-panel";
import { DocumentTable } from "@/components/documents/document-table";
import { DocumentFilters } from "@/components/documents/document-filters";
import { DocumentPreviewDialog } from "@/components/documents/document-preview-dialog";
import { api } from "@/lib/api";
import type { MockDocument } from "@/lib/schemas/filing";
import type { DocumentStatus } from "@/lib/schemas/filing";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<MockDocument[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [previewDoc, setPreviewDoc] = useState<MockDocument | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load documents on mount
  useState(() => {
    async function load() {
      try {
        const docs = await api.documents.list();
        setDocuments(docs);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  });

  // Filter documents
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      // Status filter
      if (statusFilter !== "all" && doc.status !== statusFilter) {
        return false;
      }
      // Type filter
      if (typeFilter !== "all" && doc.documentType !== typeFilter) {
        return false;
      }
      // Search filter
      if (search.trim()) {
        const query = search.toLowerCase();
        return (
          doc.fileName.toLowerCase().includes(query) ||
          doc.documentType.toLowerCase().includes(query) ||
          (doc.filingName && doc.filingName.toLowerCase().includes(query))
        );
      }
      return true;
    });
  }, [documents, search, statusFilter, typeFilter]);

  // Handle file upload
  const handleFilesSelected = useCallback(
    async (files: File[]) => {
      for (const file of files) {
        // Determine document type from filename
        let docType = "Other";
        const name = file.name.toLowerCase();
        if (name.includes("w-2") || name.includes("w2")) docType = "W-2";
        else if (name.includes("1099")) docType = "1099";
        else if (name.includes("1098")) docType = "1098";
        else if (name.includes("receipt")) docType = "Receipt";
        else if (name.includes("id") || name.includes("license")) docType = "ID";

        await api.documents.create({
          filingId: "",
          fileName: file.name,
          documentType: docType as MockDocument["documentType"],
          size: file.size,
        });
      }
      // Reload documents
      const docs = await api.documents.list();
      setDocuments(docs);
      setShowUpload(false);
    },
    []
  );

  // Handle delete
  const handleDelete = useCallback(async (id: string) => {
    await api.documents.delete(id);
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Documents"
        description="Upload and manage tax documents"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Documents" },
        ]}
        actions={
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-soft-sm transition-opacity hover:opacity-90"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            Upload Documents
          </button>
        }
      />

      {/* Upload panel (collapsible) */}
      {showUpload && (
        <div className="rounded-card border border-border bg-card p-5">
          <h3 className="text-sm font-medium text-foreground mb-4">
            Upload New Documents
          </h3>
          <UploadPanel onFilesSelected={handleFilesSelected} />
        </div>
      )}

      {/* Filters */}
      <DocumentFilters
        searchValue={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        resultCount={filteredDocuments.length}
      />

      {/* Document table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : (
        <DocumentTable
          documents={filteredDocuments}
          onDelete={handleDelete}
          onPreview={setPreviewDoc}
        />
      )}

      {/* Preview dialog */}
      <DocumentPreviewDialog
        document={previewDoc}
        onClose={() => setPreviewDoc(null)}
      />
    </div>
  );
}
