"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, MapPin, Receipt, UserCheck, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InlineFieldError } from "@/components/forms/validation-summary";

const OnboardingSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  address: z.string().optional(),
  filingStatus: z.string().min(1, "Filing status is required"),
  irdNumber: z.string().regex(/^\d{3}-\d{3}-\d{3}$/, "IRD number must be in format XXX-XXX-XXX"),
  withholdingAllowance: z.number().min(0).max(10),
  estimatedWithholding: z.number().min(0),
});

type OnboardingData = z.infer<typeof OnboardingSchema>;

export default function OnboardingPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<OnboardingData>({
    resolver: zodResolver(OnboardingSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      filingStatus: "single",
      irdNumber: "",
      withholdingAllowance: 1,
      estimatedWithholding: 0,
    },
  });

  const onSubmit = async (data: OnboardingData) => {
    setIsSubmitting(true);
    try {
      // Store onboarding data locally for now
      localStorage.setItem("taxcode-onboarding", JSON.stringify(data));
      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Onboarding failed:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-sidebar p-12">
        <div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg">
            <span className="text-xl font-bold text-primary-foreground">TC</span>
          </div>
          <h1 className="mt-8 text-3xl font-semibold tracking-tight text-sidebar-foreground">
            Welcome to TaxCode
          </h1>
          <p className="mt-3 text-base text-sidebar-foreground/70 leading-relaxed">
            Let&apos;s set up your account. We&apos;ll need some basic information to help you file your taxes efficiently.
          </p>
        </div>
        <div className="space-y-4">
          <p className="text-sm font-medium text-sidebar-foreground/50 uppercase tracking-wider">
            What happens next
          </p>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-sm text-sidebar-foreground/80">
              <ArrowRight className="h-4 w-4 flex-shrink-0 text-green-500" />
              Complete your profile information
            </li>
            <li className="flex items-center gap-3 text-sm text-sidebar-foreground/80">
              <ArrowRight className="h-4 w-4 flex-shrink-0 text-green-500" />
              Add your tax profile details
            </li>
            <li className="flex items-center gap-3 text-sm text-sidebar-foreground/80">
              <ArrowRight className="h-4 w-4 flex-shrink-0 text-green-500" />
              Start filing your taxes
            </li>
          </ul>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-2xl space-y-8">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <span className="text-base font-bold text-primary-foreground">TC</span>
            </div>
            <span className="text-xl font-semibold text-foreground">TaxCode</span>
          </div>

          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Complete your profile
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Tell us about yourself so we can personalize your tax filing experience.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Information */}
            <div className="rounded-card border border-border bg-card p-6 space-y-6">
              <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Personal Information
              </h3>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-foreground">
                    First Name *
                  </label>
                  <input
                    {...register("firstName")}
                    id="firstName"
                    className="mt-1 w-full rounded-input border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <InlineFieldError message={errors.firstName?.message} />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-foreground">
                    Last Name *
                  </label>
                  <input
                    {...register("lastName")}
                    id="lastName"
                    className="mt-1 w-full rounded-input border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <InlineFieldError message={errors.lastName?.message} />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground">
                  Email Address *
                </label>
                <div className="mt-1 flex rounded-input border border-border bg-surface">
                  <div className="flex items-center px-3 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    {...register("email")}
                    id="email"
                    type="email"
                    className="w-full rounded-r-input border-0 bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <InlineFieldError message={errors.email?.message} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground">
                    Phone Number
                  </label>
                  <div className="mt-1 flex rounded-input border border-border bg-surface">
                    <div className="flex items-center px-3 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                    </div>
                    <input
                      {...register("phone")}
                      id="phone"
                      type="tel"
                      placeholder="+64 21 123 4567"
                      className="w-full rounded-r-input border-0 bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <InlineFieldError message={errors.phone?.message} />
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-foreground">
                    Mailing Address
                  </label>
                  <div className="mt-1 flex rounded-input border border-border bg-surface">
                    <div className="flex items-center px-3 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <input
                      {...register("address")}
                      id="address"
                      placeholder="123 Main St, Auckland 1010"
                      className="w-full rounded-r-input border-0 bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <InlineFieldError message={errors.address?.message} />
                </div>
              </div>
            </div>

            {/* Tax Profile */}
            <div className="rounded-card border border-border bg-card p-6 space-y-6">
              <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                <Receipt className="h-4 w-4 text-muted-foreground" />
                Tax Profile
              </h3>

              <div>
                <label htmlFor="filingStatus" className="block text-sm font-medium text-foreground">
                  Filing Status *
                </label>
                <div className="mt-1 flex rounded-input border border-border bg-surface">
                  <div className="flex items-center px-3 text-muted-foreground">
                    <UserCheck className="h-4 w-4" />
                  </div>
                  <select
                    {...register("filingStatus")}
                    id="filingStatus"
                    className="w-full rounded-r-input border-0 bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="single">Single</option>
                    <option value="married_joint">Married Filing Jointly</option>
                    <option value="married_separate">Married Filing Separately</option>
                    <option value="head_of_household">Head of Household</option>
                  </select>
                </div>
                <InlineFieldError message={errors.filingStatus?.message} />
              </div>

              <div>
                <label htmlFor="irdNumber" className="block text-sm font-medium text-foreground">
                  IRD Number *
                </label>
                <input
                  {...register("irdNumber")}
                  id="irdNumber"
                  placeholder="123-456-789"
                  className="mt-1 w-full rounded-input border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <InlineFieldError message={errors.irdNumber?.message} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="withholdingAllowance" className="block text-sm font-medium text-foreground">
                    Withholding Allowance
                  </label>
                  <input
                    {...register("withholdingAllowance", { valueAsNumber: true })}
                    id="withholdingAllowance"
                    type="number"
                    min="0"
                    max="10"
                    className="mt-1 w-full rounded-input border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <InlineFieldError message={errors.withholdingAllowance?.message} />
                </div>
                <div>
                  <label htmlFor="estimatedWithholding" className="block text-sm font-medium text-foreground">
                    Estimated Withholding ($)
                  </label>
                  <input
                    {...register("estimatedWithholding", { valueAsNumber: true })}
                    id="estimatedWithholding"
                    type="number"
                    min="0"
                    step="0.01"
                    className="mt-1 w-full rounded-input border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <InlineFieldError message={errors.estimatedWithholding?.message} />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={isSubmitting || !isDirty}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-soft transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isSubmitting ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    Complete Setup
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
