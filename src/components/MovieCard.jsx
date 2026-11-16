import { useState } from 'react';

export default function MovieCard({ movie }) {
    // True when TMDB has no poster for this film, or when the image fails to load
    const [posterFailed, setPosterFailed] = useState(false);
    const showPoster = movie.imageUrl && !posterFailed;

    function onFavoriteClick() {
        alert('Clicked');
    }

    return (
        <article className="group flex flex-col gap-3">
            <div className="relative aspect-[2/3] overflow-hidden rounded-sm bg-surface ring-1 ring-line">
                {showPoster ? (
                    <img
                        src={movie.imageUrl}
                        alt={`Poster for ${movie.title}`}
                        loading="lazy"
                        onError={() => setPosterFailed(true)}
                        className="size-full object-cover transition duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                ) : (
                    // The title is already in the card's heading, so screen readers skip this
                    <div aria-hidden="true" className="flex size-full flex-col items-center justify-center gap-3 bg-surface-raised p-4 text-center">
                        <span className="font-display text-xl leading-tight text-paper/80 line-clamp-4">
                            {movie.title}
                        </span>
                        <span className="text-xs uppercase tracking-[0.2em] text-muted">No poster</span>
                    </div>
                )}
                <div className="absolute inset-x-0 bottom-0 flex justify-center bg-linear-to-t from-ink/90 to-transparent p-4 pt-12 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
                    <button
                        type="button"
                        onClick={onFavoriteClick}
                        aria-label={`Add ${movie.title} to favorites`}
                        className="rounded-full border border-marquee px-4 py-1.5 text-sm font-medium text-marquee transition-colors hover:bg-marquee hover:text-ink"
                    >
                        Add to favorites
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-0.5">
                <h3 className="text-base sm:text-lg font-medium leading-snug text-paper">{movie.title}</h3>
                <p className="text-sm text-muted">{movie.releaseYear}</p>
            </div>
        </article>
    );
}
