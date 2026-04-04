"use client";

import { AlertCircle, FileSearch, FileText, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { laudosService, pdfService } from "@/services";
import type { LaudoListItem } from "@/types/laudo";

type LaudosListProps = {
  refreshKey?: number;
};

function getStatusBadgeClass(status: LaudoListItem["status"]) {
  return status === "REPROVADO"
    ? "border-rose-200 bg-rose-50 text-rose-700"
    : "border-emerald-200 bg-emerald-50 text-emerald-700";
}

export function LaudosList({ refreshKey = 0 }: LaudosListProps) {
  const [laudos, setLaudos] = useState<LaudoListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadLaudos() {
      if (isMounted) {
        setIsLoading(true);
        setError(null);
      }

      try {
        const data = await laudosService.listByUser();

        if (isMounted) {
          setLaudos(data);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Nao foi possivel carregar os laudos emitidos.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadLaudos();

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  if (isLoading) {
    return (
      <div className="premium-panel rounded-[28px] border border-slate-200 bg-white px-6 py-14 text-center">
        <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-sm font-semibold text-slate-900">
          Carregando laudos emitidos
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Estamos buscando os registros salvos no sistema.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="premium-panel rounded-[28px] border border-rose-200 bg-white px-6 py-14 text-center">
        <AlertCircle className="mx-auto h-8 w-8 text-rose-500" />
        <p className="mt-4 text-sm font-semibold text-slate-900">
          Nao foi possivel carregar os laudos
        </p>
        <p className="mt-2 text-sm text-slate-500">{error}</p>
      </div>
    );
  }

  if (laudos.length === 0) {
    return (
      <div className="premium-panel rounded-[28px] border border-slate-200 bg-white px-6 py-14 text-center">
        <FileSearch className="mx-auto h-8 w-8 text-primary" />
        <p className="mt-4 text-sm font-semibold text-slate-900">
          Nenhum laudo emitido ainda
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Emita o primeiro laudo para começar a acompanhar os documentos.
        </p>
        <Link
          href="/laudos/novo?fresh=1"
          className="premium-button mt-6 inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
        >
          <FileText className="h-4 w-4" />
          Emitir primeiro laudo
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {laudos.map((laudo) => (
        <div
          key={laudo.id}
          className="premium-panel rounded-[26px] border border-slate-200 bg-white px-5 py-5"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="grid gap-3 md:grid-cols-2 md:gap-x-8 md:gap-y-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Numero do laudo
                </p>
                <p className="mt-1 text-sm font-bold text-slate-900">
                  {pdfService.buildNumeroLaudo(laudo.id)}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Data de emissao
                </p>
                <p className="mt-1 text-sm font-medium text-slate-700">
                  {pdfService.formatDate(laudo.createdAt)}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Cliente
                </p>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  {laudo.clienteNome}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Peca
                </p>
                <p className="mt-1 text-sm font-medium text-slate-700">
                  {laudo.pecaNome}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-start gap-3 md:items-end">
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] ${getStatusBadgeClass(
                  laudo.status,
                )}`}
              >
                {laudo.status}
              </span>

              <Link
                href={`/laudos/${laudo.id}/pdf`}
                target="_blank"
                rel="noreferrer"
                className="premium-button inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover"
              >
                <FileText className="h-4 w-4" />
                Ver PDF
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
