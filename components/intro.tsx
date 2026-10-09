import Image from 'next/image';

type IntroProps = {
  heading?: string;
};

export default function Intro({ heading = 'James Winfield.' }: IntroProps) {
  return (
    <div>
      <section className="flex-col md:flex-row flex items-center md:justify-between md:mt-[100px] mt-4 mb-8 md:mb-12">
        <h1 className="text-4xl md:text-7xl font-bold tracking-tighter leading-tight md:pr-8">
          {heading}
        </h1>
        <p className="text-center md:text-left text-lg mt-5 md:pl-8">
          A senior front-end software engineer in London
        </p>
      </section>
      <Image
        width={1920}
        height={808}
        style={{ width: '100%', height: 'auto' }}
        src="/images/jameswinfieldcover.webp"
        alt="Heading Image for James Winfield, showing AI generated software engineers in the style of Gustav Klimt"
        sizes="100vw"
      />
    </div>
  );
}
