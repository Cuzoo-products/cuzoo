import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSideBar from "@/components/utilities/Admins/AdminSideBar";
import Header from "@/components/utilities/header";
import { Outlet } from "react-router";

function AdminLayout() {
  return (
    <SidebarProvider>
      <AdminSideBar />
      <main className="w-full bg-background">
        <Header />
        <div className="p-4">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}

export default AdminLayout;
