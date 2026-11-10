type Edge = {
  length: number;
  node: {
    name: string;
  };
};

type CategoriesProps = {
  categories: {
    edges: Edge | Edge[];
  };
};

export default function Categories({ categories }: CategoriesProps) {
  if (!categories?.edges) return null;
  return (
    <span className="ml-1">
      under
      {Array.isArray(categories.edges) ? (
        categories.edges.map((category) => (
          <span key={category.node.name} className="ml-1">
            {category.node.name}
          </span>
        ))
      ) : (
        <span className="ml-1">{categories.edges.node.name}</span>
      )}
    </span>
  );
}
