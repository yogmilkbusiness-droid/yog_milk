import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-dairy-surface-low border border-dairy-subtle/40",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };

