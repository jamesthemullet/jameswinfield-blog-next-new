import type { AppProps } from 'next/app';
import '../styles/index.css';
import Script from 'next/script';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      import('accented').then(({ accented }) => accented());
    }
  }, []);

  return (
    <>
      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        onLoad={() => {
          // biome-ignore lint/suspicious/noExplicitAny: gtag global requires loose typing
          const w = window as any;
          w.dataLayer = w.dataLayer || [];
          w.gtag = (...args: unknown[]) => w.dataLayer.push(args);
          w.gtag('js', new Date());
          w.gtag('config', process.env.NEXT_PUBLIC_GA_ID);
        }}
      />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
