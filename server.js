const express = require("express");
const app = express();
const PORT = process.env.PORT || 7000;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

const data = [
  // HINDI
  ["Gandhari","movie","Hindi","Netflix"],
  ["The Revolutionaries","series","Hindi","Prime Video"],
  ["Ghamasaan","movie","Hindi","ZEE5"],
  ["Don't Be Shy","movie","Hindi","Prime Video"],
  ["Main Ladega","movie","Hindi","JioHotstar"],
  ["Ohh My Dog","movie","Hindi","Netflix"],
  ["Dupahiya Season 2","series","Hindi","Prime Video"],
  ["Pooja Meri Jaan","movie","Hindi","ZEE5"],

  // TELUGU
  ["Jagamae Sangeetham","series","Telugu","Prime Video"],
  ["Romanchakam","movie","Telugu","Netflix"],
  ["Sardar 2","movie","Telugu","Prime Video"],
  ["Bethlehem Kudumba Unit","movie","Telugu","JioHotstar"],
  ["#Love","series","Telugu","Netflix"],

  // TAMIL
  ["The Court","movie","Tamil","JioHotstar"],
  ["Sardar 2","movie","Tamil","Prime Video"],
  ["Romanchakam","movie","Tamil","Netflix"],
  ["#Love","series","Tamil","Netflix"],
  ["Bethlehem Kudumba Unit","movie","Tamil","JioHotstar"],

  // MALAYALAM
  ["Unmadham","movie","Malayalam","SonyLIV"],
  ["Prince of Mollywood","series","Malayalam","JioHotstar"],
  ["Bethlehem Kudumba Unit","movie","Malayalam","JioHotstar"],
  ["Panthadikkaam","series","Malayalam","ZEE5"],
  ["Romanchakam","movie","Malayalam","Netflix"],

  // KANNADA
  ["Bigg Boss Kannada Season 13","series","Kannada","JioHotstar"],
  ["Mother Promise","movie","Kannada","ZEE5"],
  ["Sardar 2","movie","Kannada","Prime Video"],
  ["Romanchakam","movie","Kannada","Netflix"],
  ["Bethlehem Kudumba Unit","movie","Kannada","JioHotstar"]
];

const languages = ["Hindi","Telugu","Tamil","Malayalam","Kannada"];

function poster(name) {
  return "https://placehold.co/600x900/111/fff?text=" +
    encodeURIComponent(name);
}

app.get("/", (req,res) => {
  res.send("Indian OTT 2026 Addon is running!");
});

app.get("/manifest.json", (req,res) => {

  const catalogs = [];

  languages.forEach(lang => {
    const key = lang.toLowerCase();

    catalogs.push({
      type:"movie",
      id:key + "_movies_2026",
      name:lang + " Movies 2026"
    });

    catalogs.push({
      type:"series",
      id:key + "_series_2026",
      name:lang + " Web Series 2026"
    });
  });

  catalogs.push({
    type:"movie",
    id:"all_movies_2026",
    name:"🇮🇳 Indian Movies 2026"
  });

  catalogs.push({
    type:"series",
    id:"all_series_2026",
    name:"🇮🇳 Indian Web Series 2026"
  });

  res.json({
    id:"org.gafoor.indianott2026",
    version:"2.0.0",
    name:"Indian OTT 2026",
    description:"Hindi, Telugu, Tamil, Malayalam and Kannada OTT catalog",
    resources:["catalog","meta"],
    types:["movie","series"],
    catalogs:catalogs,
    idPrefixes:["ott2026-"]
  });
});

app.get("/catalog/:type/:id.json", (req,res) => {

  const type = req.params.type;
  const id = req.params.id;

  let list = [];

  if(id === "all_movies_2026" || id === "all_series_2026") {
    list = data.filter(x => x[1] === type);
  } else {

    const match = id.match(
      /^(hindi|telugu|tamil|malayalam|kannada)_(movies|series)_2026$/
    );

    if(match) {
      const lang =
        match[1].charAt(0).toUpperCase() +
        match[1].slice(1);

      list = data.filter(
        x => x[1] === type && x[2] === lang
      );
    }
  }

  res.json({
    metas:list.map((x,i) => ({
      id:"ott2026-" + x[2].toLowerCase() + "-" + i,
      type:x[1],
      name:x[0],
      poster:poster(x[0]),
      posterShape:"poster"
    }))
  });
});
app.get("/meta/:type/:id.json", (req,res) => {
  const id = req.params.id;

  const match = id.match(/^ott2026-(hindi|telugu|tamil|malayalam|kannada)-(\d+)$/);

  if (!match) {
    return res.status(404).json({ error:"Not found" });
  }

  const lang = match[1];
  const index = Number(match[2]);

  const list = data.filter(x =>
    x[2].toLowerCase() === lang &&
    x[1] === req.params.type
  );

  const item = list[index];

  if (!item) {
    return res.status(404).json({ error:"Not found" });
  }

  res.json({
    meta: {
      id: id,
      type: item[1],
      name: item[0],
      poster: poster(item[0]),
      posterShape: "poster",
      releaseInfo: "2026",
      description: "2026 " + item[2] + " OTT release. Platform: " + item[3]
    }
  });
});
app.listen(PORT,"0.0.0.0",() => {
  console.log("Indian OTT 2026 addon running on port " + PORT);
});
