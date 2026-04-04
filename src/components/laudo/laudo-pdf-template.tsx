import { CheckCircle2, QrCode, XCircle } from "lucide-react";
import Image from "next/image";

import { pdfService } from "@/services";
import type { LaudoDetalhe } from "@/types/laudo";

type LaudoPdfTemplateProps = {
  laudo: LaudoDetalhe;
  qrCodeDataUrl: string;
};

function getStatusBadgeClass(status: LaudoDetalhe["itens"][number]["status"]) {
  if (status === "REPROVADO") {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }

  if (status === "REPARAR") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-emerald-200 bg-emerald-50 text-emerald-700";
}

function getStampClass(status: LaudoDetalhe["status"]) {
  return status === "REPROVADO"
    ? "border-rose-500/60 text-rose-600"
    : "border-emerald-500/60 text-emerald-600";
}

export function LaudoPdfTemplate({
  laudo,
  qrCodeDataUrl,
}: LaudoPdfTemplateProps) {
  const numeroLaudo = pdfService.buildNumeroLaudo(laudo.id);
  const controle = pdfService.buildControle(laudo.id);
  const dataEmissao = pdfService.formatDate(laudo.createdAt);
  const validade = pdfService.buildValidade(laudo.createdAt);

  return (
    <article className="pdf-sheet relative mx-auto w-full max-w-[210mm] overflow-hidden bg-white text-slate-900 shadow-[0_24px_60px_rgba(15,23,42,0.12)] print:max-w-none print:shadow-none">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_top_left,rgba(0,194,184,0.16),transparent_44%),radial-gradient(circle_at_top_right,rgba(106,0,244,0.12),transparent_36%)]" />

      <div className="relative px-10 py-10 print:px-8 print:py-8">
        <header className="flex items-start justify-between gap-8 border-b border-slate-200 pb-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-400">
              Laudoparts
            </p>
            <h1 className="mt-3 text-[32px] font-black uppercase tracking-tight text-slate-950">
              Laudo tecnico
            </h1>
            <p className="mt-2 max-w-[420px] text-sm leading-6 text-slate-500">
              Documento tecnico emitido pelo sistema LAUDOPARTS com checklist,
              evidencias visuais e resultado consolidado.
            </p>
          </div>

          <div className="flex flex-col items-end gap-4">
            <Image
              src="/logo_completo.png"
              alt="Laudoparts"
              width={188}
              height={44}
              priority
              className="h-auto w-[188px]"
            />
            <div className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-right shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                Numero do laudo
              </p>
              <p className="mt-1 text-base font-bold text-slate-900">
                {numeroLaudo}
              </p>
            </div>
          </div>
        </header>

        <section className="mt-7 grid gap-5 md:grid-cols-2">
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
              Dados do cliente
            </p>
            <div className="mt-4 grid gap-3 text-sm text-slate-700">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Razao social
                </p>
                <p className="mt-1 font-semibold text-slate-900">
                  {laudo.dadosCliente.razaoSocial}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    CNPJ
                  </p>
                  <p className="mt-1">{laudo.dadosCliente.cnpj}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    Telefone
                  </p>
                  <p className="mt-1">{laudo.dadosCliente.telefone}</p>
                </div>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  E-mail
                </p>
                <p className="mt-1">{laudo.dadosCliente.email}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
              Informacoes do laudo
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-700">
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Controle
                </p>
                <p className="mt-1 font-semibold text-slate-900">{controle}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Data de emissao
                </p>
                <p className="mt-1 font-semibold text-slate-900">
                  {dataEmissao}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Validade
                </p>
                <p className="mt-1 font-semibold text-slate-900">{validade}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Status
                </p>
                <p className="mt-1 font-semibold text-slate-900">
                  {laudo.status}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
            Informacoes da peca
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                Tipo
              </p>
              <p className="mt-1 font-semibold text-slate-900">
                {laudo.pecaNome}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                Modelo
              </p>
              <p className="mt-1 font-semibold text-slate-900">
                {laudo.dadosPeca.modelo}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                Identificacao
              </p>
              <p className="mt-1 font-semibold text-slate-900">
                {laudo.dadosPeca.identificacao}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
              Checklist tecnico
            </p>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              {laudo.itens.length} itens avaliados
            </p>
          </div>

          <div className="mt-4 space-y-3">
            {laudo.itens.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3"
              >
                <p className="text-sm font-medium text-slate-700">{item.nome}</p>
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] ${getStatusBadgeClass(
                    item.status,
                  )}`}
                >
                  {item.status === "REPROVADO" ? (
                    <XCircle className="h-3.5 w-3.5" />
                  ) : (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  )}
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        <div className="pointer-events-none absolute inset-x-0 top-[48%] flex justify-center">
          <div
            className={`rotate-[-9deg] rounded-[28px] border-[5px] px-8 py-5 text-center text-[34px] font-black uppercase tracking-[0.24em] opacity-16 ${getStampClass(
              laudo.status,
            )}`}
          >
            Laudo {laudo.status}
          </div>
        </div>

        <section className="mt-5 rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
            Imagens anexadas
          </p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {laudo.anexos.length > 0 ? (
              laudo.anexos.map((anexo) => (
                <div
                  key={anexo.id}
                  className="break-inside-avoid rounded-[22px] border border-slate-200 bg-slate-50 p-2"
                >
                  <Image
                    src={anexo.imagemBase64}
                    alt="Imagem anexada ao laudo"
                    width={520}
                    height={320}
                    unoptimized
                    className="h-40 w-full rounded-[18px] object-cover"
                  />
                </div>
              ))
            ) : (
              <div className="col-span-2 rounded-[22px] border border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">
                Nenhuma imagem foi anexada a este laudo.
              </div>
            )}
          </div>
        </section>

        <footer className="mt-6 flex items-end justify-between gap-6 border-t border-slate-200 pt-6">
          <div className="flex items-end gap-4">
            <div className="rounded-[20px] border border-slate-200 bg-white p-3 shadow-sm">
              {qrCodeDataUrl ? (
                <Image
                  src={qrCodeDataUrl}
                  alt="QR Code do laudo"
                  width={80}
                  height={80}
                  unoptimized
                  className="h-20 w-20"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <QrCode className="h-8 w-8" />
                </div>
              )}
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Validacao digital
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-900">
                LAUDOPARTS
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Documento assinado digitalmente
              </p>
            </div>
          </div>

          <div className="max-w-[280px] text-right text-xs leading-5 text-slate-400">
            QR Code vinculado ao registro digital do laudo para consulta e
            rastreabilidade do documento.
          </div>
        </footer>
      </div>
    </article>
  );
}
