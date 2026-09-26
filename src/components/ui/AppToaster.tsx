"use client";

import { Toaster } from "sonner";

export default function AppToaster() {
  return (
    <Toaster richColors
      position="bottom-right"
      offset={16}
      mobileOffset={12}
      toastOptions={{
        duration: 6000
      }}
    />
  );
}
