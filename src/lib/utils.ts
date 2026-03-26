import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

/** Firestore / protobuf-style timestamps from APIs */
type TimestampLike = {
  _seconds?: number;
  _nanoseconds?: number;
  seconds?: number;
  nanoseconds?: number;
};

function isTimestampLike(v: unknown): v is TimestampLike {
  if (!v || typeof v !== "object") return false;
  const o = v as TimestampLike;
  return typeof o._seconds === "number" || typeof o.seconds === "number";
}

/**
 * Format API date fields that may be ISO strings, unix ms, or Firestore-like objects.
 * Avoids "Invalid Date" when the backend sends `{ _seconds, _nanoseconds }`.
 */
export function formatApiDate(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? "—" : value.toLocaleString();
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    const ms = value < 1e12 ? value * 1000 : value;
    const d = new Date(ms);
    return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString();
  }

  if (typeof value === "string") {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString();
  }

  if (isTimestampLike(value)) {
    const sec = value._seconds ?? value.seconds;
    if (sec === undefined) return "—";
    const d = new Date(sec * 1000);
    return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString();
  }

  return "—";
}
