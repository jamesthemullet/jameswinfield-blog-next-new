import Footer from './footer';
import Meta from './meta';
import { ReactElement } from 'react';
import type { seoProps } from '../lib/types';
import { title } from 'process';

type LayoutProps = {
  preview?: string;
  children?: ReactElement[];
  socials: {
    content: string;
  };
  seo: seoProps;
  title?: string;
};

export default function Layout({ preview, children, socials, seo, title }: LayoutProps) {
  return (
    <>
      <Meta seo={seo} title={title} />
      <div className="min-h-screen">
        <main>{children}</main>
      </div>
      <Footer socials={socials} />
    </>
  );
}
