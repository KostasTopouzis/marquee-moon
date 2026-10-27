import MovieCard from '../components/MovieCard';
import { useState } from 'react';
// Mock data: placeholder posters until the TMDB API is connected
import johnWick from '../assets/john-wick.jpg';
import terminator from '../assets/terminator.jpg';
import alien from '../assets/alien.jpg';
import avatar from '../assets/avatar.jpg';
import titanic from '../assets/titanic.jpg';

const movies = [
    {
        id: 1,
        title: 'John Wick',
        release_date: '2021',
        imageUrl: johnWick
    },
    {
        id: 2,
        title: 'The Terminator',
        release_date: '1984',
        imageUrl: terminator
    },
    {
        id: 3,
        title: 'Alien',
        release_date: '1979',
        imageUrl: alien
    },
    {
        id: 4,
        title: 'Avatar',
        release_date: '2012',
        imageUrl: avatar
    },
    {
        id: 5,
        title: 'Titanic',
        release_date: '1998',
        imageUrl: titanic
    }
];

export default function Home() {
    const [searchQuery, setSearchQuery] = useState('');

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

                {filteredMovies.length > 0 ? (
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
                )}
            </section>
        </div>
    );
}
