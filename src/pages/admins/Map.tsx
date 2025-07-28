import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Input } from "@/components/ui/input"; // from shadcn
import "leaflet/dist/leaflet.css";
import type { LatLngExpression } from "leaflet";

// Types
type Fleet = {
  id: string;
  lat: number;
  lng: number;
};

type Position = {
  lat: number;
  lng: number;
};

// Mocked fleet data — ideally you'd fetch this
const fleetData: Fleet[] = [
  { id: "ABC123", lat: 6.5244, lng: 3.3792 },
  { id: "XYZ789", lat: 6.6, lng: 3.35 },
  { id: "JKL456", lat: 6.47, lng: 3.4 },
];

// Utility to find closest fleet to a position
const findClosestFleet = (userPos: Position, fleets: Fleet[]): Fleet | null => {
  if (!userPos) return null;

  const dist = (a: Position, b: Position): number =>
    Math.sqrt(Math.pow(a.lat - b.lat, 2) + Math.pow(a.lng - b.lng, 2));

  return fleets.reduce((prev, curr) =>
    dist(userPos, curr) < dist(userPos, prev) ? curr : prev
  );
};

// Component to move the map to a given position
const FlyTo: React.FC<{ position: LatLngExpression | null }> = ({
  position,
}) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 13);
    }
  }, [position, map]);

  return null;
};

export default function Map() {
  const [userPos, setUserPos] = useState<Position | null>(null);
  const [selectedFleet, setSelectedFleet] = useState<Fleet | null>(null);
  const [search, setSearch] = useState<string>("");

  // Get user's current location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        console.error("Geolocation error:", err);
      }
    );
  }, []);

  // Once user location is available, find and center on the closest fleet
  useEffect(() => {
    if (userPos) {
      const closest = findClosestFleet(userPos, fleetData);
      setSelectedFleet(closest);
    }
  }, [userPos]);

  // Handle search input
  const handleSearch = (value: string) => {
    setSearch(value);
    const found = fleetData.find(
      (fleet) => fleet.id.toLowerCase() === value.trim().toLowerCase()
    );
    if (found) {
      setSelectedFleet(found);
    }
  };

  const mapCenter: LatLngExpression = selectedFleet
    ? [selectedFleet.lat, selectedFleet.lng]
    : [6.5244, 3.3792]; // default center (e.g., Lagos)

  return (
    <div className="h-screen w-full flex flex-col mb-15">
      <Input
        placeholder="Search vehicle number (e.g., ABC123)"
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        className="mb-4 max-w-md"
      />

      <MapContainer
        center={mapCenter}
        zoom={13}
        scrollWheelZoom={true}
        className="flex-1 rounded-xl shadow"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {fleetData.map((fleet) => (
          <Marker
            key={fleet.id}
            position={[fleet.lat, fleet.lng] as LatLngExpression}
          >
            <Popup>{fleet.id}</Popup>
          </Marker>
        ))}

        <FlyTo
          position={
            selectedFleet ? [selectedFleet.lat, selectedFleet.lng] : null
          }
        />
      </MapContainer>
    </div>
  );
}
