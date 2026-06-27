"use client";

import { Bell, Search, User, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Topbar() {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-6">
      {/* Search */}
      <div className="relative w-80">
        <Search
          className={cn(
            "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors duration-150",
            searchFocused
              ? "text-primary"
              : "text-muted-foreground"
          )}
          strokeWidth={2}
        />
        <input
          type="text"
          placeholder="Search filings, documents..."
          className={cn(
            "h-9 w-full rounded-lg border bg-background pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground transition-all duration-150",
            searchFocused
              ? "border-primary ring-2 ring-primary/20"
              : "border-input hover:border-border/80 focus:border-primary focus:outline-none"
          )}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" strokeWidth={2} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
        </button>

        {/* User menu */}
        <button
          type="button"
          className="flex h-9 items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-foreground transition-colors duration-150 hover:bg-accent"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
            <User className="h-3.5 w-3.5 text-primary" strokeWidth={2.5} />
          </div>
          <span className="font-medium">Jane Smith</span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
}
