import styles from './post-body.module.css';

type PostBodyProps = {
  content: string;
};

export default function PostBody({ content }: PostBodyProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className={styles.content} dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
