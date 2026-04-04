import { ArrowRight } from "lucide-react";
import { LaudoStepCard } from "@/components/laudo/laudo-step-card";
import { cn } from "@/lib/utils";
import type { DadosCliente } from "@/types/laudo";

type ClienteStepShellProps = {
  value: DadosCliente;
  invalidFields?: Partial<Record<keyof DadosCliente, boolean>>;
  onChange: (field: keyof DadosCliente, value: string) => void;
  onNext: () => void;
};

const fields: Array<{ key: keyof DadosCliente; label: string; type?: string }> = [
  { key: "razaoSocial", label: "Razao social" },
  { key: "cnpj", label: "CNPJ" },
  { key: "email", label: "Email", type: "email" },
  { key: "telefone", label: "Telefone" },
];

function formatCnpj(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 14);

  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 10) {
    return digits
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  return digits
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

export function ClienteStepShell({
  value,
  invalidFields,
  onChange,
  onNext,
}: ClienteStepShellProps) {
  function handleFieldChange(field: keyof DadosCliente, fieldValue: string) {
    if (field === "cnpj") {
      onChange(field, formatCnpj(fieldValue));
      return;
    }

    if (field === "telefone") {
      onChange(field, formatPhone(fieldValue));
      return;
    }

    onChange(field, fieldValue);
  }

  return (
    <LaudoStepCard
      title="Dados do cliente"
      description="Preencha os dados que serao gravados em dados_cliente no laudo."
    >
      <div className="grid gap-4 md:grid-cols-2 appear-fade">
        {fields.map((field) => (
          <label key={field.key} className="grid gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
              {field.label}
            </span>
            <input
              type={field.type ?? "text"}
              value={value[field.key]}
              onChange={(event) =>
                handleFieldChange(field.key, event.target.value)
              }
              inputMode={
                field.key === "cnpj" || field.key === "telefone"
                  ? "numeric"
                  : undefined
              }
              maxLength={
                field.key === "cnpj"
                  ? 18
                  : field.key === "telefone"
                    ? 15
                    : undefined
              }
              className={cn(
                "premium-field h-12 rounded-2xl border border-slate-200 px-4 text-sm text-slate-900 outline-none focus:border-primary",
                invalidFields?.[field.key]
                  ? "!border-rose-400 bg-rose-50/40 !text-slate-900 focus:!border-rose-500"
                  : "",
              )}
            />
          </label>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
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
