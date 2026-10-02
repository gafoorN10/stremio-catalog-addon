# Stremio Movie & Series Catalog Addon

Catalog-only Stremio addon. It displays a small movie/series catalog with posters and descriptions.
It intentionally does not provide movie/series streaming or download links.

## Run locally

```bash
npm install
npm start
```

Then install this manifest in Stremio:

`http://localhost:7000/manifest.json`

## Deploy

Deploy the folder to any Node.js hosting service. Set `PORT` if required.
After deployment, use:

`https://YOUR-DOMAIN/manifest.json`

as the Stremio addon URL.
