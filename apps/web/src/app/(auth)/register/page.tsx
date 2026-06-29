"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

const FEATURES = [
 "Unlimited filing drafts",
 "Automatic deduction detection",
 "Secure document storage",
 "Real-time tax estimates",
];

export default function RegisterPage() {
 const [isLoading, setIsLoading] = useState(false);

 async function handleGoogleSignIn() {
  setIsLoading(true);
  await signIn("google", { callbackUrl: "/onboarding" });
 }

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
 Your complete tax filing companion — from first document to final
 submission.
 </p>
 </div>

 <div className="space-y-4">
 <p className="text-sm font-medium text-sidebar-foreground/50 uppercase tracking-wider">
 What you get
 </p>
 <ul className="space-y-3">
 {FEATURES.map((feature) => (
 <li
 key={feature}
 className="flex items-center gap-3 text-sm text-sidebar-foreground/80"
 >
 <svg
 className="h-4 w-4 flex-shrink-0 text-green-500"
 fill="none"
 viewBox="0 0 24 24"
 stroke="currentColor"
 strokeWidth={2.5}
 >
 <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
 </svg>
 {feature}
 </li>
 ))}
 </ul>
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
 Create your account
 </h2>
 <p className="mt-1.5 text-sm text-muted-foreground">
 Sign in with Google to start filing your taxes
 </p>
 </div>

 <button
 onClick={handleGoogleSignIn}
 disabled={isLoading}
 className="flex h-10 w-full items-center justify-center gap-3 rounded-lg border border-input bg-background text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
 >
 {isLoading ? (
 <svg
 className="h-4 w-4 animate-spin text-muted-foreground"
 fill="none"
 viewBox="0 0 24 24"
 >
 <circle
 className="opacity-25"
 cx="12"
 cy="12"
 r="10"
 stroke="currentColor"
 strokeWidth="4"
 />
 <path
 className="opacity-75"
 fill="currentColor"
 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
 />
 </svg>
 ) : (
 <svg className="h-4 w-4" viewBox="0 0 24 24">
 <path
 fill="#4285F4"
 d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
 />
 <path
 fill="#34A853"
 d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
 />
 <path
 fill="#FBBC05"
 d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
 />
 <path
 fill="#EA4335"
 d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
 />
 </svg>
 )}
 {isLoading ? "Redirecting..." : "Continue with Google"}
 </button>

 <p className="text-center text-sm text-muted-foreground">
 Already have an account?{" "}
 <a
 href="/register"
 className="font-medium text-primary hover:underline"
 >
 Sign in
 </a>
 </p>
 </div>
 </div>
 </div>
 );
}
