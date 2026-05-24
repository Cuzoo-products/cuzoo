import { Link } from "react-router";
import { ArrowLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

export type DetailCrumb = { label: string; href?: string };

export function DetailShell({
  backHref,
  backLabel,
  crumbs,
  children,
}: {
  backHref: string;
  backLabel: string;
  crumbs: DetailCrumb[];
  children: ReactNode;
}) {
  return (
    <div className="space-y-4">
      <Link
        to={backHref}
        className="inline-flex items-center gap-1.5 text-xs text-[var(--admin-text-muted)] transition-colors hover:text-[var(--admin-text-primary)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {backLabel}
      </Link>

      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-1 text-[11px] text-[var(--admin-text-muted)]"
      >
        {crumbs.map((c, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <span key={`${c.label}-${i}`} className="flex items-center gap-1">
              {c.href && !isLast ? (
                <Link
                  to={c.href}
                  className="hover:text-[var(--admin-text-primary)]"
                >
                  {c.label}
                </Link>
              ) : (
                <span
                  className={isLast ? "text-[var(--admin-text-primary)]" : ""}
                >
                  {c.label}
                </span>
              )}
              {!isLast && <ChevronRight className="h-3 w-3 opacity-70" />}
            </span>
          );
        })}
      </nav>

      {children}
    </div>
  );
}

export function Section({
  title,
  subtitle,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg-card)] p-5 ${className}`}
    >
      <div className="mb-4">
        <h2 className="text-base font-semibold text-[var(--admin-text-primary)]">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-0.5 text-[13px] text-[var(--admin-text-muted)]">
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

export function GridItem({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  const shown =
    value === "" || value === null || value === undefined ? "—" : value;
  return (
    <div className="space-y-0.5">
      <div className="text-[12px] uppercase tracking-wide text-[var(--admin-text-muted)]">
        {label}
      </div>
      <div className="text-sm font-medium text-[var(--admin-text-primary)]">
        {shown}
      </div>
    </div>
  );
}

export function InfoRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[var(--admin-border)] py-2.5 last:border-b-0">
      <span className="flex items-center gap-1.5 text-xs text-[var(--admin-text-muted)]">
        {icon}
        {label}
      </span>
      <span className="max-w-[60%] truncate text-right text-xs font-medium text-[var(--admin-text-primary)]">
        {value || "—"}
      </span>
    </div>
  );
}
