import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

const NAV_LINKS = [
  { href: '/', label: 'Me' },
  { href: '/blog', label: 'Blog' },
  { href: '/projects', label: 'Projects' },
  { href: '/timeline', label: 'Timeline' },
];

const baseLinkClass = 'hover:underline p-2 pl-4 pr-4 text-2xl font-bold text-white';

function linkClass(pathname: string, href: string) {
  return `${baseLinkClass} ${pathname === href ? 'text-my-yellow' : ''}`;
}

export default function Nav() {
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const router = useRouter();

  return (
    <>
      <div className="md:hidden flex items-center p-2 right-1 justify-end bg-my-blue">
        <button
          onClick={() => setIsNavExpanded(!isNavExpanded)}
          onKeyDown={(e) => e.key === 'Escape' && setIsNavExpanded(false)}
          aria-label="Toggle navigation menu"
          aria-expanded={isNavExpanded}
          aria-controls="main-nav-menu"
          className="outline-none menu-button cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="white"
            aria-hidden="true"
            focusable="false">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
      <nav
        aria-label="Main navigation"
        className={`${
          isNavExpanded ? 'flex' : 'hidden lg:flex'
        } mt-[-1px] bg-my-blue sticky top-0 z-50 justify-center`}>
        <ul
          id="main-nav-menu"
          className={`${
            isNavExpanded ? 'flex' : 'hidden lg:flex'
          } flex-col md:flex-row p-4 flex-wrap justify-center bg-my-blue absolute w-full transition ease-in-out `}>
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className={linkClass(router.pathname, href)}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
