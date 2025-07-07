import { SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/utilities/header";
import { Outlet } from "react-router";
import VendorSideBar from "@/components/utilities/Vendors/VendorSideBar";

function VendorLayout() {
  return (
    <SidebarProvider>
      <VendorSideBar />
      <main className="w-full bg-background">
        <Header />
        <div className="p-4">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}

export default VendorLayout;
