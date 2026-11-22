import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

const variants = {
  primary: "bg-accent text-accent-foreground hover:bg-accent/90",
  secondary:
    "border border-border bg-surface text-foreground hover:bg-surface-muted",
} as const;

const sizes = {
  md: "h-10 px-4",
  icon: "size-10",
} as const;

type Variant = keyof typeof variants;
type Size = keyof typeof sizes;

function buttonClasses(variant: Variant, size: Size, className?: string) {
  return `inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${sizes[size]} ${variants[variant]} ${className ?? ""}`;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}: ComponentProps<"button"> & { variant?: Variant; size?: Size }) {
  return (
    <button
      type={type}
      className={buttonClasses(variant, size, className)}
      {...props}
    />
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={buttonClasses(variant, size, className)}>
      {children}
    </Link>
  );
}
