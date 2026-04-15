import cn from 'classnames';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  title: string;
  coverImage: {
    node: {
      sourceUrl: string;
      mediaDetails: {
        width: number;
        height: number;
      };
    };
  };
  slug?: string;
  sizes?: string;
}

export default function CoverImage({
  title,
  coverImage,
  slug,
  sizes = '(max-width: 768px) 100vw, 50vw',
}: Props) {
  const image = (
    <Image
      width={coverImage?.node.mediaDetails.width}
      height={coverImage?.node.mediaDetails.height}
      alt={`Cover Image for ${title}`}
      src={coverImage?.node.sourceUrl}
      className={cn('shadow-small', {
        'hover:shadow-medium transition-shadow duration-200': slug,
      })}
      sizes={sizes}
      priority={true}
    />
  );

  return (
    <div className="sm:mx-0">
      {slug ? (
        <Link href={`/posts/${slug}`} aria-label={title}>
          {image}
        </Link>
      ) : (
        image
      )}
    </div>
  );
}
