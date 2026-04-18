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
  title?: string;
};

export default function Layout({ children, socials, seo, title }: LayoutProps) {
  return (
    <>
      <Meta seo={seo} title={title} />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:bg-white focus:text-my-blue focus:font-bold focus:rounded focus:shadow-lg">
        Skip to main content
      </a>
      <div className="min-h-screen">
        <main id="main-content">{children}</main>
      </div>
      <Footer socials={socials} />
    </>
  );
}
