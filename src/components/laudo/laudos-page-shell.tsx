"use client";

import { ClipboardList, LoaderCircle, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { LaudosList } from "@/components/laudo/laudos-list";
import { PageIntro } from "@/components/ui/page-intro";
import { laudosService } from "@/services";

export function LaudosPageShell() {
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackTone, setFeedbackTone] = useState<"default" | "danger">(
    "default",
  );

  async function handleDeleteAll() {
    const shouldDelete = window.confirm(
      "Isso vai remover todos os seus laudos, itens e anexos vinculados. Deseja continuar?",
    );

    if (!shouldDelete) {
      return;
    }

    setIsDeletingAll(true);
    setFeedback(null);

    try {
      const removedCount = await laudosService.deleteAllByUser();

      setFeedbackTone("default");
      setFeedback(
        removedCount > 0
          ? `${removedCount} laudo(s) removido(s) com sucesso.`
          : "Nenhum laudo encontrado para remover.",
      );
      setRefreshKey((current) => current + 1);
    } catch (error) {
      setFeedbackTone("danger");
      setFeedback(
        error instanceof Error
          ? error.message
          : "Não foi possível remover os laudos.",
      );
    } finally {
      setIsDeletingAll(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <PageIntro
          eyebrow="Laudos"
          title="Gestão de laudos"
          description="Consulte, acompanhe e avance com mais controle sobre os laudos emitidos no sistema."
          icon={ClipboardList}
        />

        <div className="flex flex-col items-stretch gap-3 md:items-end">
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleDeleteAll}
              disabled={isDeletingAll}
              className="premium-button-secondary inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-700 transition hover:border-rose-300 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isDeletingAll ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Limpar laudos
            </button>

            <Link
              href="/laudos/novo"
              className="premium-button inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
            >
              <Plus className="h-4 w-4" />
              Novo laudo
            </Link>
          </div>

          {feedback ? (
            <p
              className={`text-sm ${
                feedbackTone === "danger" ? "text-rose-600" : "text-slate-500"
              }`}
            >
              {feedback}
            </p>
          ) : null}
        </div>
      </div>

      <LaudosList refreshKey={refreshKey} />
    </div>
  );
}
