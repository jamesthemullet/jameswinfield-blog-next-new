import Image from 'next/image';

export default function Intro() {
  return (
    <div>
      <section className="flex-col md:flex-row flex items-center md:justify-between mt-8 mb-8 md:mb-12">
        <h1 className="text-4xl md:text-7xl font-bold tracking-tighter leading-tight md:pr-8">
          James Winfield.
        </h1>
        <p
          className="text-center md:text-left text-lg mt-5 md:pl-8"
          aria-roledescription="subtitle">
          A senior front-end software engineer in London
        </p>
      </section>
      <Image
        width={1920}
        height={808}
        layout="responsive"
        src="/images/jameswinfieldcover.png"
        alt="Heading Image for James Winfield, showing AI generated software engineers in the style of Gustav Klimt"
      />
    </div>
  );
}
