const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// The client-side twin of the server's HttpError.
// Exceptions can't cross HTTP, so the server sends a status code and a JSON body,
// and apiFetch() turns them back into an exception here in the browser.
export class ApiError extends Error {
    constructor(status, code, message) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.code = code;
    }
}

// Helper for searchMovies() and getPopularMovies().
// It talks only to our own /api endpoints; the TMDB token stays on the server.
// It is the only part of this module that throws, and errors propagate up to Home.jsx:
// - ApiError when our server answers with an error status
// - TypeError on network failure, AbortError when the request is cancelled
async function apiFetch(path, params = {}, signal) {
    const url = new URL(path, window.location.origin);
    url.search = new URLSearchParams(params).toString();

    const response = await fetch(url, { signal });

    if(!response.ok) {
        // Read the server's error shape; fall back if the body isn't JSON
        const body = await response.json().catch(() => null);
        throw new ApiError(
            response.status,
            body?.error?.code ?? 'UNKNOWN',
            body?.error?.message ?? `Request failed: ${response.status}`
        );
    }

    return response.json();
}

// This helper function converts TMDB's data shape into the shape the MovieCard component expects
function toMovie(rawData) {
    return {
        id: rawData.id,
        title: rawData.title,
        releaseYear: rawData.release_date?.slice(0, 4) ?? '',
        imageUrl: rawData.poster_path ? IMAGE_BASE_URL + rawData.poster_path : null,
    };
}

export async function getPopularMovies(signal) {
    const rawData = await apiFetch('/api/movies/popular', {}, signal);

    return rawData.results.map(toMovie);
}

export async function searchMovies(query, signal) {
    const rawData = await apiFetch('/api/movies', { query }, signal);

    return rawData.results.map(toMovie);
}
