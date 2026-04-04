"use client";

import {
  Camera,
  CircleCheckBig,
  ClipboardList,
  Package,
  UserRound,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Step = {
  id: string;
  title: string;
  description: string;
};

type LaudoProgressProps = {
  steps: readonly Step[];
  currentStep: number;
  visitedSteps?: number[];
  onStepClick?: (stepIndex: number) => void;
  avaliacaoApproved?: boolean;
};

type IndicatorStyle = {
  width: number;
  left: number;
};

function getStepIcon(stepId: string) {
  if (stepId === "cliente") {
    return UserRound;
  }

  if (stepId === "peca") {
    return Package;
  }

  if (stepId === "avaliacao") {
    return ClipboardList;
  }

  if (stepId === "fotos") {
    return Camera;
  }

  return CircleCheckBig;
}

export function LaudoProgress({
  steps,
  currentStep,
  visitedSteps = [],
  onStepClick,
  avaliacaoApproved = false,
}: LaudoProgressProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [indicatorStyle, setIndicatorStyle] = useState<IndicatorStyle | null>(
    null,
  );

  useEffect(() => {
    function updateIndicator() {
      const container = containerRef.current;
      const activeItem = itemRefs.current[currentStep];

      if (!container || !activeItem) {
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const activeRect = activeItem.getBoundingClientRect();

      setIndicatorStyle({
        width: activeRect.width,
        left: activeRect.left - containerRect.left,
      });
    }

    updateIndicator();
    window.addEventListener("resize", updateIndicator);

    return () => {
      window.removeEventListener("resize", updateIndicator);
    };
  }, [currentStep, steps]);

  useEffect(() => {
    const activeItem = itemRefs.current[currentStep];

    if (!activeItem) {
      return;
    }

    activeItem.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [currentStep]);

  return (
    <div className="border-b border-slate-100 pb-4">
      <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div
          ref={containerRef}
          className="relative flex min-w-max items-center justify-start gap-5 px-1 md:justify-center"
        >
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isAvaliacaoSuccess = step.id === "avaliacao" && avaliacaoApproved;
          const isClickable =
            index !== currentStep &&
            visitedSteps.includes(index) &&
            typeof onStepClick === "function";
          const Icon = getStepIcon(step.id);

          return (
            <button
              type="button"
              key={step.id}
              ref={(element) => {
                itemRefs.current[index] = element;
              }}
              onClick={() => {
                if (isClickable) {
                  onStepClick(index);
                }
              }}
              className={`relative flex items-center gap-2 pb-2 text-sm font-semibold transition-colors ${
                isAvaliacaoSuccess
                  ? "text-emerald-600"
                  : isActive
                  ? "text-primary"
                  : isCompleted
                    ? "text-slate-700"
                    : "text-slate-400"
              } ${isClickable ? "cursor-pointer hover:text-primary" : "cursor-default"}`}
              disabled={!isClickable}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full transition ${
                  isAvaliacaoSuccess
                    ? "bg-emerald-100 text-emerald-600"
                    : isActive
                      ? "bg-primary/10 text-primary"
                      : isCompleted
                        ? "bg-slate-100 text-slate-700"
                        : "bg-slate-100 text-slate-400"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
              </span>
              {step.title}
            </button>
          );
        })}

        {indicatorStyle ? (
          <span
            className={`pointer-events-none absolute bottom-0 left-0 h-[2px] rounded-full transition-all duration-200 ease-out ${
              currentStep === 2 && avaliacaoApproved ? "bg-emerald-500" : "bg-primary"
            }`}
            style={{
              width: `${indicatorStyle.width}px`,
              left: `${indicatorStyle.left}px`,
            }}
          />
        ) : null}
        </div>
      </div>
    </div>
  );
}
