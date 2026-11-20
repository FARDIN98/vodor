"use client";

import { useId, useState } from "react";
import { Chevron, Plus } from "./icons";

/** Questions that open one by one. `answers` is trusted HTML from the shop's own content. */
export default function Accordion({ titles, answers, icon }: { titles: string[]; answers: string[]; icon: "plus" | "chevron" }) {
  const id = useId();
  const [open, setOpen] = useState<Set<number>>(() => new Set());
  const toggle = (i: number) =>
    setOpen((s) => {
      const n = new Set(s);
      if (!n.delete(i)) n.add(i);
      return n;
    });

  return (
    <ul className="acc">
      {titles.map((t, i) => (
        <li key={t} className={open.has(i) ? "open" : undefined}>
          <h4 className="q">
            <button aria-expanded={open.has(i)} aria-controls={`${id}-${i}`} onClick={() => toggle(i)}>
              <span>{t}</span>
              {icon === "plus" ? <Plus /> : <Chevron />}
            </button>
          </h4>
          <div className="a" id={`${id}-${i}`}>
            <div className="ai" dangerouslySetInnerHTML={{ __html: answers[i] }} />
          </div>
        </li>
      ))}
    </ul>
  );
}
