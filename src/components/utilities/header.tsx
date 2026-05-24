import { cn } from "@/lib/utils";
import { SidebarTrigger } from "../ui/sidebar";
import { Account } from "./Account";
import { ModeToggle } from "./modeToggle";

function Header({ className }: { className?: string }) {
  return (
    <nav
      className={cn(
        "flex w-full justify-between px-4 py-2 md:px-5",
        className,
      )}
    >
      <div>
        <SidebarTrigger />
      </div>
      <div className="flex space-x-4">
        <Account />
        <ModeToggle />
      </div>
    </nav>
  );
}

export default Header;
