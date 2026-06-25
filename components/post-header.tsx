import type { PostHeaderProps } from '../lib/types';
import { readingTime } from '../lib/utils';
import Avatar from './avatar';
import Categories from './categories';
import CoverImage from './cover-image';
import Date from './date';
import PostTitle from './post-title';

export default function PostHeader({
  title,
  coverImage,
  date,
  author,
  categories,
  content,
}: PostHeaderProps) {
  return (
    <>
      <PostTitle>{title}</PostTitle>
      <div className="hidden md:block md:mb-12">
        <Avatar {...author} />
      </div>
      <div className="mb-8 md:mb-16 sm:mx-0">
        <CoverImage title={title} coverImage={coverImage} priority={true} sizes="100vw" />
      </div>
      <div className="max-w-2xl mx-auto">
        <div className="block md:hidden mb-6">
          <Avatar {...author} />
        </div>
        <div className="mb-6 text-lg">
          Posted <Date dateString={date} />
          <span className="ml-4 text-gray-500">{readingTime(content)} min read</span>
          <Categories categories={categories} />
        </div>
      </div>
    </>
  );
}
