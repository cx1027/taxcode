import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive"
  | "link";

type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-sm hover:opacity-90 focus:ring-2 focus:ring-primary/50 focus:ring-offset-2",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-2 focus:ring-border focus:ring-offset-2",
  outline:
    "border border-border bg-background text-foreground hover:bg-secondary focus:ring-2 focus:ring-primary/30 focus:ring-offset-2",
  ghost:
    "text-foreground hover:bg-secondary focus:ring-2 focus:ring-border focus:ring-offset-2",
  destructive:
    "bg-destructive text-destructive-foreground shadow-sm hover:opacity-90 focus:ring-2 focus:ring-destructive/50 focus:ring-offset-2",
  link:
    "text-primary underline-offset-4 hover:underline focus:ring-2 focus:ring-primary/30 focus:ring-offset-2",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-md",
  md: "h-9 px-4 text-sm gap-2 rounded-lg",
  lg: "h-11 px-6 text-base gap-2 rounded-lg",
  icon: "h-9 w-9 p-0 rounded-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon,
  rightIcon,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center font-medium transition-all duration-150",
        "disabled:pointer-events-none disabled:opacity-50",
        "focus:outline-none",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className
      )}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spinner" strokeWidth={2} />
      ) : leftIcon ? (
        <span className="flex-shrink-0">{leftIcon}</span>
      ) : null}
      {children}
      {!loading && rightIcon && (
        <span className="flex-shrink-0">{rightIcon}</span>
      )}
    </button>
  );
}
