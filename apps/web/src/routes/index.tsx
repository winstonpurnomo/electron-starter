import { Button } from "@repo/ui/components/button";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="grid min-h-[calc(100vh-53px)] place-items-center px-6 py-12">
      <section className="w-full max-w-xl rounded-[28px] border border-border/70 bg-card/90 p-8 shadow-2xl shadow-primary/10 backdrop-blur">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
          Shared UI Package
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          TanStack Router + shadcn wiring
        </h1>
        <p className="mt-4 max-w-lg text-sm leading-7 text-muted-foreground">
          This route now pulls its base font, CSS variables, Tailwind setup, and
          button component from <code>@repo/ui</code> instead of local app
          styles.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button>Primary action</Button>
          <Button variant="outline">Outline action</Button>
        </div>
      </section>
    </main>
  );
}
