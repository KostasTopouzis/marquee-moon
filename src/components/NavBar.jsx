import { Link } from 'react-router-dom';

export default function NavBar() {
    return (
        <nav id="navbar" aria-label="Navbar for the Movie App" className="flex gap-5 items-center px-4 h-20 bg-rose-500">
            <div id="navbar-brand" className="">
                <Link to='/'>Movie App</Link>
            </div>
            <div id="navbar-links" className="ml-auto flex gap-3">
                <Link to='/' className="nav-link">Home</Link>
                <Link to='/favorites' className="nav-link">Favorites</Link>
            </div>
        </nav>
    );
}