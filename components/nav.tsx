import Link from "next/link";

export default function Nav() {
  return (
    <div>
      <Link href="/">
        <a className="hover:underline">Me</a>
      </Link>
      <Link href="/blog">
        <a className="hover:underline">Blog</a>
      </Link>
    </div>
  );
}
