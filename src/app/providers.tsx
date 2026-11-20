"use client";

import { environmentManager, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { CART_KEY, useCart } from "@/lib/cart-store";

// TanStack Query is ready for data the site fetches in the browser. The catalog itself is built into
// the pages, so nothing uses it yet.
function makeQueryClient() {
  return new QueryClient({
    // Prerendered data is fresh on arrival; don't refetch it straight away.
    defaultOptions: { queries: { staleTime: 60 * 1000 } },
  });
}

let browserQueryClient: QueryClient | undefined;
function getQueryClient() {
  if (environmentManager.isServer()) return makeQueryClient();
  // Reuse one client in the browser, so a suspended first render doesn't throw it away.
  return (browserQueryClient ??= makeQueryClient());
}

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useCart.persist.rehydrate();
    // Keep the cart in step with other tabs.
    const onStorage = (e: StorageEvent) => e.key === CART_KEY && useCart.persist.rehydrate();
    addEventListener("storage", onStorage);
    return () => removeEventListener("storage", onStorage);
  }, []);

  return <QueryClientProvider client={getQueryClient()}>{children}</QueryClientProvider>;
}
