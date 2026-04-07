import type { ChangeEvent } from "react";
import { ArrowLeft, ArrowRight, ImagePlus, Trash2 } from "lucide-react";
import Image from "next/image";

import { LaudoStepCard } from "@/components/laudo/laudo-step-card";
import type { FotoUpload } from "@/types/laudo";

type FotosStepShellProps = {
  fotos: FotoUpload[];
  onFilesSelected: (files: File[]) => void;
  onRemove: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
};

export function FotosStepShell({
  fotos,
  onFilesSelected,
  onRemove,
  onBack,
  onNext,
}: FotosStepShellProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    onFilesSelected(files);
    event.target.value = "";
  }

  return (
    <LaudoStepCard
      title="Fotos"
      description="As imagens ficam em memoria e serao salvas em laudo_anexos como base64."
    >
      <label className="premium-pill appear-fade flex cursor-pointer flex-col items-center justify-center rounded-[24px] border border-dashed border-primary/30 bg-primary/5 px-6 py-10 text-center text-sm text-slate-500 transition hover:border-primary hover:bg-primary/10">
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleChange}
        />
        <ImagePlus className="h-6 w-6 text-primary" />
        <span className="mt-3 text-base font-semibold text-slate-800">
          Clique para anexar as fotos
        </span>
        <span className="mt-2">Envie ate 10 imagens.</span>
      </label>

      {fotos.length > 0 ? (
        <div className="mt-5 grid gap-3 overflow-x-hidden md:grid-cols-2">
          {fotos.map((foto) => (
            <div
              key={foto.id}
              className="premium-pill rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="relative h-40 w-full overflow-hidden rounded-2xl">
                <Image
                  src={foto.imagemBase64}
                  alt={foto.nome}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="truncate text-sm font-medium text-slate-800">
                  {foto.nome}
                </p>
                <button
                  type="button"
                  onClick={() => onRemove(foto.id)}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-rose-600 transition hover:text-rose-700"
                >
                  <Trash2 className="h-4 w-4" />
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}

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
