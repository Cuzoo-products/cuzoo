import { cn } from "@/lib/utils";

const successSet = new Set([
  "approved",
  "active",
  "success",
  "completed",
  "available",
  "paid",
  "resolved",
]);

const pendingSet = new Set(["pending", "in-progress", "ongoing", "queued"]);

const processingSet = new Set(["processing", "in_progress"]);

const dangerSet = new Set([
  "rejected",
  "disabled",
  "failed",
  "cancelled",
  "unavailable",
  "declined",
  "suspended",
]);

type StatusVariant = "success" | "pending" | "processing" | "danger" | "neutral";

function getVariant(status: string): StatusVariant {
  const lower = String(status).toLowerCase();
  if (successSet.has(lower)) return "success";
  if (pendingSet.has(lower)) return "pending";
  if (processingSet.has(lower)) return "processing";
  if (dangerSet.has(lower)) return "danger";
  return "neutral";
}

export default function VendorStatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const lower = String(status).toLowerCase();
  const variant = getVariant(lower);

  return (
    <span
      className={cn(
        "vendor-status-badge",
        `vendor-status-badge--${variant}`,
        className,
      )}
    >
      {lower}
    </span>
  );
}
