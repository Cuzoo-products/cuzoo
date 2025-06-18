import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import type { PerformingDriverData } from "@/pages/fleet/Dashboard";

function PerformingDrivers({ data }: { data: PerformingDriverData[] }) {
  return (
    <>
      {data.map((items) => (
        <div
          key={items.id}
          className="flex items-center space-x-3 border-b border-b-line-1 py-3"
        >
          <Avatar className="size-10">
            <AvatarImage src={items.imageUrl} />
            <AvatarFallback className="border-1">
              {items.initials}
            </AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <p className="font-bold">{items.name}</p>
            <p>{items.trips} trips</p>
          </div>
        </div>
      ))}
    </>
  );
}

export default PerformingDrivers;
