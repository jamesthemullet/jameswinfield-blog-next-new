import styles from './post-body.module.css';

type PostBodyProps = {
  content: string;
};

export default function PostBody({ content }: PostBodyProps) {
  const paragraphs = content.split(/<p>|<\/p>/g).filter((p) => p.length > 0);
  const newContent = paragraphs.map((p) => {
    if (p.includes('<figure')) {
      const match = p.match(/src="([^"]*)"/);
      if (match) {
        return `<a href="${match[1]}" target="_blank">${p}</a>`;
      }
    }
    return p;
  });

  const newContentString = newContent.join('<br />');
  return (
    <div className="max-w-4xl mx-auto">
      <div className={styles.content} dangerouslySetInnerHTML={{ __html: newContentString }} />
    </div>
  );
}
