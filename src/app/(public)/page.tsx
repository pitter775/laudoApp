"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { authService } from "@/services";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    async function resolveEntryPoint() {
      const session = await authService.getSession();
      router.replace(session ? "/dashboard" : "/login");
    }

    void resolveEntryPoint();
  }, [router]);

  return (
    <div className="premium-panel appear-fade rounded-[28px] border border-slate-200 bg-white px-8 py-12 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
        Laudoparts
      </p>
      <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-950">
        Preparando acesso
      </h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        Estamos direcionando você para o sistema ou para a tela de login.
      </p>
    </div>
  );
}
