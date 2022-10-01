import PostBody from "./post-body";

export default function HomePageSection({ title, content }) {
  return (
    <section>
      <div className="md:block md:mb-12">
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-tight md:leading-none mb-4 mt-4 md:mb-12 md:mt-12 text-center md:text-left">
          {title}
        </h2>
      </div>
      <PostBody content={content} />
    </section>
  );
}
