import type { ReactNode } from "react";

type LaudoStepCardProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function LaudoStepCard({
  title,
  description,
  children,
}: LaudoStepCardProps) {
  return (
    <section className="mx-auto w-full max-w-[640px]">
      <div className="mb-8">
        <h3 className="text-[15px] font-extrabold uppercase tracking-tight text-slate-900">
          {title}
        </h3>
        <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          {description}
        </p>
      </div>
      {children}
    </section>
  );
}
