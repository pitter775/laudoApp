import "server-only";

import { cookies } from "next/headers";

import { comparePasswordHash, signInternalAuthToken, verifyInternalAuthToken } from "@/server/auth/hash";
import { postgresAuthRepository } from "@/server/auth/postgres-auth.repository";
import type {
  InternalAuthSession,
  InternalLoginPayload,
} from "@/types/internal-auth";

export const INTERNAL_AUTH_COOKIE_NAME = "laudoparts.internal_session";

function buildSessionFromUser(user: {
  id: string;
  nome: string;
  email: string;
}): InternalAuthSession {
  return {
    user: {
      id: user.id,
      nome: user.nome,
      email: user.email,
    },
  };
}

export const postgresAuthService = {
  async login(payload: InternalLoginPayload) {
    const user = await postgresAuthRepository.findActiveUserByEmail(payload.email);

    if (!user || !comparePasswordHash(payload.password, user.senha_hash)) {
      throw new Error("Email ou senha invalidos.");
    }

    const token = signInternalAuthToken(user.id);
    const cookieStore = await cookies();

    cookieStore.set(INTERNAL_AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 12,
    });

    return buildSessionFromUser(user);
  },
  async logout() {
    const cookieStore = await cookies();
    cookieStore.set(INTERNAL_AUTH_COOKIE_NAME, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });
  },
  async getSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get(INTERNAL_AUTH_COOKIE_NAME)?.value;

    if (!token) {
      return null;
    }

    const payload = verifyInternalAuthToken(token);

    if (!payload?.userId) {
      return null;
    }

    const user = await postgresAuthRepository.findActiveUserById(payload.userId);

    if (!user) {
      return null;
    }

    return buildSessionFromUser(user);
  },
};
