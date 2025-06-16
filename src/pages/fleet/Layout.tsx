import { SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/utilities/header";
import { Outlet } from "react-router";
import FleetSideBar from "../../components/utilities/Fleet/FleetSideBar";

function Layout() {
  return (
    <SidebarProvider>
      <FleetSideBar />
      <main className="w-full bg-background">
        <Header />
        <div className="p-4">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}

export default Layout;
