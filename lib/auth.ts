import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import api from "./api";
import { Role } from "./types";

export const { signIn, signOut, auth, handlers } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials) return null;
        const response = await api.post("/login", {
          email: credentials.email,
          password: credentials.password,
        });
        const token = await response.data.token;

        if (token) {
          return {
            id: response.data.user.id,
            first_name: response.data.user.first_name,
            last_name: response.data.user.last_name,
            email: response.data.user.email,
            role: response.data.user.role,
            api_token: token,
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.first_name = user.first_name;
        token.last_name = user.last_name;
        token.email = user.email;
        token.role = user.role;
        token.api_token = user.api_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.user.first_name = token.first_name as string;
      session.user.last_name = token.last_name as string;
      session.user.role = token.role as Role;
      session.user.api_token = token.api_token as string;
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 Day
  },
});
