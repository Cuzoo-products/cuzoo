import { useId, useState } from "react";
import { cn } from "@/lib/utils";
import {
  formatFileSize,
  IMAGE_UPLOAD_SIZE_HINT,
  prepareImageUpload,
} from "@/lib/imageUpload";

type FleetFileInputProps = {
  accept?: string;
  onFileSelect: (file: File | null) => void | Promise<void>;
  className?: string;
  emptyLabel?: string;
  showSizeHint?: boolean;
};

export function FleetFileInput({
  accept = "image/*",
  onFileSelect,
  className,
  emptyLabel = "No file chosen",
  showSizeHint = true,
}: FleetFileInputProps) {
  const id = useId();
  const [fileLabel, setFileLabel] = useState(emptyLabel);
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <div className={cn("fleet-form-file-field w-full min-w-0", className)}>
      <input
        id={id}
        type="file"
        accept={accept}
        className="sr-only"
        disabled={isProcessing}
        onChange={async (e) => {
          const input = e.target;
          const file = input.files?.[0] ?? null;
          if (!file) {
            setFileLabel(emptyLabel);
            await onFileSelect(null);
            return;
          }

          setIsProcessing(true);
          try {
            const prepared = await prepareImageUpload(file);
            const sizeNote =
              prepared.size !== file.size
                ? ` (${formatFileSize(prepared.size)})`
                : "";
            setFileLabel(`${prepared.name}${sizeNote}`);
            await onFileSelect(prepared);
          } catch {
            setFileLabel(emptyLabel);
            input.value = "";
            await onFileSelect(null);
          } finally {
            setIsProcessing(false);
          }
        }}
      />
      <label
        htmlFor={id}
        className="fleet-form-file-trigger flex w-full min-w-0 items-center gap-4 overflow-hidden"
      >
        <span className="fleet-form-file-button shrink-0">
          {isProcessing ? "Compressing…" : "Choose File"}
        </span>
        <span
          className="fleet-form-file-text min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap"
          title={fileLabel !== emptyLabel ? fileLabel : undefined}
        >
          {fileLabel}
        </span>
      </label>
      {showSizeHint && (
        <p className="mt-1.5 text-xs text-muted-foreground">
          {IMAGE_UPLOAD_SIZE_HINT}
        </p>
      )}
    </div>
  );
}
