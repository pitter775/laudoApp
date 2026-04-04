"use client";

import {
  AlertCircle,
  ArrowLeft,
  Download,
  FilePlus2,
  LoaderCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";

import { laudosService, pdfService } from "@/services";
import type { LaudoDetalhe } from "@/types/laudo";

import { LaudoPdfTemplate } from "./laudo-pdf-template";

type LaudoPdfPageShellProps = {
  id: string;
};

export function LaudoPdfPageShell({ id }: LaudoPdfPageShellProps) {
  const router = useRouter();
  const hasTriggeredPrintRef = useRef(false);
  const [laudo, setLaudo] = useState<LaudoDetalhe | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadLaudo() {
      try {
        const data = await laudosService.getById(id);

        if (!isMounted) {
          return;
        }

        if (!data) {
          setError("Laudo nao encontrado.");
          return;
        }

        setLaudo(data);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Nao foi possivel carregar o laudo para impressao.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadLaudo();

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    let isMounted = true;

    async function generateQrCode() {
      if (!laudo) {
        return;
      }

      try {
        const qrCode = await QRCode.toDataURL(pdfService.buildQrUrl(laudo.id), {
          margin: 0,
          width: 180,
          color: {
            dark: "#0f172a",
            light: "#ffffff",
          },
        });

        if (isMounted) {
          setQrCodeDataUrl(qrCode);
        }
      } catch {
        if (isMounted) {
          setQrCodeDataUrl("");
        }
      }
    }

    void generateQrCode();

    return () => {
      isMounted = false;
    };
  }, [laudo]);

  useEffect(() => {
    if (!laudo || hasTriggeredPrintRef.current === true) {
      return;
    }

    const timeout = window.setTimeout(() => {
      hasTriggeredPrintRef.current = true;
      window.print();
    }, 450);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [laudo, qrCodeDataUrl]);

  function handleBackToWizard() {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/laudos/novo");
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6 py-10">
        <div className="rounded-[28px] border border-slate-200 bg-white px-8 py-10 text-center shadow-sm">
          <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-sm font-semibold text-slate-900">
            Preparando o PDF do laudo
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Estamos organizando o documento para impressao.
          </p>
        </div>
      </div>
    );
  }

  if (error || !laudo) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6 py-10">
        <div className="max-w-md rounded-[28px] border border-rose-200 bg-white px-8 py-10 text-center shadow-sm">
          <AlertCircle className="mx-auto h-8 w-8 text-rose-500" />
          <p className="mt-4 text-sm font-semibold text-slate-900">
            Nao foi possivel gerar o PDF
          </p>
          <p className="mt-2 text-sm text-slate-500">
            {error ?? "O laudo solicitado nao esta disponivel no momento."}
          </p>
          <Link
            href="/laudos"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para laudos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 print:bg-white print:p-0">
      <div className="mx-auto flex max-w-[210mm] justify-end gap-3 pb-4 print:hidden">
        <Link
          href="/laudos/novo?fresh=1"
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
        >
          <FilePlus2 className="h-4 w-4" />
          Novo laudo
        </Link>
        <button
          type="button"
          onClick={handleBackToWizard}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="premium-button inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover"
        >
          <Download className="h-4 w-4" />
          Baixar PDF
        </button>
      </div>

      <LaudoPdfTemplate laudo={laudo} qrCodeDataUrl={qrCodeDataUrl} />
    </div>
  );
}
