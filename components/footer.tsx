import Container from './container';

type FooterProps = {
  socials: {
    content: string;
  };
};

function sanitize(html: string): string {
  if (typeof window === 'undefined') return html;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const DOMPurify = require('dompurify');
  return DOMPurify.sanitize(html);
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
