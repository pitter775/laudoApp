import {
  ArrowLeft,
  BadgeCheck,
  Camera,
  CircleAlert,
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
    : ["Ativar a autorizacao final para liberar a emissao do laudo."];

  return (
    <LaudoStepCard
      title="Confirmacao"
      description="Revise as informacoes antes de salvar o laudo, os itens e os anexos."
    >
      <div className="grid gap-4 lg:grid-cols-2 appear-fade">
        <div className="premium-pill rounded-2xl border border-slate-200 bg-slate-50 p-4">
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

        <div className="premium-pill rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
            <FileCheck2 className="h-4 w-4 text-primary" />
            Dados da peca
          </p>
          <div className="mt-3 space-y-2 text-sm text-slate-600">
            <p>{pecaNome}</p>
            <p>{peca.modelo}</p>
            <p>{peca.identificacao}</p>
            <p>{peca.observacao || "Sem observacoes."}</p>
          </div>
        </div>
      </div>

      <div className="premium-pill mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
          <ClipboardCheck className="h-4 w-4 text-primary" />
          Avaliacao
        </p>
        <div className="mt-3 grid gap-2 text-sm text-slate-600">
          {itens.map((item) => (
            <div
              key={item.analiseId}
              className="flex items-center justify-between gap-4"
            >
              <span>{item.nome}</span>
              <span className={getStatusChipClass(item.status)}>{item.status}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="premium-pill mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
          <Camera className="h-4 w-4 text-primary" />
          Fotos anexadas: {fotos.length}
        </p>
      </div>

      <div className="premium-pill mt-4 rounded-[22px] border-2 border-[#4190ff] bg-[#eef5ff] p-5">
        <div className="flex items-center gap-4">
          <Image
            src="/avatar.png"
            alt={user.nome}
            width={56}
            height={56}
            className="h-14 w-14 rounded-2xl object-cover"
          />
          <div className="min-w-0">
            <p className="truncate text-[15px] font-black uppercase tracking-tight text-slate-900">
              {user.nome}
            </p>
            <p className="mt-1 text-[15px] font-black uppercase tracking-tight text-slate-700">
              N. CREA: {approverCrea} / CODIGO DO AVALIADOR: {avaliadorCode}
            </p>
          </div>
        </div>
      </div>

      <div
        className={`mt-4 rounded-2xl border p-4 ${
          statusFinal === "REPROVADO"
            ? "status-glow border-rose-200 bg-rose-50 text-rose-700"
            : "border-primary/25 bg-primary/10 text-primary"
        }`}
      >
        <p className="inline-flex items-center gap-2 text-sm font-semibold">
          <CircleAlert className="h-4 w-4" />
          Status final: {statusFinal}
        </p>
        <p className="mt-2 text-sm">
          {statusFinal === "REPROVADO"
            ? "Existe ao menos um item reprovado, entao o laudo sera salvo como reprovado."
            : "Nenhum item foi reprovado, entao o laudo sera salvo como aprovado."}
        </p>
      </div>

      <div
        className={`premium-pill mt-4 rounded-2xl border p-4 ${
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
              A confirmacao final foi liberada. O laudo ja pode ser emitido.
            </p>
          )}
        </div>
      </div>

      <div className="mt-5">
        <PremiumSwitch
          checked={aceite}
          onCheckedChange={onAceiteChange}
          label="Autorizacao de assinatura"
          description="Confirmo as informacoes acima e autorizo utilizar minha assinatura digital no laudo emitido."
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
