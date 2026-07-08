import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import store from "@/redux/store/store";
import { logout } from "@/redux/slices/authSlice";
import { clearQueryCache } from "@/lib/queryClient";

/** Sign out Firebase, clear React Query cache, and reset auth state. */
export async function logoutUser() {
  await signOut(auth);
  clearQueryCache();
  store.dispatch(logout());
}

/** Clear app cache + auth state without signing out Firebase again (e.g. 401). */
export function clearSessionOnAuthFailure() {
  clearQueryCache();
  store.dispatch(logout());
}
