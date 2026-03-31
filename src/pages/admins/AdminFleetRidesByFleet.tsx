import { useParams, Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

type FleetRide = {
  id: string;
  fleetId: string;
  rider: string;
  from: string;
  to: string;
  amount: number;
  date: string;
};

const DUMMY_FLEET_RIDES: FleetRide[] = [
  { id: "TRIP-001", fleetId: "fleet-1", rider: "John Doe", from: "Lekki", to: "Ajah", amount: 5500, date: "2026-03-26" },
  { id: "TRIP-002", fleetId: "fleet-1", rider: "Mary James", from: "Ikeja", to: "Yaba", amount: 4200, date: "2026-03-27" },
  { id: "TRIP-003", fleetId: "fleet-2", rider: "Bola Ade", from: "Wuse", to: "Maitama", amount: 7600, date: "2026-03-27" },
];

export default function AdminFleetRidesByFleet() {
  const { id } = useParams<{ id: string }>();
  const fleetId = id ?? "";
  const rows = DUMMY_FLEET_RIDES.filter((r) => r.fleetId === fleetId);

  return (
    <div className="@container/main">
      <div className="my-6 flex items-center justify-between">
        <div>
          <h3 className="!font-bold text-3xl">Fleet Rider Trips</h3>
          <p className="text-muted-foreground">Trips involving riders under this fleet manager.</p>
        </div>
        <Button asChild variant="outline">
          <Link to={`/admins/fleet_managers/${fleetId}`}>Back to fleet</Link>
        </Button>
      </div>
      <Card className="bg-secondary">
        <CardHeader>
          <CardTitle>Rides</CardTitle>
          <CardDescription>Dummy data for now.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trip ID</TableHead>
                <TableHead>Rider</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">No rides for this fleet in dummy data.</TableCell>
                </TableRow>
              ) : rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono">{r.id}</TableCell>
                  <TableCell>{r.rider}</TableCell>
                  <TableCell>{r.from}</TableCell>
                  <TableCell>{r.to}</TableCell>
                  <TableCell>?{r.amount.toLocaleString("en-NG")}</TableCell>
                  <TableCell>{new Date(r.date).toLocaleDateString("en-NG")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
