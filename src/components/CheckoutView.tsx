"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { flushSync } from "react-dom";
import { useCart } from "@/lib/cart-store";
import { linePhoto, money, type Catalog } from "@/lib/shop";
import { lineKey } from "./CartView";
import { ErrorIcon, NoShipIcon, ShieldIcon, Stroke } from "./icons";

// Modelled on the original's closed checkout: payments aren't set up, so it says so and stops at delivery.
// The order summary comes from the cart in this browser.
export default function CheckoutView({ catalog }: { catalog: Catalog }) {
  const router = useRouter();
  const hydrated = useCart((s) => s.hydrated);
  const lines = useCart((s) => s.lines).filter((l) => catalog[l.s]);
  const [step2, setStep2] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [discountOpen, setDiscountOpen] = useState(false);
  const [discountMsg, setDiscountMsg] = useState("");
  const emailInput = useRef<HTMLInputElement>(null);
  const firstName = useRef<HTMLInputElement>(null);
  const code = useRef<HTMLInputElement>(null);
  const summaryTitle = useRef<HTMLParagraphElement>(null);
  const summary = useRef<HTMLDivElement>(null);

  // Nothing to check out: back to the cart.
  const empty = hydrated && lines.length === 0;
  useEffect(() => {
    if (empty) router.replace("/cart");
  }, [empty, router]);

  const total = hydrated ? money(lines.reduce((t, l) => t + catalog[l.s].price * l.q, 0)) : "";

  const submitEmail = (e: FormEvent) => {
    e.preventDefault();
    const input = emailInput.current!;
    const v = input.value.trim();
    const msg = !v ? "Enter your email address." : input.checkValidity() ? "" : "Enter a valid email address.";
    setError(msg);
    if (msg) return input.focus();
    // Show step 2 first so its field can take focus.
    flushSync(() => {
      setEmail(v);
      setStep2(true);
    });
    firstName.current?.focus();
  };

  return (
    <div className="ckb">
      <header className="ckh">
        <p className="ckc">
          <b>Checkout is closed</b>
          <span>This store isn&apos;t set up to process payments.</span>
          <Link href="/our-policy">Learn more</Link>
        </p>
        <nav className="cknav" aria-label="Checkout">
          <Link className="cklogo" href="/">
            Vodor
          </Link>
        </nav>
      </header>
      <main className={step2 ? "ck step2" : "ck"}>
        <div className="ckl">
          <section className="cks" aria-labelledby="ck-e">
            <div className="ckt">
              <h1 id="ck-e">Your Email</h1>
              <button
                type="button"
                className="ckedit"
                onClick={() => {
                  flushSync(() => setStep2(false));
                  emailInput.current?.focus();
                }}
              >
                Edit
              </button>
            </div>
            <p className="ckemv">{email}</p>
            <form className={error ? "ckform bad" : "ckform"} noValidate onSubmit={submitEmail}>
              <label className="cklab" htmlFor="ck-em">
                Email
              </label>
              <div className="ckin">
                <input ref={emailInput} id="ck-em" type="email" placeholder="Email address" autoComplete="email" aria-describedby="ck-help ck-err" aria-invalid={!!error} />
                <ErrorIcon />
              </div>
              <span className="ckhelp" id="ck-help">
                You&apos;ll receive receipts and notifications at this email
              </span>
              <div className="ckerr" id="ck-err" role="alert" hidden={!error}>
                <span>{error}</span>
                <ErrorIcon />
              </div>
              <button className="ckbtn" type="submit">
                Continue
              </button>
            </form>
          </section>
          <section className="cks off" id="ck-del" aria-labelledby="ck-d">
            <h1 id="ck-d">Delivery</h1>
            <div className="ckdel">
              <div className="ckopt">
                <p>Delivery Options</p>
                <div>
                  <NoShipIcon />
                  Shipping unavailable for entered address
                </div>
              </div>
              <p className="ckship">Shipping Address</p>
              <div className="ckrow">
                <Field id="ck-fn" label="First Name" auto="given-name" inputRef={firstName} />
                <Field id="ck-ln" label="Last Name" auto="family-name" />
              </div>
              <Field id="ck-ad" label="Address" auto="address-line1" />
            </div>
          </section>
          <section className="cks off">
            <h1>Payment</h1>
          </section>
          <section className="cks off">
            <h1>Review &amp; Purchase</h1>
          </section>
        </div>
        <aside className="ckr" aria-label="Order summary">
          <div className="cksum" ref={summary}>
            <p className="ckst" tabIndex={-1} ref={summaryTitle}>
              Order summary
            </p>
            <div className="ckitems">
              {hydrated &&
                lines.map((l) => {
                  const p = catalog[l.s];
                  return (
                    <div key={lineKey(l)} className="ckit">
                      <div className="ckth">
                        {/* eslint-disable-next-line @next/next/no-img-element -- static export: no image optimizer */}
                        <img src={linePhoto(p, l.a)} alt="" />
                        <span aria-label={`Quantity ${l.q}`}>{l.q}</span>
                      </div>
                      <div className="ckd">
                        <p>{p.title}</p>
                        {Object.entries(l.a).map(([o, v]) => (
                          <p key={o} className="ckv">
                            {o}: {v}
                          </p>
                        ))}
                      </div>
                      <div className="ckp">
                        <span>{money(p.price * l.q)}</span>
                        <button
                          type="button"
                          aria-label={`Remove ${p.title}`}
                          onClick={() => {
                            useCart.getState().remove(l);
                            summaryTitle.current?.focus();
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
            <div className={discountOpen ? "ckdisc open" : "ckdisc"}>
              <button
                type="button"
                className="ckdb"
                onClick={() => {
                  flushSync(() => setDiscountOpen(true));
                  code.current?.focus();
                }}
              >
                <svg viewBox="0 0 11 11" width="11" height="11" aria-hidden="true">
                  <path d="M5.5 0v11M0 5.5h11" stroke="currentColor" fill="none" />
                </svg>
                <span>Discount or gift card</span>
              </button>
              <form
                className="ckdf"
                noValidate
                onSubmit={(e) => {
                  e.preventDefault();
                  setDiscountMsg(code.current?.value.trim() ? "This code is not valid." : "");
                }}
              >
                <label className="cklab" htmlFor="ck-code">
                  Gift or Discount Code
                </label>
                <div className="ckrd">
                  <div className="ckin">
                    <input ref={code} id="ck-code" placeholder="Gift or Discount Code" />
                  </div>
                  <button className="ckapply" type="submit">
                    Apply
                  </button>
                </div>
                <p className="ckdmsg" role="alert">
                  {discountMsg}
                </p>
              </form>
            </div>
            <div className="cksr">
              <p>Subtotal</p>
              <span className="cksub">{total}</span>
            </div>
            <div className="cksr">
              <p>Tax</p>
              <span>$0.00</span>
            </div>
            <div className="cksr cktr">
              <p>Total</p>
              <span className="cktot">{total}</span>
            </div>
            <div className="ckssl">
              <ShieldIcon />
              <span>Secure SSL Checkout</span>
            </div>
          </div>
        </aside>
      </main>
      <button type="button" className="ckfix" onClick={() => summary.current?.scrollIntoView({ behavior: "smooth" })}>
        <Stroke d="M5 8l6 6 6-6" />
        <span>Total</span>
        <b className="cktot">{total}</b>
      </button>
    </div>
  );
}

function Field({ id, label, auto, inputRef }: { id: string; label: string; auto: string; inputRef?: React.Ref<HTMLInputElement> }) {
  return (
    <div>
      <label className="cklab" htmlFor={id}>
        {label}
      </label>
      <div className="ckin">
        <input ref={inputRef} id={id} autoComplete={auto} />
      </div>
    </div>
  );
}
