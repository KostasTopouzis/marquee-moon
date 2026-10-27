import MovieCard from '../components/MovieCard';
import { useState, useEffect } from 'react';
import { getPopularMovies, searchMovies } from '../services/api';


export default function Home() {
    const [searchQuery, setSearchQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();

        const loadPopularMovies = async () => {
            try {
                const popularMovies = await getPopularMovies(controller.signal);
                setMovies(popularMovies);
            } catch(err) {
                console.error(err);
                setError('Failed to load movies...');
            } finally {
                if(!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        loadPopularMovies();

        return () => controller.abort();

        }, [])

    const filteredMovies = movies.filter((movie) =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSearch = (event) => {
        event.preventDefault();
        alert("Hello");
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
                        {searchQuery ? 'Results' : 'All films'}
                    </h2>
                    <p className="text-sm text-muted" aria-live="polite">
                        {filteredMovies.length} {filteredMovies.length === 1 ? 'title' : 'titles'}
                    </p>
                </div>

                {error && <div>{error}</div>}

                {loading ? (<div className="py-16 text-center text-muted">Loading...</div>) : (
                    filteredMovies.length > 0 ? (
                        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-10 md:gap-x-6">
                            {filteredMovies.map((movie) => (
                                <li key={'movie-' + movie.id}>
                                    <MovieCard movie={movie} />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="py-16 text-center text-muted">
                            No films match &ldquo;{searchQuery}&rdquo;. Try a different title.
                        </p>
                    ))}
            </section>
        </div>
    );
}
