"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { authService } from "@/services";
import type { UsuarioSessao } from "@/types/laudo";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UsuarioSessao | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function syncSession() {
      try {
        const currentUser = await authService.validateSession();

        if (!isMounted) {
          return;
        }

        setUser(currentUser);

        if (!currentUser && pathname !== "/login") {
          router.replace("/login");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void syncSession();

    const subscription = authService.onAuthStateChange(() => {
      void syncSession();
    });

    return () => {
      isMounted = false;
      subscription.data.subscription.unsubscribe();
    };
  }, [pathname, router]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fbfcff] px-6">
        <div className="rounded-[28px] border border-slate-200 bg-white px-8 py-10 text-center shadow-sm">
          <p className="text-sm font-semibold text-slate-950">
            Validando sessão...
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Estamos preparando o ambiente interno.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfcff] text-slate-950">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <AppSidebar />

        <div className="flex min-h-screen flex-1 flex-col">
          <AppHeader user={user} />
          <main className="flex-1 px-6 py-4 md:px-10 md:py-6">
            <div className="mx-auto w-full max-w-[1180px]">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
