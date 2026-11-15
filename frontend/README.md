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
