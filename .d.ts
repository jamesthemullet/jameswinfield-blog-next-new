declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

interface Window {
  gtag?: (...args: unknown[]) => void;
}
