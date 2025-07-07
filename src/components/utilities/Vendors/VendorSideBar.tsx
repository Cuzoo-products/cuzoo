import {
  Plus,
  LayoutDashboard,
  UserRoundPen,
  Truck,
  User,
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
    title: "Categories",
    url: "categories",
    icon: Truck,
  },
  {
    title: "Add Category",
    url: "add_category",
    icon: Plus,
  },
  {
    title: "Products",
    url: "products",
    icon: User,
  },
  {
    title: "Add Products",
    url: "add_product",
    icon: UserRoundPen,
  },
  {
    title: "Orders",
    url: "orders",
    icon: BusFront,
  },
  {
    title: "Finance",
    url: "finance",
    icon: WalletMinimal,
  },
];

export default function VendorSideBar() {
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
            <p className="text-xs">Vendors</p>
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
