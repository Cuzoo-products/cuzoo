import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

function toDate(value: Date | string | undefined): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return value;
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

export type DatePickerProps = {
  value?: Date | string;
  onChange: (value: Date | string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  /** When "string", onChange receives "yyyy-MM-dd". */
  valueType?: "date" | "string";
  fromYear?: number;
  toYear?: number;
  disableDate?: (date: Date) => boolean;
  buttonClassName?: string;
  popoverContentClassName?: string;
};

function isCalendarSelectTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return false;
  return Boolean(
    target.closest('[data-slot="select-content"]') ||
      target.closest('[data-slot="select-trigger"]') ||
      target.closest('[data-slot="select-item"]'),
  );
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  disabled = false,
  valueType = "date",
  fromYear = 1900,
  toYear = new Date().getFullYear(),
  disableDate,
  buttonClassName,
  popoverContentClassName,
}: DatePickerProps) {
  const selected = toDate(value);
  const startMonth = new Date(fromYear, 0);
  const endMonth = new Date(toYear, 11);

  function handleSelect(date: Date | undefined) {
    if (valueType === "string") {
      onChange(date ? format(date, "yyyy-MM-dd") : "");
      return;
    }
    onChange(date);
  }

  return (
    <Popover modal={false}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start pl-3 text-left font-normal",
            !selected && "text-muted-foreground",
            buttonClassName,
          )}
        >
          {selected ? format(selected, "PPP") : placeholder}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn("w-auto p-0", popoverContentClassName)}
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => {
          if (isCalendarSelectTarget(e.target)) {
            e.preventDefault();
          }
        }}
        onFocusOutside={(e) => {
          if (isCalendarSelectTarget(e.target)) {
            e.preventDefault();
          }
        }}
        onInteractOutside={(e) => {
          if (isCalendarSelectTarget(e.target)) {
            e.preventDefault();
          }
        }}
      >
        <Calendar
          mode="single"
          captionLayout="dropdown"
          startMonth={startMonth}
          endMonth={endMonth}
          defaultMonth={selected ?? endMonth}
          selected={selected}
          onSelect={handleSelect}
          disabled={disableDate}
          initialFocus
          formatters={{
            formatMonthDropdown: (date) =>
              date.toLocaleString("default", { month: "long" }),
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
