// Template — rename `Component` to the real component name (e.g. `SignupForm`),
// including this filename, before use. Place inside the owning feature's
// src/features/<slug>/components/ folder, or src/shared/components/ if more
// than one feature needs it.

type ComponentProps = {
  children?: React.ReactNode;
};

export function Component({ children }: ComponentProps) {
  return <div>{children}</div>;
}
