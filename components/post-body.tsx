import styles from './post-body.module.css';

type PostBodyProps = {
  content: string;
};

export default function PostBody({ content }: PostBodyProps) {
  const paragraphs = content.split(/<p>|<\/p>/g).filter((p) => p.length > 0);
  const newContent = paragraphs.map((p) => {
    if (p.includes('<figure')) {
      const src = p.match(/src="([^"]*)"/)[1];
      return `<a href="${src}" target="_blank">${p}</a>`;
    }
    return p;
  });

  const newContentString = newContent.join('');
  return (
    <div className="max-w-4xl mx-auto">
      <div className={styles.content} dangerouslySetInnerHTML={{ __html: newContentString }} />
    </div>
  );
}
