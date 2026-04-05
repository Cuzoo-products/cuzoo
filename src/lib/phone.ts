import {
  isValidPhoneNumber,
  parsePhoneNumberFromString,
} from "libphonenumber-js";
import { z } from "zod";

/**
 * International numbers in compact E.164 (no spaces), e.g. +2348031234567.
 * Validation uses libphonenumber-js.
 */
export const INTERNATIONAL_PHONE_ERROR =
  "Enter a valid international phone number with no spaces, e.g. +2348031234567";

/**
 * Parses input and returns E.164 when valid; otherwise a best-effort +digits
 * string for error display (may fail `isValidPhoneNumber`).
 */
export function normalizeInternationalPhoneCompact(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";

  let parsed = parsePhoneNumberFromString(trimmed);
  if (parsed?.isValid()) {
    return parsed.format("E.164");
  }

  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return "";
  const withPlus = `+${digits.slice(0, 15)}`;
  parsed = parsePhoneNumberFromString(withPlus);
  if (parsed?.isValid()) {
    return parsed.format("E.164");
  }
  return withPlus;
}

/** True if the value is a valid phone number in E.164 form. */
export function isValidInternationalPhoneCompact(value: string): boolean {
  if (!value?.trim()) return false;
  return isValidPhoneNumber(value.trim());
}

/** Required phone — normalizes on parse; submitted values are compact E.164 when valid. */
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
