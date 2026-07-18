// Template — rename `Component` to the real component name (e.g. `Button`),
// including this filename, before use.

type ComponentProps = {
  children?: React.ReactNode;
};

export function Component({ children }: ComponentProps) {
  return <div>{children}</div>;
}
