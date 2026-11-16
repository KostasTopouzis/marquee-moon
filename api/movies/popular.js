import tmdbFetch from '../_tmdb.js';
import { toErrorResponse } from '../_errors.js';

// GET /api/movies/popular
// The popular-movies collection. Takes no parameters.
export async function GET() {
    try {
        const data = await tmdbFetch('/movie/popular');

        // Popular movies change slowly: let Vercel's CDN cache the response
        // for an hour and serve a stale copy for up to a day while refreshing
        return Response.json(data, {
            headers: { 'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400' },
        });
    } catch(error) {
        return toErrorResponse(error);
    }
}
