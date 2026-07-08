import { ChevronRight } from "lucide-react";
import { Link } from "react-router";

import { cn } from "@/lib/utils";
import type { AdminActionItem } from "@/hooks/useAdminActionItems";

type AdminActionItemsProps = {
  items: AdminActionItem[];
  title?: string;
};

function ActionItemSkeleton() {
  return (
    <div className="flex animate-pulse items-center justify-between rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg-card)] p-4">
      <div className="space-y-2">
        <div className="h-4 w-48 rounded bg-[var(--admin-bg-card-alt)]" />
        <div className="h-3 w-72 max-w-full rounded bg-[var(--admin-bg-card-alt)]" />
      </div>
      <div className="h-8 w-12 rounded-full bg-[var(--admin-bg-card-alt)]" />
    </div>
  );
}

export default function AdminActionItems({
  items,
  title = "Needs your attention",
}: AdminActionItemsProps) {
  const visibleItems = items.filter((item) => item.isLoading || item.count > 0);

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold text-[var(--admin-text-primary)]">
        {title}
      </h2>
      <div className="grid gap-3">
        {visibleItems.map((item) =>
          item.isLoading ? (
            <ActionItemSkeleton key={item.id} />
          ) : (
            <Link
              key={item.id}
              to={item.href}
              className={cn(
                "group flex items-center justify-between gap-4 rounded-xl border border-[var(--admin-border)]",
                "bg-[var(--admin-bg-card)] p-4 transition-all",
                "hover:border-[var(--admin-warning)]/60 hover:shadow-[0_0_0_1px_var(--admin-warning)]",
              )}
            >
              <div className="min-w-0 space-y-1">
                <p className="font-medium text-[var(--admin-text-primary)] group-hover:text-[var(--admin-accent)]">
                  {item.title}
                </p>
                <p className="text-sm text-[var(--admin-text-muted)]">
                  {item.description}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <span className="inline-flex min-w-10 items-center justify-center rounded-full bg-[var(--admin-warning)]/15 px-3 py-1 text-lg font-bold tabular-nums text-[var(--admin-warning)]">
                  {item.count.toLocaleString("en-NG")}
                </span>
                <ChevronRight className="h-5 w-5 text-[var(--admin-text-muted)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--admin-accent)]" />
              </div>
            </Link>
          ),
        )}
      </div>
    </section>
  );
}
