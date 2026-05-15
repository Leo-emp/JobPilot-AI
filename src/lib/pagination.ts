/* ============================================================
   PAGINATION UTILITY - Cursor-Based Pagination
   ============================================================
   Shared helper for all list API endpoints. Uses cursor-based
   pagination (more efficient than offset for large datasets).

   Query params:
   - cursor: ID of the last item from the previous page
   - limit: items per page (default 20, max 100)
   - sort: field to sort by (default "createdAt")
   - order: "asc" or "desc" (default "desc")

   Response shape:
   { data: [...], nextCursor: "xxx" | null, hasMore: boolean }
   ============================================================ */

/* # Parse pagination params from URL search params */
export function parsePaginationParams(url: string) {
  const { searchParams } = new URL(url);

  const cursor = searchParams.get("cursor") || undefined;
  const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "20", 10) || 20, 1), 100);
  const sort = searchParams.get("sort") || "createdAt";
  const order = searchParams.get("order") === "asc" ? "asc" : "desc";

  return { cursor, limit, sort, order: order as "asc" | "desc" };
}

/* # Build Prisma findMany args for cursor pagination */
export function buildPaginationQuery(params: {
  cursor?: string;
  limit: number;
  sort: string;
  order: "asc" | "desc";
  allowedSorts?: string[];
}) {
  const { cursor, limit, sort, order, allowedSorts } = params;

  /* # Validate sort field against allowed list (prevent injection) */
  const safeSort = allowedSorts?.includes(sort) ? sort : "createdAt";

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const query: any = {
    take: limit + 1,
    orderBy: { [safeSort]: order },
  };

  /* # If cursor provided, skip that item and start from the next */
  if (cursor) {
    query.skip = 1;
    query.cursor = { id: cursor };
  }

  return query;
}

/* # Format the response with pagination metadata */
export function paginatedResponse<T extends { id: string }>(items: T[], limit: number) {
  const hasMore = items.length > limit;
  const data = hasMore ? items.slice(0, limit) : items;
  const nextCursor = hasMore ? data[data.length - 1].id : null;

  return { data, nextCursor, hasMore };
}
