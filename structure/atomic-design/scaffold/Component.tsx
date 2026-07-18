// Template — rename `Component` to the real component name (e.g. `Button`),
// including this filename, before use. Place inside src/components/<level>/
// where <level> is atoms, molecules, organisms, or templates, based on how
// many smaller components it's built from.

type ComponentProps = {
  children?: React.ReactNode;
};

export function Component({ children }: ComponentProps) {
  return <div>{children}</div>;
}
