import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Car, RouteIcon, Users, Wallet } from "lucide-react";

function FleetSectionCard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4  gap-2">
      <Card className="bg-primary text-white gap-0 pt-4 pb-2">
        <CardHeader>
          <Wallet />
        </CardHeader>
        <CardContent className="mt-1">
          <h3 className="text-3xl">₦340000</h3>
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
          <h3 className="text-3xl">24</h3>
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
          <h3 className="text-3xl">30</h3>
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
          <h3 className="text-3xl">127</h3>
        </CardContent>
        <CardFooter>
          <CardTitle>Total Trips</CardTitle>
        </CardFooter>
      </Card>
    </div>
  );
}

export default FleetSectionCard;
