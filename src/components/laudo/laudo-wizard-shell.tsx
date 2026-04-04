"use client";

import { History, Send, SquarePen } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";

import { laudoWizardSteps } from "@/lib/constants/laudo";
import {
  authService,
  laudosService,
  pecasService,
  storageService,
} from "@/services";
import type {
  AvaliacaoStatus,
  DadosCliente,
  DadosPeca,
  FotoUpload,
  LaudoItemDraft,
  Peca,
  UsuarioSessao,
} from "@/types/laudo";

import { LaudoProgress } from "./laudo-progress";
import { AvaliacaoStepShell } from "./steps/avaliacao-step-shell";
import { ClienteStepShell } from "./steps/cliente-step-shell";
import { ConfirmacaoStepShell } from "./steps/confirmacao-step-shell";
import { FotosStepShell } from "./steps/fotos-step-shell";
import { PecaStepShell } from "./steps/peca-step-shell";

const initialCliente: DadosCliente = {
  razaoSocial: "",
  cnpj: "",
  email: "",
  telefone: "",
};

const initialPeca: DadosPeca = {
  pecaId: "",
  modelo: "",
  identificacao: "",
  observacao: "",
};

const WIZARD_STORAGE_KEY = "laudoparts:laudo-wizard-draft";

function getStatusFinal(itens: LaudoItemDraft[]) {
  return itens.some((item) => item.status === "REPROVADO")
    ? "REPROVADO"
    : "APROVADO";
}

export function LaudoWizardShell() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const wizardPanelRef = useRef<HTMLDivElement | null>(null);
  const progressAnchorRef = useRef<HTMLDivElement | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [visitedSteps, setVisitedSteps] = useState<number[]>([0]);
  const [hasMounted, setHasMounted] = useState(false);
  const [isProgressPinned, setIsProgressPinned] = useState(false);
  const [pinnedProgressStyle, setPinnedProgressStyle] = useState<{
    left: number;
    top: number;
    width: number;
  } | null>(null);
  const [stepDirection, setStepDirection] = useState<"forward" | "backward">(
    "forward",
  );
  const [cliente, setCliente] = useState<DadosCliente>(initialCliente);
  const [clienteInvalidFields, setClienteInvalidFields] = useState<
    Partial<Record<keyof DadosCliente, boolean>>
  >({});
  const [peca, setPeca] = useState<DadosPeca>(initialPeca);
  const [pecaInvalidFields, setPecaInvalidFields] = useState<
    Partial<Record<keyof DadosPeca, boolean>>
  >({});
  const [pecas, setPecas] = useState<Peca[]>([]);
  const [itens, setItens] = useState<LaudoItemDraft[]>([]);
  const [fotos, setFotos] = useState<FotoUpload[]>([]);
  const [aceite, setAceite] = useState(false);
  const [sessionUser, setSessionUser] = useState<UsuarioSessao | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingPecas, setIsLoadingPecas] = useState(true);
  const [, setIsLoadingAnalises] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedPeca = useMemo(
    () => pecas.find((item) => item.id === peca.pecaId) ?? null,
    [peca.pecaId, pecas],
  );

  const statusFinal = useMemo(() => getStatusFinal(itens), [itens]);
  const avaliacaoApproved = useMemo(
    () => itens.length > 0 && itens.every((item) => item.status === "APROVADO"),
    [itens],
  );

  function goToStep(nextStep: number) {
    setStepDirection(nextStep >= currentStep ? "forward" : "backward");
    setCurrentStep(nextStep);
    setVisitedSteps((current) =>
      current.includes(nextStep) ? current : [...current, nextStep],
    );
  }

  useEffect(() => {
    async function bootstrap() {
      try {
        const [user, pecasData] = await Promise.all([
          authService.getSession(),
          pecasService.listPecas(),
        ]);

        setSessionUser(user);
        setPecas(pecasData);
      } catch (bootstrapError) {
        setError(
          bootstrapError instanceof Error
            ? bootstrapError.message
            : "Não foi possível carregar os dados iniciais.",
        );
      } finally {
        setIsLoadingPecas(false);
      }
    }

    void bootstrap();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (searchParams.get("fresh") === "1") {
      window.sessionStorage.removeItem(WIZARD_STORAGE_KEY);
      resetWizard();
      router.replace("/laudos/novo");
      return;
    }

    const storedDraft = window.sessionStorage.getItem(WIZARD_STORAGE_KEY);

    if (!storedDraft) {
      return;
    }

    try {
      const parsedDraft = JSON.parse(storedDraft) as {
        currentStep: number;
        visitedSteps: number[];
        cliente: DadosCliente;
        peca: DadosPeca;
        itens: LaudoItemDraft[];
        fotos: FotoUpload[];
        aceite: boolean;
      };

      setCurrentStep(parsedDraft.currentStep ?? 0);
      setVisitedSteps(parsedDraft.visitedSteps?.length ? parsedDraft.visitedSteps : [0]);
      setCliente(parsedDraft.cliente ?? initialCliente);
      setPeca(parsedDraft.peca ?? initialPeca);
      setItens(parsedDraft.itens ?? []);
      setFotos(parsedDraft.fotos ?? []);
      setAceite(parsedDraft.aceite ?? false);
    } catch {
      window.sessionStorage.removeItem(WIZARD_STORAGE_KEY);
    }
  }, [router, searchParams]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.sessionStorage.setItem(
      WIZARD_STORAGE_KEY,
      JSON.stringify({
        currentStep,
        visitedSteps,
        cliente,
        peca,
        itens,
        fotos,
        aceite,
      }),
    );
  }, [aceite, cliente, currentStep, fotos, itens, peca, visitedSteps]);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    function updatePinnedProgress() {
      const wizardPanel = wizardPanelRef.current;
      const progressAnchor = progressAnchorRef.current;

      if (!wizardPanel || !progressAnchor) {
        return;
      }

      const headerElement = document.querySelector("header");
      const headerHeight = headerElement instanceof HTMLElement
        ? headerElement.getBoundingClientRect().height
        : 0;
      const pinnedTop = Math.max(headerHeight - 4, 0);
      const panelRect = wizardPanel.getBoundingClientRect();
      const anchorRect = progressAnchor.getBoundingClientRect();
      const shouldPin =
        anchorRect.top <= pinnedTop &&
        panelRect.bottom > pinnedTop + anchorRect.height + 24;

      if (!shouldPin) {
        setIsProgressPinned(false);
        setPinnedProgressStyle(null);
        return;
      }

      setIsProgressPinned(true);
      setPinnedProgressStyle({
        left: anchorRect.left,
        top: pinnedTop,
        width: anchorRect.width,
      });
    }

    updatePinnedProgress();
    window.addEventListener("scroll", updatePinnedProgress, { passive: true });
    window.addEventListener("resize", updatePinnedProgress);

    return () => {
      window.removeEventListener("scroll", updatePinnedProgress);
      window.removeEventListener("resize", updatePinnedProgress);
    };
  }, []);

  function handleClienteChange(field: keyof DadosCliente, value: string) {
    setCliente((current) => ({ ...current, [field]: value }));
    setClienteInvalidFields((current) =>
      current[field] ? { ...current, [field]: false } : current,
    );
  }

  async function handlePecaChange(field: keyof DadosPeca, value: string) {
    setPeca((current) => ({ ...current, [field]: value }));
    setPecaInvalidFields((current) =>
      current[field] ? { ...current, [field]: false } : current,
    );

    if (field !== "pecaId") {
      return;
    }

    setItens([]);
    setError(null);

    if (!value) {
      return;
    }

    setIsLoadingAnalises(true);

    try {
      const analises = await pecasService.listAnalisesByPeca(value);
      setItens(
        analises.map((analise) => ({
          analiseId: analise.id,
          nome: analise.nome,
          status: "",
        })),
      );
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Não foi possível carregar as análises da peça.",
      );
    } finally {
      setIsLoadingAnalises(false);
    }
  }

  function handleStatusChange(analiseId: string, status: AvaliacaoStatus) {
    setItens((current) =>
      current.map((item) =>
        item.analiseId === analiseId ? { ...item, status } : item,
      ),
    );
  }

  async function handleFilesSelected(files: File[]) {
    if (files.length === 0) {
      return;
    }

    setError(null);

    try {
      const convertedFiles = await storageService.convertFilesToBase64(
        files.slice(0, 10 - fotos.length),
      );
      setFotos((current) => [...current, ...convertedFiles].slice(0, 10));
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Não foi possível processar as imagens.",
      );
    }
  }

  function resetWizard() {
    setCurrentStep(0);
    setVisitedSteps([0]);
    setStepDirection("forward");
    setCliente(initialCliente);
    setClienteInvalidFields({});
    setPeca(initialPeca);
    setPecaInvalidFields({});
    setItens([]);
    setFotos([]);
    setAceite(false);
    setError(null);

    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(WIZARD_STORAGE_KEY);
    }
  }

  async function handleSubmit() {
    if (!sessionUser) {
      setError("Nenhum usuário autenticado foi encontrado na sessão.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const laudoId = await laudosService.create({
        userId: sessionUser.id,
        dadosCliente: cliente,
        dadosPeca: peca,
        pecaId: peca.pecaId,
        status: statusFinal,
        itens: itens.map((item) => ({
          analiseId: item.analiseId,
          status: item.status as AvaliacaoStatus,
        })),
        anexos: fotos.map((foto) => ({
          imagemBase64: foto.imagemBase64,
        })),
      });

      const pdfUrl = `/laudos/${laudoId}/pdf`;
      router.push(pdfUrl);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Não foi possível emitir o laudo.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function validateClienteFields() {
    const nextInvalidFields = Object.entries(cliente).reduce<
      Partial<Record<keyof DadosCliente, boolean>>
    >((accumulator, [field, fieldValue]) => {
      if (fieldValue.trim().length === 0) {
        accumulator[field as keyof DadosCliente] = true;
      }

      return accumulator;
    }, {});

    setClienteInvalidFields(nextInvalidFields);
    return Object.keys(nextInvalidFields).length === 0;
  }

  function validatePecaFields() {
    const requiredFields: Array<keyof DadosPeca> = [
      "pecaId",
      "modelo",
      "identificacao",
    ];
    const nextInvalidFields = requiredFields.reduce<
      Partial<Record<keyof DadosPeca, boolean>>
    >((accumulator, field) => {
      if (peca[field].trim().length === 0) {
        accumulator[field] = true;
      }

      return accumulator;
    }, {});

    setPecaInvalidFields(nextInvalidFields);
    return Object.keys(nextInvalidFields).length === 0;
  }

  function canAdvanceFromAvaliacao() {
    return itens.length > 0 && itens.every((item) => item.status !== "");
  }

  function renderStep() {
    if (currentStep === 0) {
      return (
        <ClienteStepShell
          value={cliente}
          invalidFields={clienteInvalidFields}
          onChange={handleClienteChange}
          onNext={() => {
            setError(null);

            if (!validateClienteFields()) {
              return;
            }

            goToStep(1);
          }}
        />
      );
    }

    if (currentStep === 1) {
      return (
        <PecaStepShell
          value={peca}
          pecas={pecas}
          isLoading={isLoadingPecas}
          invalidFields={pecaInvalidFields}
          onChange={(field, value) => {
            void handlePecaChange(field, value);
          }}
          onBack={() => goToStep(0)}
          onNext={() => {
            setError(null);

            if (!validatePecaFields()) {
              return;
            }

            goToStep(2);
          }}
        />
      );
    }

    if (currentStep === 2) {
      return (
        <AvaliacaoStepShell
          itens={itens}
          onStatusChange={handleStatusChange}
          onBack={() => goToStep(1)}
          onNext={() => {
            if (!canAdvanceFromAvaliacao()) {
              setError("Avalie todas as análises para continuar.");
              return;
            }

            setError(null);
            goToStep(3);
          }}
        />
      );
    }

    if (currentStep === 3) {
      return (
        <FotosStepShell
          fotos={fotos}
          onFilesSelected={handleFilesSelected}
          onRemove={(id) =>
            setFotos((current) => current.filter((foto) => foto.id !== id))
          }
          onBack={() => goToStep(2)}
          onNext={() => goToStep(4)}
        />
      );
    }

    return (
      <ConfirmacaoStepShell
        cliente={cliente}
        peca={peca}
        pecaNome={selectedPeca?.nome ?? "Peça não identificada"}
        user={sessionUser ?? { id: "", nome: "", email: "" }}
        itens={itens}
        fotos={fotos}
        statusFinal={statusFinal}
        aceite={aceite}
        isSubmitting={isSubmitting}
        onAceiteChange={setAceite}
        onBack={() => goToStep(3)}
        onSubmit={() => {
          void handleSubmit();
        }}
      />
    );
  }

  return (
    <div className="space-y-8 appear-fade">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-4">
          <div className="premium-pill flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-primary shadow-[0_14px_34px_rgba(0,194,184,0.12)]">
            <SquarePen className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Meus Laudos &gt; Emitir novo laudo
            </p>
            <h1 className="mt-2 text-[26px] font-black uppercase tracking-tight text-slate-900">
              Emissão de novo laudo
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="premium-pill premium-button-secondary inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-secondary shadow-sm hover:text-secondary-hover"
          >
            <History className="h-4 w-4" />
            History
          </button>
          <button
            type="button"
            className="premium-pill premium-button-secondary inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-secondary shadow-sm hover:text-secondary-hover"
          >
            <Send className="h-4 w-4" />
            Invite
          </button>
        </div>
      </div>

      <div
        ref={wizardPanelRef}
        className="premium-panel appear-fade-delay overflow-visible rounded-[22px] border border-slate-200 bg-white px-4 py-8 md:px-8 md:py-10"
      >
        <div className="mx-auto max-w-[760px]">
          <div ref={progressAnchorRef} className="relative">
            <div className={isProgressPinned ? "invisible" : ""}>
              <LaudoProgress
                steps={laudoWizardSteps}
                currentStep={currentStep}
                visitedSteps={visitedSteps}
                avaliacaoApproved={avaliacaoApproved}
                onStepClick={(stepIndex) => {
                  goToStep(stepIndex);
                }}
              />
            </div>

          </div>

          {hasMounted && isProgressPinned && pinnedProgressStyle
            ? createPortal(
                <div
                  className="fixed z-30"
                  style={{
                    left: pinnedProgressStyle.left,
                    top: pinnedProgressStyle.top,
                    width: pinnedProgressStyle.width,
                  }}
                >
                  <div className="rounded-2xl bg-white/96 backdrop-blur-sm">
                    <LaudoProgress
                      steps={laudoWizardSteps}
                      currentStep={currentStep}
                      visitedSteps={visitedSteps}
                      avaliacaoApproved={avaliacaoApproved}
                      onStepClick={(stepIndex) => {
                        goToStep(stepIndex);
                      }}
                    />
                  </div>
                </div>,
                document.body,
              )
            : null}


          {error ? (
            <div className="mx-auto mt-8 w-full max-w-[640px] rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 appear-fade">
              {error}
            </div>
          ) : null}

          <div
            key={currentStep}
            className={`step-stage mt-10 ${
              stepDirection === "forward"
                ? "step-stage-forward"
                : "step-stage-backward"
            }`}
          >
            {renderStep()}
          </div>
        </div>
      </div>
    </div>
  );
}
