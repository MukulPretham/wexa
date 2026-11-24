import { randomBytes } from "node:crypto";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { compare, hash } from "bcryptjs";
import { prisma } from "@/lib/db";

export const SESSION_COOKIE_NAME = "stockflow_session";

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;
const BCRYPT_ROUNDS = 10;

export type SessionUser = {
  id: string;
  email: string;
  organizationId: string;
};

export type SessionOrganization = {
  id: string;
  name: string;
  defaultLowStockThreshold: number;
};

export type AuthSession = {
  user: SessionUser;
  organization: SessionOrganization;
};

export function hashPassword(password: string): Promise<string> {
  return hash(password, BCRYPT_ROUNDS);
}

export function verifyPassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  return compare(password, passwordHash);
}

export const getSession = cache(async (): Promise<AuthSession | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const session = await prisma.session.findUnique({
    where: { token },
    include: {
      user: {
        include: {
          organization: true,
        },
      },
    },
  });

  if (!session) {
    return null;
  }

  if (session.expiresAt.getTime() <= Date.now()) {
    await prisma.session.delete({ where: { id: session.id } }).catch(() => {
      // The session may already have been removed by a concurrent request.
    });
    return null;
  }

  return {
    user: {
      id: session.user.id,
      email: session.user.email,
      organizationId: session.user.organizationId,
    },
    organization: {
      id: session.user.organization.id,
      name: session.user.organization.name,
      defaultLowStockThreshold:
        session.user.organization.defaultLowStockThreshold,
    },
  };
});

export async function requireSession(): Promise<AuthSession> {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}

export async function createUserSession(userId: string): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await prisma.session.create({
    data: { token, userId, expiresAt },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    await prisma.session.deleteMany({ where: { token } });
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}
