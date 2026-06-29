import { Link, useLocation } from "react-router";
import {
  ArrowLeft,
  Banknote,
  BusFront,
  Home,
  Plus,
  Truck,
  User,
  UserRoundPen,
  WalletMinimal,
  Zap,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { STATIC_SITE_URL } from "@/lib/siteUrls";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/fleet/dashboard", icon: Home },
  { label: "Add Vehicle", href: "/fleet/add_vehicle", icon: Plus },
  { label: "Vehicles", href: "/fleet/fleets", icon: Truck },
  { label: "Add Driver", href: "/fleet/add_driver", icon: UserRoundPen },
  { label: "Drivers", href: "/fleet/drivers", icon: User },
  { label: "Trips", href: "/fleet/trips", icon: BusFront },
  { label: "Finance", href: "/fleet/finance", icon: WalletMinimal },
  { label: "Payouts", href: "/fleet/payouts", icon: Banknote },
];

function FleetNavLink({
  item,
  active,
  iconOnly,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  iconOnly: boolean;
  onNavigate: () => void;
}) {
  const Icon = item.icon;

  const link = (
    <Link
      to={item.href}
      onClick={onNavigate}
      aria-label={iconOnly ? item.label : undefined}
      className={cn(
        "fleet-sidebar-nav-link flex items-center rounded-lg text-sm font-medium transition-all duration-150",
        iconOnly
          ? "lg:size-8 lg:w-8 lg:shrink-0 lg:justify-center lg:p-0 lg:gap-0"
          : "w-full gap-2.5 px-3 py-2.5",
        active
          ? "fleet-sidebar-nav-link--active"
          : "text-[var(--fleet-sidebar-muted)] hover:bg-[var(--fleet-sidebar-accent)] hover:text-[var(--fleet-sidebar-fg)]",
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {!iconOnly && <span className="truncate">{item.label}</span>}
    </Link>
  );

  if (!iconOnly) {
    return link;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent
        side="right"
        align="center"
        className="fleet-sidebar-tooltip hidden lg:block"
      >
        {item.label}
      </TooltipContent>
    </Tooltip>
  );
}

export default function FleetSidebar({
  collapsed,
  mobileOpen,
  onMobileClose,
}: {
  collapsed: boolean;
  mobileOpen: boolean;
  onMobileClose: () => void;
}) {
  const { pathname } = useLocation();
  const iconOnly = collapsed && !mobileOpen;

  return (
    <aside
      className={cn(
        "fleet-sidebar fixed inset-y-0 left-0 z-40 flex h-screen w-72 flex-shrink-0 flex-col border-r border-[var(--fleet-sidebar-border)] bg-[var(--fleet-sidebar-bg)] transition-all duration-200 ease-in-out lg:sticky lg:top-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0 lg:w-48",
        iconOnly &&
          "fleet-sidebar--collapsed lg:w-[calc(3rem+1rem+2px)] lg:p-2",
      )}
    >
      <div
        className={cn(
          "flex items-center border-b border-[var(--fleet-sidebar-border)]",
          iconOnly ? "justify-center px-2 py-4" : "gap-3 p-4",
        )}
      >
        <div className="fleet-sidebar-brand-icon flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--fleet-sidebar-primary)]">
          <Zap className="h-4 w-4 text-white" strokeWidth={2.5} />
        </div>
        {!iconOnly && (
          <div className="min-w-0">
            <p className="truncate text-base text-[var(--fleet-sidebar-fg)]">
              Cuzoo
            </p>
            <p className="truncate text-xs text-[var(--fleet-sidebar-muted)]">
              Fleet Portal
            </p>
          </div>
        )}
      </div>

      <nav
        className={cn(
          "scrollbar-thin flex-1 overflow-y-auto py-4",
          iconOnly ? "px-0 lg:px-0" : "px-2",
        )}
      >
        <ul className={cn("space-y-1", iconOnly && "lg:space-y-1")}>
          {navItems.map((item) => {
            const hrefBase = item.href.split("#")[0];
            const active =
              pathname === hrefBase ||
              (hrefBase !== "/fleet/dashboard" &&
                pathname.startsWith(hrefBase));

            return (
              <li
                key={item.label}
                className={cn(
                  iconOnly && "flex justify-center lg:flex lg:justify-center",
                )}
              >
                <FleetNavLink
                  item={item}
                  active={active}
                  iconOnly={iconOnly}
                  onNavigate={onMobileClose}
                />
              </li>
            );
          })}
        </ul>
      </nav>

      {iconOnly ? (
        <div className="mt-auto w-full border-t border-[var(--fleet-sidebar-border)] py-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href={STATIC_SITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Back to Website"
                className="mx-auto flex size-8 items-center justify-center rounded-lg text-[var(--admin-text-muted)] transition-colors hover:bg-[var(--fleet-sidebar-accent)] hover:text-[var(--admin-text-primary)]"
              >
                <ArrowLeft size={14} className="shrink-0" />
              </a>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              align="center"
              className="fleet-sidebar-tooltip hidden lg:block"
            >
              Back to Website
            </TooltipContent>
          </Tooltip>
        </div>
      ) : (
        <a
          href={STATIC_SITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto flex cursor-pointer items-center gap-2 border-t border-[var(--fleet-sidebar-border)] px-4 py-3 text-xs text-[var(--admin-text-muted)] transition-colors hover:text-[var(--admin-text-primary)]"
        >
          <ArrowLeft size={14} className="shrink-0" />
          <span className="truncate">Back to Website</span>
        </a>
      )}
    </aside>
  );
}
