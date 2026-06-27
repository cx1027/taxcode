"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Mail, Bell, FileText, AlertTriangle, CheckCircle } from "lucide-react";

interface NotificationSettingsProps {
  onSave: (settings: NotificationSettings) => void;
}

export interface NotificationSettings {
  emailFilingUpdates: boolean;
  emailDeadlineReminders: boolean;
  emailTaxAlerts: boolean;
  emailPromotions: boolean;
  pushFilingUpdates: boolean;
  pushDeadlineReminders: boolean;
  pushTaxAlerts: boolean;
}

function ToggleSwitch({
  checked,
  onChange,
  label,
  description,
  icon: Icon,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="flex items-start gap-3 min-w-0">
        {Icon && (
          <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-secondary">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200",
          checked ? "bg-primary" : "bg-muted"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}

export function NotificationSettingsForm({
  onSave,
}: NotificationSettingsProps) {
  const [settings, setSettings] = useState<NotificationSettings>({
    emailFilingUpdates: true,
    emailDeadlineReminders: true,
    emailTaxAlerts: true,
    emailPromotions: false,
    pushFilingUpdates: true,
    pushDeadlineReminders: true,
    pushTaxAlerts: false,
  });

  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(settings);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage how and when you receive notifications.
        </p>
      </div>

      {/* Email Notifications */}
      <div className="rounded-card border border-border p-5">
        <h3 className="text-sm font-medium text-foreground flex items-center gap-2 mb-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          Email Notifications
        </h3>
        <div className="divide-y divide-border">
          <ToggleSwitch
            checked={settings.emailFilingUpdates}
            onChange={(v) => updateSetting("emailFilingUpdates", v)}
            label="Filing Updates"
            description="Get notified when your filing status changes"
            icon={FileText}
          />
          <ToggleSwitch
            checked={settings.emailDeadlineReminders}
            onChange={(v) => updateSetting("emailDeadlineReminders", v)}
            label="Deadline Reminders"
            description="Reminders for upcoming tax deadlines"
            icon={AlertTriangle}
          />
          <ToggleSwitch
            checked={settings.emailTaxAlerts}
            onChange={(v) => updateSetting("emailTaxAlerts", v)}
            label="Tax Alerts"
            description="Important tax law changes and updates"
            icon={Bell}
          />
          <ToggleSwitch
            checked={settings.emailPromotions}
            onChange={(v) => updateSetting("emailPromotions", v)}
            label="Promotions"
            description="Product offers and promotional content"
          />
        </div>
      </div>

      {/* Push Notifications */}
      <div className="rounded-card border border-border p-5">
        <h3 className="text-sm font-medium text-foreground flex items-center gap-2 mb-2">
          <Bell className="h-4 w-4 text-muted-foreground" />
          Push Notifications
        </h3>
        <div className="divide-y divide-border">
          <ToggleSwitch
            checked={settings.pushFilingUpdates}
            onChange={(v) => updateSetting("pushFilingUpdates", v)}
            label="Filing Updates"
            description="Push notifications for status changes"
            icon={FileText}
          />
          <ToggleSwitch
            checked={settings.pushDeadlineReminders}
            onChange={(v) => updateSetting("pushDeadlineReminders", v)}
            label="Deadline Reminders"
            description="Push reminders for deadlines"
            icon={AlertTriangle}
          />
          <ToggleSwitch
            checked={settings.pushTaxAlerts}
            onChange={(v) => updateSetting("pushTaxAlerts", v)}
            label="Tax Alerts"
            description="Push alerts for tax changes"
            icon={Bell}
          />
        </div>
      </div>

      {/* Save button */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-soft-sm transition-opacity hover:opacity-90"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
}
