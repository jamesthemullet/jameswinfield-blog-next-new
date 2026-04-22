import styles from './post-body.module.css';

type PostBodyProps = {
  content: string;
};

function sanitize(html: string): string {
  if (typeof window === 'undefined') return html;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const DOMPurify = require('dompurify');
  return DOMPurify.sanitize(html);
}

export default function PostBody({ content }: PostBodyProps) {
  if (!content) return null;
  const paragraphs = content.split(/<p>|<\/p>/g).filter((p) => p.length > 0);
  const newContent = paragraphs.map((p) => {
    if (p.includes('<figure')) {
      const match = p.match(/src="([^"]*)"/);
      if (match) {
        return `<a href="${match[1]}" target="_blank" rel="noopener noreferrer" aria-label="View image in new tab">${p}</a>`;
      }
    }
    return p;
  });

  const newContentString = newContent.join('<br />');
  return (
    <div className="max-w-4xl mx-auto">
      <div className={styles.content} dangerouslySetInnerHTML={{ __html: sanitize(newContentString) }} />
    </div>
  );
}
