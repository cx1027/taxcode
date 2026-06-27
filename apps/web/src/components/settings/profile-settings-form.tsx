"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InlineFieldError } from "@/components/forms/validation-summary";
import { User, Mail, Phone, MapPin } from "lucide-react";

interface ProfileSettingsFormProps {
  defaultValues?: Partial<ProfileData>;
  onSubmit: (data: ProfileData) => void;
}

export interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}

const ProfileSchema = {
  firstName: { min: 1, message: "First name is required" },
  lastName: { min: 1, message: "Last name is required" },
  email: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address" },
};

export function ProfileSettingsForm({
  defaultValues,
  onSubmit,
}: ProfileSettingsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileData>({
    defaultValues: {
      firstName: defaultValues?.firstName ?? "",
      lastName: defaultValues?.lastName ?? "",
      email: defaultValues?.email ?? "",
      phone: defaultValues?.phone ?? "",
      address: defaultValues?.address ?? "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Profile</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your personal information and contact details.
        </p>
      </div>

      {/* Name section */}
      <div className="rounded-card border border-border p-5 space-y-4">
        <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          Name
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="profile-firstName" className="block text-sm font-medium text-foreground">
              First Name
            </label>
            <input
              {...register("firstName", ProfileSchema.firstName)}
              id="profile-firstName"
              className="mt-1 w-full rounded-input border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <InlineFieldError message={errors.firstName?.message} />
          </div>
          <div>
            <label htmlFor="profile-lastName" className="block text-sm font-medium text-foreground">
              Last Name
            </label>
            <input
              {...register("lastName", ProfileSchema.lastName)}
              id="profile-lastName"
              className="mt-1 w-full rounded-input border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <InlineFieldError message={errors.lastName?.message} />
          </div>
        </div>
      </div>

      {/* Contact section */}
      <div className="rounded-card border border-border p-5 space-y-4">
        <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          Contact
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="profile-email" className="block text-sm font-medium text-foreground">
              Email
            </label>
            <input
              {...register("email", {
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
              id="profile-email"
              type="email"
              className="mt-1 w-full rounded-input border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <InlineFieldError message={errors.email?.message} />
          </div>
          <div>
            <label htmlFor="profile-phone" className="block text-sm font-medium text-foreground">
              Phone
            </label>
            <input
              {...register("phone")}
              id="profile-phone"
              type="tel"
              placeholder="+64 21 123 4567"
              className="mt-1 w-full rounded-input border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <InlineFieldError message={errors.phone?.message} />
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="rounded-card border border-border p-5 space-y-4">
        <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          Address
        </h3>
        <div>
          <label htmlFor="profile-address" className="block text-sm font-medium text-foreground">
            Mailing Address
          </label>
          <input
            {...register("address")}
            id="profile-address"
            placeholder="123 Main St, Auckland 1010"
            className="mt-1 w-full rounded-input border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <InlineFieldError message={errors.address?.message} />
        </div>
      </div>

      {/* Save button */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="submit"
          disabled={!isDirty}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-soft-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}
