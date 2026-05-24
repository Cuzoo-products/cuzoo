import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function initialsFromName(name?: string | null): string {
  if (!name?.trim()) return "U";
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

type AuthUser = {
  displayName?: string;
  email?: string;
};

export function AdminAccount() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(
    (state: { auth: { user?: AuthUser | null } }) => state.auth,
  );

  const displayName = user?.displayName ?? auth.currentUser?.displayName ?? "User";
  const email = user?.email ?? auth.currentUser?.email ?? "";
  const initials = initialsFromName(displayName);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
      navigate("/");
      toast.success("Logged out successfully!");
    } catch {
      toast.error("Failed to logout");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="admin-account-trigger group flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--admin-sidebar-primary)] text-xs font-medium text-[var(--admin-sidebar-primary-fg)]">
            {initials}
          </span>
          <span className="hidden max-w-[140px] truncate sm:inline">
            {displayName}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="admin-account-menu w-56 p-1">
        <div className="admin-account-menu__header px-3 py-2.5">
          <p className="admin-account-menu__name">{displayName}</p>
          {email ? (
            <p className="admin-account-menu__email">{email}</p>
          ) : null}
        </div>
        <DropdownMenuItem asChild className="admin-account-menu__item">
          <Link to="profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="admin-account-menu__item">
          <Link to="reset-password">Reset Password</Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleLogout}
          className={cn("admin-account-menu__item", "admin-account-menu__logout")}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
