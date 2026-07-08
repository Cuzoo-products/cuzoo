import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Link, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { logoutUser } from "@/lib/logout";

export function Account() {
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.auth);

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/");
      toast.success("Logged out successfully!");
    } catch {
      toast.error("Failed to logout");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="size-10">
          <AvatarImage src={user?.photoURL ?? ""} />
          <AvatarFallback className="border-1">
            {user?.displayName
              .split(" ")
              .map((name: string) => name.charAt(0))
              .join("")}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="rounded bg-background border-0 shadow-accent shadow-sm">
        <DropdownMenuItem>
          <Link to="profile">{user?.displayName}</Link>
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
