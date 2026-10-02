const express = require("express");
const app = express();

const PORT = process.env.PORT || 7000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

const movies = [
  {
    id: "tt0111161",
    type: "movie",
    name: "The Shawshank Redemption",
    poster: "https://image.tmdb.org/t/p/w500/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg",
    description: "Two imprisoned men bond over many years, finding solace and eventual redemption."
  },
  {
    id: "tt0468569",
    type: "movie",
    name: "The Dark Knight",
    poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    description: "Batman faces a criminal mastermind who plunges Gotham into chaos."
  }
];

const series = [
  {
    id: "tt0903747",
    type: "series",
    name: "Breaking Bad",
    poster: "https://image.tmdb.org/t/p/w500/ztkUQFLlC9fJZQY9V5jQZQZQZQZ.jpg",
    description: "A chemistry teacher turns to manufacturing illegal drugs after a life-changing diagnosis."
  },
  {
    id: "tt0944947",
    type: "series",
    name: "Game of Thrones",
    poster: "https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg",
    description: "Nine noble families fight for control over the lands of Westeros."
  }
];

const catalog = [...movies, ...series];

app.get("/manifest.json", (req, res) => {
  res.json({
    id: "org.gafoor.catalog",
    version: "1.0.0",
    name: "My Movie Catalog",
    description: "A simple catalog-only Stremio addon for movies and series.",
    logo: "https://www.stremio.com/website/stremio-logo-small.png",
    resources: ["catalog", "meta"],
    types: ["movie", "series"],
    catalogs: [
      { type: "movie", id: "my_movies", name: "My Movies" },
      { type: "series", id: "my_series", name: "My Series" }
    ],
    idPrefixes: ["tt"]
  });
});

app.get("/catalog/:type/:id.json", (req, res) => {
  const { type, id } = req.params;
  const items = id === "my_movies" ? movies : id === "my_series" ? series : [];
  res.json({ metas: items.map(x => ({
    id: x.id, type: x.type, name: x.name, poster: x.poster, description: x.description
  }))});
});

app.get("/meta/:type/:id.json", (req, res) => {
  const item = catalog.find(x => x.id === req.params.id && x.type === req.params.type);
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json({ meta: item });
});

app.listen(PORT, () => console.log(`Stremio addon running at ${BASE_URL}`));
