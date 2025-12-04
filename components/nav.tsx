import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Nav() {
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const router = useRouter();

  return (
    <>
      <div className="md:hidden flex items-center p-2 right-1 justify-end bg-my-blue">
        <button
          onClick={() => {
            setIsNavExpanded(!isNavExpanded);
          }}
          className="outline-none menu-button cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="white">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
      <div
        className={`${
          isNavExpanded ? 'flex' : 'hidden lg:flex'
        } mt-[-1px] bg-my-blue sticky top-0 z-50 justify-center`}>
        <ul
          className={`${
            isNavExpanded ? 'flex' : 'hidden lg:flex'
          } flex-col md:flex-row p-4 flex-wrap justify-center bg-my-blue absolute w-full transition ease-in-out `}>
          <Link
            href="/"
            className={`hover:underline p-2 pl-4 pr-4 text-2xl font-bold text-white ${
              router.pathname == '/' ? 'text-my-yellow' : ''
            }`}>
            Me
          </Link>
          <Link
            href="/blog"
            className={`hover:underline p-2 pl-4 pr-4 text-2xl font-bold text-white ${
              router.pathname == '/blog' ? 'text-my-yellow' : ''
            }`}>
            Blog
          </Link>
          <Link
            href="/learning"
            className={`hover:underline p-2 pl-4 pr-4 text-2xl font-bold text-white ${
              router.pathname == '/learning' ? 'text-my-yellow' : ''
            }`}>
            Learning
          </Link>
          <Link
            href="/projects"
            className={`hover:underline p-2 pl-4 pr-4 text-2xl font-bold text-white ${
              router.pathname == '/projects' ? 'text-my-yellow' : ''
            }`}>
            Projects
          </Link>
          <Link
            href="/timeline"
            className={`hover:underline p-2 pl-4 pr-4 text-2xl font-bold text-white ${
              router.pathname == '/timeline' ? 'text-my-yellow' : ''
            }`}>
            Timeline
          </Link>
        </ul>
      </div>
    </>
  );
}
