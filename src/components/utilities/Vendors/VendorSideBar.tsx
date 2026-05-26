import {
  LayoutDashboard,
  Tag,
  Plus,
  Package,
  ShoppingCart,
  Wallet,
  Ticket,
  CreditCard,
  QrCode,
  Zap,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router";
import { cn } from "@/lib/utils";

function vendorNavItemActive(pathname: string, url: string): boolean {
  const key = "/vendor";
  const idx = pathname.indexOf(key);
  if (idx === -1) return false;
  const rest = pathname.slice(idx + key.length).replace(/\/$/, "") || "/";
  const first = rest.replace(/^\//, "").split("/")[0] ?? "";
  if (url === "dashboard") return first === "" || first === "dashboard";
  return first === url;
}

const items = [
  { title: "Dashboard", url: "dashboard", icon: LayoutDashboard },
  { title: "Categories", url: "categories", icon: Tag },
  { title: "Add Category", url: "add_category", icon: Plus },
  { title: "Products", url: "products", icon: Package },
  { title: "Add Products", url: "add_product", icon: Plus },
  { title: "Orders", url: "orders", icon: ShoppingCart },
  { title: "Finance", url: "finance", icon: Wallet },
  { title: "Coupons", url: "coupons", icon: Ticket },
  { title: "Payouts", url: "payouts", icon: CreditCard },
  { title: "Store Flyer", url: "store-flyer", icon: QrCode },
];

export default function VendorSideBar() {
  const { pathname } = useLocation();
  const { isMobile, toggleSidebar } = useSidebar();

  const handleSideBarOnMoble = () => {
    if (!isMobile) return;
    toggleSidebar();
  };

  return (
    <Sidebar
      collapsible="icon"
      className="vendor-sidebar border-r border-[var(--vendor-sidebar-border)] bg-[var(--vendor-sidebar-bg)]"
    >
      <SidebarHeader className="border-b border-[var(--vendor-sidebar-border)] p-4 group-data-[collapsible=icon]:px-2">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <div className="vendor-sidebar-brand-icon">
            <Zap className="h-4 w-4 text-white" strokeWidth={2.5} />
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-base text-[var(--vendor-sidebar-fg)]">
              Cuzoo
            </p>
            <p className="truncate text-xs text-[var(--vendor-sidebar-muted)]">
              Vendors
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {items.map((item) => {
                const active = vendorNavItemActive(pathname, item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.title}
                      className={cn(
                        "h-auto rounded-lg px-3 py-2.5 text-sm transition-all",
                        "text-[var(--vendor-sidebar-fg)] hover:bg-[var(--vendor-sidebar-accent)] hover:text-[var(--vendor-sidebar-accent-fg)]",
                        "data-[active=true]:bg-[var(--vendor-sidebar-primary)] data-[active=true]:text-[var(--vendor-sidebar-primary-fg)] data-[active=true]:font-medium data-[active=true]:shadow-none",
                        "data-[active=true]:hover:bg-[var(--vendor-sidebar-primary)] data-[active=true]:hover:text-[var(--vendor-sidebar-primary-fg)]",
                      )}
                    >
                      <Link onClick={handleSideBarOnMoble} to={item.url}>
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
