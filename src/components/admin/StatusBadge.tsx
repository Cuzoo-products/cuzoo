import { cn } from "@/lib/utils";

const successSet = new Set([
  "approved",
  "active",
  "success",
  "completed",
  "available",
  "paid",
  "inflow",
]);

const warnSet = new Set([
  "pending",
  "in-progress",
  "ongoing",
  "queued",
  "frozen",
]);

const dangerSet = new Set([
  "rejected",
  "disabled",
  "failed",
  "cancelled",
  "unavailable",
  "declined",
  "suspended",
  "outflow",
]);

type StatusVariant = "success" | "pending" | "danger" | "neutral";

function getVariant(status: string): StatusVariant {
  const lower = String(status).toLowerCase();
  if (successSet.has(lower)) return "success";
  if (warnSet.has(lower)) return "pending";
  if (dangerSet.has(lower)) return "danger";
  return "neutral";
}

export default function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const variant = getVariant(status);

  return (
    <span
      className={cn(
        "admin-status-badge",
        `admin-status-badge--${variant}`,
        className,
      )}
    >
      {status}
    </span>
  );
}
