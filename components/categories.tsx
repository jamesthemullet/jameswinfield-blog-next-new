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
  return (
    <span className="ml-1">
      under
      {Array.isArray(categories.edges) ? (
        categories.edges.map((category, index) => (
          <span key={index} className="ml-1">
            {category.node.name}
          </span>
        ))
      ) : (
        <span className="ml-1">{categories.edges.node.name}</span>
      )}
    </span>
  );
}
