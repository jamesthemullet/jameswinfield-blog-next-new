import Footer from "./footer";
import Meta from "./meta";

export default function Layout({ preview, children, socials }) {
  return (
    <>
      <Meta />
      <div className="min-h-screen">
        <main>{children}</main>
      </div>
      <Footer socials={socials} />
    </>
  );
}
