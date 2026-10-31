"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard caught error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
      <div className="h-14 w-14 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-4">
        <AlertTriangle className="h-7 w-7" />
      </div>
      <h2 className="font-serif text-2xl font-bold text-dairy-dark">
        Operational Error Occurred
      </h2>
      <p className="text-sm text-muted-foreground mt-2 max-w-md">
        An unexpected error occurred while rendering this operational desk:{" "}
        <span className="font-mono text-xs text-red-700 bg-red-50 px-1 py-0.5 rounded">
          {error.message || "Unknown error"}
        </span>
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Button onClick={() => reset()} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Reload Desk
        </Button>
      </div>
    </div>
  );
}

