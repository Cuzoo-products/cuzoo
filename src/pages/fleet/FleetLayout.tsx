import { useEffect, useState } from "react";
import FleetSidebar from "@/components/fleet/FleetSidebar";
import FleetTopbar from "@/components/fleet/FleetTopbar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Outlet } from "react-router";

function FleetLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  function handleToggleSidebar() {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setCollapsed((v) => !v);
    } else {
      setMobileOpen((v) => !v);
    }
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div className="fleet-portal flex min-h-screen">
        <FleetSidebar
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />

        {mobileOpen && (
          <button
            type="button"
            aria-label="Close sidebar"
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <FleetTopbar onToggleSidebar={handleToggleSidebar} />
          <main className="flex-1 p-4 sm:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}

export default FleetLayout;
