import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-sm font-semibold text-accent">{brand.name}</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-sm leading-6 text-muted">
        That address is not part of the StayOps workspace.
      </p>
      <ButtonLink href="/dashboard" className="mt-8">
        Back to dashboard
      </ButtonLink>
    </div>
  );
}
