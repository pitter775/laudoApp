"use client";

import { Beaker, ChevronLeft, ChevronRight, ClipboardList, KeyRound, PanelRight, Wrench } from "lucide-react";
import { useEffect, useState } from "react";

import { pecasService } from "@/services";
import type { Peca, PecaAnalise } from "@/types/laudo";

type PecaComAnalises = {
  peca: Peca;
  analises: PecaAnalise[];
};

export function DevHelperPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pecasData, setPecasData] = useState<PecaComAnalises[]>([]);

  useEffect(() => {
    async function loadPanelData() {
      setIsLoading(true);
      setError(null);

      try {
        const pecas = await pecasService.listPecas();
        const analisesByPeca = await Promise.all(
          pecas.map(async (peca) => ({
            peca,
            analises: await pecasService.listAnalisesByPeca(peca.id),
          })),
        );

        setPecasData(analisesByPeca);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Nao foi possivel carregar a colinha de desenvolvimento.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadPanelData();
  }, []);

  return (
    <aside
      className={`fixed top-0 right-0 z-50 hidden h-screen w-[320px] border-l border-slate-200/80 bg-white/80 shadow-[0_12px_40px_rgba(15,23,42,0.12)] backdrop-blur-xl transition-transform duration-300 ease-in-out md:block ${
        isOpen ? "translate-x-0" : "translate-x-[280px]"
      }`}
      aria-label="Painel de ajuda para desenvolvimento"
    >
      <div className="flex h-full">
        <div className="flex w-10 shrink-0 flex-col items-center border-r border-slate-200/70 bg-white/90 py-3">
          <button
            type="button"
            onClick={() => setIsOpen((current) => !current)}
            className="premium-pill inline-flex h-10 w-10 items-center justify-center rounded-l-2xl rounded-r-none border border-r-0 border-slate-200 bg-white text-slate-600 transition hover:text-primary"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Fechar colinha de desenvolvimento" : "Abrir colinha de desenvolvimento"}
          >
            {isOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>

          <div className="mt-4 flex flex-1 flex-col items-center gap-3 text-slate-400">
            <PanelRight className="h-4 w-4" />
            <span className="[writing-mode:vertical-rl] rotate-180 text-[10px] font-bold uppercase tracking-[0.28em]">
              Dev
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-primary">
                Ambiente dev
              </p>
              <h2 className="mt-1.5 text-sm font-semibold text-slate-950">
                Colinha do MVP
              </h2>
              <p className="mt-1.5 text-[11px] leading-5 text-slate-600">
                Dados rapidos para login e testes do fluxo de emissao.
              </p>
            </div>

            <span className="premium-pill inline-flex items-center gap-1.5 rounded-full bg-primary/8 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary">
              <Beaker className="h-3 w-3" />
              Dev
            </span>
          </div>

          <div className="mt-4 space-y-3">
            <section className="premium-pill rounded-2xl border border-slate-200 bg-white/70 p-3">
              <div className="flex items-center gap-2 text-slate-950">
                <KeyRound className="h-3.5 w-3.5 text-primary" />
                <h3 className="text-[11px] font-semibold uppercase tracking-wide">Login</h3>
              </div>
              <div className="mt-2.5 space-y-1.5 text-[11px] text-slate-600">
                <p>
                  <span className="font-semibold text-slate-900">E-mail:</span>{" "}
                  admin@laudoparts.com
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Senha:</span>{" "}
                  Admin@123
                </p>
              </div>
            </section>

            <section className="premium-pill rounded-2xl border border-slate-200 bg-white/70 p-3">
              <div className="flex items-center gap-2 text-slate-950">
                <Wrench className="h-3.5 w-3.5 text-primary" />
                <h3 className="text-[11px] font-semibold uppercase tracking-wide">Pecas</h3>
              </div>

              <div className="mt-2.5 space-y-2.5">
                {isLoading ? (
                  <p className="text-[11px] text-slate-500">Carregando pecas e checklist...</p>
                ) : error ? (
                  <p className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] text-rose-700">
                    {error}
                  </p>
                ) : pecasData.length === 0 ? (
                  <p className="text-[11px] text-slate-500">Nenhuma peca encontrada no banco.</p>
                ) : (
                  pecasData.map(({ peca, analises }) => (
                    <div
                      key={peca.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50/90 p-2.5"
                    >
                      <p className="text-[11px] font-semibold text-slate-950">{peca.nome}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-wide text-slate-400">
                        {analises.length} analise(s)
                      </p>

                      <ul className="mt-2.5 space-y-1.5">
                        {analises.length > 0 ? (
                          analises.map((analise) => (
                            <li
                              key={analise.id}
                              className="rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-[11px] text-slate-600"
                            >
                              {analise.nome}
                            </li>
                          ))
                        ) : (
                          <li className="rounded-xl border border-dashed border-slate-200 bg-white px-2.5 py-2 text-[11px] text-slate-500">
                            Sem checklist cadastrado para esta peca.
                          </li>
                        )}
                      </ul>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="premium-pill rounded-2xl border border-slate-200 bg-white/70 p-3">
              <div className="flex items-center gap-2 text-slate-950">
                <ClipboardList className="h-3.5 w-3.5 text-primary" />
                <h3 className="text-[11px] font-semibold uppercase tracking-wide">Checklist</h3>
              </div>
              <p className="mt-2.5 text-[11px] leading-5 text-slate-600">
                Cada peca lista abaixo as analises vindas de <code>pecas_analises</code>.
              </p>
            </section>

            <section className="premium-pill rounded-2xl border border-slate-200 bg-white/70 p-3">
              <div className="flex items-center gap-2 text-slate-950">
                <Beaker className="h-3.5 w-3.5 text-primary" />
                <h3 className="text-[11px] font-semibold uppercase tracking-wide">
                  Exemplo de resultado
                </h3>
              </div>
              <div className="mt-2.5 space-y-1.5 text-[11px] text-slate-600">
                <p>
                  <span className="font-semibold text-rose-600">1 NOK</span> -&gt;{" "}
                  <span className="font-semibold text-slate-900">REPROVADO</span>
                </p>
                <p>
                  <span className="font-semibold text-emerald-600">Todos OK</span> -&gt;{" "}
                  <span className="font-semibold text-slate-900">APROVADO</span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  console.log("[DevHelperPanel] Preencher teste clicado");
                }}
                className="premium-button-secondary mt-3 inline-flex rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-secondary"
              >
                Preencher teste
              </button>
            </section>
          </div>
        </div>
      </div>
    </aside>
  );
}
