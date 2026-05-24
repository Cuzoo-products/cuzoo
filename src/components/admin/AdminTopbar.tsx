import { Menu, Zap } from "lucide-react";
import { AdminAccount } from "@/components/admin/AdminAccount";
import { AdminModeToggle } from "@/components/admin/AdminModeToggle";

export default function AdminTopbar({
  onToggleSidebar,
}: {
  onToggleSidebar: () => void;
}) {
  return (
    <header className="admin-portal-header sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-[var(--admin-border)] bg-[var(--admin-header-bg)]/90 px-4 backdrop-blur sm:px-6">
      <button
        type="button"
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
        className="admin-topbar-btn flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex items-center gap-2 lg:hidden">
        <div className="admin-sidebar-brand-icon flex h-7 w-7 items-center justify-center rounded-lg">
          <Zap className="h-3.5 w-3.5 text-white" />
        </div>
        <span className="text-sm font-semibold text-[var(--admin-text-primary)]">
          Cuzoo
        </span>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="admin-topbar-theme">
          <AdminModeToggle />
        </div>
        <AdminAccount />
      </div>
    </header>
  );
}
