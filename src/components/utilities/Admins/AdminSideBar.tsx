import {
  LayoutDashboard,
  UserRoundPen,
  Truck,
  User,
  Settings,
  CarFront,
  ShieldUser,
  Map,
  WalletMinimal,
  Plus,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link } from "react-router";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "trips",
    url: "Trips",
    icon: Truck,
  },
  {
    title: "Users",
    url: "users",
    icon: User,
  },
  {
    title: "Riders",
    url: "drivers",
    icon: CarFront,
  },
  {
    title: "Fleet Managers",
    url: "fleet_managers",
    icon: UserRoundPen,
  },
  {
    title: "Vendors",
    url: "vendors",
    icon: UserRoundPen,
  },
  {
    title: "Finance",
    url: "financials",
    icon: WalletMinimal,
  },
  {
    title: "Admins",
    url: "admins",
    icon: ShieldUser,
  },
  {
    title: "Add Admin",
    url: "add_admin",
    icon: Plus,
  },
  {
    title: "Settings",
    url: "settings",
    icon: Settings,
  },
  {
    title: "Map",
    url: "map",
    icon: Map,
  },
];

export default function AdminSideBar() {
  const { isMobile, toggleSidebar } = useSidebar();
  const handleSideBarOnMoble = () => {
    if (!isMobile) return;
    toggleSidebar();
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="mb-5">
            <h2 className="font-bold text-xl">Cuzoo</h2>
            <p className="text-xs">Fleet Manager</p>
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-2">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link onClick={handleSideBarOnMoble} to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
