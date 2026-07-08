import { useEffect, useRef, useState } from "react";
import { isGooglePlaceId } from "@/lib/placeId";

interface GogglePlaceProps {
  /** Google Place ID (what gets stored / submitted). */
  value?: string;
  /** Human-readable address to show in the input. Never pass the place ID here. */
  label?: string;
  onChange?: (placeId: string, address: string) => void;
  placeholder?: string;
  className?: string;
}

interface GoogleMapsAutocomplete {
  getPlace: () => {
    place_id?: string;
    formatted_address?: string;
    name?: string;
  };
  addListener: (event: string, callback: () => void) => void;
}

interface GoogleMaps {
  maps: {
    places: {
      Autocomplete: new (
        input: HTMLInputElement,
        options: {
          fields?: string[];
          componentRestrictions?: { country: string | string[] };
        },
      ) => GoogleMapsAutocomplete;
    };
    event: {
      clearInstanceListeners: (instance: GoogleMapsAutocomplete) => void;
    };
  };
}

declare global {
  interface Window {
    google?: GoogleMaps;
  }
}

let googleMapsPromise: Promise<void> | null = null;

function getGoogleMapsApiKey(): string {
  const raw = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  return typeof raw === "string" ? raw.trim() : "";
}

function loadGoogleMapsPlaces(): Promise<void> {
  if (window.google?.maps?.places) {
    return Promise.resolve();
  }

  if (googleMapsPromise) return googleMapsPromise;

  const apiKey = getGoogleMapsApiKey();
  if (!apiKey) {
    return Promise.reject(
      new Error(
        "Google Maps API key not found. Set VITE_GOOGLE_MAPS_API_KEY in your .env file.",
      ),
    );
  }

  googleMapsPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-cuzoo-google-maps="true"]',
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Failed to load Google Maps API")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.dataset.cuzooGoogleMaps = "true";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      googleMapsPromise = null;
      reject(new Error("Failed to load Google Maps API"));
    };
    document.head.appendChild(script);
  });

  return googleMapsPromise;
}

export function GogglePlace({
  value = "",
  label = "",
  onChange,
  placeholder = "Search address...",
  className,
}: GogglePlaceProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<GoogleMapsAutocomplete | null>(null);
  const onChangeRef = useRef(onChange);
  const selectedPlaceIdRef = useRef(isGooglePlaceId(value) ? value : "");

  const [displayValue, setDisplayValue] = useState(() => {
    if (label.trim()) return label;
    if (value && !isGooglePlaceId(value)) return value;
    return "";
  });
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (isGooglePlaceId(value)) {
      selectedPlaceIdRef.current = value;
    } else if (!value) {
      selectedPlaceIdRef.current = "";
    }
  }, [value]);

  useEffect(() => {
    if (label.trim()) {
      setDisplayValue(label);
      return;
    }
    if (!value) {
      setDisplayValue("");
      return;
    }
    // Never show place IDs in the text field.
    if (!isGooglePlaceId(value)) {
      setDisplayValue(value);
    }
  }, [label, value]);

  useEffect(() => {
    let cancelled = false;

    const initAutocomplete = async () => {
      try {
        await loadGoogleMapsPlaces();
        if (cancelled || !inputRef.current || !window.google?.maps?.places) {
          return;
        }

        if (autocompleteRef.current) {
          window.google.maps.event.clearInstanceListeners(
            autocompleteRef.current,
          );
          autocompleteRef.current = null;
        }

        // Avoid mixing Autocomplete `types` (breaks selection for many results).
        const autocomplete = new window.google.maps.places.Autocomplete(
          inputRef.current,
          {
            fields: ["place_id", "formatted_address", "name"],
            componentRestrictions: { country: "ng" },
          },
        );

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          const placeId = place.place_id?.trim() ?? "";
          if (!placeId) {
            selectedPlaceIdRef.current = "";
            onChangeRef.current?.("", inputRef.current?.value.trim() ?? "");
            return;
          }

          const address =
            place.formatted_address?.trim() ||
            place.name?.trim() ||
            inputRef.current?.value.trim() ||
            "";

          selectedPlaceIdRef.current = placeId;
          setDisplayValue(address);
          onChangeRef.current?.(placeId, address);
        });

        autocompleteRef.current = autocomplete;
        setLoadError(null);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Could not initialize Google Places";
        if (!cancelled) setLoadError(message);
        console.error(message);
      }
    };

    void initAutocomplete();

    return () => {
      cancelled = true;
      if (autocompleteRef.current && window.google?.maps?.event) {
        window.google.maps.event.clearInstanceListeners(
          autocompleteRef.current,
        );
        autocompleteRef.current = null;
      }
    };
  }, []);

  return (
    <div className="cuzoo-places-field w-full">
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={displayValue}
        onChange={(e) => {
          const next = e.target.value;
          setDisplayValue(next);
          // Typing invalidates previous selection — user must pick again.
          if (selectedPlaceIdRef.current) {
            selectedPlaceIdRef.current = "";
            onChangeRef.current?.("", next);
          }
        }}
        autoComplete="off"
        className={
          className ??
          "flex h-11 w-full rounded-md border border-[#d6d6d6] bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4D37B3] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        }
      />
      {loadError ? (
        <p className="mt-1 text-xs text-red-500">{loadError}</p>
      ) : null}
    </div>
  );
}
