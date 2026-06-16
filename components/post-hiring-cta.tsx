export default function PostHiringCta() {
  return (
    <aside className="my-8 p-6 rounded-lg bg-[#F3DFA2] border-l-4 border-[#083D77]">
      <p className="text-[#083D77] font-semibold text-lg mb-2">Open to new opportunities</p>
      <p className="text-[#083D77] mb-4">
        I&apos;m James — a software engineer based in the UK. If you liked this post and think I
        could be a good fit for your team, I&apos;d love to hear from you.
      </p>
      <a
        href="mailto:jamesthemonkeh@hotmail.com"
        className="inline-block bg-[#083D77] text-white font-semibold px-5 py-2 rounded hover:bg-[#083D77]/80 transition-colors"
        onClick={() => {
          if (typeof window !== 'undefined' && typeof (window as Window & { gtag?: Function }).gtag === 'function') {
            (window as Window & { gtag?: Function }).gtag('event', 'hiring_cta_click');
          }
        }}
      >
        Let&apos;s talk
      </a>
    </aside>
  );
}
