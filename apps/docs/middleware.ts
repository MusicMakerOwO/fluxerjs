import { rewrite } from '@vercel/functions';

/**
 * Edge middleware: rewrite SPA routes to index.html with 200 status (not 404).
 * This allows AI crawlers and search engines to index our client-side routes.
 * Static assets (assets/, docs/, etc.) pass through normally.
 */
export const config = {
  matcher: [
    /*
     * Match SPA routes - exclude static assets (/assets/, /docs/) and common files.
     * This rewrite returns 200 so AI crawlers can index client-side routes.
     */
    '/((?!assets/|docs/|favicon\\.ico|index\\.html|404\\.html).*)',
  ],
};

export default function middleware(request: Request) {
  const url = new URL(request.url);
  return rewrite(new URL('/index.html', url.origin));
}
