import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    api_token: string;
  }

  interface Session {
    user: User;
  }
}
