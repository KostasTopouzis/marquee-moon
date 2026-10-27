import MovieCard from '../components/MovieCard';
import { useState } from 'react';

const movies = [
    {
        id: 1,
        title: 'John Wick',
        release_date: '2021',
        imageUrl: '../assets/john-wick.jpg'
    },
    {
        id: 2,
        title: 'The Terminator',
        release_date: '1984',
        imageUrl: '../assets/terminator.jpg'
    },
    {
        id: 3,
        title: 'Alien',
        release_date: '1979',
        imageUrl: '../assets/alien.jpg'
    },
    {
        id: 4,
        title: 'Avatar',
        release_date: '2012',
        imageUrl: '../assets/avatar.jpg'
    },
    {
        id: 5,
        title: 'Titanic',
        release_date: '1998',
        imageUrl: '../assets/titanic.jpg'
    }
];

export default function Home() {
    const [searchQuery, setSearchQuery] = useState('');


    const movieCards = movies.map((movie) => (
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) && (
            <MovieCard 
              key={'movie-' + movie.id}
              movie={movie}
            />
        )
    ));

    const handleSearch = (event) => {
        event.preventDefault();
        alert("Hello"); 
    }

    return (
        <div className="flex flex-col gap-40">
            <form onSubmit={handleSearch} className="search-form">
                <input 
                  type="text" 
                  placeholder="Search for movies..." 
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)} 
                />
                <button type="submit" className="search-btn">Search</button>
            </form>

            <div className="flex gap-22">
                {movieCards}
            </div>
        </div>
    );
}