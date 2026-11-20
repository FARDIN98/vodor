import Link from "next/link";
import { SOCIAL, SocialIcon } from "./icons";

export default function Footer() {
  return (
    <footer className="ftr">
      <p className="pol">
        <Link href="/our-policy">OUR POLICY</Link>
      </p>
      <nav className="icons" aria-label="Social">
        {SOCIAL.map((s) => (
          <a key={s.name} href={s.href} target="_blank" rel="noopener" aria-label={s.name}>
            <SocialIcon name={s.name} size={14} />
          </a>
        ))}
      </nav>
    </footer>
  );
}
