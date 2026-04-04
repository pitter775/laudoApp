"use client";

import { ClipboardList, GraduationCap, SquarePen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { appNavigation } from "@/lib/navigation";

export function AppSidebar() {
  const pathname = usePathname();
  const laudosItem = appNavigation.find((item) => item.href === "/laudos");
  const emitirItem = appNavigation.find((item) => item.href === "/laudos/novo");
  const capacitacaoItem = appNavigation.find(
    (item) => item.href === "/capacitacao",
  );

  const laudosActive =
    pathname === "/laudos" ||
    pathname.startsWith("/laudos/") ||
    pathname === "/laudos/novo";

  const emitirActive = pathname === "/laudos/novo";

  return (
    <aside className="hidden w-[300px] shrink-0 border-r border-slate-200/80 bg-[linear-gradient(180deg,#ffffff_0%,#fbfdff_52%,#f7fbff_100%)] lg:flex lg:flex-col">
      <div className="px-6 py-6">
        <div className="appear-fade flex h-[88px] items-center rounded-[28px] px-2 shadow-none">
          <Image
            src="/logo_completo.png"
            alt="Laudoparts"
            width={220}
            height={48}
            priority
            className="h-auto w-[220px]"
          />
        </div>
      </div>

      <nav className="flex-1 space-y-4 px-5 py-2">
        {laudosItem ? (
          <div
            className={`rounded-[28px] border p-3 transition ${
              laudosActive
                ? "border-primary/15 bg-[linear-gradient(180deg,rgba(0,194,184,0.08),rgba(255,255,255,0.95))] shadow-[0_18px_42px_rgba(0,194,184,0.09)]"
                : "border-transparent bg-transparent"
            }`}
          >
            <Link
              href={laudosItem.href}
              className={`group block rounded-[22px] px-4 py-4 transition premium-button-secondary ${
                pathname === "/laudos"
                  ? "premium-pill border border-white/90 bg-white text-slate-950"
                  : "text-slate-600 hover:bg-white/90 hover:text-slate-950"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 h-3.5 w-3.5 rounded-full transition ${
                    pathname === "/laudos"
                      ? "bg-primary shadow-[0_0_0_5px_rgba(0,194,184,0.12)]"
                      : "bg-secondary/20 group-hover:bg-secondary/35"
                  }`}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="h-4 w-4 text-primary" />
                    <p className="text-[15px] font-bold uppercase tracking-wide">
                      {laudosItem.label}
                    </p>
                  </div>
                  <p className="mt-1 text-sm leading-5 text-slate-500">
                    {laudosItem.description}
                  </p>
                </div>
              </div>
            </Link>

            {emitirItem ? (
              <Link
                href={emitirItem.href}
                className={`group mt-2 block rounded-[20px] px-6 py-4 text-[14px] font-bold uppercase tracking-wide transition premium-button-secondary ${
                  emitirActive
                    ? "premium-pill border border-white/90 bg-white text-primary"
                    : "text-slate-500 hover:bg-white/80 hover:text-secondary"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <SquarePen className="h-4 w-4" />
                      <p>{emitirItem.label}</p>
                    </div>
                    <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                      Nova emissao
                    </p>
                  </div>
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-lg leading-none transition ${
                      emitirActive
                        ? "bg-primary/12 text-primary"
                        : "bg-secondary/8 text-secondary group-hover:bg-secondary/12"
                    }`}
                  >
                    +
                  </div>
                </div>
              </Link>
            ) : null}
          </div>
        ) : null}

        {capacitacaoItem ? (
          <div className="rounded-[24px] border border-dashed border-slate-200 bg-white/65 px-5 py-5 text-[15px] font-bold uppercase tracking-wide text-slate-400">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 h-3.5 w-3.5 rounded-full bg-slate-200" />
              <div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  <p>{capacitacaoItem.label}</p>
                </div>
                <p className="mt-1 text-sm font-medium normal-case tracking-normal text-slate-400">
                  Em breve no mesmo padrao visual do restante do sistema.
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </nav>
    </aside>
  );
}
