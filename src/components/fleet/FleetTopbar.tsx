import { FleetAccount } from "@/components/fleet/FleetAccount";
import { FleetModeToggle } from "@/components/fleet/FleetModeToggle";
import { Menu, Zap } from "lucide-react";

export default function FleetTopbar({
  onToggleSidebar,
}: {
  onToggleSidebar: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-[var(--admin-border)] bg-[var(--fleet-header-bg)]/90 px-4 backdrop-blur sm:px-6">
      <button
        type="button"
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
        className="fleet-topbar-btn flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex items-center gap-2 lg:hidden">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--fleet-sidebar-primary)]">
          <Zap className="h-3.5 w-3.5 text-white" />
        </div>
        <span className="text-sm font-semibold text-[var(--admin-text-primary)]">
          Cuzoo
        </span>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="fleet-topbar-theme">
          <FleetModeToggle />
        </div>
        <FleetAccount />
      </div>
    </header>
  );
}
