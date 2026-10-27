const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const TOKEN = import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN;

// Helper function for searchMovies() and getPopularMovies()
// This is the only part of the code in this module that throws an error.
// It is allowed to propagate up to Home.jsx: loadPopularMovies() in useEffect()
// Cleaner structure, easy to follow the exception propagation path 
// and consider its consequences 
async function tmdbFetch(path, params = {}, signal) {
    const url = new URL(BASE_URL + path);

    url.search = new URLSearchParams(params);

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${TOKEN}`,
            accept: 'application/json'
        },
        signal,
    });

    if(!response.ok) {
        throw new Error(`TMDB request failed: ${response.status} - ${response.statusText}`);
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
    const rawData = await tmdbFetch('/movie/popular', {}, signal);

    return rawData.results.map(toMovie);
}

export async function searchMovies(query, signal) {
    const rawData = await tmdbFetch('/search/movie', { query }, signal);

    return rawData.results.map(toMovie);
}