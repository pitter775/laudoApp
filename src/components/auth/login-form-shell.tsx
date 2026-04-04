"use client";

import type { FormEvent } from "react";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { PageIntro } from "@/components/ui/page-intro";
import { authService } from "@/services";

export function LoginFormShell() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@laudoparts.com");
  const [password, setPassword] = useState("Admin@123");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function hydrateSession() {
      const session = await authService.getSession();
      if (session) {
        router.replace("/dashboard");
      }
    }

    void hydrateSession();
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await authService.signIn({ email, password });
      router.replace("/dashboard");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Não foi possível autenticar.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 appear-fade">
      <PageIntro
        eyebrow="Acesso seguro"
        title="Entrar"
        description="Entre com seus dados para continuar a emissão e a gestão dos laudos."
        icon={LockKeyhole}
      />

      <form
        onSubmit={handleSubmit}
        className="premium-panel rounded-[28px] border border-slate-200 bg-white p-6"
      >
        <div className="mb-6 flex justify-center">
          <Image
            src="/logo_curto.png"
            alt="Laudoparts"
            width={108}
            height={108}
            priority
            className="h-auto w-[34px] md:w-[42px]"
          />
        </div>

        <div className="grid gap-4">
          <label className="grid gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
              E-mail
            </span>
            <div className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 px-4 focus-within:border-primary">
              <Mail className="h-4 w-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="seuemail@empresa.com"
                className="h-full flex-1 bg-transparent text-sm text-slate-900 outline-none"
                required
              />
            </div>
          </label>

          <label className="grid gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
              Senha
            </span>
            <div className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 px-4 focus-within:border-primary">
              <LockKeyhole className="h-4 w-4 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Digite sua senha"
                className="h-full flex-1 bg-transparent text-sm text-slate-900 outline-none"
                required
              />
            </div>
          </label>
        </div>

        {error ? (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <div className="mt-6 flex items-center justify-end gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="premium-button inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span>{isSubmitting ? "Entrando..." : "Entrar"}</span>
            {!isSubmitting ? <ArrowRight className="h-4 w-4" /> : null}
          </button>
        </div>
      </form>
    </div>
  );
}
