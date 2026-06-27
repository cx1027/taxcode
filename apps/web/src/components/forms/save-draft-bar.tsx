"use client";

import { useState, useEffect } from "react";
import { Save, CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SaveDraftBarProps {
  onSave: () => Promise<void>;
  hasChanges: boolean;
  className?: string;
}

type SaveStatus = "idle" | "saving" | "saved";

export function SaveDraftBar({ onSave, hasChanges, className }: SaveDraftBarProps) {
  const [status, setStatus] = useState<SaveStatus>("idle");

  // Reset status to idle after "saved" message
  useEffect(() => {
    if (status === "saved") {
      const timer = setTimeout(() => setStatus("idle"), 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleSave = async () => {
    if (status === "saving") return;
    setStatus("saving");
    try {
      await onSave();
      setStatus("saved");
    } catch {
      setStatus("idle");
    }
  };

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-surface/95 backdrop-blur-sm",
        className
      )}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        {/* Status text */}
        <div className="flex items-center gap-2 text-sm">
          {status === "saving" && (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              <span className="text-muted-foreground">Saving...</span>
            </>
          )}
          {status === "saved" && (
            <>
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-success">Draft saved</span>
            </>
          )}
          {status === "idle" && hasChanges && (
            <span className="text-muted-foreground">You have unsaved changes</span>
          )}
          {status === "idle" && !hasChanges && (
            <span className="text-muted-foreground">All changes saved</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={status === "saving" || !hasChanges}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
              hasChanges
                ? "bg-primary text-primary-foreground shadow-soft-sm hover:opacity-90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            <Save className="h-4 w-4" strokeWidth={2} />
            Save Draft
          </button>
        </div>
      </div>
    </div>
  );
}
