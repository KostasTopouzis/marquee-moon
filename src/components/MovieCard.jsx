export default function MovieCard({ movie }) {
    function onFavoriteClick() {
        alert('Clicked');
    }
    
    return(
        <div className="flex flex-row">
            <div className="movie-poster">
                <img src={movie.imageUrl} alt={movie.title} />
                <div className="movie-overlay">
                    <button className="favorite-btn" onClick={onFavoriteClick}>
                        Like
                    </button>
                </div>
            </div>

            <div className="movie-info">
                <h3>{movie.title}</h3>
                <p>{movie.release_date}</p>
            </div>
        </div>
    );
}