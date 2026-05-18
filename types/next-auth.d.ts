// types/next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    user: {
      id?: string;
      email?: string | null;
      name?: string | null;
      roles?: string[];
      isAdmin?: boolean;
      isDoctor?: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    name?: string;
    accessToken?: string;
    refreshToken?: string;
    roles?: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    sub?: string;
    email?: string | null;
    name?: string | null;
    roles?: string[];
  }
}