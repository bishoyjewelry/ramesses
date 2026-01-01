import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProgressStep {
  key: string;
  label: string;
}

// Unified customer-facing status steps (5 stages)
export const PROGRESS_STEPS: ProgressStep[] = [
  { key: "submitted", label: "Submitted" },
  { key: "under_review", label: "Under Review" },
  { key: "in_production", label: "In Production" },
  { key: "quality_check", label: "Quality Check" },
  { key: "ready", label: "Ready" },
];

// Map internal repair statuses to customer-facing progress steps
export function mapRepairStatusToProgress(internalStatus: string | null): string {
  const statusMap: Record<string, string> = {
    pending: "submitted",
    received: "under_review",
    in_progress: "in_production",
    polishing: "quality_check",
    awaiting_parts: "in_production",
    completed: "ready",
    shipped: "ready",
  };
  return statusMap[internalStatus || "pending"] || "submitted";
}

// Map internal design statuses to customer-facing progress steps
export function mapDesignStatusToProgress(internalStatus: string | null): string {
  const statusMap: Record<string, string> = {
    draft: "submitted",
    saved: "submitted",
    submitted: "submitted",
    submitted_for_cad: "under_review",
    revision_requested: "under_review",
    new: "under_review",
    reviewed: "under_review",
    quoted: "under_review",
    approved: "in_production",
    in_cad: "in_production",
    cad_complete: "quality_check",
    production_ready: "quality_check",
    completed: "ready",
  };
  return statusMap[internalStatus || "draft"] || "submitted";
}

interface ProgressTrackerProps {
  currentStep: string;
  steps?: ProgressStep[];
  className?: string;
  showReassurance?: boolean;
  variant?: "default" | "compact";
}

export const ProgressTracker = ({
  currentStep,
  steps = PROGRESS_STEPS,
  className,
  showReassurance = true,
  variant = "default",
}: ProgressTrackerProps) => {
  const currentIndex = steps.findIndex((s) => s.key === currentStep);
  const activeIndex = currentIndex >= 0 ? currentIndex : 0;

  return (
    <div className={cn("w-full", className)}>
      {/* Progress Bar */}
      <div className="relative">
        {/* Background track */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-border" />

        {/* Completed track */}
        <div
          className="absolute top-4 left-0 h-0.5 bg-primary transition-all duration-500"
          style={{
            width: `${(activeIndex / (steps.length - 1)) * 100}%`,
          }}
        />

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = index < activeIndex;
            const isCurrent = index === activeIndex;
            const isFuture = index > activeIndex;

            return (
              <div
                key={step.key}
                className={cn(
                  "flex flex-col items-center",
                  variant === "compact" ? "min-w-0" : ""
                )}
              >
                {/* Circle */}
                <div
                  className={cn(
                    "relative z-10 flex items-center justify-center rounded-full border-2 transition-all",
                    variant === "compact" ? "w-6 h-6" : "w-8 h-8",
                    isCompleted
                      ? "bg-primary border-primary text-primary-foreground"
                      : isCurrent
                      ? "bg-background border-primary text-primary ring-4 ring-primary/20"
                      : "bg-muted border-border text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className={cn(variant === "compact" ? "w-3 h-3" : "w-4 h-4")} />
                  ) : (
                    <span className={cn("font-medium", variant === "compact" ? "text-xs" : "text-sm")}>
                      {index + 1}
                    </span>
                  )}
                </div>

                {/* Label */}
                <span
                  className={cn(
                    "mt-2 text-center leading-tight",
                    variant === "compact" ? "text-[10px] max-w-[60px]" : "text-xs max-w-[80px]",
                    isCurrent
                      ? "text-primary font-medium"
                      : isFuture
                      ? "text-muted-foreground/60"
                      : "text-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reassurance copy */}
      {showReassurance && (
        <p className="text-xs text-muted-foreground text-center mt-4">
          Timelines vary by design. Your jeweler will contact you if anything is needed.
        </p>
      )}
    </div>
  );
};
