import { useEffect } from "react";
import { AlertTriangle, CheckCircle, Copy } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { buildRiderUsername } from "@/lib/riderUsername";

export type DriverCredentialsState = {
  firstName: string;
  lastName: string;
  businessName: string;
  password: string;
};

function copyText(label: string, value: string) {
  navigator.clipboard.writeText(value).then(
    () => toast.success(`${label} copied`),
    () => toast.error(`Could not copy ${label.toLowerCase()}`),
  );
}

export default function DriverCredentials() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as DriverCredentialsState | null;

  const firstName = state?.firstName?.trim() ?? "";
  const lastName = state?.lastName?.trim() ?? "";
  const businessName = state?.businessName?.trim() ?? "";
  const password = state?.password?.trim() ?? "";

  const username =
    firstName && lastName && businessName
      ? buildRiderUsername(firstName, lastName, businessName)
      : "";

  const isValid = Boolean(username && password);

  useEffect(() => {
    if (!isValid) {
      navigate("/fleet/drivers", { replace: true });
    }
  }, [isValid, navigate]);

  if (!isValid) {
    return null;
  }

  return (
    <div className="fleet-form-page">
      <div className="fleet-form-shell fleet-form-shell--wide">
        <div className="fleet-form-header">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-600">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1>Driver account created</h1>
          <p>Share these login details with the driver. This page will not show them again.</p>
        </div>

        <div className="fleet-form-card space-y-6">
          <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
              <p className="text-sm leading-relaxed text-amber-950 dark:text-amber-100">
                You can only view this password once. Copy or write it down now and
                give it to{" "}
                <span className="font-medium">
                  {firstName} {lastName}
                </span>{" "}
                so they can sign in to the rider app.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-bg-card-alt)] p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
                Username
              </p>
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-sm break-all">{username}</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => copyText("Username", username)}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
              </div>
            </div>

            <div className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-bg-card-alt)] p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
                Password
              </p>
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-sm break-all">{password}</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => copyText("Password", password)}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
              </div>
            </div>
          </div>

          <Button
            type="button"
            className="fleet-form-submit w-full"
            onClick={() => navigate("/fleet/drivers", { replace: true })}
          >
            I have saved the credentials
          </Button>
        </div>
      </div>
    </div>
  );
}
