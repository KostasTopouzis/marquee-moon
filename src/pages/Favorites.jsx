import { Link } from 'react-router-dom';

export default function Favorites() {
    return (
        <section className="flex flex-col items-start gap-6 max-w-xl py-16 sm:py-24">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-marquee">Your list</p>
            <h1 className="font-display text-4xl sm:text-5xl leading-tight text-paper">
                No favorite films yet.
            </h1>
            <p className="text-muted">
                Start adding films to your favorites and they will appear here.
            </p>
            <Link
                to='/'
                className="rounded-sm border border-marquee px-5 py-2.5 font-medium text-marquee transition-colors hover:bg-marquee hover:text-ink"
            >
                Browse films
            </Link>
        </section>
    );
}
