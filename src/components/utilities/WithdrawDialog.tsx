import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function WithdrawDialog() {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button>Withdraw</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enter Amount</DialogTitle>
            <DialogDescription>
              Enter amount you want to withdraw here, and verify with your
              password.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Amount</Label>
              <Input name="name" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">Password</Label>
              <Input id="username-1" type="password" defaultValue="" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
