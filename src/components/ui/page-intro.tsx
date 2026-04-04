import type { LucideIcon } from "lucide-react";

type PageIntroProps = {
  eyebrow?: string;
  title: string;
  description: string;
  icon?: LucideIcon;
};

export function PageIntro({
  eyebrow,
  title,
  description,
  icon: Icon,
}: PageIntroProps) {
  return (
    <div className="space-y-3 appear-fade">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
          {eyebrow}
        </p>
      ) : null}
      <div className="flex items-start gap-4">
        {Icon ? (
          <div className="premium-pill flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-primary shadow-[0_14px_34px_rgba(0,194,184,0.12)]">
            <Icon className="h-5 w-5" />
          </div>
        ) : null}
        <div className="space-y-3">
          <h1 className="text-3xl font-black tracking-tight text-slate-950">
            {title}
          </h1>
          <p className="max-w-3xl text-base leading-7 text-slate-600">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
