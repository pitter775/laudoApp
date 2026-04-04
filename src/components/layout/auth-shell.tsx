import type { ReactNode } from "react";

import { FileText, Sparkles, Workflow } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type AuthShellProps = {
  children: ReactNode;
};

export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(0,194,184,0.14),_#ffffff_48%),radial-gradient(circle_at_bottom_right,_rgba(106,0,244,0.12),_transparent_28%)] px-6 py-12">
      <div className="premium-panel w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/70 bg-white">
        <div className="grid min-h-[640px] lg:grid-cols-[1.2fr_0.8fr]">
          <section className="relative flex flex-col justify-between overflow-hidden bg-slate-950 px-8 py-10 text-slate-100 md:px-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(0,194,184,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(106,0,244,0.22),_transparent_30%)]" />
            <div className="space-y-5">
              <Link href="/" className="relative inline-flex appear-fade">
                <Image
                  src="/logo_completo.png"
                  alt="Laudoparts"
                  width={220}
                  height={48}
                  priority
                  className="h-auto w-[220px]"
                />
              </Link>
              <div className="relative space-y-3 appear-fade-delay">
                <p className="text-sm uppercase tracking-[0.24em] text-primary">
                  Laudos tecnicos com fluxo controlado
                </p>
                <h1 className="max-w-md text-4xl font-semibold leading-tight">
                  Emita laudos com mais padrao, clareza e agilidade.
                </h1>
                <p className="max-w-lg text-base leading-7 text-slate-300">
                  O LAUDOPARTS organiza a emissao em etapas, centraliza imagens
                  e mantem a operacao pronta para crescer com novos modulos e
                  PDF.
                </p>
              </div>
            </div>

            <div className="relative grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
              <div className="premium-pill rounded-2xl border border-white/10 bg-white/5 p-4">
                <Workflow className="h-5 w-5 text-primary" />
                <p className="mt-3 font-semibold text-white">Fluxo guiado</p>
                <p className="mt-2">
                  Cada etapa conduz o preenchimento e reduz erros na emissao.
                </p>
              </div>
              <div className="premium-pill rounded-2xl border border-white/10 bg-white/5 p-4">
                <Sparkles className="h-5 w-5 text-primary" />
                <p className="mt-3 font-semibold text-white">Visual profissional</p>
                <p className="mt-2">
                  Interface clara, confiavel e pronta para uso no dia a dia.
                </p>
              </div>
              <div className="premium-pill rounded-2xl border border-white/10 bg-white/5 p-4">
                <FileText className="h-5 w-5 text-primary" />
                <p className="mt-3 font-semibold text-white">PDF em evolucao</p>
                <p className="mt-2">
                  Estrutura preparada para gerar PDF com anexos e validacoes.
                </p>
              </div>
            </div>
          </section>

          <section className="flex items-center bg-white px-6 py-8 md:px-10">
            <div className="w-full">{children}</div>
          </section>
        </div>
      </div>
    </div>
  );
}
