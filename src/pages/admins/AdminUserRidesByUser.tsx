import { useParams, Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

type UserRide = {
  id: string;
  userId: string;
  from: string;
  to: string;
  rider: string;
  amount: number;
  date: string;
};

const DUMMY_USER_RIDES: UserRide[] = [
  { id: "RIDE-1001", userId: "user-1", from: "Lekki", to: "Ajah", rider: "John Doe", amount: 4500, date: "2026-03-10" },
  { id: "RIDE-1002", userId: "user-1", from: "Yaba", to: "Ikeja", rider: "Mary James", amount: 3800, date: "2026-03-12" },
  { id: "RIDE-1003", userId: "user-2", from: "Wuse", to: "Maitama", rider: "Bola Ade", amount: 6200, date: "2026-03-11" },
];

export default function AdminUserRidesByUser() {
  const { id } = useParams<{ id: string }>();
  const userId = id ?? "";
  const rows = DUMMY_USER_RIDES.filter((r) => r.userId === userId);

  return (
    <div className="@container/main">
      <div className="my-6 flex items-center justify-between">
        <div>
          <h3 className="!font-bold text-3xl">User Rides</h3>
          <p className="text-muted-foreground">Rides requested by this user only.</p>
        </div>
        <Button asChild variant="outline">
          <Link to={`/admins/users/${userId}`}>Back to user</Link>
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
                <TableHead>Ride ID</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Rider</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No user rides for this ID in dummy data.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono">{r.id}</TableCell>
                    <TableCell>{r.from}</TableCell>
                    <TableCell>{r.to}</TableCell>
                    <TableCell>{r.rider}</TableCell>
                    <TableCell>₦{r.amount.toLocaleString("en-NG")}</TableCell>
                    <TableCell>{new Date(r.date).toLocaleDateString("en-NG")}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
