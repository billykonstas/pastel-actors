import axios from "axios";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TMDB_KEY = process.env.TMDB_API_KEY;
const OUTPUT_DIR = path.resolve(__dirname, "../public/data");

const MOVIES = [
  1137350, // The Phoenician Scheme
  747188, // Asteroid City
  542178, // The French Dispatch
  399174, // Isle of Dogs
  120467, // The Grand Budapest Hotel
  83666, // Moonrise Kingdom
  10315, // Fantastic Mr. Fox
  4538, // The Darjeeling Limited
  421, // The Life Aquatic with Steve Zissou
  9428, // The Royal Tenenbaums
  11545, // Rushmore
  13685, // Bottle Rocket
];

async function fetchMovie(id) {
  const { data } = await axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
    params: {
      api_key: TMDB_KEY,
      append_to_response: "credits",
    },
  });
  return data;
}

async function generateData() {
  const actorsMap = {};
  const moviesList = [];

  for (const id of MOVIES) {
    const movie = await fetchMovie(id);
    const movieData = {
      title: movie.title,
      year: parseInt(movie.release_date),
      runtime: movie.runtime,
      poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      actors: [],
    };

    for (const cast of movie.credits.cast) {
      const actorId = cast.id;
      const actorData = {
        id: actorId,
        name: cast.name,
        character: cast.character,
        image: cast.profile_path ? `https://image.tmdb.org/t/p/w300${cast.profile_path}` : null,
      };

      movieData.actors.push(actorData);

      if (!actorsMap[actorId]) {
        actorsMap[actorId] = {
          id: actorId,
          name: cast.name,
          image: actorData.image,
          appearances: [],
        };
      }
      actorsMap[actorId].appearances.push({
        title: movie.title,
        year: movieData.year,
        runtime: movie.runtime,
        poster: movieData.poster,
      });
    }

    moviesList.push(movieData);
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(OUTPUT_DIR, "actors.json"),
    JSON.stringify(Object.values(actorsMap), null, 2)
  );
  fs.writeFileSync(path.join(OUTPUT_DIR, "movies.json"), JSON.stringify(moviesList, null, 2));

  console.log("✅ Data generated in /public/data/");
}

generateData().catch(console.error);
