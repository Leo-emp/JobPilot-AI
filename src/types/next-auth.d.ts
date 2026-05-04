/* ============================================================
   NEXTAUTH TYPE EXTENSIONS
   ============================================================
   Extends the default NextAuth types to include our custom fields.
   Without this, TypeScript would complain when we access session.user.id
   because the default Session type doesn't include an "id" field.
   ============================================================ */

import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Our custom user ID from the database
    } & DefaultSession["user"];
  }
}
