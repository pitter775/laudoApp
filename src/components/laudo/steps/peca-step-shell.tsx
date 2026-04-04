import { ArrowLeft, ArrowRight, Boxes, PackageSearch } from "lucide-react";
import { LaudoStepCard } from "@/components/laudo/laudo-step-card";
import { PremiumSelect } from "@/components/ui/premium-select";
import { cn } from "@/lib/utils";
import type { DadosPeca, Peca } from "@/types/laudo";

type PecaStepShellProps = {
  value: DadosPeca;
  pecas: Peca[];
  isLoading: boolean;
  invalidFields?: Partial<Record<keyof DadosPeca, boolean>>;
  onChange: (field: keyof DadosPeca, value: string) => void;
  onBack: () => void;
  onNext: () => void;
};

export function PecaStepShell({
  value,
  pecas,
  isLoading,
  invalidFields,
  onChange,
  onBack,
  onNext,
}: PecaStepShellProps) {
  const pecaOptions = [
    {
      label: isLoading ? "Carregando pecas..." : "Selecione",
      value: "",
      icon: PackageSearch,
    },
    ...pecas.map((peca) => ({
      label: peca.nome,
      value: peca.id,
      icon: Boxes,
    })),
  ];

  return (
    <LaudoStepCard
      title="Peca ou conjunto"
      description="Selecione a peca cadastrada no banco e informe os dados complementares."
    >
      <div className="grid gap-4 md:grid-cols-2 appear-fade">
        <PremiumSelect
          label="Tipo da peca"
          value={value.pecaId}
          options={pecaOptions}
          onChange={(selectedValue) => onChange("pecaId", selectedValue)}
          disabled={isLoading}
          invalid={Boolean(invalidFields?.pecaId)}
          placeholderIcon={PackageSearch}
          className="md:col-span-2"
        />

        <label className="grid gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
            Modelo da peca
          </span>
          <input
            value={value.modelo}
            onChange={(event) => onChange("modelo", event.target.value)}
            className={cn(
              "premium-field h-12 rounded-2xl border border-slate-200 px-4 text-sm text-slate-900 outline-none focus:border-primary",
              invalidFields?.modelo
                ? "!border-rose-400 bg-rose-50/40 !text-slate-900 focus:!border-rose-500"
                : "",
            )}
          />
        </label>

        <label className="grid gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
            Identificacao
          </span>
          <input
            value={value.identificacao}
            onChange={(event) => onChange("identificacao", event.target.value)}
            className={cn(
              "premium-field h-12 rounded-2xl border border-slate-200 px-4 text-sm text-slate-900 outline-none focus:border-primary",
              invalidFields?.identificacao
                ? "!border-rose-400 bg-rose-50/40 !text-slate-900 focus:!border-rose-500"
                : "",
            )}
          />
        </label>

        <label className="grid gap-2 md:col-span-2">
          <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
            Observacao
          </span>
          <textarea
            value={value.observacao}
            onChange={(event) => onChange("observacao", event.target.value)}
            className="premium-field min-h-28 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-primary"
          />
        </label>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="premium-button-secondary inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>
        <button
          type="button"
          onClick={onNext}
          className="premium-button inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
        >
          <ArrowRight className="h-4 w-4" />
          Avancar
        </button>
      </div>
    </LaudoStepCard>
  );
}
