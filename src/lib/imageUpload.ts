import { toast } from "sonner";
import { fileToBase64 } from "@/lib/utils";

/** Reject originals larger than this before processing. */
export const MAX_IMAGE_UPLOAD_BYTES = 1 * 1024 * 1024; // 1 MB

const MAX_IMAGE_DIMENSION = 1600;
const JPEG_QUALITY = 0.72;

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Short hint shown next to KYC / image file pickers. */
export const IMAGE_UPLOAD_SIZE_HINT = "Max 1 MB per image";

export function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}

export function assertUploadSize(
  file: File,
  maxBytes = MAX_IMAGE_UPLOAD_BYTES,
): void {
  if (file.size > maxBytes) {
    throw new Error(
      `This image is too large (${formatFileSize(file.size)}). Please upload an image under ${formatFileSize(maxBytes)}.`,
    );
  }
}

/**
 * Resize + compress an image file to JPEG. Non-images are returned unchanged
 * after a size check.
 */
export async function compressImageFile(
  file: File,
  options?: {
    maxBytes?: number;
    maxDimension?: number;
    quality?: number;
  },
): Promise<File> {
  const maxBytes = options?.maxBytes ?? MAX_IMAGE_UPLOAD_BYTES;
  const maxDimension = options?.maxDimension ?? MAX_IMAGE_DIMENSION;
  const quality = options?.quality ?? JPEG_QUALITY;

  assertUploadSize(file, maxBytes);

  if (!isImageFile(file)) {
    return file;
  }

  // Skip tiny images — no need to re-encode.
  if (file.size < 200 * 1024 && file.type === "image/jpeg") {
    return file;
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await loadImage(objectUrl);
    const { width, height } = fitWithin(image.width, image.height, maxDimension);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;

    ctx.drawImage(image, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((result) => resolve(result), "image/jpeg", quality);
    });

    if (!blob) return file;

    const baseName = file.name.replace(/\.[^.]+$/, "") || "image";
    return new File([blob], `${baseName}.jpg`, {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export async function prepareImageUpload(file: File): Promise<File> {
  try {
    return await compressImageFile(file);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not process this file.";
    toast.error(message);
    throw error;
  }
}

/** Compress (if image) then convert to data URL for KYC payloads. */
export async function fileToCompressedBase64(file: File): Promise<string> {
  const prepared = await compressImageFile(file);
  return fileToBase64(prepared);
}

export async function valueToCompressedBase64(
  value: FileList | File | string | undefined | null,
): Promise<string | undefined> {
  if (value === undefined || value === null) return undefined;
  if (typeof value === "string") return value.trim() || undefined;
  const file = value instanceof FileList ? value[0] : value;
  if (!file) return undefined;
  return fileToCompressedBase64(file);
}

export function isTimeoutLikeError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const err = error as {
    code?: string;
    message?: string;
    details?: unknown;
  };

  if (err.code === "ECONNABORTED") return true;

  const message = String(err.message ?? "").toLowerCase();
  if (
    message.includes("timeout") ||
    message.includes("took too long") ||
    message.includes("no response from server") ||
    message.includes("network error")
  ) {
    return true;
  }

  return false;
}

export const KYC_SLOW_UPLOAD_MESSAGE =
  "Your documents are still uploading. This can take up to 3 minutes — please keep this page open and don’t submit again yet.";

export const KYC_TIMEOUT_SOFT_MESSAGE =
  "Upload is taking longer than expected. The server may still finish processing. Please wait a moment before trying again — refreshing after a minute is safer than resubmitting.";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not read this image."));
    img.src = src;
  });
}

function fitWithin(
  width: number,
  height: number,
  maxDimension: number,
): { width: number; height: number } {
  if (width <= maxDimension && height <= maxDimension) {
    return { width, height };
  }
  const scale = maxDimension / Math.max(width, height);
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}
