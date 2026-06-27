"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout";
import { ProfileSettingsForm, type ProfileData } from "@/components/settings/profile-settings-form";
import { TaxProfileSettingsForm, type TaxProfileData } from "@/components/settings/tax-profile-settings-form";
import { NotificationSettingsForm, type NotificationSettings } from "@/components/settings/notification-settings-form";
import { SecuritySettings } from "@/components/settings/security-settings";

type TabId = "profile" | "tax-profile" | "notifications" | "security";

interface NavItem {
  id: TabId;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "profile", label: "Profile" },
  { id: "tax-profile", label: "Tax Profile" },
  { id: "notifications", label: "Notifications" },
  { id: "security", label: "Security" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  const handleProfileSave = (data: ProfileData) => {
    // Mock save
    console.log("Profile saved:", data);
  };

  const handleTaxProfileSave = (data: TaxProfileData) => {
    // Mock save
    console.log("Tax Profile saved:", data);
  };

  const handleNotificationSave = (data: NotificationSettings) => {
    // Mock save
    console.log("Notification preferences saved:", data);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your account and application preferences"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Settings" },
        ]}
      />

      {/* Tab navigation (mobile-friendly) */}
      <div className="flex gap-1 overflow-x-auto rounded-card border border-border bg-card p-1">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex-1 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === item.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="rounded-card border border-border bg-card p-6">
        {activeTab === "profile" && (
          <ProfileSettingsForm onSubmit={handleProfileSave} />
        )}
        {activeTab === "tax-profile" && (
          <TaxProfileSettingsForm onSubmit={handleTaxProfileSave} />
        )}
        {activeTab === "notifications" && (
          <NotificationSettingsForm onSave={handleNotificationSave} />
        )}
        {activeTab === "security" && <SecuritySettings />}
      </div>
    </div>
  );
}
