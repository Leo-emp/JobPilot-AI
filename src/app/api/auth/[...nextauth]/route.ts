/* ============================================================
   AUTH API ROUTE - NextAuth.js Endpoint
   ============================================================
   This catch-all route handles all authentication API requests:
   - POST /api/auth/signin (login)
   - POST /api/auth/signout (logout)
   - GET /api/auth/session (check current session)
   - GET /api/auth/csrf (get CSRF token)
   The [...nextauth] folder name means it catches all sub-paths.
   ============================================================ */

import { handlers } from "@/lib/auth";

/* Export the GET and POST handlers from NextAuth */
/* Next.js App Router uses named exports for HTTP methods */
export const { GET, POST } = handlers;
