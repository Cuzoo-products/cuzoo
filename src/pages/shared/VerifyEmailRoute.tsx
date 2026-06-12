import { useSearchParams } from "react-router";
import VerifyEmail from "@/pages/shared/VerifyEmail";
import VerifyEmailLink from "@/pages/shared/VerifyEmailLink";

/** Routes `/verify-email` (check inbox) vs `/verify-email?token=...` (link verification). */
export default function VerifyEmailRoute() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";

  if (token) {
    return <VerifyEmailLink />;
  }

  return <VerifyEmail />;
}
