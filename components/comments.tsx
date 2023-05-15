import Date from './date';

type CommentsProps = {
  comments: {
    node: {
      author: {
        node: {
          name: string;
          avatar: {
            url: string;
          };
        };
      };
      id: number;
      content: string;
      date: string;
    };
  }[];
};

export default function Comments({ comments }: CommentsProps) {
  return (
    <section>
      <h2 className="mb-8 text-5xl md:text-5xl font-bold tracking-tighter leading-tight">
        Comments
      </h2>
      <div className="max-w-2xl mx-auto">
        {comments.map(({ node }) => (
          <div key={node.id} className="mb-4 max-w-2xl mx-auto">
            <div className="mb-4" dangerouslySetInnerHTML={{ __html: node.content }} />
            <p>{node.author.node.name}</p>
            <Date dateString={node.date} />
          </div>
        ))}
      </div>
    </section>
  );
}
