"use client";

import { Shield, Smartphone, Key, ExternalLink } from "lucide-react";

export function SecuritySettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Security</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account security and authentication settings.
        </p>
      </div>

      {/* Change Password */}
      <div className="rounded-card border border-border p-5 space-y-4">
        <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
          <Key className="h-4 w-4 text-muted-foreground" />
          Change Password
        </h3>
        <div className="space-y-3">
          <div>
            <label htmlFor="sec-current-password" className="block text-sm font-medium text-foreground">
              Current Password
            </label>
            <input
              id="sec-current-password"
              type="password"
              placeholder="••••••••"
              className="mt-1 w-full rounded-input border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label htmlFor="sec-new-password" className="block text-sm font-medium text-foreground">
              New Password
            </label>
            <input
              id="sec-new-password"
              type="password"
              placeholder="••••••••"
              className="mt-1 w-full rounded-input border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label htmlFor="sec-confirm-password" className="block text-sm font-medium text-foreground">
              Confirm New Password
            </label>
            <input
              id="sec-confirm-password"
              type="password"
              placeholder="••••••••"
              className="mt-1 w-full rounded-input border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-soft-sm transition-opacity hover:opacity-90"
        >
          Update Password
        </button>
      </div>

      {/* Two-Factor Authentication */}
      <div className="rounded-card border border-border p-5 space-y-4">
        <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
          <Smartphone className="h-4 w-4 text-muted-foreground" />
          Two-Factor Authentication
        </h3>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">
              Add an extra layer of security to your account by enabling two-factor authentication.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Currently: <span className="font-medium text-warning">Not enabled</span>
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            <Shield className="h-4 w-4" />
            Enable 2FA
          </button>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="rounded-card border border-border p-5 space-y-4">
        <h3 className="text-sm font-medium text-foreground">Active Sessions</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-border bg-surface p-3">
            <div>
              <p className="text-sm font-medium text-foreground">Current Session</p>
              <p className="text-xs text-muted-foreground">Chrome on macOS · Auckland, NZ</p>
            </div>
            <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
              Active
            </span>
          </div>
        </div>
        <button
          type="button"
          className="text-sm font-medium text-destructive hover:underline"
        >
          Revoke all other sessions
        </button>
      </div>

      {/* Danger Zone */}
      <div className="rounded-card border border-destructive/30 bg-destructive/5 p-5 space-y-4">
        <h3 className="text-sm font-medium text-destructive">Danger Zone</h3>
        <p className="text-sm text-muted-foreground">
          Once you delete your account, there is no going back. This action is permanent.
        </p>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-destructive/30 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}
