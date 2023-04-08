import CommentForm from './commentForm';
import Date from './date';

type CommentsProps = {
  comments: {
    edges: {
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
  id: number;
};

export default function Comments({ comments, id }: CommentsProps) {
  const commentsToDisplay = comments?.edges;
  return (
    <section>
      <h2 className="mb-8 text-5xl md:text-5xl font-bold tracking-tighter leading-tight">
        Comments
      </h2>
      <div className="max-w-2xl mx-auto">
        {commentsToDisplay.map(({ node }) => (
          <div key={node.id} className="mb-4 max-w-2xl mx-auto">
            <div className="mb-4" dangerouslySetInnerHTML={{ __html: node.content }} />
            <p>{node.author.node.name}</p>
            <Date dateString={node.date} />
          </div>
        ))}
      </div>
      <CommentForm postId={id} />
    </section>
  );
}
