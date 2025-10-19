import { useEffect, useRef, useState } from "react";

interface GogglePlaceProps {
  value?: string;
  onChange?: (placeId: string) => void;
  placeholder?: string;
}

interface GoogleMapsAutocomplete {
  getPlace: () => {
    place_id: string;
    formatted_address: string;
    geometry: {
      location: {
        lat: () => number;
        lng: () => number;
      };
    };
  };
  addListener: (event: string, callback: () => void) => void;
}

interface GoogleMapsPlaces {
  Autocomplete: new (
    input: HTMLInputElement,
    options: {
      types: string[];
      fields: string[];
    }
  ) => GoogleMapsAutocomplete;
}

interface GoogleMaps {
  maps: {
    places: GoogleMapsPlaces;
  };
}

declare global {
  interface Window {
    google: GoogleMaps;
  }
}

export function GogglePlace({
  value = "",
  onChange,
  placeholder = "Enter address...",
}: GogglePlaceProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<GoogleMapsAutocomplete | null>(null);
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const initAutocomplete = () => {
      if (!inputRef.current || !window.google) return;

      // Create the Autocomplete instance
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ["address"],
          fields: ["place_id", "formatted_address", "geometry"],
        }
      );

      // Listen for place selection
      autocompleteRef.current.addListener("place_changed", () => {
        if (autocompleteRef.current) {
          const place = autocompleteRef.current.getPlace();

          if (place.place_id) {
            const placeId = place.place_id;
            const address = place.formatted_address || "";

            setDisplayValue(address);
            if (onChange) {
              onChange(placeId);
            }
          }
        }
      });
    };

    // Load Google Maps script if not already loaded
    if (!window.google) {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

      if (!apiKey) {
        console.error(
          "Google Maps API key not found. Please set VITE_GOOGLE_MAPS_API_KEY in your environment variables."
        );
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        initAutocomplete();
      };
      script.onerror = () => {
        console.error("Failed to load Google Maps API");
      };
      document.head.appendChild(script);
    } else {
      initAutocomplete();
    }

    return () => {
      if (autocompleteRef.current) {
        // Clean up listeners if needed
        autocompleteRef.current = null;
      }
    };
  }, [onChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayValue(e.target.value);
  };

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder={placeholder}
      value={displayValue}
      onChange={handleInputChange}
      className="flex h-11 w-full rounded-md border border-[#d6d6d6] bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4D37B3] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    />
  );
}
