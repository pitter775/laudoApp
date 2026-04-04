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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");

  const deleteConfirmationPhrase = "deletar todos os laudos";
  const canConfirmDelete =
    deleteConfirmationText.trim().toLowerCase() === deleteConfirmationPhrase;

  function openDeleteModal() {
    setDeleteConfirmationText("");
    setIsDeleteModalOpen(true);
  }

  function closeDeleteModal() {
    if (isDeletingAll) {
      return;
    }

    setDeleteConfirmationText("");
    setIsDeleteModalOpen(false);
  }

  async function handleDeleteAll() {
    if (!canConfirmDelete) {
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
      closeDeleteModal();
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
              onClick={openDeleteModal}
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

      {isDeleteModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-6 backdrop-blur-[2px]">
          <div className="w-full max-w-lg rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.22)]">
            <div className="flex items-start gap-4">
              <div className="premium-pill flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-700">
                <Trash2 className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-600">
                  Ação irreversível
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                  Confirmar exclusão total
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Isso vai remover todos os laudos, itens e anexos vinculados ao
                  seu usuário.
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Para continuar, digite{" "}
                  <span className="rounded-md bg-slate-100 px-2 py-1 font-semibold text-slate-900">
                    {deleteConfirmationPhrase}
                  </span>
                  .
                </p>
              </div>
            </div>

            <div className="mt-6">
              <label className="grid gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  Frase de confirmação
                </span>
                <input
                  value={deleteConfirmationText}
                  onChange={(event) =>
                    setDeleteConfirmationText(event.target.value)
                  }
                  placeholder={deleteConfirmationPhrase}
                  className="premium-field h-12 rounded-2xl border border-slate-200 px-4 text-sm text-slate-900 outline-none focus:border-rose-400"
                />
              </label>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={isDeletingAll}
                className="premium-button-secondary inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleDeleteAll}
                disabled={!canConfirmDelete || isDeletingAll}
                className="premium-button inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-rose-300"
              >
                {isDeletingAll ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Deletar todos os laudos
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
