import PostBody from "./post-body";

export default function HomePageSection({ title, content }) {
  return (
    <section>
      <div className="md:block md:mt-8">
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-tight md:leading-none mb-2 mt-2 md:mb-4 md:mt-4 text-center md:text-left">
          {title}
        </h2>
      </div>
      <PostBody content={content} />
    </section>
  );
}
