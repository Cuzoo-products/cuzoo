import { Package, Repeat, TrendingUp, Wallet, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type VendorSectionCardProps = {
  finance?: number;
  overallSales?: number;
  salesThisMonth?: number;
  products?: number;
};

type KpiItem = {
  icon: LucideIcon;
  label: string;
  value: string;
  variant?: "primary" | "default";
};

function VendorKpiCard({
  icon: Icon,
  label,
  value,
  variant = "default",
}: KpiItem) {
  return (
    <div
      className={cn(
        "vendor-kpi-card",
        variant === "primary" && "vendor-kpi-card--primary",
      )}
    >
      <div
        className={cn(
          "vendor-kpi-card__icon",
          variant === "primary" && "vendor-kpi-card__icon--primary",
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <p className="vendor-kpi-card__value">{value}</p>
      <p className="vendor-kpi-card__label">{label}</p>
    </div>
  );
}

function VendorSectionCard({
  finance = 0,
  overallSales = 0,
  salesThisMonth = 0,
  products = 0,
}: VendorSectionCardProps) {
  const items: KpiItem[] = [
    {
      icon: Wallet,
      label: "Finance",
      value: `₦${finance.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`,
      variant: "primary",
    },
    {
      icon: Repeat,
      label: "Overall Sales",
      value: overallSales.toLocaleString("en-NG"),
    },
    {
      icon: TrendingUp,
      label: "Sales this month",
      value: salesThisMonth.toLocaleString("en-NG"),
    },
    {
      icon: Package,
      label: "Products",
      value: products.toLocaleString("en-NG"),
    },
  ];

  return (
    <div className="vendor-kpi-grid">
      {items.map((item) => (
        <VendorKpiCard key={item.label} {...item} />
      ))}
    </div>
  );
}

export default VendorSectionCard;
