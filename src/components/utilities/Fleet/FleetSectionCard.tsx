import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Car, RouteIcon, Users, Wallet } from "lucide-react";

export type FleetSectionCardProps = {
  finance?: number;
  vehicles?: number;
  drivers?: number;
  trips?: number;
};

function FleetSectionCard({
  finance = 0,
  vehicles = 0,
  drivers = 0,
  trips = 0,
}: FleetSectionCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4  gap-2">
      <Card className="bg-primary text-white gap-0 pt-4 pb-2">
        <CardHeader>
          <Wallet />
        </CardHeader>
        <CardContent className="mt-1">
          <h3 className="text-3xl">₦{finance.toLocaleString()}</h3>
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
          <h3 className="text-3xl">{vehicles}</h3>
        </CardContent>
        <CardFooter>
          <CardTitle>Vehicles</CardTitle>
        </CardFooter>
      </Card>

      <Card className="gap-0 pt-4 pb-2 bg-secondary">
        <CardHeader>
          <Users />
        </CardHeader>
        <CardContent className="mt-1">
          <h3 className="text-3xl">{drivers}</h3>
        </CardContent>
        <CardFooter>
          <CardTitle>Drivers</CardTitle>
        </CardFooter>
      </Card>

      <Card className="gap-0 pt-4 pb-2 bg-secondary text-secondary-foreground">
        <CardHeader>
          <RouteIcon />
        </CardHeader>
        <CardContent className="mt-1">
          <h3 className="text-3xl">{trips}</h3>
        </CardContent>
        <CardFooter>
          <CardTitle>Total Trips</CardTitle>
        </CardFooter>
      </Card>
    </div>
  );
}

export default FleetSectionCard;
