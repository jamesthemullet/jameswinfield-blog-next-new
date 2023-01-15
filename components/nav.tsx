import Link from 'next/link';

export default function Nav() {
  return (
    <div className="flex flex-wrap justify-center items-center p-4 p-4 bg-my-blue text-white sticky top-0 z-50">
      <Link href="/">
        <a className="hover:underline p-2 pl-4 pr-4 text-2xl font-bold">Me</a>
      </Link>
      <Link href="/blog">
        <a className="hover:underline p-2 pl-4 pr-4 text-2xl font-bold">Blog</a>
      </Link>
      <Link href="/learning">
        <a className="hover:underline p-2 pl-4 pr-4 text-2xl font-bold">Learning</a>
      </Link>
      <Link href="/projects">
        <a className="hover:underline p-2 pl-4 pr-4 text-2xl font-bold">Projects</a>
      </Link>
      <Link href="/timeline">
        <a className="hover:underline p-2 pl-4 pr-4 text-2xl font-bold">Timeline</a>
      </Link>
    </div>
  );
}
