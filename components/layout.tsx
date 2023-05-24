import Footer from './footer';
import Meta from './meta';
import { ReactElement } from 'react';
import type { seoProps } from '../lib/types';

type LayoutProps = {
  preview?: string;
  children?: ReactElement[];
  socials: {
    content: string;
  };
  seo: seoProps;
};

export default function Layout({ preview, children, socials, seo }: LayoutProps) {
  return (
    <>
      <Meta seo={seo} />
      <div className="min-h-screen">
        <main>{children}</main>
      </div>
      <Footer socials={socials} />
    </>
  );
}
