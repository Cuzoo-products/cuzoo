import { SidebarTrigger } from "../ui/sidebar";
import { Account } from "./Account";
import { ModeToggle } from "./modeToggle";

function Header() {
  return (
    <nav className="w-full flex justify-between px-4 py-2">
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
