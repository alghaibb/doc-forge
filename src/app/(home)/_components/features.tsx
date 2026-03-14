import { FileText, Zap, Shield, Layers, Sparkles } from "lucide-react";

const items = [
  {
    title: "Lorem ipsum",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    icon: FileText,
    span: "sm:col-span-2 sm:row-span-2",
    accent: "from-primary/10 to-primary/5",
    iconColor: "text-primary",
  },
  {
    title: "Dolor sit amet",
    description:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    icon: Zap,
    span: "",
    accent: "from-chart-1/10 to-chart-1/5",
    iconColor: "text-chart-1",
  },
  {
    title: "Consectetur",
    description:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.",
    icon: Shield,
    span: "",
    accent: "from-chart-2/10 to-chart-2/5",
    iconColor: "text-chart-2",
  },
  {
    title: "Adipiscing elit",
    description:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui.",
    icon: Layers,
    span: "sm:col-span-2",
    accent: "from-chart-3/10 to-chart-3/5",
    iconColor: "text-chart-3",
  },
  {
    title: "Tempor incididunt",
    description:
      "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit.",
    icon: Sparkles,
    span: "",
    accent: "from-chart-4/10 to-chart-4/5",
    iconColor: "text-chart-4",
  },
];

export function Features() {
  return (
    <section className="border-b border-border/40 px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <p className="text-primary mb-2 text-sm font-medium uppercase tracking-widest">
          Features
        </p>
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Lorem ipsum dolor sit amet
        </h2>
        <p className="text-muted-foreground mt-3 max-w-2xl text-lg">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className={`group relative overflow-hidden rounded-2xl border border-border/60 bg-linear-to-br ${item.accent} p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 ${item.span}`}
              >
                <div
                  className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-linear-to-br from-primary/10 to-transparent opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                />
                <div
                  className={`flex size-10 items-center justify-center rounded-xl bg-background/80 shadow-sm ${item.iconColor}`}
                >
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="text-muted-foreground mt-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
