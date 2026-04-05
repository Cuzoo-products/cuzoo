import { z } from "zod";

/**
 * E.164-style international number: leading +, then 7–15 digits (no spaces).
 * Example: +2348140231279
 */
export const INTERNATIONAL_PHONE_ERROR =
  "Use international format with no spaces, e.g. +2348140231279";

/** Strips non-digits, caps at 15 digits, prefixes +. */
export function normalizeInternationalPhoneCompact(input: string): string {
  const digits = input.replace(/\D/g, "");
  if (!digits) return "";
  return `+${digits.slice(0, 15)}`;
}

/** True if value matches compact international format (after normalization). */
export function isValidInternationalPhoneCompact(value: string): boolean {
  if (!value) return false;
  return /^\+[1-9]\d{6,14}$/.test(value);
}

/** Required phone — normalizes on parse; submitted values are compact. */
export const zInternationalPhoneCompact = z
  .string()
  .min(1, "Phone number is required")
  .transform((s) => normalizeInternationalPhoneCompact(s))
  .refine((s) => isValidInternationalPhoneCompact(s), {
    message: INTERNATIONAL_PHONE_ERROR,
  });

/** Empty string or valid compact international (e.g. optional profile phone). */
export const zInternationalPhoneCompactOrEmpty = z
  .string()
  .transform((s) => normalizeInternationalPhoneCompact(s.trim()))
  .refine((s) => s === "" || isValidInternationalPhoneCompact(s), {
    message: INTERNATIONAL_PHONE_ERROR,
  });
