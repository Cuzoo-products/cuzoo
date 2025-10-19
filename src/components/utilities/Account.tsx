import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { toast } from "sonner";

export function Account() {
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="size-10">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback className="border-1">CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="rounded bg-background border-0 shadow-accent shadow-sm">
        <DropdownMenuItem>
          <Link to="profile">Charles Ayomike</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link to="reset-password">Reset Password</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
