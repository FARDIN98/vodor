import type { Metadata } from "next";
import { Dosis, Hanken_Grotesk, Italiana } from "next/font/google";
import Providers from "./providers";
import "./globals.css";

// Self-hosted at build time, so no request to Google and no render-blocking font CSS.
const dosis = Dosis({ subsets: ["latin"], variable: "--ff-dosis" });
const hanken = Hanken_Grotesk({ subsets: ["latin"], variable: "--ff-hanken" });
const italiana = Italiana({ weight: "400", subsets: ["latin"], variable: "--ff-italiana" });

export const metadata: Metadata = {
  title: "Vodor",
  icons: { icon: { url: "/favicon.svg", type: "image/svg+xml" } },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-US" className={`${dosis.variable} ${hanken.variable} ${italiana.variable}`} suppressHydrationWarning>
      <head>
        {/* Before first paint: lets the CSS hide photos until they load, only when JS will reveal them. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
