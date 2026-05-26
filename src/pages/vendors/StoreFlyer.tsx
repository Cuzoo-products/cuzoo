import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Copy, Download } from "lucide-react";
import { toast } from "sonner";
import { downloadFlyerPng } from "@/lib/downloadFlyerPng";
import { useGetVendorProfile } from "@/api/vendor/auth/useAuth";
import { FlyerPreviewCard } from "@/components/vendor/flyer/FlyerPreviewCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Loader from "@/components/utilities/Loader";
import { buildStoreUrl } from "@/lib/storeUrl";
import { cn } from "@/lib/utils";
import "@/styles/store-flyer.css";

async function waitForImages(element: HTMLElement): Promise<void> {
  const images = element.querySelectorAll("img");
  await Promise.all(
    Array.from(images).map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete) {
            resolve();
            return;
          }
          img.onload = () => resolve();
          img.onerror = () => resolve();
          setTimeout(() => resolve(), 5000);
        }),
    ),
  );
}

export default function StoreFlyer() {
  const { data: vendorProfile, isLoading } = useGetVendorProfile();
  const profile = vendorProfile?.data;

  const storeCode = profile?.storeCode?.trim() ?? "";
  const defaultStoreName =
    profile?.businessName?.trim() ||
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ").trim() ||
    "Your Store";

  const [storeName, setStoreName] = useState(defaultStoreName);
  const [showQR, setShowQR] = useState(true);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const flyerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (defaultStoreName) {
      setStoreName(defaultStoreName);
    }
  }, [defaultStoreName]);

  const storeUrl = useMemo(
    () => (storeCode ? buildStoreUrl(storeCode) : ""),
    [storeCode],
  );

  const handleCopyLink = async () => {
    if (!storeUrl) {
      toast.error("Store code is not available yet.");
      return;
    }
    try {
      await navigator.clipboard.writeText(storeUrl);
      setCopied(true);
      toast.success("Store link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleDownloadFlyer = async () => {
    if (!storeCode) {
      toast.error("Store code is required before downloading a flyer.");
      return;
    }

    setDownloading(true);

    try {
      const flyerElement = flyerRef.current;

      if (!flyerElement) {
        toast.error("Flyer element not found. Please try again.");
        setDownloading(false);
        return;
      }

      await waitForImages(flyerElement);
      await new Promise((resolve) => setTimeout(resolve, 200));

      await downloadFlyerPng(
        flyerElement,
        `cuzoo-store-flyer-${storeCode}-${Date.now()}.png`,
      );

      toast.success("Flyer downloaded successfully!");
      setDownloading(false);
    } catch (error) {
      console.error("Download error:", error);
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(`Download failed: ${message}`);
      setDownloading(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-500">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="vendor-dashboard-header__title">Store Flyer</h1>
          <p className="vendor-dashboard-header__subtitle">
            Download and share your store flyer with customers
          </p>
        </div>
        <p className="text-xs text-muted-foreground sm:text-right">
          Use this flyer for offline promotion
        </p>
      </div>

      {!storeCode ? (
        <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
          Your store code is not set yet. Once it is assigned to your account,
          your unique QR link will appear here.
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="flex justify-center lg:col-span-3">
          <div id="flyer-preview" className="store-flyer-preview-shell">
            <FlyerPreviewCard
              ref={flyerRef}
              storeName={storeName}
              storeCode={storeCode}
              showQR={showQR && Boolean(storeUrl)}
              storeUrl={storeUrl}
            />
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="sticky top-6 space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="border-b border-border pb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Customize & Download
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Personalize your store flyer
              </p>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="store-name">Store Name</Label>
                <Input
                  id="store-name"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="Enter store name"
                  className="vendor-form-control"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="store-code">Store Code</Label>
                <div className="relative">
                  <Input
                    id="store-code"
                    value={storeCode || "—"}
                    readOnly
                    className={cn(
                      "vendor-form-control font-mono font-semibold",
                      "cursor-not-allowed bg-secondary/50 pr-24",
                    )}
                  />
                  <div className="absolute top-1/2 right-3 -translate-y-1/2">
                    <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      Read-only
                    </span>
                  </div>
                </div>
              </div>

              {storeUrl ? (
                <div className="space-y-1 rounded-xl border border-border bg-muted/30 px-3 py-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Store link (QR encodes this URL)
                  </p>
                  <p className="break-all text-sm text-foreground">{storeUrl}</p>
                </div>
              ) : null}

              <div className="flex items-center justify-between border-t border-border pt-4">
                <Label htmlFor="show-qr" className="cursor-pointer">
                  Show QR Code
                </Label>
                <Switch
                  id="show-qr"
                  checked={showQR}
                  onCheckedChange={setShowQR}
                  disabled={!storeCode}
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <Button
                type="button"
                className="h-12 w-full gap-2 shadow-lg shadow-primary/30"
                onClick={handleDownloadFlyer}
                disabled={downloading || !storeCode}
              >
                {downloading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5" />
                    Download Flyer
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="h-12 w-full gap-2"
                onClick={handleCopyLink}
                disabled={!storeUrl}
              >
                {copied ? (
                  <>
                    <Check className="h-5 w-5 text-green-600" />
                    <span className="text-green-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-5 w-5" />
                    Copy Store Link
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
