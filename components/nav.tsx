import Link from "next/link";

export default function Nav() {
  return (
    <div className="flex flex-wrap justify-center items-center p-4 p-4 bg-accent-1">
      <Link href="/">
        <a className="hover:underline pr-2 pl-2">Me</a>
      </Link>
      <Link href="/blog">
        <a className="hover:underline pr-2 pl-2">Blog</a>
      </Link>
    </div>
  );
}
