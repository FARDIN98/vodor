import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="skip" href="#page">
        Skip to Content
      </a>
      <Header />
      <main id="page">{children}</main>
      <Footer />
    </>
  );
}
