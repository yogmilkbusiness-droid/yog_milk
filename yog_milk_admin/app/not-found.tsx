import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
      <div className="h-14 w-14 rounded-full bg-dairy-surface-low flex items-center justify-center text-primary mb-4">
        <FileQuestion className="h-7 w-7" />
      </div>
      <h2 className="font-serif text-2xl font-bold text-dairy-dark">
        Operational Desk Not Found
      </h2>
      <p className="text-sm text-muted-foreground mt-2 max-w-md">
        The requested admin route, order record, or retailer profile does not exist or has been archived.
      </p>
      <div className="mt-6">
        <Button asChild variant="outline" className="gap-2">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Return to Operations Overview
          </Link>
        </Button>
      </div>
    </div>
  );
}

