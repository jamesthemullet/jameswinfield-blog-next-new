export default function PostHiringCta() {
  return (
    <div className="max-w-2xl mx-auto mt-12 mb-4 pt-8 border-t border-accent-2">
      <p className="text-lg font-bold tracking-tighter mb-1">
        Open to new opportunities
      </p>
      <p className="text-lg mb-4">
        I&apos;m James — a software engineer based in the UK. If you think I
        could be a good fit for your team, I&apos;d love to hear from you.
      </p>
      <a
        href="mailto:hello@jameswinfield.co.uk"
        className="text-lg font-bold underline hover:text-my-blue transition-colors"
        onClick={() => {
          if (
            typeof window !== "undefined" &&
            typeof (window as Window & { gtag?: Function }).gtag === "function"
          ) {
            (window as Window & { gtag?: Function }).gtag(
              "event",
              "hiring_cta_click"
            );
          }
        }}
      >
        Let&apos;s talk &rarr;
      </a>
    </div>
  );
}
