# Pulse Campus Events API

Flask API backed by Supabase. The API does not implement authentication or
authorization. Requests that identify a user pass `user_id` directly.

## Deploy on Render

This folder can be used as the repository root, or as the service's Root
Directory in a monorepo. The included `render.yaml` configures a Python web
service with:

- Build command: `pip install -r requirements.txt`
- Start command: `gunicorn app:app`
- Health check: `/`

Create the service from the Render Blueprint or enter those commands in a
Render Web Service. Add these environment variables in Render's Environment
tab:

- `SUPABASE_URL`: your Supabase project URL.
- `SUPABASE_PUBLISHABLE_KEY`: your Supabase publishable (anon) key.
- `CORS_ORIGINS`: the frontend origin, such as
  `https://your-frontend.onrender.com`. Multiple origins can be comma-separated.
  Use `*` to allow requests from any browser origin.

Do not upload `.env` or commit real credentials. Supabase must also allow the
anonymous database operations this API performs through its row-level security
policies.

## Run locally

```powershell
python -m venv v
.\v\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
python app.py
```

Fill in the Supabase values in `.env` before starting the server. The API is
then available at `http://127.0.0.1:5000`.

## Endpoints

- `GET /api/users?role=student`
- `GET /api/events`
- `GET /api/events/<id>`
- `POST /api/events` with `{ "title": "...", "capacity": 100, "organizer_id": "..." }`
- `POST /api/registrations` with JSON `{ "user_id": "...", "event_id": "..." }`
- `GET /api/me/registrations?user_id=<id>`
- `GET /api/events/<id>/registrations`

Event creation validates that `organizer_id` belongs to an organizer account.
Registration creation rejects a `user_id` equal to the event's `organizer_id`,
so an organizer cannot RSVP to their own event.

This demo API does not authenticate callers. The role picker in the frontend is
not a login system; for a public production deployment, add Supabase Auth and
verify the caller's JWT before allowing event creation or registration.
