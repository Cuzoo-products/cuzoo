import { Link } from "react-router";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    let raf = 0;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

export type KpiCardProps = {
  icon: React.ReactNode;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  trend?: string;
  trendColor?: "success" | "danger" | "muted";
  href?: string;
  variant?: "default" | "accent";
};

export default function KpiCard({
  icon,
  label,
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  trend,
  trendColor = "success",
  href,
  variant = "default",
}: KpiCardProps) {
  const animated = useCountUp(value);
  const displayValue = animated.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  const card = (
    <div
      className={cn(
        "group rounded-xl border p-5 transition-all hover:scale-[1.02]",
        variant === "accent"
          ? "border-transparent bg-[var(--admin-accent)] text-white shadow-lg hover:shadow-[0_8px_24px_rgba(110,86,207,0.35)]"
          : "border-[var(--admin-border)] bg-[var(--admin-bg-card)] text-[var(--admin-text-primary)] hover:border-[var(--admin-accent)]/60 hover:shadow-[0_0_0_1px_var(--admin-accent)]",
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg",
          variant === "accent" ? "bg-white/20" : "bg-[var(--admin-bg-card-alt)]",
        )}
      >
        {icon}
      </div>
      <div className="mt-4 space-y-1">
        <div className="text-2xl font-bold tracking-tight">
          {prefix}
          {displayValue}
          {suffix}
        </div>
        <div
          className={cn(
            "text-xs font-medium",
            variant === "accent" ? "text-white/80" : "text-[var(--admin-text-muted)]",
          )}
        >
          {label}
        </div>
        {trend && (
          <div
            className={cn(
              "pt-2 text-xs",
              variant === "accent" && "text-white/90",
              variant === "default" &&
                trendColor === "success" &&
                "text-[var(--admin-success)]",
              variant === "default" &&
                trendColor === "danger" &&
                "text-[var(--admin-danger)]",
              variant === "default" &&
                trendColor === "muted" &&
                "text-[var(--admin-text-muted)]",
            )}
          >
            {trend}
          </div>
        )}
      </div>
    </div>
  );

  return href ? <Link to={href}>{card}</Link> : card;
}
