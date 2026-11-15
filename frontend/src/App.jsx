import { useEffect, useMemo, useState } from "react";

const ATTENDEE_KEY = "pulse-attendee-id";
const ROLE_KEY = "pulse-selected-role";
const ROLES = [
  { value: "student", label: "Students" },
  { value: "organizer", label: "Organizers" },
  { value: "admin", label: "Admins" },
];

async function api(path, options = {}) {
  const response = await fetch(`${import.meta.env.VITE_API_BASE || ""}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });
  const payload = (response.headers.get("content-type") || "").includes("application/json")
    ? await response.json()
    : null;
  if (!response.ok) throw new Error(payload?.error || `Request failed (${response.status})`);
  return payload;
}

function categoryFor(event) {
  const text = `${event.title || ""} ${event.status || ""}`.toLowerCase();
  if (/hack|code|cyber|tech|ai|robot|data/.test(text)) return "Tech + Ideas";
  if (/music|band|concert|dj|sound|fest/.test(text)) return "Music + Culture";
  if (/sport|game|fitness|run|match/.test(text)) return "Sport + Play";
  if (/career|job|network|workshop|lecture|talk/.test(text)) return "Career + Learning";
  return "Campus life";
}

function toneFor(event) {
  const text = `${event.title || ""} ${event.id || ""}`.toLowerCase();
  if (/music|band|concert|dj|fest/.test(text)) return "orange";
  if (/career|lecture|workshop|science|astro/.test(text)) return "mint";
  if (/tech|hack|cyber|code|ai/.test(text)) return "blue";
  return "violet";
}

function symbolFor(event) {
  const category = categoryFor(event);
  if (category.includes("Music")) return "♫";
  if (category.includes("Tech")) return "⌘";
  if (category.includes("Sport")) return "↗";
  if (category.includes("Career")) return "✳";
  return "✦";
}

function capacityFor(event) {
  const total = Number(event.capacity);
  if (!Number.isFinite(total) || total < 0 || !event.countKnown) return null;
  const registered = Math.max(0, Number(event.registeredCount) || 0);
  return {
    total,
    registered,
    left: Math.max(0, total - registered),
    ratio: total > 0 ? Math.min(100, (registered / total) * 100) : 100,
  };
}

function titleCase(value) {
  return String(value || "Open").replace(/[_-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function EventCard({ event, isRegistered, pending, onRegister }) {
  const capacity = capacityFor(event);
  const full = capacity && capacity.left === 0;
  const critical = capacity && capacity.ratio >= 90 && capacity.left > 0;
  const badge = !capacity ? "COUNT CHECK" : full ? "SOLD OUT" : critical ? "ALMOST FULL" : "OPEN RSVP";
  const organizer = event.organizer_id
    ? `HOST ID · ${String(event.organizer_id).slice(0, 8)}`
    : "CAMPUS COMMUNITY";

  let buttonText = "Reserve a seat";
  if (pending) buttonText = <><span className="button-spinner" aria-label="Registering" /> Registering</>;
  else if (isRegistered) buttonText = "✓ Registered";
  else if (full) buttonText = "Event full";
  else if (!capacity) buttonText = "Seats unknown";

  return (
    <article className="event-card">
      <div className="event-cover" data-tone={toneFor(event)}>
        <div className="cover-top">
          <span className={`open-badge ${full || critical ? "almost" : ""}`}>{badge}</span>
          <span className="status-badge">{titleCase(event.status)}</span>
        </div>
        <span className="cover-symbol" aria-hidden="true">{symbolFor(event)}</span>
        <span className="cover-coordinate">PULSE / {String(event.id || "0000").slice(0, 4).toUpperCase()}</span>
      </div>
      <div className="event-body">
        <div className="event-meta">
          <span className="category">{categoryFor(event)}</span>
          <span className="event-status">{capacity ? `${Math.round(capacity.ratio)}% FULL` : "LIVE DATA"}</span>
        </div>
        <h3 className="event-title">{event.title || "Untitled campus event"}</h3>
        <p className="event-subtitle">
          {capacity
            ? `Join the campus for ${(event.title || "this event").toLowerCase()}. Find your people, try something new, and make the most of your time here.`
            : "Capacity information will appear when registration data is available."}
        </p>
        <div className="capacity-block" aria-label="Event capacity">
          <div className="capacity-label">
            <span>REGISTERED / CAPACITY</span>
            <strong className={full || critical ? "critical" : ""}>
              {capacity ? `${capacity.registered} / ${capacity.total}` : "— / —"}
            </strong>
          </div>
          <div
            className="capacity-track"
            role="progressbar"
            aria-label="Seats registered"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={capacity ? Math.round(capacity.ratio) : 0}
          >
            <div
              className={`capacity-fill ${full || critical ? "critical" : ""}`}
              style={{ width: `${capacity ? capacity.ratio : 0}%` }}
            />
          </div>
          <div className="seats-line">
            <span>{capacity ? (full ? "No seats left" : `${capacity.left} ${capacity.left === 1 ? "seat" : "seats"} left`) : "Seat count unavailable"}</span>
            <b>{capacity ? `${capacity.left} AVAILABLE` : "— AVAILABLE"}</b>
          </div>
        </div>
        <div className="card-footer">
          <span className="organizer-label">{organizer}</span>
          <button
            className={`rsvp-button ${isRegistered ? "registered" : ""}`}
            type="button"
            disabled={pending || isRegistered || full || !capacity}
            onClick={() => onRegister(event)}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </article>
  );
}

function App() {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [attendeeId, setAttendeeId] = useState(() => localStorage.getItem(ATTENDEE_KEY) || "");
  const [selectedRole, setSelectedRole] = useState(() => {
    const savedRole = localStorage.getItem(ROLE_KEY);
    return ROLES.some((role) => role.value === savedRole) ? savedRole : "student";
  });
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState("");
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [connection, setConnection] = useState("Connecting");
  const [loadError, setLoadError] = useState("");
  const [pendingEventId, setPendingEventId] = useState("");
  const [toast, setToast] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const registeredEventIds = useMemo(
    () => new Set(registrations.map((registration) => String(registration.event_id))),
    [registrations],
  );

  useEffect(() => {
    let current = true;
    setLoading(true);
    setLoadError("");
    setConnection("Connecting");
    api("/api/events")
      .then((rows) => rows.filter((event) => !["draft", "cancelled", "archived"].includes(String(event.status || "").toLowerCase())))
      .then((rows) => Promise.all(rows.map(async (event) => {
        try {
          const attendeeRows = await api(`/api/events/${encodeURIComponent(event.id)}/registrations`);
          return { ...event, registeredCount: attendeeRows.length, countKnown: true };
        } catch {
          return { ...event, registeredCount: null, countKnown: false };
        }
      })))
      .then((rows) => {
        if (!current) return;
        setEvents(rows);
        setConnection("Campus sync live");
      })
      .catch((error) => {
        if (!current) return;
        setLoadError(error.message);
        setConnection("API offline");
      })
      .finally(() => {
        if (current) setLoading(false);
      });
    return () => { current = false; };
  }, [reloadKey]);

  useEffect(() => {
    let current = true;
    setUsersLoading(true);
    setUsersError("");
    api(`/api/users?role=${encodeURIComponent(selectedRole)}`)
      .then((rows) => {
        if (!current) return;
        setUsers(rows);
        const stillAvailable = rows.some((user) => String(user.id) === String(attendeeId));
        const nextId = stillAvailable ? attendeeId : (rows[0]?.id || "");
        if (nextId !== attendeeId) {
          setAttendeeId(nextId);
          if (nextId) localStorage.setItem(ATTENDEE_KEY, nextId);
          else localStorage.removeItem(ATTENDEE_KEY);
        }
      })
      .catch((error) => {
        if (!current) return;
        setUsers([]);
        setAttendeeId("");
        localStorage.removeItem(ATTENDEE_KEY);
        setUsersError(error.message);
      })
      .finally(() => { if (current) setUsersLoading(false); });
    return () => { current = false; };
  }, [selectedRole]);

  useEffect(() => {
    let current = true;
    if (!attendeeId) {
      setRegistrations([]);
      return () => { current = false; };
    }
    api(`/api/me/registrations?user_id=${encodeURIComponent(attendeeId)}`)
      .then((rows) => { if (current) setRegistrations(rows); })
      .catch((error) => {
        if (current) {
          setRegistrations([]);
          notify(`Couldn’t load registrations: ${error.message}`, "error");
        }
      });
    return () => { current = false; };
  }, [attendeeId, reloadKey]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 4200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    function handleShortcut(event) {
      if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
        event.preventDefault();
        document.querySelector("#search-input")?.focus();
      }
      if (event.key === "Escape") return;
    }
    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, []);

  const filteredEvents = useMemo(() => events.filter((event) => {
    const text = `${event.title || ""} ${event.status || ""} ${categoryFor(event)}`.toLowerCase();
    if (query.trim() && !text.includes(query.trim().toLowerCase())) return false;
    const capacity = capacityFor(event);
    if (activeFilter === "available" && (!capacity || capacity.left <= 0)) return false;
    if (activeFilter === "soldout" && (!capacity || capacity.left > 0)) return false;
    return true;
  }), [events, query, activeFilter]);

  const openCount = events.filter((event) => {
    const capacity = capacityFor(event);
    return capacity && capacity.left > 0;
  }).length;

  function notify(message, kind = "") {
    setToast({ message, kind, id: Date.now() });
  }

  function changeRole(role) {
    setSelectedRole(role);
    localStorage.setItem(ROLE_KEY, role);
    setAttendeeId("");
    setRegistrations([]);
    setUsers([]);
    localStorage.removeItem(ATTENDEE_KEY);
  }

  function changeUser(userId) {
    setAttendeeId(userId);
    if (userId) localStorage.setItem(ATTENDEE_KEY, userId);
    else localStorage.removeItem(ATTENDEE_KEY);
  }

  async function registerForEvent(event) {
    if (!attendeeId) {
      document.querySelector("#user-select")?.focus();
      notify("Choose a user ID for this role to reserve a seat.");
      return;
    }
    const capacity = capacityFor(event);
    if (!capacity || capacity.left <= 0) {
      notify("This event has no seats available right now.", "error");
      return;
    }
    setPendingEventId(String(event.id));
    try {
      await api("/api/registrations", {
        method: "POST",
        body: JSON.stringify({ user_id: attendeeId, event_id: event.id }),
      });
      notify("You’re on the list. Your place is reserved.", "success");
      setReloadKey((key) => key + 1);
    } catch (error) {
      notify(error.message, "error");
    } finally {
      setPendingEventId("");
    }
  }

  const eventById = useMemo(() => new Map(events.map((event) => [String(event.id), event])), [events]);

  return (
    <>
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <header className="topbar">
        <a className="brand" href="/" aria-label="Pulse Campus Events home">
          <span className="brand-mark">ϟ</span>
          <span className="brand-copy"><b>PULSE</b><small>CAMPUS EVENTS</small></span>
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          <a href="#events" className="nav-link">Live feed</a>
          <a href="#events" className="nav-link active">Explore events</a>
          <a href="#events" className="nav-link">Campus clubs</a>
        </nav>
        <div className="top-actions">
          <span className="sync-label"><i />{connection}</span>
          <label className="top-select role-select"><span>ROLE</span>
            <select aria-label="Select role" value={selectedRole} onChange={(event) => changeRole(event.target.value)}>
              {ROLES.map((role) => <option key={role.value} value={role.value}>{role.label}</option>)}
            </select>
          </label>
          <label className="top-select user-select"><span>{selectedRole.toUpperCase()} ID</span>
            <select id="user-select" aria-label={`Select ${selectedRole} user ID`} value={attendeeId} onChange={(event) => changeUser(event.target.value)} disabled={usersLoading || users.length === 0}>
              <option value="">{usersLoading ? "Loading IDs…" : usersError ? "Could not load IDs" : "No users for role"}</option>
              {users.map((user) => <option key={user.id} value={user.id}>{user.id}</option>)}
            </select>
          </label>
        </div>
      </header>

      <main className="page-shell">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-grid" />
          <div className="hero-copy">
            <div className="eyebrow"><span className="live-dot" /> CAMPUS SIGNAL // LIVE</div>
            <p className="hero-kicker">YOUR NEXT GOOD STORY STARTS HERE</p>
            <h1 id="hero-title">Find your<br /><span>people.</span> Find your<br className="mobile-break" /> next thing.</h1>
            <p className="hero-description">Ideas after class. Music after dark. The campus is yours to explore.</p>
            <a className="button button-primary hero-cta" href="#events"><span>Explore events</span><span aria-hidden="true">↘</span></a>
          </div>
          <div className="hero-stats" aria-label="Event overview">
            <div className="orbit orbit-a" /><div className="orbit orbit-b" />
            <div className="stat-card stat-main"><span className="stat-icon">✳</span><small>OPEN TO YOU</small><strong>{loading ? "—" : openCount}</strong><span>events with seats available</span></div>
            <div className="stat-card stat-float"><span className="live-dot" /><small>LIVE CAMPUS SYNC</small><strong>{connection === "Campus sync live" ? "ON" : "…"}</strong></div>
            <div className="hero-index">PULSE / 001</div>
          </div>
        </section>

        <section className="content-layout" id="events">
          <div className="event-column">
            <div className="section-heading">
              <div><p className="eyebrow muted">THE CAMPUS, IN MOTION</p><h2>Find your next <span>thing.</span></h2></div>
              <span className="result-count">{loading ? "LOADING EVENTS" : `${filteredEvents.length} ${filteredEvents.length === 1 ? "EVENT" : "EVENTS"} IN VIEW`}</span>
            </div>
            <div className="toolbar">
              <label className="search-box"><span aria-hidden="true">⌕</span><input id="search-input" type="search" placeholder="Search events" value={query} onChange={(event) => setQuery(event.target.value)} /><kbd>/</kbd></label>
              <div className="filter-list" aria-label="Filter events">
                {[["all", "All events"], ["available", "Seats available"], ["soldout", "Sold out"]].map(([filter, label]) => (
                  <button key={filter} className={`filter-chip ${activeFilter === filter ? "selected" : ""}`} onClick={() => setActiveFilter(filter)} type="button">{label}</button>
                ))}
              </div>
            </div>
            {loading ? (
              <div className="loading-card"><span className="spinner" /><p>Finding what’s happening…</p></div>
            ) : loadError ? (
              <div className="loading-card"><div><p><b>Campus signal is quiet.</b></p><p>{loadError}</p><p>From the project folder, start Flask with <code>.\backend\venv\Scripts\python.exe backend\app.py</code>, then retry.</p><button className="button button-quiet" type="button" onClick={() => setReloadKey((key) => key + 1)}>Retry connection <span>↻</span></button></div></div>
            ) : filteredEvents.length ? (
              <div className="event-grid">
                {filteredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isRegistered={registeredEventIds.has(String(event.id))}
                    pending={pendingEventId === String(event.id)}
                    onRegister={registerForEvent}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state"><span>◌</span><h3>No events in this signal.</h3><p>Try a different search or filter.</p></div>
            )}
          </div>

          <aside className="side-column">
            <section className="side-panel passes-panel">
              <div className="panel-heading"><div><p className="eyebrow muted">YOUR RSVP LIST</p><h2>My registrations</h2></div><span className="panel-icon">↗</span></div>
              <p className="panel-description">{attendeeId ? `Showing registrations for ${selectedRole} ID ${attendeeId.slice(0, 8)}…` : `Choose a ${selectedRole} user ID to view registrations and reserve a place.`}</p>
              <div className="passes-list">
                {!attendeeId ? <div className="pass-placeholder">{usersError || `No ${selectedRole} user selected.`}</div>
                  : registrations.length === 0 ? <div className="pass-placeholder">No registrations yet. Pick an event and reserve a seat.</div>
                    : registrations.map((registration) => {
                      const event = eventById.get(String(registration.event_id));
                      const capacity = event ? capacityFor(event) : null;
                      return <div className="pass-item" key={registration.id || registration.event_id}>
                        <span className="pass-icon">✳</span>
                        <span className="pass-info"><b>{event?.title || "Campus event"}</b><small>{capacity ? `${capacity.registered} / ${capacity.total} registered` : "RSVP confirmed"}</small></span>
                        <span className="pass-arrow">↗</span>
                      </div>;
                    })}
              </div>
              <button className="button button-quiet full-width" onClick={() => document.querySelector("#user-select")?.focus()} type="button">Choose a user ID <span>→</span></button>
            </section>
            <section className="side-panel capacity-panel">
              <div className="panel-heading"><div><p className="eyebrow muted">SEAT CHECK</p><h2>Room to join?</h2></div><span className="capacity-symbol">◉</span></div>
              <p>Cards show seats registered against total capacity, and how many seats are still open.</p>
              <div className="capacity-legend"><span><i className="legend-dot mint" />Seats open</span><span><i className="legend-dot orange" />Almost full</span></div>
            </section>
            <div className="side-note"><span>✳</span><p>A little more campus.<br /><b>A lot less scrolling.</b></p></div>
          </aside>
        </section>
      </main>

      <footer className="footer"><a className="brand footer-brand" href="/"><span className="brand-mark">ϟ</span><span className="brand-copy"><b>PULSE</b><small>CAMPUS SIGNAL</small></span></a><p>A little more campus, a lot less scrolling.</p><span className="footer-status"><i /> ALL SYSTEMS LOCAL</span></footer>

      {toast && <div className="toast-region" aria-live="polite" aria-atomic="true"><div key={toast.id} className={`toast ${toast.kind}`}>{toast.message}</div></div>}
    </>
  );
}

export default App;
