import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface ContentContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

const MAX_WIDTH_CLASSES = {
  sm: "max-w-xl",
  md: "max-w-3xl",
  lg: "max-w-5xl",
  xl: "max-w-6xl",
  "2xl": "max-w-7xl",
  full: "max-w-full",
};

export function ContentContainer({
  children,
  className,
  maxWidth = "full",
}: ContentContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-6",
        MAX_WIDTH_CLASSES[maxWidth],
        className
      )}
    >
      {children}
    </div>
  );
}

interface PageContentProps {
  children: ReactNode;
  className?: string;
}

export function PageContent({ children, className }: PageContentProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {children}
    </div>
  );
}
