import DOMPurify from 'isomorphic-dompurify';
import Container from './container';

type FooterProps = {
  socials: {
    content: string;
  };
};

export default function Footer({ socials }: FooterProps) {
  return (
    <footer className="border-t border-accent-2 bg-my-blue">
      <Container>
        <div
          className="flexbox-row text-white text-xl font-bold"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(socials?.content ?? '') }}
        />
      </Container>
    </footer>
  );
}
