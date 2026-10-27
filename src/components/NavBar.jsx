import { Link, NavLink } from 'react-router-dom';

const linkClass = ({ isActive }) =>
    `relative py-2 text-sm font-medium tracking-wide transition-colors motion-reduce:transition-none ${
        isActive ? 'text-paper' : 'text-muted hover:text-paper'
    } after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-marquee after:transition-transform after:origin-left ${
        isActive ? 'after:scale-x-100' : 'after:scale-x-0'
    }`;

export default function NavBar() {
    return (
        <header className="sticky top-0 z-40 bg-ink/90 backdrop-blur border-b border-line">
            <nav id="navbar" aria-label="Main" className="flex items-center gap-6 px-4 sm:px-6 lg:px-8 h-16 sm:h-20 max-w-7xl mx-auto">
                <Link to='/' id="navbar-brand" className="flex items-center gap-2.5 font-display text-2xl text-paper">
                    <span aria-hidden="true" className="size-2.5 rounded-full bg-marquee shadow-[0_0_12px_2px_rgba(242,179,61,0.45)]" />
                    Marquee Moon
                </Link>
                <div id="navbar-links" className="ml-auto flex gap-6">
                    <NavLink to='/' end className={linkClass}>Home</NavLink>
                    <NavLink to='/favorites' className={linkClass}>Favorites</NavLink>
                </div>
            </nav>
        </header>
    );
}
