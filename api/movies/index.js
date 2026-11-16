import tmdbFetch from '../_tmdb.js';
import { HttpError, toErrorResponse } from '../_errors.js';

const MAX_QUERY_LENGTH = 100;

// GET /api/movies?query=alien
// The movies collection, filtered by a search term.
// Only the parameters read here are supported; anything else is ignored,
// so this endpoint can't be used as an open proxy to TMDB.
export async function GET(request) {
    try {
        const query = new URL(request.url).searchParams.get('query')?.trim();

        if(!query) {
            throw new HttpError(400, 'MISSING_QUERY', 'A search query is required');
        }

        if(query.length > MAX_QUERY_LENGTH) {
            throw new HttpError(400, 'QUERY_TOO_LONG', `A search query can be at most ${MAX_QUERY_LENGTH} characters`);
        }

        const data = await tmdbFetch('/search/movie', { query });
        return Response.json(data);
    } catch(error) {
        return toErrorResponse(error);
    }
}
