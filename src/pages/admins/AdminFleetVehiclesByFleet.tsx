import { useParams, Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

type FleetVehicle = {
  id: string;
  fleetId: string;
  plateNumber: string;
  type: string;
  status: "Active" | "Inactive";
};

const DUMMY_FLEET_VEHICLES: FleetVehicle[] = [
  { id: "VH-001", fleetId: "fleet-1", plateNumber: "LAG-123AA", type: "Sedan", status: "Active" },
  { id: "VH-002", fleetId: "fleet-1", plateNumber: "LAG-456BB", type: "SUV", status: "Active" },
  { id: "VH-003", fleetId: "fleet-2", plateNumber: "ABJ-999CC", type: "Mini bus", status: "Inactive" },
];

export default function AdminFleetVehiclesByFleet() {
  const { id } = useParams<{ id: string }>();
  const fleetId = id ?? "";
  const rows = DUMMY_FLEET_VEHICLES.filter((v) => v.fleetId === fleetId);

  return (
    <div className="@container/main">
      <div className="my-6 flex items-center justify-between">
        <div>
          <h3 className="!font-bold text-3xl">Fleet Vehicles</h3>
          <p className="text-muted-foreground">Vehicles linked to this fleet manager.</p>
        </div>
        <Button asChild variant="outline">
          <Link to={`/admins/fleet_managers/${fleetId}`}>Back to fleet</Link>
        </Button>
      </div>
      <Card className="bg-secondary">
        <CardHeader>
          <CardTitle>Vehicles</CardTitle>
          <CardDescription>Dummy data for now.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle ID</TableHead>
                <TableHead>Plate Number</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">No vehicles for this fleet in dummy data.</TableCell>
                </TableRow>
              ) : rows.map((v) => (
                <TableRow key={v.id}>
                  <TableCell className="font-mono">{v.id}</TableCell>
                  <TableCell>{v.plateNumber}</TableCell>
                  <TableCell>{v.type}</TableCell>
                  <TableCell>{v.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
