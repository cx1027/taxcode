import type { Metadata } from "next";
import Link from "next/link";
import { FileText, Mail, Lock, Eye, EyeOff } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign In — TaxCode",
  description: "Sign in to your TaxCode account",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-sidebar p-12">
        <div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg">
            <span className="text-xl font-bold text-primary-foreground">TC</span>
          </div>
          <h1 className="mt-8 text-3xl font-semibold tracking-tight text-sidebar-foreground">
            TaxCode
          </h1>
          <p className="mt-3 text-base text-sidebar-foreground/70 leading-relaxed">
            File your taxes with confidence. Our guided workflow keeps you organized,
            highlights deductions, and catches errors before you submit.
          </p>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm text-sidebar-foreground/50">
            <FileText className="h-4 w-4" strokeWidth={2} />
            <span>Pre-filed returns ready for review</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-sidebar-foreground/50">
            <Mail className="h-4 w-4" strokeWidth={2} />
            <span>Secure document uploads</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-sidebar-foreground/50">
            <Lock className="h-4 w-4" strokeWidth={2} />
            <span>Bank-level encryption</span>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <span className="text-base font-bold text-primary-foreground">TC</span>
            </div>
            <span className="text-xl font-semibold text-foreground">TaxCode</span>
          </div>

          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Welcome back
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Sign in to access your filings and documents
            </p>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground transition-colors hover:border-border/80 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground transition-colors hover:border-border/80 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Toggle password visibility"
                >
                  <EyeOff className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="h-10 w-full rounded-lg bg-primary text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
            >
              Sign in
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-primary hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
