import { HttpError } from './_errors.js';

const BASE_URL = 'https://api.themoviedb.org/3';
const TIMEOUT_MS = 8000;

// Server-side helper for every TMDB call.
// It returns the parsed JSON on success and throws an HttpError otherwise.
// TMDB's failures are mapped to the status codes our own clients should see:
// the browser is never told about TMDB's status directly.
export default async function tmdbFetch(path, params = {}) {
    const token = process.env.TMDB_READ_ACCESS_TOKEN;

    if(!token) {
        console.error('TMDB_READ_ACCESS_TOKEN is not set');
        throw new HttpError(500, 'CONFIG', 'Something went wrong');
    }

    const url = new URL(BASE_URL + path);
    url.search = new URLSearchParams(params).toString();

    let response;
    try {
        response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                accept: 'application/json',
            },
            signal: AbortSignal.timeout(TIMEOUT_MS),
        });
    } catch(error) {
        // Network failure or timeout: TMDB never answered
        console.error(`TMDB request to ${path} failed:`, error);
        throw new HttpError(504, 'UPSTREAM_TIMEOUT', 'Movie service did not respond');
    }

    if(!response.ok) {
        console.error(`TMDB request to ${path} failed: ${response.status} - ${response.statusText}`);

        switch(response.status) {
            // Our token is wrong: a server misconfiguration, not the client's fault
            case 401:
                throw new HttpError(500, 'CONFIG', 'Something went wrong');
            case 404:
                throw new HttpError(404, 'NOT_FOUND', 'Movie not found');
            case 429:
                throw new HttpError(503, 'RATE_LIMITED', 'Movie service is busy, try again shortly');
            default:
                throw new HttpError(502, 'UPSTREAM_ERROR', 'Movie service unavailable');
        }
    }

    return response.json();
}
