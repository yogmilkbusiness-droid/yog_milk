import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center space-x-1.5 text-xs text-muted-foreground", className)}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={index} className="flex items-center space-x-1.5">
            {index > 0 && <ChevronRight className="h-3 w-3 text-dairy-outline" />}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="hover:text-primary transition-colors font-medium"
              >
                {item.label}
              </Link>
            ) : (
              <span className={cn(isLast && "font-semibold text-dairy-dark")}>
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}

