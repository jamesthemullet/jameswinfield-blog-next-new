type PostTitle = {
  children: string;
};

export default function PostTitle({ children }: PostTitle) {
  return (
    <h1
      className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-tight md:leading-none mb-12 text-center md:text-left"
      dangerouslySetInnerHTML={{ __html: children }}
    />
  );
}
