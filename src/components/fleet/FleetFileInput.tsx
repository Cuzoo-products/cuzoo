import { useId, useState } from "react";
import { cn } from "@/lib/utils";

type FleetFileInputProps = {
  accept?: string;
  onFileSelect: (file: File | null) => void | Promise<void>;
  className?: string;
  emptyLabel?: string;
};

export function FleetFileInput({
  accept = "image/*",
  onFileSelect,
  className,
  emptyLabel = "No file chosen",
}: FleetFileInputProps) {
  const id = useId();
  const [fileLabel, setFileLabel] = useState(emptyLabel);

  return (
    <div className={cn("fleet-form-file-field", className)}>
      <input
        id={id}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={async (e) => {
          const file = e.target.files?.[0] ?? null;
          setFileLabel(file?.name ?? emptyLabel);
          await onFileSelect(file);
        }}
      />
      <label htmlFor={id} className="fleet-form-file-trigger">
        <span className="fleet-form-file-button">Choose File</span>
        <span className="fleet-form-file-text">{fileLabel}</span>
      </label>
    </div>
  );
}
