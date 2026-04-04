import {
  ArrowLeft,
  BadgeCheck,
  Camera,
  CircleCheckBig,
  ClipboardCheck,
  FileCheck2,
  Send,
} from "lucide-react";
import Image from "next/image";

import { LaudoStepCard } from "@/components/laudo/laudo-step-card";
import { PremiumSwitch } from "@/components/ui/premium-switch";
import type {
  DadosCliente,
  DadosPeca,
  FotoUpload,
  LaudoItemDraft,
  LaudoResumoStatus,
  UsuarioSessao,
} from "@/types/laudo";

type ConfirmacaoStepShellProps = {
  cliente: DadosCliente;
  peca: DadosPeca;
  pecaNome: string;
  user: UsuarioSessao;
  itens: LaudoItemDraft[];
  fotos: FotoUpload[];
  statusFinal: LaudoResumoStatus;
  aceite: boolean;
  isSubmitting: boolean;
  onAceiteChange: (checked: boolean) => void;
  onBack: () => void;
  onSubmit: () => void;
};

function getStatusChipClass(status: LaudoItemDraft["status"]) {
  if (status === "REPROVADO") {
    return "status-chip status-chip-rejected";
  }

  if (status === "REPARAR") {
    return "status-chip status-chip-repair";
  }

  return "status-chip status-chip-approved";
}

export function ConfirmacaoStepShell({
  cliente,
  peca,
  pecaNome,
  user,
  itens,
  fotos,
  statusFinal,
  aceite,
  isSubmitting,
  onAceiteChange,
  onBack,
  onSubmit,
}: ConfirmacaoStepShellProps) {
  const approverCrea = "5060202571";
  const avaliadorCode = `001AIQ-${user.id.slice(0, 5).toUpperCase()}`;
  const pendingItems = aceite
    ? []
    : ["Ativar a autorização final para liberar a emissão do laudo."];

  return (
    <LaudoStepCard
      title="Confirmação"
      description="Revise as informações antes de salvar o laudo, os itens e os anexos."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
            <BadgeCheck className="h-4 w-4 text-primary" />
            Dados do cliente
          </p>
          <div className="mt-3 space-y-2 text-sm text-slate-600">
            <p>{cliente.razaoSocial}</p>
            <p>{cliente.cnpj}</p>
            <p>{cliente.email}</p>
            <p>{cliente.telefone}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
            <FileCheck2 className="h-4 w-4 text-primary" />
            Dados da peça
          </p>
          <div className="mt-3 space-y-2 text-sm text-slate-600">
            <p>{pecaNome}</p>
            <p>{peca.modelo}</p>
            <p>{peca.identificacao}</p>
            <p>{peca.observacao || "Sem observações."}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
            <ClipboardCheck className="h-4 w-4 text-primary" />
            Avaliação
          </p>
          <span
            className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] ${
              statusFinal === "REPROVADO"
                ? "bg-rose-50 text-rose-700"
                : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {statusFinal}
          </span>
        </div>

        <div className="mt-4 grid gap-2 text-sm text-slate-600">
          {itens.map((item) => (
            <div
              key={item.analiseId}
              className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-3 py-2.5"
            >
              <span>{item.nome}</span>
              <span className={getStatusChipClass(item.status)}>{item.status}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Camera className="h-4 w-4 text-primary" />
            Fotos anexadas
          </p>
          <p className="mt-3 text-sm text-slate-600">
            {fotos.length > 0
              ? `${fotos.length} imagem(ns) pronta(s) para seguir com o laudo.`
              : "Nenhuma imagem anexada."}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-semibold text-slate-900">Avaliador responsável</p>
          <div className="mt-4 flex items-center gap-4">
            <Image
              src="/avatar.png"
              alt={user.nome}
              width={48}
              height={48}
              className="h-12 w-12 rounded-2xl object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-900">{user.nome}</p>
              <p className="mt-1 text-xs text-slate-500">CREA {approverCrea}</p>
              <p className="mt-1 text-xs text-slate-500">
                Código {avaliadorCode}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`mt-4 rounded-2xl border p-4 ${
          pendingItems.length > 0
            ? "border-amber-200 bg-amber-50"
            : "border-emerald-200 bg-emerald-50"
        }`}
      >
        <p
          className={`inline-flex items-center gap-2 text-sm font-semibold ${
            pendingItems.length > 0 ? "text-amber-800" : "text-emerald-700"
          }`}
        >
          <CircleCheckBig className="h-4 w-4" />
          {pendingItems.length > 0 ? "Falta para concluir" : "Tudo pronto para emitir"}
        </p>

        <div className="mt-3 space-y-2 text-sm">
          {pendingItems.length > 0 ? (
            pendingItems.map((item) => (
              <p key={item} className="text-amber-700">
                {item}
              </p>
            ))
          ) : (
            <p className="text-emerald-700">
              A confirmação final foi liberada. O laudo já pode ser emitido.
            </p>
          )}
        </div>
      </div>

      <div className="mt-5">
        <PremiumSwitch
          checked={aceite}
          onCheckedChange={onAceiteChange}
          label="Autorização de assinatura"
          description="Confirmo as informações acima e autorizo utilizar minha assinatura digital no laudo emitido."
        />
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
          onClick={onSubmit}
          disabled={!aceite || isSubmitting}
          className="premium-button inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send className="h-4 w-4" />
          {isSubmitting ? "Emitindo..." : "Emitir laudo"}
        </button>
      </div>
    </LaudoStepCard>
  );
}
