import Image from 'next/image';
import type { AuthorProps } from '../lib/types';

export default function Avatar({ node }: AuthorProps) {
  const isAuthorHaveFullName = node?.firstName && node?.lastName;
  const name = isAuthorHaveFullName ? `${node?.firstName} ${node?.lastName}` : node?.name || null;

  return (
    <div className="flex items-center">
      <div className="w-12 h-12 relative mr-4">
        {node?.avatar.url && (
          <Image src={node?.avatar.url} layout="fill" className="rounded-full" alt={name} />
        )}
      </div>
      <div className="text-xl font-bold">{name}</div>
    </div>
  );
}
