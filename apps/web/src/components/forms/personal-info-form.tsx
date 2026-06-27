"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import type { Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PersonalInfoSchema, type PersonalInfoInput } from "@/lib/schemas/filing";
import { InlineFieldError } from "./validation-summary";

interface PersonalInfoFormProps {
  defaultValues?: Partial<PersonalInfoInput>;
  onSubmit: (data: PersonalInfoInput) => void;
  onAutoSave?: (data: PersonalInfoInput) => void;
}

function TextInput({
  label,
  name,
  placeholder,
  type = "text",
  control,
  error,
  required = false,
}: {
  label: string;
  name: keyof PersonalInfoInput | "address.line1" | "address.line2" | "address.city" | "address.state" | "address.zip";
  placeholder?: string;
  type?: string;
  control: Control<PersonalInfoInput>;
  error?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <input
            {...field}
            id={name}
            type={type}
            placeholder={placeholder}
            className="mt-1 w-full rounded-input border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={String(field.value ?? "")}
          />
        )}
      />
      <InlineFieldError message={error} />
    </div>
  );
}

export function PersonalInfoForm({
  defaultValues,
  onSubmit,
  onAutoSave,
}: PersonalInfoFormProps) {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PersonalInfoInput>({
    resolver: zodResolver(PersonalInfoSchema),
    defaultValues: defaultValues,
    mode: "onBlur",
  });

  // Auto-save on change (debounced)
  const watchedValues = watch();
  useEffect(() => {
    if (!onAutoSave) return;
    const timer = setTimeout(() => {
      onAutoSave(watchedValues as PersonalInfoInput);
    }, 1000);
    return () => clearTimeout(timer);
  }, [watchedValues, onAutoSave]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Personal Information</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your basic details for this tax filing.
        </p>
      </div>

      {/* Name section */}
      <div className="rounded-card border border-border p-5 space-y-4">
        <h3 className="text-sm font-medium text-foreground">Name</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            label="First Name"
            name="firstName"
            placeholder="John"
            control={control}
            error={errors.firstName?.message}
            required
          />
          <TextInput
            label="Last Name"
            name="lastName"
            placeholder="Doe"
            control={control}
            error={errors.lastName?.message}
            required
          />
        </div>
      </div>

      {/* Tax details */}
      <div className="rounded-card border border-border p-5 space-y-4">
        <h3 className="text-sm font-medium text-foreground">Tax Details</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            label="IRD Number"
            name="irdNumber"
            placeholder="123-456-789"
            control={control}
            error={errors.irdNumber?.message}
            required
          />
          <TextInput
            label="Tax Year"
            name="taxYear"
            type="number"
            placeholder="2024"
            control={control}
            error={errors.taxYear?.message}
            required
          />
        </div>
      </div>

      {/* Address */}
      <div className="rounded-card border border-border p-5 space-y-4">
        <h3 className="text-sm font-medium text-foreground">Mailing Address</h3>
        <TextInput
          label="Address Line 1"
          name="address.line1"
          placeholder="123 Main Street"
          control={control}
          error={errors.address?.line1?.message}
          required
        />
        <TextInput
          label="Address Line 2"
          name="address.line2"
          placeholder="Apt 4B (optional)"
          control={control}
          error={errors.address?.line2?.message}
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <TextInput
            label="City"
            name="address.city"
            placeholder="Auckland"
            control={control}
            error={errors.address?.city?.message}
            required
          />
          <TextInput
            label="State / Region"
            name="address.state"
            placeholder="Auckland"
            control={control}
            error={errors.address?.state?.message}
            required
          />
          <TextInput
            label="ZIP / Postal Code"
            name="address.zip"
            placeholder="1010"
            control={control}
            error={errors.address?.zip?.message}
            required
          />
        </div>
      </div>
    </form>
  );
}


