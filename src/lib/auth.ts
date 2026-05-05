/* ============================================================
   AUTH CONFIG - NextAuth.js Configuration
   ============================================================
   Sets up authentication with three providers:
   1. Credentials — email + password login
   2. Google OAuth — sign in with Google account
   3. LinkedIn OAuth — sign in with LinkedIn account
   JWT strategy stores user session in a signed cookie.
   ============================================================ */

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import LinkedIn from "next-auth/providers/linkedin";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  /* ---- Auth Providers ---- */
  providers: [
    /* Google OAuth — users sign in with their Google account */
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),

    /* LinkedIn OAuth — users sign in with their LinkedIn account */
    LinkedIn({
      clientId: process.env.LINKEDIN_CLIENT_ID || "",
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET || "",
    }),

    /* Credentials — traditional email + password login */
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      /* authorize() runs when the user submits the login form */
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        /* Look up the user by email */
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        /* If no user found or user has no password (OAuth-only account), fail */
        if (!user || !user.password) return null;

        /* Compare the provided password with the stored hash */
        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!passwordMatch) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],

  /* ---- Session Strategy ---- */
  session: {
    strategy: "jwt",
  },

  /* ---- Callbacks ---- */
  callbacks: {
    /* signIn() runs when any provider authenticates a user */
    /* For OAuth providers, we create or link the user in our database */
    async signIn({ user, account }) {
      if (account?.provider === "google" || account?.provider === "linkedin") {
        if (!user.email) return false;

        /* Check if a user with this email already exists */
        let dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        /* If no user exists, create one (no password for OAuth users) */
        if (!dbUser) {
          dbUser = await prisma.user.create({
            data: {
              name: user.name || "User",
              email: user.email,
              image: user.image,
            },
          });
        } else if (!dbUser.image && user.image) {
          /* Update profile image if user exists but doesn't have one */
          await prisma.user.update({
            where: { id: dbUser.id },
            data: { image: user.image },
          });
        }

        /* Link the OAuth account to the user if not already linked */
        const existingAccount = await prisma.account.findUnique({
          where: {
            provider_providerAccountId: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
          },
        });

        if (!existingAccount) {
          await prisma.account.create({
            data: {
              userId: dbUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token,
              refresh_token: account.refresh_token,
              expires_at: account.expires_at,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
            },
          });
        }

        /* Attach the database user ID so the jwt callback can use it */
        user.id = dbUser.id;
      }

      return true;
    },

    /* jwt() runs when a JWT is created or updated */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    /* session() runs when the session is checked */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  /* ---- Custom Pages ---- */
  pages: {
    signIn: "/login",
  },
});
