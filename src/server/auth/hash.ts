import "server-only";

import { createHash, createHmac, timingSafeEqual } from "node:crypto";

const INTERNAL_AUTH_SECRET_FALLBACK = "laudos-app-internal-auth-dev";

function getInternalAuthSecret() {
  return (
    process.env.INTERNAL_AUTH_SECRET?.trim() || INTERNAL_AUTH_SECRET_FALLBACK
  );
}

export function hashPassword(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function comparePasswordHash(value: string, expectedHash: string) {
  const currentHash = Buffer.from(hashPassword(value));
  const referenceHash = Buffer.from(expectedHash);

  if (currentHash.length !== referenceHash.length) {
    return false;
  }

  return timingSafeEqual(currentHash, referenceHash);
}

export function signInternalAuthToken(userId: string) {
  const payload = JSON.stringify({
    userId,
    issuedAt: Date.now(),
  });

  const payloadBase64 = Buffer.from(payload).toString("base64url");
  const signature = createHmac("sha256", getInternalAuthSecret())
    .update(payloadBase64)
    .digest("base64url");

  return `${payloadBase64}.${signature}`;
}

export function verifyInternalAuthToken(token: string) {
  const [payloadBase64, signature] = token.split(".");

  if (!payloadBase64 || !signature) {
    return null;
  }

  const expectedSignature = createHmac("sha256", getInternalAuthSecret())
    .update(payloadBase64)
    .digest("base64url");

  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (providedBuffer.length !== expectedBuffer.length) {
    return null;
  }

  if (!timingSafeEqual(providedBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(payloadBase64, "base64url").toString("utf8"),
    ) as {
      userId?: string;
      issuedAt?: number;
    };

    if (!payload.userId) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
