"use client";

import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  ShieldAlert,
  Wrench,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { LaudoStepCard } from "@/components/laudo/laudo-step-card";
import type { AvaliacaoStatus, LaudoItemDraft } from "@/types/laudo";

type AvaliacaoStepShellProps = {
  itens: LaudoItemDraft[];
  onStatusChange: (analiseId: string, status: AvaliacaoStatus) => void;
  onBack: () => void;
  onNext: () => void;
};

type CanvasParticle = {
  color: string;
  size: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  spin: number;
  life: number;
  decay: number;
  gravityDelay: number;
  gravity: number;
  shape: "dot" | "bar";
};

const statusOptions: AvaliacaoStatus[] = ["APROVADO", "REPARAR", "REPROVADO"];
const canvasColors = [
  "#00c2b8",
  "#6a00f4",
  "#facc15",
  "#facc15",
  "#fde047",
  "#ef4444",
  "#22c55e",
  "#3b82f6",
  "#fbbf24",
  "#ffffff",
];

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function createParticles(width: number, height: number): CanvasParticle[] {
  const originX = width / 2;
  const originY = height - 18;

  return Array.from({ length: 52 }, () => {
    const angle = randomBetween(-2.9, -0.2);
    const speed = randomBetween(90, 210);
    const burstLift = randomBetween(6, 18);

    return {
      color: canvasColors[Math.floor(Math.random() * canvasColors.length)],
      size: randomBetween(1.4, 2.8),
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - burstLift,
      rotation: randomBetween(0, Math.PI * 2),
      spin: randomBetween(-7, 7),
      life: 1,
      decay: randomBetween(0.95, 1.25),
      gravityDelay: randomBetween(0.2, 0.42),
      gravity: randomBetween(220, 300),
      shape: Math.random() > 0.55 ? "dot" : "bar",
    };
  });
}

function getStatusIcon(status: AvaliacaoStatus) {
  if (status === "REPROVADO") {
    return ShieldAlert;
  }

  if (status === "REPARAR") {
    return Wrench;
  }

  return BadgeCheck;
}

function getStatusButtonClass(status: AvaliacaoStatus, isActive: boolean) {
  if (!isActive) {
    return "border-slate-300 bg-white text-slate-600 hover:border-slate-400";
  }

  if (status === "REPROVADO") {
    return "status-glow border-rose-300 bg-rose-100 text-rose-700";
  }

  if (status === "REPARAR") {
    return "border-amber-300 bg-amber-100 text-amber-700";
  }

  return "border-primary/30 bg-primary/10 text-primary";
}

export function AvaliacaoStepShell({
  itens,
  onStatusChange,
  onBack,
  onNext,
}: AvaliacaoStepShellProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const celebrationTimeoutRef = useRef<number | null>(null);
  const hasCelebratedRef = useRef(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const allApproved =
    itens.length > 0 && itens.every((item) => item.status === "APROVADO");

  useEffect(() => {
    function syncViewport() {
      setIsMobileViewport(window.innerWidth < 640);
    }

    syncViewport();
    window.addEventListener("resize", syncViewport);

    return () => {
      window.removeEventListener("resize", syncViewport);
    };
  }, []);

  useEffect(() => {
    if (!showCelebration) {
      return;
    }

    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    const width = 320;
    const height = 130;
    const devicePixelRatio = window.devicePixelRatio || 1;

    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

    const particles = createParticles(width, height);
    let animationFrame = 0;
    let lastTime = performance.now();
    const startTime = lastTime;
    const totalDuration = 1050;

    const drawFrame = (now: number) => {
      const delta = Math.min((now - lastTime) / 1000, 0.024);
      const elapsed = now - startTime;
      lastTime = now;

      context.clearRect(0, 0, width, height);

      particles.forEach((particle) => {
        const progress = Math.min(1, elapsed / totalDuration);

        if (progress > particle.gravityDelay) {
          particle.vy += particle.gravity * delta;
        }

        particle.x += particle.vx * delta;
        particle.y += particle.vy * delta;
        particle.rotation += particle.spin * delta;
        particle.life = Math.max(0, particle.life - particle.decay * delta);

        const opacity =
          progress < 0.62
            ? particle.life
            : particle.life * Math.max(0, 1 - (progress - 0.62) / 0.38);

        if (opacity <= 0.01) {
          return;
        }

        context.save();
        context.translate(particle.x, particle.y);
        context.rotate(particle.rotation);
        context.globalAlpha = opacity;
        context.fillStyle = particle.color;

        if (particle.shape === "dot") {
          context.beginPath();
          context.arc(0, 0, particle.size, 0, Math.PI * 2);
          context.fill();
        } else {
          context.fillRect(
            -particle.size * 0.45,
            -particle.size * 1.2,
            particle.size * 0.9,
            particle.size * 2.4,
          );
        }

        context.restore();
      });

      if (elapsed < totalDuration) {
        animationFrame = window.requestAnimationFrame(drawFrame);
      } else {
        context.clearRect(0, 0, width, height);
      }
    };

    animationFrame = window.requestAnimationFrame(drawFrame);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      context.clearRect(0, 0, width, height);
    };
  }, [showCelebration]);

  function handleStatusSelect(analiseId: string, status: AvaliacaoStatus) {
    onStatusChange(analiseId, status);

    if (isMobileViewport) {
      return;
    }

    const nextAllApproved =
      status === "APROVADO" &&
      itens.length > 0 &&
      itens.every(
        (item) =>
          item.analiseId === analiseId ? true : item.status === "APROVADO",
      );

    if (nextAllApproved && hasCelebratedRef.current === false) {
      hasCelebratedRef.current = true;
      setShowCelebration(true);

      if (celebrationTimeoutRef.current) {
        window.clearTimeout(celebrationTimeoutRef.current);
      }

      celebrationTimeoutRef.current = window.setTimeout(() => {
        setShowCelebration(false);
      }, 1050);
    }
  }

  return (
    <LaudoStepCard
      title="Avaliacao"
      description="As analises abaixo foram carregadas dinamicamente da tabela pecas_analises."
    >
      <div className="space-y-3 overflow-x-hidden appear-fade">
        {itens.map((item) => (
          <div
            key={item.analiseId}
            className={`premium-pill flex flex-col gap-3 rounded-2xl border bg-slate-50 p-4 transition md:flex-row md:items-center md:justify-between ${
              allApproved
                ? "border-emerald-200 bg-emerald-50/70"
                : "border-slate-200"
            }`}
          >
            <p className="min-w-0 break-words text-sm font-medium text-slate-800">
              {item.nome}
            </p>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((status) => {
                const isActive = item.status === status;
                const Icon = getStatusIcon(status);

                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => handleStatusSelect(item.analiseId, status)}
                    className={`premium-button-secondary inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold transition ${getStatusButtonClass(status, isActive)}`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {status}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
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

        <div className="relative">
          {!isMobileViewport ? (
            <canvas
              ref={canvasRef}
              className={`pointer-events-none absolute left-1/2 bottom-[calc(100%-50px)] z-10 -translate-x-1/2 ${
                showCelebration ? "block" : "hidden"
              }`}
            />
          ) : null}

          <button
            type="button"
            onClick={onNext}
            className={`premium-button inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold text-white transition ${
              allApproved
                ? "status-glow bg-emerald-500 hover:bg-emerald-600"
                : "bg-primary hover:bg-primary-hover"
            }`}
          >
            <ArrowRight className="h-4 w-4" />
            Avancar
          </button>
        </div>
      </div>
    </LaudoStepCard>
  );
}
