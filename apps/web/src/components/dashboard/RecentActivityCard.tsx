"use client";

import { cn } from "@/lib/utils";
import { Activity } from "lucide-react";
import { MOCK_ACTIVITIES } from "@/lib/mock-data";
import type { MockActivity } from "@/lib/mock-data";

function ActivityItem({ activity }: { activity: MockActivity }) {
  return (
    <div className="flex items-start gap-sm py-sm">
      <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
      <div>
        <p className="text-xs text-foreground leading-relaxed">{activity.text}</p>
        <p className="text-helper text-text-muted">{activity.time}</p>
      </div>
    </div>
  );
}

export function RecentActivityCard({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-card border border-border bg-card shadow-soft-sm", className)}>
      <div className="flex items-center gap-sm border-b border-border px-lg py-md">
        <Activity className="h-4 w-4 text-primary" strokeWidth={1.75} />
        <h2 className="text-card-title text-foreground">Recent Activity</h2>
      </div>
      <div className="px-lg py-xs">
        {MOCK_ACTIVITIES.map((activity, i) => (
          <div key={activity.id}>
            <ActivityItem activity={activity} />
            {i < MOCK_ACTIVITIES.length - 1 && (
              <div className="ml-2 border-l border-border pl-2.5" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
