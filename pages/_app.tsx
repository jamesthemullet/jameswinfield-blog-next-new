import { AppProps } from 'next/app';
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
        src={`https://www.googletagmanager.com/gtag/js?id=G-THF64Z6X3S`}
      />

      <Script strategy="lazyOnload"></Script>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
