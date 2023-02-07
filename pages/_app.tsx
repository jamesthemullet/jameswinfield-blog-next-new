import { AppProps } from 'next/app';
import '../styles/index.css';
import Script from 'next/script';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=G-THF64Z6X3S`}
      />

      <Script strategy="lazyOnload">
        {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
      
        gtag('config', 'G-THF64Z6X3S');
    `}
      </Script>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
