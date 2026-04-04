import { supabaseClient } from "@/lib/supabaseClient";
import type { UsuarioSessao } from "@/types/laudo";

export type LoginPayload = {
  email: string;
  password: string;
};

const AUTH_STORAGE_KEY = "laudoparts.session";
const AUTH_EVENT_NAME = "laudoparts-auth-changed";

type UsuarioRecord = UsuarioSessao & {
  senha_hash: string;
  ativo: boolean;
};

async function sha256(value: string) {
  const data = new TextEncoder().encode(value);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function readStoredSession() {
  if (typeof window === "undefined") {
    return null;
  }

  const session = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!session) {
    return null;
  }

  try {
    return JSON.parse(session) as UsuarioSessao;
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

function saveSession(user: UsuarioSessao | null) {
  if (typeof window === "undefined") {
    return;
  }

  if (user) {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } else {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  window.dispatchEvent(new Event(AUTH_EVENT_NAME));
}

export const authService = {
  async signIn(payload: LoginPayload) {
    const senhaHash = await sha256(payload.password);
    const { data, error } = await supabaseClient
      .from("usuarios")
      .select("id, nome, email, senha_hash, ativo")
      .eq("email", payload.email.trim().toLowerCase())
      .eq("senha_hash", senhaHash)
      .eq("ativo", true)
      .maybeSingle<UsuarioRecord>();

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error("Email ou senha inválidos.");
    }

    const user = {
      id: data.id,
      nome: data.nome,
      email: data.email,
    } satisfies UsuarioSessao;

    saveSession(user);
    return user;
  },
  async signOut() {
    saveSession(null);
  },
  clearSession() {
    saveSession(null);
  },
  async getSession() {
    return readStoredSession();
  },
  async getCurrentUser() {
    return this.getSession();
  },
  async validateSession() {
    const sessionAtStart = readStoredSession();
    if (!sessionAtStart) {
      return null;
    }

    const { data, error } = await supabaseClient
      .from("usuarios")
      .select("id, nome, email, ativo")
      .eq("id", sessionAtStart.id)
      .eq("ativo", true)
      .maybeSingle<UsuarioSessao & { ativo: boolean }>();

    if (error) {
      throw error;
    }

    const latestStoredSession = readStoredSession();
    if (!latestStoredSession || latestStoredSession.id !== sessionAtStart.id) {
      return null;
    }

    if (!data) {
      saveSession(null);
      return null;
    }

    const user = {
      id: data.id,
      nome: data.nome,
      email: data.email,
    } satisfies UsuarioSessao;

    saveSession(user);
    return user;
  },
  onAuthStateChange(callback: () => void) {
    if (typeof window === "undefined") {
      return {
        data: {
          subscription: {
            unsubscribe() {},
          },
        },
      };
    }

    const handler = () => callback();
    window.addEventListener(AUTH_EVENT_NAME, handler);
    window.addEventListener("storage", handler);

    return {
      data: {
        subscription: {
          unsubscribe() {
            window.removeEventListener(AUTH_EVENT_NAME, handler);
            window.removeEventListener("storage", handler);
          },
        },
      },
    };
  },
};
