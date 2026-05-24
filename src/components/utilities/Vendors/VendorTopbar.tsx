import { Menu } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { VendorModeToggle } from "@/components/utilities/Vendors/VendorModeToggle";
import { VendorAccount } from "@/components/utilities/Vendors/VendorAccount";

export default function VendorTopbar() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="vendor-portal-header sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between px-4 sm:px-6">
      <button
        type="button"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
        className="vendor-topbar-btn flex h-10 w-10 items-center justify-center rounded-lg"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex items-center gap-3">
        <div className="vendor-topbar-theme">
          <VendorModeToggle />
        </div>
        <VendorAccount />
      </div>
    </header>
  );
}
