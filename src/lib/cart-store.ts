// The cart lives in this browser (localStorage). There is no online checkout behind it.
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CartProduct, Options } from "./shop";

export type Line = { s: string; a: Options; q: number };

type CartState = {
  lines: Line[];
  /** False until the saved cart has been read; the static HTML always starts empty. */
  hydrated: boolean;
  /** Adds to the cart. Returns the line's options in the shop's order, or null when it would go past the stock. */
  add: (slug: string, product: CartProduct, attrs: Options, qty: number) => Options | null;
  setQty: (line: Line, qty: number) => void;
  remove: (line: Line) => void;
};

export const CART_KEY = "vodor-cart";

// localStorage can hold anything, so only well-formed lines are kept.
const isLine = (i: unknown): i is Line => {
  const l = i as Line;
  return !!l && typeof l.s === "string" && typeof l.q === "number" && l.q >= 1 && !!l.a && typeof l.a === "object" && Object.values(l.a).every((v) => typeof v === "string");
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      hydrated: false,
      add: (s, p, attrs, q) => {
        const a = Object.fromEntries((p.order.length ? p.order : Object.keys(attrs)).map((k) => [k, attrs[k]]));
        const key = JSON.stringify(a);
        const lines = get().lines;
        const it = lines.find((i) => i.s === s && JSON.stringify(i.a) === key);
        if (p.max != null && (it?.q ?? 0) + q > p.max) return null;
        set({ lines: it ? lines.map((i) => (i === it ? { ...i, q: i.q + q } : i)) : [...lines, { s, a, q }] });
        return a;
      },
      setQty: (line, q) => set({ lines: get().lines.map((i) => (i === line ? { ...i, q } : i)) }),
      remove: (line) => set({ lines: get().lines.filter((i) => i !== line) }),
    }),
    {
      name: CART_KEY,
      // `window.` so prerendering on the server gets no storage (and Node's own localStorage isn't touched).
      storage: createJSONStorage(() => window.localStorage),
      partialize: (s) => ({ lines: s.lines }),
      merge: (saved, current) => {
        const lines = (saved as { lines?: unknown } | undefined)?.lines;
        return { ...current, lines: Array.isArray(lines) ? lines.filter(isLine) : [] };
      },
      // Read after the first render (see Providers), so the server HTML and first client render match.
      skipHydration: true,
      onRehydrateStorage: () => () => useCart.setState({ hydrated: true }),
    },
  ),
);

export const cartCount = (lines: Line[]) => lines.reduce((n, i) => n + i.q, 0);
