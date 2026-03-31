import { useParams, Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

type FleetRider = {
  id: string;
  fleetId: string;
  name: string;
  email: string;
  status: "Active" | "Disabled";
};

const DUMMY_FLEET_RIDERS: FleetRider[] = [
  { id: "R-1001", fleetId: "fleet-1", name: "John Doe", email: "john@example.com", status: "Active" },
  { id: "R-1002", fleetId: "fleet-1", name: "Mary James", email: "mary@example.com", status: "Active" },
  { id: "R-1003", fleetId: "fleet-2", name: "Bola Ade", email: "bola@example.com", status: "Disabled" },
];

export default function AdminFleetRidersByFleet() {
  const { id } = useParams<{ id: string }>();
  const fleetId = id ?? "";
  const rows = DUMMY_FLEET_RIDERS.filter((r) => r.fleetId === fleetId);

  return (
    <div className="@container/main">
      <div className="my-6 flex items-center justify-between">
        <div>
          <h3 className="!font-bold text-3xl">Fleet Riders</h3>
          <p className="text-muted-foreground">Riders linked to this fleet manager.</p>
        </div>
        <Button asChild variant="outline">
          <Link to={`/admins/fleet_managers/${fleetId}`}>Back to fleet</Link>
        </Button>
      </div>
      <Card className="bg-secondary">
        <CardHeader>
          <CardTitle>Riders</CardTitle>
          <CardDescription>Dummy data for now.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rider ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">No riders for this fleet in dummy data.</TableCell>
                </TableRow>
              ) : rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono">{r.id}</TableCell>
                  <TableCell>{r.name}</TableCell>
                  <TableCell>{r.email}</TableCell>
                  <TableCell>{r.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
