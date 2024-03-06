type PostBodyProps = {
  content: string;
};

export default function PostBody({ content }: PostBodyProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
