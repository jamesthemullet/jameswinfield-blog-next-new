import Avatar from './avatar';
import Date from './date';
import CoverImage from './cover-image';
import PostTitle from './post-title';
import Categories from './categories';
import { PostHeaderProps } from '../lib/types';

export default function PostHeader({
  title,
  coverImage,
  date,
  author,
  categories,
}: PostHeaderProps) {
  return (
    <>
      <PostTitle>{title}</PostTitle>
      <div className="hidden md:block md:mb-12">
        <Avatar {...author} />
      </div>
      <div className="mb-8 md:mb-16 sm:mx-0">
        <CoverImage title={title} coverImage={coverImage} />
      </div>
      <div className="max-w-2xl mx-auto">
        <div className="block md:hidden mb-6">
          <Avatar {...author} />
        </div>
        <div className="mb-6 text-lg">
          Posted <Date dateString={date} />
          <Categories categories={categories} />
        </div>
      </div>
    </>
  );
}
