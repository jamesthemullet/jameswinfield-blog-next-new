import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="alternate" type="application/rss+xml" title="James Winfield" href="/api/rss" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
