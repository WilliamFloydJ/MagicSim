# Railway data persistence setup

Your app uses SQLite. SQLite is file-based, so the DB file must live on a Railway volume, not on the ephemeral deploy filesystem.

## 1) Create and mount a Railway volume

1. In Railway, open your service.
2. Go to **Volumes** and create a volume.
3. Mount it to your service at `/data`.

## 2) Set environment variables for the service

Add these variables in Railway for the server service:

- `SQLITE_DB_PATH=/data/mtg_decks.db`
- `UPLOADS_DIR=/data/uploads`

## 3) Redeploy

Trigger a redeploy after setting the variables.

After this, pushes/redeploys will not wipe your SQLite database or uploaded files.

## Local development

If these env vars are not set locally, the app keeps using:

- database: `server/mtg_decks.db`
- uploads: `server/uploads`
