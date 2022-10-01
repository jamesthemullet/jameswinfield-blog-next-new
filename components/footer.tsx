import Container from "./container";

export default function Footer({ socials }) {
  return (
    <footer className="bg-accent-1 border-t border-accent-2">
      <Container>
        <div
          className="flexbox-row"
          dangerouslySetInnerHTML={{ __html: socials?.content }}
        />
      </Container>
    </footer>
  );
}
