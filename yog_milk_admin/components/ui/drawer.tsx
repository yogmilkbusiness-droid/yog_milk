"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Drawer = DialogPrimitive.Root;
const DrawerTrigger = DialogPrimitive.Trigger;
const DrawerClose = DialogPrimitive.Close;

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
DrawerOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    width?: string;
  }
>(({ className, children, width = "max-w-md", ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DrawerOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-y-0 right-0 z-50 h-full w-full bg-white border-l border-dairy-subtle p-6 shadow-2xl transition ease-in-out duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right flex flex-col justify-between overflow-y-auto",
        width,
        className
      )}
      {...props}
    >
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-dairy-subtle mb-6">
          <div className="space-y-1">
            <DialogPrimitive.Title className="font-serif text-lg font-bold text-primary">
              {props["aria-label"] || "Slide-over Drawer"}
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="text-xs text-muted-foreground">
              Operational details and action desk
            </DialogPrimitive.Description>
          </div>
          <DialogPrimitive.Close className="rounded-md p-1.5 text-muted-foreground hover:bg-dairy-surface-low hover:text-dairy-dark transition-colors">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </div>
        {children}
      </div>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
DrawerContent.displayName = DialogPrimitive.Content.displayName;

export { Drawer, DrawerTrigger, DrawerClose, DrawerContent };

