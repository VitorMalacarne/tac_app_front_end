import NextAuth from "next-auth";
import CognitoProvider from "next-auth/providers/cognito";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CognitoProvider({
      clientId: process.env.COGNITO_CLIENT_ID!,
      clientSecret: process.env.COGNITO_CLIENT_SECRET!, // opcional se não usar secret
      issuer: process.env.COGNITO_ISSUER!, // ex: https://seu-domínio.auth.us-east-1.amazoncognito.com
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // salva access_token no token jwt
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
      }
      return token;
    },
    // expõe o accessToken na sessão do cliente
    async session({ session, token }: any) {
      session.accessToken = token.accessToken;
      session.idToken = token.idToken;
      return session;
    },
  },
  // opcional: páginas customizadas
  pages: {
    signIn: "/auth/signin",
  },
};

export default NextAuth(authOptions);
