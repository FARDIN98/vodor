// The site's SVG icons. All are decorative (aria-hidden); the link or button around them carries the label.

/** A stroked line icon, 1.5px, in the current text colour. */
export const Stroke = ({ d, w = 22, h = 22 }: { d: string; w?: number; h?: number }) => (
  <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} aria-hidden="true">
    <path d={d} stroke="currentColor" strokeWidth="1.5" fill="none" />
  </svg>
);
export const Minus = () => <Stroke d="M3 11h16" />;
export const Add = () => <Stroke d="M3 11h16M11 3v16" />;
export const Cross = () => <Stroke d="M5 5l12 12M17 5 5 17" />;
export const Down = () => <Stroke d="M1 1.5l8 8 8-8" w={18} h={12} />;

export const CartIcon = () => (
  <svg viewBox="0 0 25 25" width="25" height="25" aria-hidden="true">
    <path fill="currentColor" d="M1 3.5h3.3l3.4 12.6h12.2l3-9H7.2" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <circle cx="9.3" cy="20.5" r="1.8" fill="currentColor" />
    <circle cx="18.5" cy="20.5" r="1.8" fill="currentColor" />
  </svg>
);

/** Accordion plus that turns into a minus (the CSS rotates the `.v` stroke). */
export const Plus = () => (
  <svg viewBox="0 0 14 14" width="14" height="14" aria-hidden="true">
    <path d="M0 7h14" stroke="currentColor" strokeWidth="1" fill="none" />
    <path className="v" d="M0 7h14" stroke="currentColor" strokeWidth="1" fill="none" />
  </svg>
);

export const Chevron = () => (
  <svg viewBox="0 0 16 9" width="16" height="9" aria-hidden="true">
    <path d="M.5.5 8 8 15.5.5" stroke="currentColor" strokeWidth="1" fill="none" />
  </svg>
);

export const ErrorIcon = () => (
  <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
    <circle cx="10" cy="10" r="8.5" fill="none" stroke="#c32d38" strokeWidth="1.5" />
    <path d="M10 5.5v6" stroke="#c32d38" strokeWidth="1.5" />
    <circle cx="10" cy="14.2" r="1" fill="#c32d38" />
  </svg>
);

export const NoShipIcon = () => (
  <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
    <circle cx="10" cy="10" r="8" fill="none" stroke="#aaa" strokeWidth="1.5" />
    <path d="M4.5 15.5l11-11" stroke="#aaa" strokeWidth="1.5" />
  </svg>
);

export const ShieldIcon = () => (
  <svg viewBox="0 0 22 26" width="22" height="26" aria-hidden="true">
    <path d="M11 1.5 2 4.5v8c0 5.5 4 9.6 9 12 5-2.4 9-6.5 9-12v-8z" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M6.5 13l3.2 3.2 6-6.4" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const SocialGlyph = ({ name }: { name: string }) => {
  switch (name) {
    case "Instagram":
      return (
        <>
          <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="17.3" cy="6.7" r="1.3" fill="currentColor" />
        </>
      );
    case "Facebook":
      return <path fill="currentColor" d="M13.5 22v-8.4h2.8l.5-3.3h-3.3V8.2c0-1 .3-1.6 1.7-1.6h1.7V3.7c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.4v3.3h2.8V22z" />;
    case "Pinterest":
      return (
        <path
          fill="currentColor"
          d="M12 2a10 10 0 0 0-3.6 19.3c-.1-.8-.2-2 0-2.9l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.5 1.8-2.5.9 0 1.3.6 1.3 1.4 0 .9-.5 2.1-.8 3.3-.2 1 .5 1.8 1.5 1.8 1.8 0 3.1-1.9 3.1-4.6 0-2.4-1.7-4.1-4.2-4.1-2.9 0-4.5 2.1-4.5 4.4 0 .9.3 1.8.8 2.3.1.1.1.2.1.3l-.3 1.2c0 .2-.2.3-.4.2-1.3-.6-2.1-2.5-2.1-4 0-3.3 2.4-6.3 6.9-6.3 3.6 0 6.4 2.6 6.4 6 0 3.6-2.3 6.5-5.4 6.5-1.1 0-2.1-.6-2.4-1.2l-.7 2.5c-.2.9-.9 2.1-1.3 2.8A10 10 0 1 0 12 2z"
        />
      );
    default:
      return <path fill="currentColor" d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3z" />;
  }
};

export const SOCIAL = [
  { name: "Instagram", href: "https://www.instagram.com/maisonvarro/" },
  { name: "Facebook", href: "https://www.facebook.com/maisonvarro" },
  { name: "Pinterest", href: "https://www.pinterest.com/maisonvarro/" },
  { name: "YouTube", href: "https://www.youtube.com/@MaisonVarro" },
];

export const SocialIcon = ({ name, size = 24 }: { name: string; size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
    <SocialGlyph name={name} />
  </svg>
);
