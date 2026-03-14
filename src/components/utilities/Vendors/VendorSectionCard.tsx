import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Car, RouteIcon, Users, Wallet } from "lucide-react";

export type VendorSectionCardProps = {
  finance?: number;
  overallSales?: number;
  salesThisMonth?: number;
  products?: number;
};

function VendorSectionCard({
  finance = 0,
  overallSales = 0,
  salesThisMonth = 0,
  products = 0,
}: VendorSectionCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4  gap-2">
      <Card className="bg-primary text-white gap-0 pt-4 pb-2">
        <CardHeader>
          <Wallet />
        </CardHeader>
        <CardContent className="mt-1">
          <h3 className="text-3xl">
            ₦{finance.toLocaleString("en-NG", { maximumFractionDigits: 0 })}
          </h3>
        </CardContent>
        <CardFooter>
          <CardTitle>Finance</CardTitle>
        </CardFooter>
      </Card>

      <Card className="gap-0 pt-4 pb-2 bg-secondary">
        <CardHeader>
          <Car />
        </CardHeader>
        <CardContent className="mt-1">
          <h3 className="text-3xl">{overallSales.toLocaleString("en-NG")}</h3>
        </CardContent>
        <CardFooter>
          <CardTitle>Overall Sales</CardTitle>
        </CardFooter>
      </Card>

      <Card className="gap-0 pt-4 pb-2 bg-secondary">
        <CardHeader>
          <Users />
        </CardHeader>
        <CardContent className="mt-1">
          <h3 className="text-3xl">{salesThisMonth.toLocaleString("en-NG")}</h3>
        </CardContent>
        <CardFooter>
          <CardTitle>Sales this month</CardTitle>
        </CardFooter>
      </Card>

      <Card className="gap-0 pt-4 pb-2 bg-secondary text-secondary-foreground">
        <CardHeader>
          <RouteIcon />
        </CardHeader>
        <CardContent className="mt-1">
          <h3 className="text-3xl">{products.toLocaleString("en-NG")}</h3>
        </CardContent>
        <CardFooter>
          <CardTitle>Products</CardTitle>
        </CardFooter>
      </Card>
    </div>
  );
}

export default VendorSectionCard;
