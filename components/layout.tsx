import Footer from './footer';
import Meta from './meta';

type LayoutProps = {
  preview?: string;
  children: string;
  socials: {
    content: string;
  };
};

export default function Layout({ preview, children, socials }: LayoutProps) {
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
