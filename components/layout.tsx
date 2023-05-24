import Footer from './footer';
import Meta from './meta';
import { ReactElement } from 'react';

type seoProps = {
  canonical: string;
  focuskw: string;
  metaDesc: string;
  metaKeywords: string;
  opengraphDescription: string;
  opengraphImage: {
    uri: string;
    altText: string;
    mediaItemUrl: string;
    mediaDetails: {
      width: string;
      height: string;
    };
  };
  opengraphTitle: string;
  opengraphUrl: string;
  opengraphSiteName: string;
  title: string;
};

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
