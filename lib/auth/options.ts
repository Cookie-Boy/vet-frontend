import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Используем ту же логику, что и в route.ts, но без HTTP запроса
          const params = new URLSearchParams({
            grant_type: 'password',
            client_id: process.env.KEYCLOAK_CLIENT_ID!,
            client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
            username: credentials.email,
            password: credentials.password,
          });

          const response = await fetch(
            `${process.env.KEYCLOAK_BASE_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: params,
            }
          );

          const data = await response.json();

          if (!response.ok) {
            console.error('Keycloak error:', data.error_description || 'Invalid credentials');
            return null;
          }

          const tokenParts = data.access_token.split('.');
          const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
          const roles: string[] = [];
          if (payload.realm_access?.roles) {
            roles.push(...payload.realm_access.roles);
          }

          return {
            id: payload.sub,
            email: payload.email,
            name: payload.name || payload.preferred_username || payload.email,
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            roles: roles,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.sub = user.id;
        token.email = user.email;
        token.name = user.name;
        token.roles = user.roles || [];
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      if (session.user) {
        session.user.id = token.sub;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.roles = token.roles || [];
        session.user.isAdmin = token.roles?.includes('ADMIN') || false;
        session.user.isDoctor = token.roles?.includes('DOCTOR') || false;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};