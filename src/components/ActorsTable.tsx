import React, { useEffect, useMemo, useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { useDevice, type DeviceInfo } from "../hooks/useDevice";
import { ActorPlaceholder } from "./ActorPlaceholder";
import { SkeletonRow } from "./Skeleton/SkeletonRow";
import { SkeletonHeader } from "./Skeleton/SkeletonHeader";
import AnimatedStars from "./AnimatedStars";
import { Logo } from "./Logo";
import "../index.css";

type Appearance = {
  title: string;
  year: number;
  poster: string;
  runtime: number;
};

type Actor = {
  id: number;
  name: string;
  image: string | null;
  appearances: Appearance[];
};

type Movie = {
  title: string;
  year: number;
  runtime: number;
  poster: string;
  rating: number;
  overview: string;
  actors: {
    id: number;
    name: string;
    image: string | null;
    minutes: number;
    character: string;
  }[];
};

export default function ActorsTable() {
  const [actors, setActors] = useState<Actor[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<string | null>(null);

  // ✅ Sorting state (default: most movies first)
  const [sortBy, setSortBy] = useState<"name" | "movies" | null>("movies");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 200);

  // ✅ Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;

  useEffect(() => {
    Promise.all([
      fetch("/data/actors.json").then((res) => res.json()),
      fetch("/data/movies.json").then((res) => res.json()),
    ]).then(([actorsData, moviesData]) => {
      setActors(actorsData);
      setMovies(moviesData);
      setTimeout(() => setLoading(false), 1000);
    });
  }, []);

  const displayedActors = useMemo(() => {
    let list = [...actors];

    // Filter by selected movie
    if (selectedMovie) {
      const movie = movies.find((m) => m.title === selectedMovie);
      if (movie) {
        list = list.filter((actor) => movie.actors.some((a) => a.id === actor.id));
      }
    }

    // Filter by search
    if (debouncedSearch) {
      list = list.filter((actor) => {
        const inActorName = actor.name.toLowerCase().includes(debouncedSearch.toLowerCase());
        const inMovies = actor.appearances.some((app) =>
          app.title.toLowerCase().includes(debouncedSearch.toLowerCase())
        );
        return inActorName || inMovies;
      });
    }

    // ✅ Sorting
    if (sortBy === "name") {
      list.sort((a, b) =>
        sortDir === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      );
    } else if (sortBy === "movies") {
      list.sort((a, b) =>
        sortDir === "asc"
          ? a.appearances.length - b.appearances.length
          : b.appearances.length - a.appearances.length
      );
    }

    return list;
  }, [actors, movies, selectedMovie, sortBy, sortDir, debouncedSearch]);

  // ✅ Pagination logic
  const totalPages = Math.ceil(displayedActors.length / rowsPerPage);
  const paginatedActors = displayedActors.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedMovie, sortBy, sortDir]);

  // ✅ Toggle sort functions
  const toggleNameSort = () => {
    if (sortBy !== "name") {
      setSortBy("name");
      setSortDir("asc");
    } else if (sortDir === "asc") {
      setSortDir("desc");
    } else if (sortDir === "desc") {
      setSortBy(null);
      setSortDir("asc");
    }
  };

  const toggleMoviesSort = () => {
    if (sortBy !== "movies") {
      setSortBy("movies");
      setSortDir("asc");
    } else if (sortDir === "asc") {
      setSortDir("desc");
    } else if (sortDir === "desc") {
      setSortBy(null);
      setSortDir("asc");
    }
  };

  const { isMobile, isDesktop, isTablet, screenWidth }: DeviceInfo = useDevice();

  return (
    <div className="w-full py-10 px-6 bg-wesYellow relative text-wesBrown rounded-lg border-2 border-wesBrown shadow-lg ">
      {(isMobile || isTablet) && (
        <img
          src="/images/wes-head.png"
          alt="Wes Anderson Head"
          width={80}
          height={80}
          className="mx-auto mb-2"
        />
      )}
      <div className="flex justify-center items-center gap-6">
        <Logo width={70} height={70} />
        <h1 className="text-4xl font-bold text-wesBrown w-fit h-fit wes-title">
          Pastel Actors: The Wes Anderson Cast Database
        </h1>
      </div>
      {isDesktop && screenWidth > 1350 && !selectedMovie && (
        <img
          height={400}
          width={150}
          className="absolute right-80 top-32 z-0 hover:top-24 transition-all"
          src="/images/wes.png"
          alt="Wes Anderson Cameo"
        />
      )}
      {/*Animated Stars*/}
      <div className="flex justify-center my-4">
        <AnimatedStars autoPlayOnLoad={!loading} />
      </div>

      {/* Search */}
      <div className="mb-4 w-64 mx-auto">
        <input
          type="text"
          placeholder="Search actors or movies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 py-2 border border-wesBrown rounded w-full"
        />
      </div>
      {selectedMovie &&
        (() => {
          const movie = movies.find((m) => m.title === selectedMovie);
          if (!movie) return null;
          return (
            <div className="relative mb-6 max-w-3xl mx-auto bg-wesPeach border border-wesBrown rounded-lg p-4 shadow-md">
              <button
                onClick={() => setSelectedMovie(null)}
                className="absolute top-4 right-4 h-auto text-wesBrown hover:text-wesRed text-base font-bold leading-none"
                aria-label="Close"
              >
                X
              </button>
              <div className="flex flex-col items-center sm:flex-row gap-4">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-24 h-auto border border-wesBrown rounded shadow-sm"
                />
                <div>
                  <h2 className="text-2xl font-bold">
                    {movie.title} ({movie.year})
                  </h2>
                  <p className="text-lg">⭐ {movie.rating} / 10</p>
                  <p className="mt-2 text-sm leading-snug">{movie.overview}</p>
                </div>
              </div>
            </div>
          );
        })()}
      <div className="overflow-x-auto w-full">
        <table className="w-full border z-20 relative bg-wesYellow border-wesBrown text-xl">
          <thead>
            {loading ? (
              <SkeletonHeader columns={11} />
            ) : (
              <tr>
                <th
                  className="p-2 border border-wesBrown bg-wesPink z-10 cursor-pointer select-none"
                  onClick={toggleNameSort}
                >
                  Actor {sortBy === "name" ? (sortDir === "asc" ? "▲" : "▼") : ""}
                </th>
                <th
                  className="p-2 border border-wesBrown bg-wesPink cursor-pointer select-none"
                  onClick={toggleMoviesSort}
                >
                  Total Movies {sortBy === "movies" ? (sortDir === "asc" ? "▲" : "▼") : ""}
                </th>
                {movies.map((movie) => (
                  <th
                    key={movie.title}
                    className={`p-2 border border-wesBrown min-w-[80px] text-center cursor-pointer hover:bg-wesBlue/30 transition ${selectedMovie === movie.title && "bg-wesPink"}`}
                    onClick={() => setSelectedMovie(movie.title)}
                  >
                    <div className="flex flex-col items-center">
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        title={`${movie.title} (${movie.year})`}
                        className="w-14 h-18 object-cover border border-wesBrown shadow-md hover:scale-105 transition-transform duration-200"
                      />
                      <span className="text-lg mt-1">{movie.year}</span>
                    </div>
                  </th>
                ))}
              </tr>
            )}
          </thead>

          <tbody>
            {loading
              ? [...Array(rowsPerPage)].map((_, i) => <SkeletonRow key={i} columns={11} />)
              : paginatedActors.map((actor) => (
                  <tr key={actor.id} className="hover:bg-wesBlue/20 transition">
                    {/* Actor Name */}
                    <td className="p-2 border border-wesBrown font-semibold">
                      <div className="flex items-center space-x-2 w-full">
                        {actor.image ? (
                          <img
                            src={actor.image}
                            alt={actor.name}
                            title={actor.name}
                            className="w-8 h-8 rounded-full border border-wesBrown object-cover"
                          />
                        ) : (
                          <ActorPlaceholder name={actor.name} actorId={actor.id} size={32} />
                        )}
                        <span className="w-full truncate">{actor.name}</span>
                      </div>
                    </td>
                    <td className="p-2 border border-wesBrown text-center font-bold">
                      <span className="px-3 py-1 bg-wesPeach rounded-full border border-wesBrown font-bold shadow-sm">
                        {actor.appearances.length}
                      </span>
                    </td>
                    {movies.map((movie) => {
                      return (
                        <td
                          key={movie.title + actor.id}
                          className="p-2 border border-wesBrown text-center"
                        >
                          {(() => {
                            const actorInMovie = movie.actors.find((a) => a.id === actor.id);
                            if (!actorInMovie) return null;

                            return actor.image ? (
                              <div className="relative group w-fit mx-auto">
                                <img
                                  src={actor.image}
                                  alt={actor.name}
                                  className="w-10 h-10 rounded-full border-[2px] border-wesBrown object-cover shadow-sm hover:scale-110 hover:rotate-2 transition-transform duration-200"
                                />
                                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-wesPink text-wesBrown font-bold text-base px-3 py-1 rounded border border-wesBrown shadow-sm pointer-events-none opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 whitespace-nowrap z-20">
                                  {actorInMovie.character}
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-6 border-l-transparent border-r-6 border-r-transparent border-t-6 border-t-wesPink"></div>
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-wesBrown -z-10 translate-y-[1px]"></div>
                                </div>
                              </div>
                            ) : (
                              <div className="relative group w-fit mx-auto">
                                <ActorPlaceholder name={actor.name} actorId={actor.id} size={40} />
                                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-wesPink text-wesBrown font-bold text-base px-3 py-1 rounded border border-wesBrown shadow-sm pointer-events-none opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 whitespace-nowrap z-20">
                                  {actorInMovie.character}
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-6 border-l-transparent border-r-6 border-r-transparent border-t-6 border-t-wesPink"></div>
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-wesBrown -z-10 translate-y-[1px]"></div>
                                </div>
                              </div>
                            );
                          })()}
                        </td>
                      );
                    })}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {paginatedActors.length > 0 && (
        <div className="flex justify-center items-center gap-4 z-10 bg-wesYellow mt-6 font-bold text-lg">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-[#f6c6b8] border border-wesBrown rounded-full shadow-md
                   hover:bg-[#f4bfa8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          <span className="px-6 py-2 bg-wesPeach border border-wesBrown rounded-lg shadow-sm">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-[#f6c6b8] border border-wesBrown rounded-full shadow-md
                   hover:bg-[#f4bfa8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
      <div className="absolute right-10">
        Made by{" "}
        <a className="underline" href="https://billykonstas.com">
          billykonstas
        </a>{" "}
        with ☕
      </div>
    </div>
  );
}
