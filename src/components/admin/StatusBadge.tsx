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

const warnSet = new Set(["pending", "in-progress", "ongoing", "queued"]);

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

export default function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const lower = String(status).toLowerCase();
  const isSuccess = successSet.has(lower);
  const isWarn = warnSet.has(lower);
  const isDanger = dangerSet.has(lower);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        isSuccess &&
          "border border-[var(--admin-success)]/30 bg-[var(--admin-success)]/15 text-[var(--admin-success)]",
        isWarn &&
          "border border-[var(--admin-warning)]/30 bg-[var(--admin-warning)]/15 text-[var(--admin-warning)]",
        isDanger &&
          "border border-[var(--admin-danger)]/30 bg-[var(--admin-danger)]/15 text-[var(--admin-danger)]",
        !isSuccess &&
          !isWarn &&
          !isDanger &&
          "border border-[var(--admin-border)] bg-[var(--admin-bg-card-alt)] text-[var(--admin-text-muted)]",
        className,
      )}
    >
      {status}
    </span>
  );
}
