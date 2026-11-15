# Pulse campus events frontend

This frontend uses React and Vite. Its UI source and configuration live in this `frontend` folder; the API remains in `backend/app.py`.

## Development

In one terminal, start the Flask API from the project root:

```powershell
.\backend\venv\Scripts\python.exe backend\app.py
```

In another terminal:

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

Open the Vite URL printed in the terminal. Vite proxies `/api` requests to Flask on `127.0.0.1:5000`.

## Production build

```powershell
cd frontend
npm.cmd run build
```

The build is written to `frontend/dist` and calls the Render API at
`https://hyderabad-proj.onrender.com`. The API supports these frontend requests:

- `GET /api/events` for the event feed.
- `GET /api/events/<id>/registrations` for event seat counts.
- `GET /api/users?role=<role>` for the role and user selector.
- `GET /api/me/registrations?user_id=<id>` for the selected user's RSVPs.
- `POST /api/registrations` with `{ "user_id": "...", "event_id": "..." }` to reserve a seat.

For a different API host, set `VITE_API_BASE` in the frontend build environment.
The backend's `CORS_ORIGINS` setting must include the deployed frontend's origin.

## Deploy the frontend on Vercel

1. Import the GitHub repository into Vercel.
2. Set **Root Directory** to `frontend`.
3. Keep the build command as `npm run build` and output directory as `dist`;
   `vercel.json` supplies these settings and the single-page-app rewrite.
4. Add `VITE_API_BASE` in Vercel's Environment Variables, with the value
   `https://hyderabad-proj.onrender.com`. Enable it for Production and Preview.
5. Deploy the frontend, then add its Vercel domain to the Render backend's
   `CORS_ORIGINS` environment variable. Use comma-separated origins if you also
   have a custom domain, with no trailing slash.

The organizer event form uses `POST /api/events`; deploy the matching backend
change to Render before using that form. Keep `SUPABASE_URL` and
`SUPABASE_PUBLISHABLE_KEY` in Render only; they do not belong in Vercel.
