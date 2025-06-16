import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router";

function FleetSectionCard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4  gap-2">
      <Card className="bg-primary text-white gap-0 pt-4 pb-2">
        <CardHeader>
          <CardTitle>Finance</CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="text-4xl">₦340000</h3>
        </CardContent>
        <CardFooter>
          <Link to="#" className="text-accent">
            see finance
          </Link>
        </CardFooter>
      </Card>

      <Card className="gap-0 pt-4 pb-2">
        <CardHeader>
          <CardTitle>Vehicles</CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="text-4xl">24</h3>
        </CardContent>
        <CardFooter>
          <Link to="#" className="text-accent">
            see vehicles
          </Link>
        </CardFooter>
      </Card>

      <Card className="gap-0 pt-4 pb-2">
        <CardHeader>
          <CardTitle>Drivers</CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="text-4xl">30</h3>
        </CardContent>
        <CardFooter>
          <Link to="#" className="text-accent">
            see drivers
          </Link>
        </CardFooter>
      </Card>

      <Card className="gap-0 pt-4 pb-2">
        <CardHeader>
          <CardTitle>Total Trips</CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="text-4xl">127</h3>
        </CardContent>
        <CardFooter>
          <Link to="#" className="text-accent">
            see trips
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export default FleetSectionCard;
