import type { TagsProps } from '../lib/types';

export default function Tags({ tags }: TagsProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <p className="mt-8 text-lg font-bold">
        Tagged
        {Array.isArray(tags.edges) &&
          tags.edges.map((tag, index) => (
            <span key={index} className="ml-4 font-normal">
              {tag.node.name}
            </span>
          ))}
      </p>
    </div>
  );
}
