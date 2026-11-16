import MovieCard from '../components/MovieCard';
import { useState, useEffect, useRef } from 'react';
import { ApiError, getPopularMovies, searchMovies } from '../services/api';

// Decides what the user sees when a request fails.
// The service layer reports what went wrong; this page decides how to say it.
function toErrorMessage(err, fallback) {
    if(err instanceof ApiError) {
        // 400 messages come from our own input validation and are safe to show
        if(err.status === 400) return err.message;
        if(err.status === 503) return 'The movie service is busy. Try again in a moment.';
        if(err.status >= 500) return 'The movie service is having trouble. Try again later.';
        return fallback;
    }

    // fetch rejects with a TypeError when the server can't be reached at all
    if(err instanceof TypeError) return 'Could not reach the server. Check your connection.';

    return fallback;
}

export default function Home() {
    const [searchQuery, setSearchQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    // The query whose results are on screen. Unlike searchQuery, it only changes
    // when a search succeeds, so typing in the box doesn't affect the grid.
    // An empty string means the grid shows popular movies.
    const [activeQuery, setActiveQuery] = useState('');

    // The controller of the request currently in flight (popular movies or a search).
    // Only one request's results should ever reach the grid, so starting a new one
    // cancels the previous one. A slow, older response can't overwrite a newer one.
    const requestRef = useRef(null);

    function startRequest() {
        requestRef.current?.abort();
        const controller = new AbortController();
        requestRef.current = controller;
        return controller;
    }

    useEffect(() => {
        const controller = startRequest();

        const loadPopularMovies = async () => {
            try {
                const popularMovies = await getPopularMovies(controller.signal);
                setMovies(popularMovies);
                setError(null);
            } catch(err) {
                // A cancelled request isn't a failure. In development, StrictMode
                // runs this effect twice and the cleanup aborts the first request.
                if(err.name === 'AbortError')
                    return;

                console.error(err);
                setError(toErrorMessage(err, 'Failed to load movies.'));
            } finally {
                if(!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        loadPopularMovies();

        // Cleanup on unmount: cancel whichever request is still running
        return () => requestRef.current?.abort();
    }, []);

    const handleSearch = async (event) => {
        event.preventDefault();

        const query = searchQuery.trim();

        // Submitting an empty box after a search goes back to popular movies
        if(!query && !activeQuery)
            return;

        // Supersedes any request still running, including a newer search
        const controller = startRequest();

        setLoading(true);
        setError(null);
        try {
            const results = query
                ? await searchMovies(query, controller.signal)
                : await getPopularMovies(controller.signal);
            setMovies(results);
            setActiveQuery(query);
        } catch(err) {
            if(err.name === 'AbortError')
                return;

            console.error(err);
            setError(toErrorMessage(err, query ? 'Failed to search movies.' : 'Failed to load movies.'));
        } finally {
            if(!controller.signal.aborted) {
                setLoading(false);
            }
        }
    }

    return (
        <div className="flex flex-col gap-12 sm:gap-16">
            <section className="flex flex-col gap-6 max-w-3xl">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-marquee">Now showing</p>
                <h1 className="font-display text-4xl sm:text-6xl leading-tight text-paper">
                    Find your next picture.
                </h1>
                <form onSubmit={handleSearch} role="search" className="flex flex-col sm:flex-row gap-3">
                    <label htmlFor="movie-search" className="sr-only">Search for movies</label>
                    <input
                        id="movie-search"
                        type="search"
                        placeholder="Search for movies..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 min-w-0 rounded-sm border border-line bg-surface px-4 py-3 text-paper placeholder:text-muted/70 focus:border-marquee focus:outline-none"
                    />
                    <button
                        type="submit"
                        className="rounded-sm bg-marquee px-6 py-3 font-medium text-ink transition-colors hover:bg-marquee-hover"
                    >
                        Search
                    </button>
                </form>
            </section>

            <section aria-labelledby="results-heading" className="flex flex-col gap-8">
                <div className="flex items-baseline justify-between gap-4 border-b border-line pb-4">
                    <h2 id="results-heading" className="font-display text-2xl sm:text-3xl text-paper">
                        {activeQuery ? <>Results for &ldquo;{activeQuery}&rdquo;</> : 'All films'}
                    </h2>
                    <p className="text-sm text-muted" aria-live="polite">
                        {movies.length} {movies.length === 1 ? 'title' : 'titles'}
                    </p>
                </div>

                {error && <div role="alert">{error}</div>}

                {loading ? (<div className="py-16 text-center text-muted">Loading...</div>) : (
                    movies.length > 0 ? (
                        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-10 md:gap-x-6">
                            {movies.map((movie) => (
                                <li key={'movie-' + movie.id}>
                                    <MovieCard movie={movie} />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        !error && (
                            <p className="py-16 text-center text-muted">
                                {activeQuery
                                    ? <>No films match &ldquo;{activeQuery}&rdquo;. Try a different title.</>
                                    : 'No films to show right now.'}
                            </p>
                        )
                    ))}
            </section>
        </div>
    );
}
