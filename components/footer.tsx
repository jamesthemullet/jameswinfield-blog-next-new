import { sanitize } from '../lib/sanitize';
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
        <div className="flexbox-row text-white text-xl font-bold">
          <div dangerouslySetInnerHTML={{ __html: sanitize(socials?.content ?? '') }} />
          <a
            href="/api/rss"
            aria-label="RSS feed"
            className="inline-flex items-center ml-4"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              width="20"
              height="20"
              aria-hidden="true"
            >
              <circle cx="6.18" cy="17.82" r="2.18" />
              <path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z" />
            </svg>
          </a>
        </div>
      </Container>
    </footer>
  );
}
