import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BriefcaseBusiness, Car, Users, Wallet } from "lucide-react";

function DashboardCards({
  finance,
  vendors,
  drivers,
  fleets,
}: {
  finance?: number;
  vendors?: number;
  drivers?: number;
  fleets?: number;
}) {
  const formattedFinance =
    typeof finance === "number"
      ? finance.toLocaleString("en-NG", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : "0.00";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4  gap-2">
      <Card className="bg-primary text-white gap-0 pt-4 pb-2">
        <CardHeader>
          <Wallet />
        </CardHeader>
        <CardContent className="mt-1">
          <h3 className="text-3xl">₦{formattedFinance}</h3>
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
          <h3 className="text-3xl">{drivers ?? 0}</h3>
        </CardContent>
        <CardFooter>
          <CardTitle>Drivers</CardTitle>
        </CardFooter>
      </Card>

      <Card className="gap-0 pt-4 pb-2 bg-secondary">
        <CardHeader>
          <Users />
        </CardHeader>
        <CardContent className="mt-1">
          <h3 className="text-3xl">{fleets ?? 0}</h3>
        </CardContent>
        <CardFooter>
          <CardTitle>Fleet</CardTitle>
        </CardFooter>
      </Card>

      <Card className="gap-0 pt-4 pb-2 bg-secondary text-secondary-foreground">
        <CardHeader>
          <BriefcaseBusiness />
        </CardHeader>
        <CardContent className="mt-1">
          <h3 className="text-3xl">{vendors ?? 0}</h3>
        </CardContent>
        <CardFooter>
          <CardTitle>Vendors</CardTitle>
        </CardFooter>
      </Card>
    </div>
  );
}

export default DashboardCards;
