import "@/styles/vendor-portal.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import VendorTopbar from "@/components/utilities/Vendors/VendorTopbar";
import { Outlet } from "react-router";
import VendorSideBar from "@/components/utilities/Vendors/VendorSideBar";

function VendorLayout() {
  return (
    <div className="vendor-portal min-h-svh">
      <SidebarProvider className="flex min-h-svh w-full">
        <VendorSideBar />
        <main className="vendor-portal-main flex min-h-svh min-w-0 flex-1 flex-col">
          <VendorTopbar />
          <div className="vendor-portal-content flex-1 overflow-auto px-4 pb-8 pt-3 md:px-6">
            <div className="mx-auto w-full max-w-[1600px]">
              <Outlet />
            </div>
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}

export default VendorLayout;
