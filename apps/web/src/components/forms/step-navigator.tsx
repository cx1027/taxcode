"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { STEPS, STEP_LABELS, type StepId } from "@/lib/schemas/filing";

interface StepNavigatorProps {
  currentStep: StepId;
  completedSteps: StepId[];
  onStepClick?: (step: StepId) => void;
}

export function StepNavigator({
  currentStep,
  completedSteps,
  onStepClick,
}: StepNavigatorProps) {
  const currentIndex = STEPS.indexOf(currentStep);

  return (
    <nav aria-label="Filing steps" className="w-full">
      <ol className="flex items-center gap-0">
        {STEPS.map((step, index) => {
          const isCompleted = completedSteps.includes(step);
          const isCurrent = step === currentStep;
          const isPast = index < currentIndex;
          const isClickable = isCompleted || isPast || isCurrent;

          return (
            <li key={step} className="flex flex-1 items-center">
              {/* Step indicator */}
              <button
                onClick={() => isClickable && onStepClick?.(step)}
                disabled={!isClickable}
                className={cn(
                  "group flex flex-col items-center gap-2 transition-colors",
                  isClickable ? "cursor-pointer" : "cursor-default"
                )}
                aria-current={isCurrent ? "step" : undefined}
              >
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                    isCurrent
                      ? "border-primary bg-primary text-primary-foreground"
                      : isCompleted
                        ? "border-success bg-success text-success-foreground"
                        : "border-border bg-card text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" strokeWidth={3} />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium whitespace-nowrap",
                    isCurrent
                      ? "text-primary"
                      : isCompleted
                        ? "text-success"
                        : "text-muted-foreground"
                  )}
                >
                  {STEP_LABELS[step]}
                </span>
              </button>

              {/* Connector line */}
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    "mx-2 h-0.5 flex-1 transition-colors",
                    index < currentIndex
                      ? "bg-success"
                      : "bg-border"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
