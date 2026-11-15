import os

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from postgrest import APIError
from supabase import Client, create_client

load_dotenv()

app = Flask(__name__)
CORS(
    app,
    resources={r"/api/*": {"origins": [
        origin.strip()
        for origin in os.environ.get("CORS_ORIGINS", "*").split(",")
        if origin.strip()
    ]}},
)

supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_PUBLISHABLE_KEY")
if not supabase_url or not supabase_key:
    raise RuntimeError("Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY in backend/.env")

supabase: Client = create_client(supabase_url, supabase_key)


def database_error(error):
    """Return a JSON error without leaking request credentials or server details."""
    message = getattr(error, "message", None) or "Database request failed"
    return jsonify({"error": message}), 500


@app.get("/")
def index():
    return jsonify({"message": "Campus events API", "endpoints": [
        "/api/users", "/api/events", "/api/events/<id>",
        "/api/registrations", "/api/me/registrations",
        "/api/events/<id>/registrations",
    ]})


@app.get("/api/users")
def list_users():
    """List users, optionally filtering by role (used by the client identity selector)."""
    try:
        query = supabase.table("users").select("id,email,role").order("email")
        role = request.args.get("role")
        if role:
            query = query.eq("role", role)
        return jsonify(query.execute().data)
    except APIError as error:
        return database_error(error)


@app.get("/api/events")
def list_events():
    try:
        response = supabase.table("events").select("*").order("title")
        return jsonify(response.execute().data)
    except APIError as error:
        return database_error(error)


@app.get("/api/events/<event_id>")
def get_event(event_id):
    try:
        response = (
            supabase.table("events")
            .select("*")
            .eq("id", event_id)
            .maybe_single()
            .execute()
        )
        if response.data is None:
            return jsonify({"error": "Event not found"}), 404
        return jsonify(response.data)
    except APIError as error:
        return database_error(error)


@app.post("/api/registrations")
def create_registration():
    body = request.get_json(silent=True)
    if not isinstance(body, dict):
        return jsonify({"error": "Request body must be a JSON object"}), 400

    user_id = body.get("user_id")
    event_id = body.get("event_id")
    if not user_id or not event_id:
        return jsonify({"error": "user_id and event_id are required"}), 400

    try:
        event_response = (
            supabase.table("events")
            .select("id,capacity")
            .eq("id", event_id)
            .maybe_single()
            .execute()
        )
        if event_response.data is None:
            return jsonify({"error": "Event not found"}), 404

        existing = (
            supabase.table("registrations")
            .select("id")
            .eq("user_id", user_id)
            .eq("event_id", event_id)
            .limit(1)
            .execute()
        )
        if existing.data:
            return jsonify({"error": "User is already registered for this event"}), 409

        capacity = event_response.data.get("capacity")
        if capacity is not None:
            count_response = (
                supabase.table("registrations")
                .select("id", count="exact")
                .eq("event_id", event_id)
                .execute()
            )
            if count_response.count is not None and count_response.count >= capacity:
                return jsonify({"error": "Event is full"}), 409

        created = (
            supabase.table("registrations")
            .insert({"user_id": user_id, "event_id": event_id})
            .execute()
        )
        row = created.data[0] if created.data else {
            "user_id": user_id,
            "event_id": event_id,
        }
        return jsonify(row), 201
    except APIError as error:
        # Covers duplicate-key conflicts if the database has a unique constraint.
        if getattr(error, "code", None) == "23505":
            return jsonify({"error": "User is already registered for this event"}), 409
        return database_error(error)


@app.get("/api/me/registrations")
def list_user_registrations():
    # There is no authentication: callers specify the user_id explicitly.
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"error": "user_id query parameter is required"}), 400
    try:
        response = (
            supabase.table("registrations")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .execute()
        )
        return jsonify(response.data)
    except APIError as error:
        return database_error(error)


@app.get("/api/events/<event_id>/registrations")
def list_event_registrations(event_id):
    # Deliberately public; no organizer ownership check is performed.
    try:
        event = (
            supabase.table("events")
            .select("id")
            .eq("id", event_id)
            .maybe_single()
            .execute()
        )
        if event.data is None:
            return jsonify({"error": "Event not found"}), 404
        response = (
            supabase.table("registrations")
            .select("*")
            .eq("event_id", event_id)
            .order("created_at", desc=True)
            .execute()
        )
        return jsonify(response.data)
    except APIError as error:
        return database_error(error)


if __name__ == "__main__":
    app.run(debug=True)
