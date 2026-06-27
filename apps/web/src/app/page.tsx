import Link from "next/link";
import { FileText, Shield, Clock, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Nav */}
      <header className="flex h-16 items-center justify-between border-b border-border bg-card px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">TC</span>
          </div>
          <span className="text-base font-semibold text-foreground">TaxCode</span>
        </div>
        <nav className="flex items-center gap-6">
          <Link
            href="/login"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
          >
            Get started
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center px-8 py-20 text-center">
        <div className="max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            2024 tax season is open
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Tax filing made{" "}
            <span className="text-primary">calm and clear</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            TaxCode guides you through every step — from uploading documents to
            final submission. No surprises, no jargon, just clarity.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
            >
              Start filing for free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 text-sm font-medium text-foreground shadow-soft transition-colors hover:bg-secondary"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-card px-8 py-16">
        <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-3">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileText className="h-6 w-6" strokeWidth={1.75} />
            </div>
            <h3 className="text-sm font-semibold text-foreground">
              Guided workflows
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Step-by-step forms that break complex tax tasks into manageable sections.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 text-success">
              <Shield className="h-6 w-6" strokeWidth={1.75} />
            </div>
            <h3 className="text-sm font-semibold text-foreground">
              Bank-level security
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your documents and data are encrypted and protected at every step.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10 text-warning">
              <Clock className="h-6 w-6" strokeWidth={1.75} />
            </div>
            <h3 className="text-sm font-semibold text-foreground">
              Always accessible
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Save your progress anytime. Pick up where you left off on any device.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
