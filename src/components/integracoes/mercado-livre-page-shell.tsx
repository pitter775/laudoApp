"use client";

import {
  CheckCircle2,
  LoaderCircle,
  PlugZap,
  ShieldCheck,
  Store,
  Trash2,
  X,
} from "lucide-react";
import { type FormEvent, useEffect, useMemo, useState } from "react";

import { PageIntro } from "@/components/ui/page-intro";
import { authService, mercadoLivreService } from "@/services";
import type { MercadoLivreContract } from "@/types/mercado-livre";
import type { UsuarioSessao } from "@/types/laudo";

type ConnectionForm = {
  storeName: string;
  sellerId: string;
  appId: string;
};

const initialForm: ConnectionForm = {
  storeName: "",
  sellerId: "",
  appId: "",
};

function formatConnectionDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export function MercadoLivrePageShell() {
  const [user, setUser] = useState<UsuarioSessao | null>(null);
  const [contract, setContract] = useState<MercadoLivreContract | null>(null);
  const [form, setForm] = useState(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [removeConfirmationText, setRemoveConfirmationText] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackTone, setFeedbackTone] = useState<"default" | "danger">(
    "default",
  );

  const normalizedStoreName = contract?.storeName.trim().toLowerCase() ?? "";
  const canRemoveContract =
    removeConfirmationText.trim().toLowerCase() === normalizedStoreName;
  const canConnect = useMemo(
    () =>
      form.storeName.trim().length > 1 &&
      form.sellerId.trim().length > 1 &&
      form.appId.trim().length > 1,
    [form.appId, form.sellerId, form.storeName],
  );

  useEffect(() => {
    let isMounted = true;

    async function loadContract() {
      try {
        const currentUser = await authService.getCurrentUser();

        if (!isMounted) {
          return;
        }

        setUser(currentUser);

        if (currentUser) {
          const currentContract = await mercadoLivreService.getByUser(
            currentUser.id,
          );
          setContract(currentContract);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadContract();

    return () => {
      isMounted = false;
    };
  }, []);

  function updateForm(field: keyof ConnectionForm, value: string) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  async function handleConnect(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user || !canConnect) {
      return;
    }

    setIsSaving(true);
    setFeedback(null);

    try {
      const createdContract = await mercadoLivreService.connect({
        userId: user.id,
        storeName: form.storeName,
        sellerId: form.sellerId,
        appId: form.appId,
      });

      setContract(createdContract);
      setForm(initialForm);
      setFeedbackTone("default");
      setFeedback("Contrato conectado com sucesso.");
    } catch (error) {
      setFeedbackTone("danger");
      setFeedback(
        error instanceof Error
          ? error.message
          : "Nao foi possivel conectar o contrato.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  function openRemoveModal() {
    setRemoveConfirmationText("");
    setIsRemoveModalOpen(true);
  }

  function closeRemoveModal() {
    if (isRemoving) {
      return;
    }

    setRemoveConfirmationText("");
    setIsRemoveModalOpen(false);
  }

  async function handleRemoveContract() {
    if (!user || !contract || !canRemoveContract) {
      return;
    }

    setIsRemoving(true);
    setFeedback(null);

    try {
      await mercadoLivreService.remove(user.id);
      setContract(null);
      setFeedbackTone("default");
      setFeedback("Contrato removido com sucesso.");
      closeRemoveModal();
    } catch (error) {
      setFeedbackTone("danger");
      setFeedback(
        error instanceof Error
          ? error.message
          : "Nao foi possivel remover o contrato.",
      );
    } finally {
      setIsRemoving(false);
    }
  }

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow="Integracoes"
        title="Mercado Livre"
        description="Gerencie o contrato de conexao da loja Mercado Livre usada na operacao."
        icon={Store}
      />

      {feedback ? (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
            feedbackTone === "danger"
              ? "border-rose-200 bg-rose-50 text-rose-700"
              : "border-primary/20 bg-primary/8 text-slate-700"
          }`}
        >
          {feedback}
        </div>
      ) : null}

      {isLoading ? (
        <div className="premium-panel rounded-[28px] border border-slate-200 p-8">
          <div className="relative flex items-center gap-3 text-sm font-semibold text-slate-600">
            <LoaderCircle className="h-4 w-4 animate-spin text-primary" />
            Carregando contrato...
          </div>
        </div>
      ) : contract ? (
        <section className="premium-panel rounded-[28px] border border-slate-200 p-6 md:p-8">
          <div className="relative grid gap-8 lg:grid-cols-[1fr_320px]">
            <div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="premium-pill flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                      Contrato ativo
                    </p>
                    <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                      {contract.storeName}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      A conexao ja esta registrada. O formulario fica oculto
                      enquanto existir contrato ativo para esta loja.
                    </p>
                  </div>
                </div>

                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-primary">
                  <CheckCircle2 className="h-4 w-4" />
                  Conectado
                </span>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white/75 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    Seller ID
                  </p>
                  <p className="mt-2 font-mono text-sm font-semibold text-slate-900">
                    {contract.sellerId}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white/75 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    App ID
                  </p>
                  <p className="mt-2 font-mono text-sm font-semibold text-slate-900">
                    {contract.appId}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white/75 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    Conectado em
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {formatConnectionDate(contract.connectedAt)}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-rose-100 bg-rose-50/70 p-5">
              <div className="flex items-start gap-3">
                <Trash2 className="mt-0.5 h-5 w-5 shrink-0 text-rose-700" />
                <div>
                  <h3 className="text-base font-black text-rose-950">
                    Remover contrato
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-rose-800/80">
                    A remocao exige confirmar o nome da loja antes de liberar
                    uma nova conexao.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={openRemoveModal}
                className="premium-button mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                <Trash2 className="h-4 w-4" />
                Remover contrato
              </button>
            </div>
          </div>
        </section>
      ) : (
        <form
          onSubmit={handleConnect}
          className="premium-panel rounded-[28px] border border-slate-200 p-6 md:p-8"
        >
          <div className="relative grid gap-6 lg:grid-cols-[1fr_300px]">
            <div>
              <div className="flex items-start gap-4">
                <div className="premium-pill flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-primary">
                  <PlugZap className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                    Nova conexao
                  </p>
                  <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                    Conectar loja
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Informe os dados do contrato para ativar a loja Mercado
                    Livre neste usuario.
                  </p>
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 sm:col-span-2">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                    Nome da loja *
                  </span>
                  <input
                    value={form.storeName}
                    onChange={(event) =>
                      updateForm("storeName", event.target.value)
                    }
                    className="premium-field h-12 rounded-2xl border border-slate-200 px-4 text-sm text-slate-900 outline-none focus:border-primary"
                    placeholder="Ex: Auto Pecas Centro"
                    required
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                    Seller ID *
                  </span>
                  <input
                    value={form.sellerId}
                    onChange={(event) =>
                      updateForm("sellerId", event.target.value)
                    }
                    className="premium-field h-12 rounded-2xl border border-slate-200 px-4 font-mono text-sm text-slate-900 outline-none focus:border-primary"
                    placeholder="123456789"
                    required
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                    App ID *
                  </span>
                  <input
                    value={form.appId}
                    onChange={(event) => updateForm("appId", event.target.value)}
                    className="premium-field h-12 rounded-2xl border border-slate-200 px-4 font-mono text-sm text-slate-900 outline-none focus:border-primary"
                    placeholder="APP-USR-000000"
                    required
                  />
                </label>
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white/70 p-5">
              <h3 className="text-base font-black text-slate-950">
                Estado da conexao
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Depois de conectar, este formulario sai da tela e a acao
                principal passa a ser remover o contrato.
              </p>

              <button
                type="submit"
                disabled={!canConnect || isSaving || !user}
                className="premium-button mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {isSaving ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <PlugZap className="h-4 w-4" />
                )}
                Conectar contrato
              </button>
            </div>
          </div>
        </form>
      )}

      {isRemoveModalOpen && contract ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-6 backdrop-blur-[2px]">
          <div className="w-full max-w-lg rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.22)]">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="premium-pill flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-700">
                  <Trash2 className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-600">
                    Confirmar remocao
                  </p>
                  <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                    Remover contrato
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Digite o nome da loja para liberar a remocao do contrato.
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Loja:{" "}
                    <span className="rounded-md bg-slate-100 px-2 py-1 font-semibold text-slate-900">
                      {contract.storeName}
                    </span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeRemoveModal}
                disabled={isRemoving}
                aria-label="Fechar modal"
                className="premium-button-secondary inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6">
              <label className="grid gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  Nome da loja
                </span>
                <input
                  value={removeConfirmationText}
                  onChange={(event) =>
                    setRemoveConfirmationText(event.target.value)
                  }
                  placeholder={contract.storeName}
                  className="premium-field h-12 rounded-2xl border border-slate-200 px-4 text-sm text-slate-900 outline-none focus:border-rose-400"
                />
              </label>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeRemoveModal}
                disabled={isRemoving}
                className="premium-button-secondary inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleRemoveContract}
                disabled={!canRemoveContract || isRemoving}
                className="premium-button inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-rose-300"
              >
                {isRemoving ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Remover contrato
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
