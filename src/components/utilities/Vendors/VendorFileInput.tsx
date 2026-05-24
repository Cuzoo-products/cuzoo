import { useId, useState } from "react";
import { cn } from "@/lib/utils";

type VendorFileInputProps = {
  accept?: string;
  onFileSelect: (file: File | null) => void | Promise<void>;
  className?: string;
  emptyLabel?: string;
};

export function VendorFileInput({
  accept = "image/*",
  onFileSelect,
  className,
  emptyLabel = "No file chosen",
}: VendorFileInputProps) {
  const id = useId();
  const [fileLabel, setFileLabel] = useState(emptyLabel);

  return (
    <div className={cn("vendor-form-file-field", className)}>
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
      <label htmlFor={id} className="vendor-form-file-trigger">
        <span className="vendor-form-file-button">Choose File</span>
        <span className="vendor-form-file-text">{fileLabel}</span>
      </label>
    </div>
  );
}
