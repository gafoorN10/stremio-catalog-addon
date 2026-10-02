const express = require("express");
const app = express();

const PORT = process.env.PORT || 7000;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

const movies = [
  {
    id: "tt0111161",
    type: "movie",
    name: "The Shawshank Redemption",
    poster: "https://image.tmdb.org/t/p/w500/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg"
  },
  {
    id: "tt0468569",
    type: "movie",
    name: "The Dark Knight",
    poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg"
  }
];

const series = [
  {
    id: "tt0903747",
    type: "series",
    name: "Breaking Bad",
    poster: "https://image.tmdb.org/t/p/w500/ztkUQFLlC9fJZQY9V5jQZQZQZQZ.jpg"
  },
  {
    id: "tt0944947",
    type: "series",
    name: "Game of Thrones",
    poster: "https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg"
  }
];

const catalog = [...movies, ...series];

app.get("/", (req, res) => {
  res.send("Stremio Catalog Addon is running!");
});

app.get("/manifest.json", (req, res) => {
  res.json({
    id: "org.gafoor.catalog",
    version: "1.0.1",
    name: "My Movie Catalog",
    description: "Movie and series catalog for Stremio",
    resources: ["catalog", "meta"],
    types: ["movie", "series"],
    catalogs: [
      {
        type: "movie",
        id: "my_movies",
        name: "My Movies"
      },
      {
        type: "series",
        id: "my_series",
        name: "My Series"
      }
    ],
    idPrefixes: ["tt"]
  });
});

app.get("/catalog/:type/:id.json", (req, res) => {
  let items = [];

  if (req.params.type === "movie" && req.params.id === "my_movies") {
    items = movies;
  }

  if (req.params.type === "series" && req.params.id === "my_series") {
    items = series;
  }

  res.json({
    metas: items.map(item => ({
      id: item.id,
      type: item.type,
      name: item.name,
      poster: item.poster,
      posterShape: "poster"
    }))
  });
});

app.get("/meta/:type/:id.json", (req, res) => {
  const item = catalog.find(
    x => x.id === req.params.id && x.type === req.params.type
  );

  if (!item) {
    return res.status(404).json({ error: "Not found" });
  }

  res.json({
    meta: {
      id: item.id,
      type: item.type,
      name: item.name,
      poster: item.poster,
      posterShape: "poster"
    }
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Stremio addon running on port " + PORT);
});
