type ContainerProps = {
  children: string;
};

export default function Container({ children }: ContainerProps) {
  return <div className="container mx-auto px-5">{children}</div>;
}
