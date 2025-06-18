import {
  Plus,
  LayoutDashboard,
  UserRoundPen,
  Truck,
  User,
  Map,
  BusFront,
  WalletMinimal,
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
    title: "Fleets",
    url: "fleets",
    icon: Truck,
  },
  {
    title: "Add Vehicle",
    url: "add_vehicle",
    icon: Plus,
  },
  {
    title: "Drivers",
    url: "drivers",
    icon: User,
  },
  {
    title: "Add Drivers",
    url: "add_driver",
    icon: UserRoundPen,
  },
  {
    title: "Trips",
    url: "#",
    icon: BusFront,
  },
  {
    title: "Finance",
    url: "#",
    icon: WalletMinimal,
  },
  {
    title: "Map",
    url: "maps",
    icon: Map,
  },
];

export default function FleetSideBar() {
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
                    <Link to={item.url}>
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
