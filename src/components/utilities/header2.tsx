import Image from "../ui/image";
import { ModeToggle } from "./modeToggle";
import logo from "../../assets/logo1.jpeg";

function Header2() {
  return (
    <nav className="w-full flex justify-between px-4 py-2 bg-secondary">
      <div className="flex gap-1">
        <Image source={logo} alt="logo" className="w-7 h-7" />
        <h2 className="font-bold text-xl">Cuzoo</h2>
      </div>
      <div className="flex space-x-4">
        <ModeToggle />
      </div>
    </nav>
  );
}

export default Header2;
