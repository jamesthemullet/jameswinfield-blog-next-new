import Container from './container';

type FooterProps = {
  socials: {
    content: string;
  };
};

function removeTwitterLinks(html: string): string {
  return html.replace(/<a[^>]*href=["'][^"']*(?:twitter\.com|x\.com)[^"']*["'][^>]*>[\s\S]*?<\/a>/gi, '');
}

function sanitize(html: string): string {
  const filtered = removeTwitterLinks(html);
  if (typeof window === 'undefined') return filtered;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const DOMPurify = require('dompurify');
  return DOMPurify.sanitize(filtered);
}

export default function Footer({ socials }: FooterProps) {
  return (
    <footer className="border-t border-accent-2 bg-my-blue">
      <Container>
        <div
          className="flexbox-row text-white text-xl font-bold"
          dangerouslySetInnerHTML={{ __html: sanitize(socials?.content ?? '') }}
        />
      </Container>
    </footer>
  );
}
