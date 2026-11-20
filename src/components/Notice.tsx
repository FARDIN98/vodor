"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Msg = { title: string; msg: string };

/** The "can't add" notice, styled like the original shop's. Returns the element to render and `show`. */
export function useNotice() {
  const [msg, setMsg] = useState<Msg | null>(null);
  const show = useCallback((title: string, text: string) => setMsg({ title, msg: text }), []);
  const close = useCallback(() => setMsg(null), []);
  const element = msg && <Notice {...msg} onClose={close} />;
  return [element, show] as const;
}

export const stockMessage = (max: number) => `Sorry, we only have ${max} of that item available.`;

function Notice({ title, msg, onClose }: Msg & { onClose: () => void }) {
  const ok = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const back = document.activeElement as HTMLElement | null;
    ok.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Tab") e.preventDefault();
      if (e.key === "Escape") onClose();
    };
    addEventListener("keydown", onKey);
    return () => {
      removeEventListener("keydown", onKey);
      back?.focus();
    };
  }, [onClose]);

  return createPortal(
    <div>
      <div className="ovl" onClick={onClose} />
      <div className="alert" role="alertdialog" aria-modal="true" aria-labelledby="al-t" aria-describedby="al-m">
        <div className="ac">
          <div className="at" id="al-t">
            {title}
          </div>
          <div className="am" id="al-m">
            {msg}
          </div>
        </div>
        <button ref={ok} className="ok" type="button" onClick={onClose}>
          Okay
        </button>
      </div>
    </div>,
    document.body,
  );
}
