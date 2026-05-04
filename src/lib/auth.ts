/* ============================================================
   AUTH CONFIG - NextAuth.js Configuration
   ============================================================
   Sets up authentication with email/password (Credentials provider).
   Uses bcrypt to verify hashed passwords against the database.
   JWT strategy stores user session in a signed cookie (no session DB needed).
   ============================================================ */

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  /* ---- Auth Providers ---- */
  /* Credentials provider = email + password login form */
  /* You can add Google, GitHub, etc. providers here later */
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      /* authorize() runs when the user submits the login form */
      /* It checks the email/password against the database */
      async authorize(credentials) {
        /* Validate that both fields were provided */
        if (!credentials?.email || !credentials?.password) {
          return null; // null = login failed
        }

        /* Look up the user by email */
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        /* If no user found, login fails */
        if (!user) return null;

        /* Compare the provided password with the stored hash */
        /* bcrypt.compare() handles the salt automatically */
        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        /* If password doesn't match, login fails */
        if (!passwordMatch) return null;

        /* Return the user object — this becomes the session */
        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],

  /* ---- Session Strategy ---- */
  /* JWT = JSON Web Token stored in a cookie (stateless, no DB session table) */
  session: {
    strategy: "jwt",
  },

  /* ---- Callbacks ---- */
  /* These run at specific points in the auth flow */
  callbacks: {
    /* jwt() runs when a JWT is created or updated */
    /* We add the user ID to the token so we can access it later */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    /* session() runs when the session is checked (useSession, auth()) */
    /* We copy the user ID from the token into the session object */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  /* ---- Custom Pages ---- */
  /* Override the default NextAuth login page with our space-themed one */
  pages: {
    signIn: "/login",
  },
});
