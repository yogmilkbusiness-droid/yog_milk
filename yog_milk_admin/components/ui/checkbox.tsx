import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function Checkbox({
  checked,
  onCheckedChange,
  label,
  disabled = false,
  className,
}: CheckboxProps) {
  return (
    <label
      className={cn(
        "flex items-center space-x-2 cursor-pointer select-none",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "h-4 w-4 shrink-0 rounded border border-dairy-outline transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary flex items-center justify-center",
          checked ? "bg-primary border-primary text-white" : "bg-white"
        )}
      >
        {checked && <Check className="h-3 w-3 stroke-[3]" />}
      </button>
      {label && <span className="text-xs font-medium text-dairy-dark">{label}</span>}
    </label>
  );
}

