import Image from "../ui/image";
import { ModeToggle } from "./modeToggle";
import logo from "../../assets/logo1.jpeg";
import { Button } from "../ui/button";
import { signOut } from "firebase/auth";
import { logout } from "@/redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { auth } from "@/firebase";

interface Header2Props {
  showLogout: boolean;
}

function Header2({ showLogout }: Header2Props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);
      // Clear Redux state
      dispatch(logout());
      // Navigate to login page
      navigate("/");
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };
  return (
    <nav className="w-full flex justify-between px-4 py-2 bg-secondary">
      <div className="flex gap-1">
        <Image source={logo} alt="logo" className="w-7 h-7" />
        <h2 className="font-bold text-xl">Cuzoo</h2>
      </div>
      <div className="flex space-x-4">
        {showLogout && (
          <Button
            onClick={() => {
              handleLogout();
            }}
          >
            Logout
          </Button>
        )}
        <ModeToggle />
      </div>
    </nav>
  );
}

export default Header2;
