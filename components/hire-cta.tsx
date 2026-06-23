type Props = {
  available?: boolean;
};

export default function HireCta({ available = true }: Props) {
  if (!available) return null;

  return (
    <div className="my-8 p-6 border border-accent-2 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <p className="text-lg font-bold tracking-tighter">
        Open to senior front-end engineering roles &middot; React, TypeScript, Next.js
      </p>
      <a
        href="mailto:jamesthemonkeh@hotmail.com"
        className="inline-block bg-my-blue text-white font-bold text-sm px-5 py-3 rounded hover:opacity-90 transition-opacity whitespace-nowrap"
        onClick={() => {
          if (typeof window !== 'undefined' && typeof (window as Window & { gtag?: Function }).gtag === 'function') {
            (window as Window & { gtag?: Function }).gtag('event', 'hire_cta_click');
          }
        }}
      >
        Get in touch
      </a>
    </div>
  );
}
