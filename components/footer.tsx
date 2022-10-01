import Container from "./container";
import Alert from "./alert";

export default function Footer({ socials }) {
  return (
    <footer className="bg-accent-1 border-t border-accent-2 bg-my-green">
      <Container>
        <div
          className="flexbox-row text-white text-xl font-bold"
          dangerouslySetInnerHTML={{ __html: socials?.content }}
        />
      </Container>

      <Alert preview={null} />
    </footer>
  );
}
