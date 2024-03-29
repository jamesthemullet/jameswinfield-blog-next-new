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
}

export default function CoverImage({ title, coverImage, slug }: Props) {
  const image = (
    <Image
      width={coverImage?.node.mediaDetails.width}
      height={coverImage?.node.mediaDetails.height}
      alt={`Cover Image for ${title}`}
      src={coverImage?.node.sourceUrl}
      className={cn('shadow-small', {
        'hover:shadow-medium transition-shadow duration-200': slug,
      })}
      priority={true}
    />
  );

  return (
    <div className="sm:mx-0">
      {slug ? (
        <Link href={`/posts/${slug}`}>
          <a aria-label={title}>{image}</a>
        </Link>
      ) : (
        image
      )}
    </div>
  );
}
