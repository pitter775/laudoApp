"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { authService } from "@/services";
import type { UsuarioSessao } from "@/types/laudo";

type AppHeaderProps = {
  user: UsuarioSessao;
};

export function AppHeader({ user }: AppHeaderProps) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);

    try {
      await authService.signOut();
      authService.clearSession();
      router.replace("/login");
      router.refresh();
      window.location.href = "/login";
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-10 bg-white/95 px-6 py-3 backdrop-blur md:px-10">
      <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 appear-fade">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/15 bg-white shadow-[0_12px_28px_rgba(0,194,184,0.1)]">
            <Image
              src="/logo_curto.png"
              alt="Laudoparts"
              width={20}
              height={20}
              className="h-5 w-5"
            />
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="premium-pill hidden items-center gap-2.5 rounded-xl bg-white px-3 py-1.5 text-sm text-slate-500 shadow-sm md:flex">
            <Image
              src="/avatar.png"
              alt={user.nome}
              width={32}
              height={32}
              className="h-8 w-8 rounded-lg object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold leading-tight text-slate-900">
                {user.nome}
              </p>
              <p className="truncate text-[11px] leading-tight text-slate-500">
                {user.email}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="premium-pill premium-button-secondary rounded-xl border border-slate-200 bg-white px-4 py-1.5 text-[13px] font-semibold text-secondary shadow-sm transition hover:border-secondary/20 hover:text-secondary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSigningOut ? "Saindo..." : "Sair"}
          </button>
        </div>
      </div>
    </header>
  );
}
