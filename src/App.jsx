import React, { useEffect, useState } from "react";
import "./App.css";

const API_KEY = "1131f406a8e18ce486213707f11de5e5";
const BASE_URL = "https://api.themoviedb.org/3";

const GENRES = {
  action: 28,
  comedy: 35,
  horror: 27,
  thriller: 53,
};

const MovieSearchWithFilters = () => {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("latest");

  const fetchMovies = async ({ q = "", filter = "latest" } = {}) => {
    setLoading(true);
    setError("");

    try {
      let url = "";

      if (q && q.trim()) {
        url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
          q.trim()
        )}`;
      } else if (filter === "latest") {
        url = `${BASE_URL}/movie/now_playing?api_key=${API_KEY}`;
      } else {
        const genreId = GENRES[filter];
        url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&sort_by=popularity.desc`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch movies");
      const data = await res.json();
      setMovies(data.results || []);
    } catch (e) {
      setError(e.message || "Something went wrong");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!query) {
      fetchMovies({ filter: activeFilter });
    }
  }, [activeFilter]);

  useEffect(() => {
    const id = setTimeout(() => {
      fetchMovies({ q: query, filter: activeFilter });
    }, 500);
    return () => clearTimeout(id);
  }, [query]);

  return (
    <div className="movie-app">
      {/* Header */}
      <header className="movie-header">
        <div className="logo">Movies Headquarter</div>
        <div className="controls">
          <input
            type="text"
            placeholder="🔍 Search movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-bar"
          />
          <div className="button-group">
            <button
              onClick={() => {
                setActiveFilter("latest");
                setQuery("");
              }}
              className={activeFilter === "latest" ? "active" : ""}
            >
              Latest
            </button>
            <button
              onClick={() => {
                setActiveFilter("horror");
                setQuery("");
              }}
              className={activeFilter === "horror" ? "active" : ""}
            >
              Horror
            </button>
            <button
              onClick={() => {
                setActiveFilter("comedy");
                setQuery("");
              }}
              className={activeFilter === "comedy" ? "active" : ""}
            >
              Comedy
            </button>
            <button
              onClick={() => {
                setActiveFilter("thriller");
                setQuery("");
              }}
              className={activeFilter === "thriller" ? "active" : ""}
            >
              Thriller
            </button>
            <button
              onClick={() => {
                setActiveFilter("action");
                setQuery("");
              }}
              className={activeFilter === "action" ? "active" : ""}
            >
              Action
            </button>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="movie-body">
        {loading && <p className="loading">Loading…</p>}
        {error && <p className="error">⚠️ {error}</p>}

        {!loading && !error && (
          <>
            {movies.length === 0 ? (
              <p className="no-results">No movies found</p>
            ) : (
              <div className="movie-grid">
                {movies.map((m) => (
                  <div key={m.id} className="movie-card">
                    {m.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w300${m.poster_path}`}
                        alt={m.title}
                        className="movie-poster"
                      />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                    <div className="movie-info">
                      <h4 className="movie-title">{m.title}</h4>
                      {m.overview ? (
                        <p className="movie-overview">
                          {m.overview.length > 120
                            ? m.overview.slice(0, 120) + "..."
                            : m.overview}
                        </p>
                      ) : (
                        <p className="movie-overview">No description available.</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default MovieSearchWithFilters;
