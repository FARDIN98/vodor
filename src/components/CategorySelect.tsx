"use client";

import { useRouter } from "next/navigation";

/** The phone layout's category picker. */
export default function CategorySelect({ options, value }: { options: { href: string; name: string }[]; value: string }) {
  const router = useRouter();
  return (
    <div className="catsel">
      <label htmlFor="catsel">Categories</label>
      {/* Uncontrolled so the new choice shows while the page loads; the key resets it on arrival. */}
      <select id="catsel" key={value} defaultValue={value} onChange={(e) => router.push(e.target.value)}>
        {options.map((o) => (
          <option key={o.href} value={o.href}>
            {o.name}
          </option>
        ))}
      </select>
    </div>
  );
}
