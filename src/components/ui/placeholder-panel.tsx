import type { LucideIcon } from "lucide-react";

type PlaceholderPanelProps = {
  title: string;
  description: string;
  items: string[];
  icon?: LucideIcon;
};

export function PlaceholderPanel({
  title,
  description,
  items,
  icon: Icon,
}: PlaceholderPanelProps) {
  return (
    <section className="premium-panel appear-fade rounded-[28px] border border-slate-200 bg-white p-6">
      <div className="flex items-start gap-4">
        {Icon ? (
          <div className="premium-pill flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/5 text-primary">
            <Icon className="h-5 w-5" />
          </div>
        ) : null}
        <div>
          <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        </div>
      </div>

      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li
            key={item}
            className="premium-pill rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
