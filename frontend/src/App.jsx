import { useEffect, useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || (
  import.meta.env.PROD ? "https://hyderabad-proj.onrender.com" : ""
);
const ROLE_KEY = "pulse-selected-role";
const USER_KEY = "pulse-selected-user";
const ROLES = [
  { id: "student", name: "Student Hub", description: "Campus discovery, RSVP, passes", icon: "school" },
  { id: "organizer", name: "Organizer Studio", description: "Event and attendee roster", icon: "campaign" },
  { id: "admin", name: "Admin Command", description: "Campus oversight and governance", icon: "admin_panel_settings" },
];
const DESIGN_IMAGES = {
  hero: "https://lh3.googleusercontent.com/aida-public/AB6AXuDGDEHT2Asjxp-ofGEto07hsf8bOp9Nc9VFIVNVjkkH0kMerQcE0-ifgzO29HyzCw38jg8fUSgEX0yReviETI104QwOf9gcutqqhKk7xWtDQuv8o25UKuxL418kl_vw_6PukD-ICt99GJNRIzvE-SWDkjOuX-Vjh8XEt5tdX87j3P_GhU4X074iSzspJ9Wqv98FApfCmKD53Rsx4h6JMyNE6EI7btBlmdNih8L-kys",
  tech: "https://lh3.googleusercontent.com/aida-public/AB6AXuCvJzymlAqYLKek6ZxBKLEg5M_d54Tn42J62wv7C02XVA_3ijkdAgLxEAfZ1LhuOYyBIXrILHm6u7xHRvglKBcY7WATk1uDRTPobTGayx9Zp_YQuurDgN9ud44iThFxx-DBGfHZIVdBl42PQE3YGfUG3YlWuiyIETM2tbdEAw5wL_G3In6ru61RrRCSEfwgZ6YFfx0RNURC598JSsSl660i30V9PfwEYXokdlevy10",
  astronomy: "https://lh3.googleusercontent.com/aida-public/AB6AXuD5wIVvlqnHD9TcIEsAUebob5aUhjKZZujv7_KYiqKtV91NoiE6mtfAIiR9f6ZlUGOT8aAFAMICxghVE-bJzTScQoALBKpaAvjt0ERRSgKGDegURZzpnAwcWc4muclMKPENYxyJtwzxI6C861QxCyOlBiGKVCjxi6EIZapmYL3wYBbBYptX4ijyt8WXd2HlUujhw2p1rZnnG22m0RqgQHiDYNu6HbV3oC2FbkDKzqg",
  music: "https://lh3.googleusercontent.com/aida-public/AB6AXuC83tWutRiojlR-G4xReWg4r35c1xB6oi-srkr9NXJ8meTEq76KPEC1svAn6_67_lNZ2OxZne2vjNS1NG8NcQm5sv8eXW_Z7e9X5VUg3a9Rduea-31O57XbMAI4ZLu98ydWAXx-GS1EFaQgz-G6hTyxIx9LVdKj0jEE9jhAhJVfODYID_n3GUufSsW7rs7hmIdXlDczSPT8NGIouLxZTtfs6ksOBJm7-wH9FX1ndXc",
  cyber: "https://lh3.googleusercontent.com/aida-public/AB6AXuCwJ9miq2NQPe7zb8dm2uaQsL886pFKdEFnGrrCTqPMjDe1_9GkLB4yJnnzsQy_G9ku9tTqK6u5Fl2CHaOd9E3MrGPLqzCW2y7mDe43g4YNIDepf4et3MpZDOka0YKP0FXj8SMIC9IdMw-hg5I4jIoP_nC0A1smPmqn0Qm1lKhU_E2n7bfm8pCvWKurO50bnHKAXZMXWEgc6KwT7V1MgGKvSNglu7z9ln_p3-c2VYA",
};

async function api(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
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
  if (/hack|code|cyber|tech|ai|robot|data/.test(text)) return "Hackathons";
  if (/music|band|concert|dj|sound|fest/.test(text)) return "EDM & music";
  if (/sport|game|fitness|run|match/.test(text)) return "Esports";
  if (/career|job|network|workshop|lecture|talk/.test(text)) return "Career & tech";
  return "Campus life";
}

function toneFor(event) {
  const text = `${event.title || ""}`.toLowerCase();
  if (/music|band|concert|dj|fest/.test(text)) return "orange";
  if (/career|lecture|workshop|science|astro/.test(text)) return "mint";
  if (/tech|hack|cyber|code|ai/.test(text)) return "blue";
  return "violet";
}

function imageFor(event) {
  const text = `${event?.title || ""}`.toLowerCase();
  if (/music|band|concert|dj|fest/.test(text)) return DESIGN_IMAGES.music;
  if (/astro|space|planet|telescope/.test(text)) return DESIGN_IMAGES.astronomy;
  if (/cyber|security|capture|flag/.test(text)) return DESIGN_IMAGES.cyber;
  if (/hack|code|tech|ai|robot|data|workshop/.test(text)) return DESIGN_IMAGES.tech;
  return DESIGN_IMAGES.hero;
}

function capacityFor(event) {
  const total = Number(event.capacity);
  if (!Number.isFinite(total) || total < 0 || !event.countKnown) return null;
  const registered = Math.max(0, Number(event.registeredCount) || 0);
  return { total, registered, left: Math.max(0, total - registered), ratio: total ? Math.min(100, registered / total * 100) : 100 };
}

function shortId(value) { return String(value || "").slice(0, 8).toUpperCase(); }
function titleCase(value) { return String(value || "Open").replace(/[_-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()); }
function Icon({ children, className = "" }) { return <span className={`material-icon ${className}`} aria-hidden="true">{children}</span>; }

function Header({ role, onRole, user, users, onUser, connection }) {
  const current = ROLES.find((item) => item.id === role) || ROLES[0];
  return (
    <header className="app-header">
      <a className="brand" href="#top" aria-label="Pulse home"><span className="brand-mark"><Icon>bolt</Icon></span><span><b>PULSE</b><small>{role === "student" ? "CAMPUS EVENTS" : "STUDIO // COMMAND"}</small></span></a>
      {role === "student" ? <nav className="student-nav"><a href="#events">Live feed</a><a className="active" href="#events">Explore events</a><a href="#events">Campus clubs</a><a href="#events">Venues &amp; spaces</a></nav> : <div className="network-pill"><i /> PRODUCTION MODE // LIVE NETWORK</div>}
      <div className="header-actions">
        {role === "student" && <span className="connection"><i />{connection}</span>}
        {role !== "admin" && <label className="user-picker"><span className="sr-only">Select {role} account</span><select value={user} onChange={(event) => onUser(event.target.value)} aria-label={`Select ${role} account`}><option value="">Select account</option>{users.map((item) => <option key={item.id} value={item.id}>{item.email || shortId(item.id)}</option>)}</select></label>}
        <label className="role-picker"><span className="role-signal" /><span className="role-caption">ROLE:</span><select value={role} onChange={(event) => onRole(event.target.value)} aria-label="Switch workspace">{ROLES.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><Icon>expand_more</Icon></label>
        <button className="icon-button" aria-label="Notifications" type="button"><Icon>notifications</Icon></button>
        <div className="profile-dot"><Icon>person</Icon></div>
      </div>
    </header>
  );
}

function Capacity({ event }) {
  const capacity = capacityFor(event);
  if (!capacity) return <div className="capacity-unknown">Seat count unavailable from API</div>;
  return <div className="capacity-meter"><div className="capacity-caption"><span>LIVE REGISTERED</span><b className={capacity.ratio >= 90 ? "hot" : ""}>{capacity.registered} / {capacity.total} <small>({Math.round(capacity.ratio)}%)</small></b></div><div className="meter-track"><i className={capacity.ratio >= 90 ? "hot" : ""} style={{ width: `${capacity.ratio}%` }} /></div><div className="capacity-caption lower"><span>{capacity.left} spots remaining</span><span>{capacity.ratio >= 90 ? "ALMOST FULL" : "OPEN RSVP"}</span></div></div>;
}

function StudentView({ events, registrations, selectedUser, loading, error, onRefresh, onRegister, pending, registeredIds }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All telemetry");
  const filtered = useMemo(() => events.filter((event) => {
    const text = `${event.title} ${categoryFor(event)} ${event.status}`.toLowerCase();
    const capacity = capacityFor(event);
    if (query && !text.includes(query.toLowerCase())) return false;
    if (filter === "Hackathons" && categoryFor(event) !== "Hackathons") return false;
    if (filter === "EDM & music" && categoryFor(event) !== "EDM & music") return false;
    if (filter === "Career & tech" && categoryFor(event) !== "Career & tech") return false;
    if (filter === "Esports" && categoryFor(event) !== "Esports") return false;
    if (filter === "<15% spots left" && (!capacity || capacity.left / Math.max(1, capacity.total) >= .15)) return false;
    return true;
  }), [events, filter, query]);
  const featured = events[0];
  const openSeats = events.reduce((sum, event) => sum + (capacityFor(event)?.left || 0), 0);
  const liveEvents = events.filter((event) => !["draft", "cancelled", "archived"].includes(String(event.status || "").toLowerCase())).length;
  const heroStats = [[String(events.length).padStart(2, "0"), "EVENTS"], [String(liveEvents).padStart(2, "0"), "LIVE"], [String(registrations.length).padStart(2, "0"), "MY PASSES"], [openSeats.toLocaleString(), "SEATS"]];
  const quickPasses = registrations.map((registration) => events.find((event) => String(event.id) === String(registration.event_id))).filter(Boolean);
  return (
    <main className="student-page" id="top">
      <section className="student-hero" style={{ backgroundImage: `linear-gradient(90deg,#0d111a 0%,#101520e8 49%,#11152055 100%), url("${imageFor(featured)}")` }}>
        <div className="hero-art" />
        <div className="hero-copy"><div className="hero-tags"><span><i /> LIVE CAMPUS SYNC</span><span>SECTOR 04 // MAIN QUAD &amp; INNOVATION LAB</span></div><p className="hero-eyebrow">PRIORITY EXPERIENCE</p><h1>{featured?.title || "Your next campus story"}<br /><em>starts right here.</em></h1><p className="hero-description">Discover what’s happening across campus. Find your people, build your pass, and RSVP in one click.</p><div className="hero-actions"><a className="primary-button" href="#events"><Icon>bolt</Icon> EXPLORE LIVE EVENTS</a><span className="quiet-note"><Icon>verified_user</Icon> NO SSO / ZERO-FRICTION ENTRY</span></div></div>
        <div className="hero-telemetry"><div className="hero-role"><span>CAMPUS LIVE // API SYNC</span><b>CONNECTED</b></div>{heroStats.map(([value, label]) => <div className="count-cell" key={label}><strong>{loading ? "—" : value}</strong><small>{label}</small></div>)}<div className="hero-capacity"><Capacity event={featured || {}} /></div></div>
      </section>
      <section className="student-content" id="events">
        <div className="student-feed">
          <div className="student-toolbar"><div className="category-filter">{["All telemetry", "Hackathons", "EDM & music", "Career & tech", "Esports"].map((item) => <button type="button" key={item} className={filter === item ? "selected" : ""} onClick={() => setFilter(item)}>{item}</button>)}</div><label className="search-input"><Icon>search</Icon><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search campus events" /></label></div>
          {loading ? <div className="empty-panel">Syncing campus protocols…</div> : error ? <div className="empty-panel"><b>Campus signal is quiet.</b><p>{error}</p><button className="secondary-button" onClick={onRefresh} type="button">Retry sync</button></div> : filtered.length ? <div className="student-event-grid">{filtered.map((event, index) => { const cap = capacityFor(event); const isRegistered = registeredIds.has(String(event.id)); return <article className="student-event-card" key={event.id}><div className={`event-art tone-${toneFor(event)}`} style={{ backgroundImage: `linear-gradient(0deg,#10151ee8,transparent 65%), url("${imageFor(event)}")` }}><span className="event-chip">{cap?.ratio >= 90 ? "ALMOST FULL" : "OPEN RSVP"}</span><span className="event-chip free-chip">FREE TICKET</span><div className="art-orbit" /><span className="art-index">PULSE // {String(index + 1).padStart(2, "0")}</span><div className="event-art-caption"><Icon>{categoryFor(event) === "EDM & music" ? "music_note" : categoryFor(event) === "Hackathons" ? "terminal" : "auto_awesome"}</Icon> CAMPUS EVENT // {titleCase(event.status)}</div></div><div className="student-event-info"><p className="host-label">HOSTED BY CAMPUS COMMUNITY <span>♧</span></p><h2>{event.title}</h2><p className="event-description">A live campus experience. Connect with students and make room for something new.</p><Capacity event={event} /><div className="student-event-footer"><span className="host-id">HOST // {shortId(event.organizer_id)}</span><button className="rsvp-button" type="button" disabled={pending === String(event.id) || isRegistered || !cap || cap.left <= 0} onClick={() => onRegister(event)}>{pending === String(event.id) ? "RESERVING…" : isRegistered ? "✓ RSVP CONFIRMED" : "♙ 1-CLICK RSVP"}</button></div></div></article>; })}</div> : <div className="empty-panel">No events match this filter.</div>}
          <div className="feed-footer"><span><i /> SHOWING {filtered.length} OF {events.length} CAMPUS PROTOCOLS</span><button type="button" onClick={onRefresh}>SYNC LIVE FEED <Icon>refresh</Icon></button></div>
        </div>
        <aside className="student-aside"><section className="side-card pass-card"><div className="side-card-heading"><h2><Icon>confirmation_number</Icon> My Quick Pass</h2><code>/api/me/registrations</code></div><p>Live wallet credentials for campus scanner kiosks. No physical pass required.</p><div className="quick-pass-list">{quickPasses.length ? quickPasses.map((event) => <div className="quick-pass" key={event.id}><div><small>RSVP CONFIRMED</small><b>{event.title}</b><span>{titleCase(event.status)} · {shortId(event.id)}</span></div><div className="fake-qr" aria-hidden="true"><i /></div></div>) : <div className="pass-empty">{selectedUser ? "No active passes yet. RSVP to an event to add one here." : "Select a student account to load your passes."}</div>}</div><div className="pass-sync"><span><i /> Auto-sync enabled</span><b>{quickPasses.length} active passes</b></div></section><section className="side-card heatmap-card"><div className="side-card-heading"><h2>Kinetic heatmap</h2><b className="orange-text">CAMPUS LIVE</b></div><p>Seat availability is calculated from live registration counts.</p><div className="heatmap-bars">{events.slice(0, 5).map((event) => <div key={event.id}><span>{event.title}</span><i><b style={{ width: `${capacityFor(event)?.ratio || 0}%` }} /></i></div>)}</div></section></aside>
      </section>
    </main>
  );
}

function ConsoleSidebar({ role }) {
  const items = role === "organizer" ? [["edit_calendar", "Event Creator"], ["confirmation_number", "Ticket Telemetry"], ["qr_code_scanner", "Door Scanner"], ["admin_panel_settings", "Campus Oversight"], ["verified_user", "Audit & Compliance"]] : [["admin_panel_settings", "Campus Oversight"], ["analytics", "Ingestion Telemetry"], ["fact_check", "Governance Registry"], ["verified_user", "Audit & Compliance"]];
  return <aside className="console-sidebar"><a className="console-brand" href="#top"><span><Icon>bolt</Icon></span><b>PULSE<small>STUDIO // COMMAND</small></b></a><div className="scope-card"><small>ROLE SCOPE</small><b><i /> {role === "organizer" ? "Organizers & Staff" : "Institutional Admin"}<em>ACTIVE</em></b></div><nav>{items.map(([icon, label], index) => <a className={index === 0 ? "current" : ""} key={label} href="#console"><Icon>{icon}</Icon>{label}</a>)}</nav><div className="sidebar-bottom"><Icon>person</Icon><span>Console View<small>Instant Switch</small></span></div></aside>;
}

function Metric({ label, value, note, tone = "violet", icon = "analytics" }) {
  return <article className={`metric-card metric-${tone}`}><div className="metric-top"><small>{label}</small><span><Icon>{icon}</Icon></span></div><strong>{value}</strong><p>{note}</p></article>;
}

function OrganizerView({ events, users, selectedUser, onUser, loading, error, selectedEventId, onEvent, roster, rosterLoading, onRefresh }) {
  const ownedEvents = selectedUser ? events.filter((event) => String(event.organizer_id) === String(selectedUser)) : events;
  const selectedEvent = ownedEvents.find((event) => String(event.id) === String(selectedEventId)) || ownedEvents[0];
  const attendees = users.filter((user) => user.role === "student");
  const totalRsvps = ownedEvents.reduce((sum, event) => sum + (Number(event.registeredCount) || 0), 0);
  const capacity = ownedEvents.reduce((sum, event) => sum + (Number(event.capacity) || 0), 0);
  const fill = capacity ? (totalRsvps / capacity * 100).toFixed(1) : "0.0";
  return <div className="console-layout" id="top"><ConsoleSidebar role="organizer" /><main className="console-main" id="console"><div className="console-eyebrow"><i /> CONSOLE OPERATIONAL // ORG-CLUSTER-04 <span>ID: {shortId(selectedUser)}</span></div><div className="console-title-row"><div><h1>Organizer Studio</h1><p>Manage live guest rosters and monitor event capacity from your campus console.</p></div><div className="console-actions"><button className="secondary-button" type="button" onClick={onRefresh}><Icon>sync</Icon> Sync DB API</button><button className="primary-button disabled-action" type="button" disabled title="Event creation is not available in the connected API"><Icon>add_circle</Icon> New Pipeline Event</button></div></div>
    {!selectedUser && <div className="notice-banner">Select an organizer account in the top bar. Showing all events until an organizer is selected.</div>}
    <section className="metric-grid"><Metric label="ACTIVE MANAGED EVENTS" value={String(ownedEvents.length).padStart(2, "0")} note="Visible in campus feed" icon="calendar_month" tone="violet" /><Metric label="TOTAL RSVPS" value={totalRsvps.toLocaleString()} note="Across managed events" icon="group_add" tone="orange" /><Metric label="AVG. CAPACITY FILL" value={`${fill}%`} note={`${totalRsvps} / ${capacity} slots`} icon="donut_large" tone="mint" /><Metric label="CHECK-IN READINESS" value="—" note="No check-in endpoint connected" icon="qr_code_scanner" tone="blue" /></section>
    <div className="target-event-bar"><b>TARGET EVENT:</b><select value={selectedEvent?.id || ""} onChange={(event) => onEvent(event.target.value)} aria-label="Choose event">{ownedEvents.map((event) => <option key={event.id} value={event.id}>{event.title}</option>)}</select><span className="live-chip"><i /> LIVE ROSTER</span><code>API // /api/events/{shortId(selectedEvent?.id)}</code></div>
    <section className="organizer-content-grid"><div className="console-panel roster-panel"><div className="panel-title-row"><div><h2>Attendee roster</h2><p>{selectedEvent?.title || "No event selected"} · live registrations</p></div><button className="secondary-button" type="button" onClick={onRefresh}><Icon>refresh</Icon> Refresh</button></div><div className="roster-toolbar"><span><Icon>database</Icon> {rosterLoading ? "SYNCING REGISTRATIONS" : `${roster.length} REGISTRATIONS`}</span><span className="read-only-label">READ ONLY</span></div>{error ? <div className="empty-panel">{error}</div> : <div className="table-scroll"><table><thead><tr><th>ATTENDEE &amp; ROLE</th><th>USER ID</th><th>REGISTRATION</th><th>STATUS</th></tr></thead><tbody>{roster.length ? roster.map((registration, index) => { const person = attendees.find((user) => String(user.id) === String(registration.user_id)); return <tr key={registration.id || `${registration.user_id}-${index}`}><td><b>{person?.email || `Attendee ${shortId(registration.user_id)}`}</b><small>Student // Campus member</small></td><td><code>{shortId(registration.user_id)}</code></td><td><code>{registration.created_at ? new Date(registration.created_at).toLocaleString() : "Confirmed"}</code></td><td><span className="status-tag confirmed"><i /> CONFIRMED</span></td></tr>; }) : <tr><td colSpan="4" className="table-empty">{rosterLoading ? "Loading attendee records…" : selectedEvent ? "No registrations for this event yet." : "No managed events found for this account."}</td></tr>}</tbody></table></div>}<div className="table-foot">REGISTRATION DATA FROM SUPABASE <span>PAGE 1 / 1</span></div></div>
      <aside className="console-rail"><section className="console-panel scanner-panel"><div className="panel-title-row"><div><h2><i className="mint-dot" /> Door scanner</h2><p>Check-in station status</p></div><span className="live-chip">API OFFLINE</span></div><div className="scanner-visual"><Icon>qr_code_scanner</Icon><b>NO CHECK-IN ENDPOINT</b><small>The connected API can list RSVPs but cannot record scans.</small></div><button className="secondary-button full-width" disabled type="button">Simulate check-in pass</button></section><section className="console-panel guard-panel"><div className="panel-title-row"><div><h2>Capacity guard</h2><p>Live event capacity</p></div><Icon>tune</Icon></div>{selectedEvent ? <><Capacity event={selectedEvent} /><div className="guard-row"><span>Maximum capacity</span><b>{selectedEvent.capacity ?? "Not set"}</b></div></> : <p>No event capacity to display.</p>}<button className="secondary-button full-width" disabled type="button" title="Capacity updates are not available in the connected API">Capacity edits unavailable</button></section><section className="console-panel broadcast-panel"><h2>Quick broadcast</h2><p>Broadcast messaging isn’t available in the connected API.</p><button className="secondary-button full-width" disabled type="button">Send broadcast unavailable</button></section></aside>
    </section><section className="pipeline-section"><div className="panel-title-row"><div><h2>Pipeline events by organizer</h2><p>Events returned by the live campus API</p></div><span className="live-chip"><i /> {ownedEvents.length} EVENTS</span></div><div className="pipeline-grid">{ownedEvents.slice(0, 6).map((event) => <article className="pipeline-card" key={event.id}><span className="status-tag">{titleCase(event.status)}</span><code>{shortId(event.id)}</code><h3>{event.title}</h3><Capacity event={event} /></article>)}</div></section>
  </main></div>;
}

function AdminView({ events, users, loading, error, onRefresh }) {
  const totalRsvps = events.reduce((sum, event) => sum + (Number(event.registeredCount) || 0), 0);
  const totalCapacity = events.reduce((sum, event) => sum + (Number(event.capacity) || 0), 0);
  const activeEvents = events.filter((event) => !["draft", "cancelled", "archived"].includes(String(event.status).toLowerCase())).length;
  const flaggedEvents = events.filter((event) => { const cap = capacityFor(event); return cap && cap.ratio >= 90; });
  return <div className="console-layout admin-layout" id="top"><ConsoleSidebar role="admin" /><main className="console-main" id="console"><div className="console-eyebrow admin-eyebrow"><i /> ROOT ARCHITECTURE // 0xCAMPUS_PROD <span>NODE-CENTRAL-US</span></div><div className="console-title-row"><div><h1>Campus Command &amp; Oversight</h1><p>Live event ingestion, campus registration throughput, and governance across the event registry.</p></div><div className="console-actions"><span className="syslog-pill"><i /> API SYNC ONLINE</span><button className="secondary-button" onClick={onRefresh} type="button"><Icon>sync</Icon> Refresh data</button></div></div>
    {error && <div className="notice-banner error-banner">{error}</div>}
    <section className="metric-grid admin-metrics"><Metric label="ACTIVE CAMPUS EVENTS" value={String(activeEvents).padStart(2, "0")} note={`${users.length} campus accounts visible`} icon="hub" tone="violet" /><Metric label="LIVE REGISTRATIONS" value={totalRsvps.toLocaleString()} note={`${users.filter((user) => user.role === "student").length} student records visible`} icon="how_to_reg" tone="mint" /><Metric label="CAPACITY UTILIZATION" value={`${totalCapacity ? (totalRsvps / totalCapacity * 100).toFixed(1) : "0.0"}%`} note={`${totalRsvps.toLocaleString()} / ${totalCapacity.toLocaleString()} seats`} icon="speed" tone="orange" /><Metric label="CAPACITY ALERTS" value={String(flaggedEvents.length).padStart(2, "0")} note="Events at 90% capacity or above" icon="gavel" tone="orange" /></section>
    <section className="admin-top-grid"><article className="console-panel override-panel"><div className="panel-title-row"><div><h2>Emergency overrides</h2><p>Operational controls</p></div><Icon>tune</Icon></div><div className="control-placeholder"><b>Controls unavailable</b><p>The connected API has no lockdown, rate-limit, or role-simulation endpoints. No operational toggles are active from this UI.</p></div><button className="secondary-button full-width" disabled type="button">No control API connected</button></article><article className="console-panel chart-panel"><div className="panel-title-row"><div><h2>Campus throughput &amp; ingestion wave</h2><p>Event registration share by capacity</p></div><span className="live-chip"><i /> LIVE API DATA</span></div><div className="bar-chart">{events.slice(0, 12).map((event) => <div className="chart-column" key={event.id} title={`${event.title}: ${event.registeredCount || 0} RSVPs`}><div className="chart-bars"><i style={{ height: `${Math.max(5, capacityFor(event)?.ratio || 0)}%` }} /><b style={{ height: `${Math.max(4, Math.min(100, (Number(event.registeredCount) || 0) / Math.max(1, totalRsvps) * 100))}%` }} /></div><small>{shortId(event.id).slice(0, 4)}</small></div>)}</div><div className="chart-legend"><span><i /> Capacity fill</span><span><i /> RSVP share</span></div></article></section>
    <section className="console-panel governance-panel"><div className="panel-title-row"><div><h2><Icon>fact_check</Icon> Event governance registry</h2><p>Live event and capacity records returned by the API</p></div><div className="registry-count">{loading ? "SYNCING" : `${events.length} EVENTS`}</div></div><div className="table-scroll"><table><thead><tr><th>EVENT &amp; CAMPUS</th><th>ORGANIZER ID</th><th>CAPACITY TELEMETRY</th><th>STATUS</th><th>GOVERNANCE</th></tr></thead><tbody>{events.map((event) => { const cap = capacityFor(event); return <tr key={event.id}><td><b>{event.title}</b><small>Campus event // {shortId(event.id)}</small></td><td><code>{shortId(event.organizer_id)}</code></td><td>{cap ? <><div className="registry-counts"><span>{cap.registered} registered</span><b>Cap {cap.total}</b></div><div className="meter-track"><i className={cap.ratio >= 90 ? "hot" : ""} style={{ width: `${cap.ratio}%` }} /></div></> : "No seat count"}</td><td><span className={`status-tag ${cap?.ratio >= 90 ? "warning" : "confirmed"}`}>{cap?.ratio >= 90 ? "CAPACITY ALERT" : titleCase(event.status)}</span></td><td><span className="read-only-label">READ ONLY</span></td></tr>; })}</tbody></table>{!events.length && <div className="table-empty">{loading ? "Loading event registry…" : "No events returned by the API."}</div>}</div><div className="table-foot">SOURCE: /API/EVENTS + RSVP COUNTS <span>{events.length} RECORDS</span></div></section>
    <section className="admin-bottom-grid"><article className="console-panel stream-panel"><div className="panel-title-row"><div><h2><i className="mint-dot" /> Campus ingestion telemetry stream</h2><p>Recent registration records from event endpoints</p></div><span className="live-chip"><i /> API_CONNECTED</span></div><div className="stream-list">{events.flatMap((event) => (event.registrations || []).slice(0, 1).map((registration) => ({ event, registration }))).slice(0, 5).map(({ event, registration }, index) => <div className="stream-row" key={registration.id || `${event.id}-${index}`}><code>{registration.created_at ? new Date(registration.created_at).toLocaleTimeString() : "LIVE"}</code><span><b>{shortId(registration.user_id)}</b> registered for {event.title}</span><em>RSVP_OK</em></div>)}{!events.some((event) => event.registrations?.length) && <div className="stream-empty">The API returns aggregate registration counts. Detailed telemetry requires a dedicated audit endpoint.</div>}</div></article><article className="console-panel compliance-panel"><h2>Compliance snapshot</h2><p>Coverage of current event and registration data.</p><div className="compliance-score"><strong>{events.length ? Math.round(events.filter((event) => event.capacity != null && event.status).length / events.length * 100) : 0}%</strong><span>Events with capacity and status</span></div><div className="compliance-lines"><span>Events visible <b>{events.length}</b></span><span>Account records <b>{users.length}</b></span><span>Admin policy controls <b>Unavailable</b></span></div></article></section>
  </main></div>;
}

function App() {
  const [role, setRole] = useState(() => { const saved = localStorage.getItem(ROLE_KEY); return ROLES.some((item) => item.id === saved) ? saved : "student"; });
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(() => localStorage.getItem(USER_KEY) || "");
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [roster, setRoster] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [loading, setLoading] = useState(true);
  const [rosterLoading, setRosterLoading] = useState(false);
  const [error, setError] = useState("");
  const [connection, setConnection] = useState("CONNECTING");
  const [pending, setPending] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [toast, setToast] = useState("");
  const registeredIds = useMemo(() => new Set(registrations.map((registration) => String(registration.event_id))), [registrations]);

  useEffect(() => {
    let active = true;
    setLoading(true); setError(""); setConnection("CONNECTING");
    Promise.all([api("/api/events"), api("/api/users")])
      .then(async ([eventRows, userRows]) => {
        const hydrated = await Promise.all(eventRows.map(async (event) => {
          try { const rows = await api(`/api/events/${encodeURIComponent(event.id)}/registrations`); return { ...event, registrations: rows, registeredCount: rows.length, countKnown: true }; }
          catch { return { ...event, registrations: [], registeredCount: null, countKnown: false }; }
        }));
        if (active) { setEvents(hydrated); setUsers(userRows); setConnection("LIVE NETWORK"); }
      })
      .catch((loadError) => { if (active) { setError(loadError.message); setConnection("API OFFLINE"); } })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [refreshKey]);

  useEffect(() => {
    const valid = users.some((user) => String(user.id) === String(selectedUser) && user.role === role);
    if (!valid) {
      const first = users.find((user) => user.role === role)?.id || "";
      setSelectedUser(first); if (first) localStorage.setItem(USER_KEY, first); else localStorage.removeItem(USER_KEY);
    }
  }, [users, role]);

  useEffect(() => {
    let active = true;
    if (!selectedUser || role === "admin") { setRegistrations([]); return () => { active = false; }; }
    api(`/api/me/registrations?user_id=${encodeURIComponent(selectedUser)}`).then((rows) => { if (active && role === "student") setRegistrations(rows); }).catch(() => { if (active) setRegistrations([]); });
    return () => { active = false; };
  }, [selectedUser, role, refreshKey]);

  const selectedEvent = useMemo(() => events.find((event) => String(event.id) === String(selectedEventId)) || events.find((event) => !selectedUser || String(event.organizer_id) === String(selectedUser)) || events[0], [events, selectedEventId, selectedUser]);
  useEffect(() => {
    let active = true;
    if (role !== "organizer" || !selectedEvent) { setRoster([]); return () => { active = false; }; }
    setRosterLoading(true);
    api(`/api/events/${encodeURIComponent(selectedEvent.id)}/registrations`).then((rows) => { if (active) setRoster(rows); }).catch((rosterError) => { if (active) setError(rosterError.message); }).finally(() => { if (active) setRosterLoading(false); });
    return () => { active = false; };
  }, [role, selectedEvent?.id, refreshKey]);

  useEffect(() => { if (!toast) return undefined; const timer = window.setTimeout(() => setToast(""), 4000); return () => window.clearTimeout(timer); }, [toast]);

  function changeRole(nextRole) { setRole(nextRole); localStorage.setItem(ROLE_KEY, nextRole); setSelectedEventId(""); }
  function changeUser(value) { setSelectedUser(value); if (value) localStorage.setItem(USER_KEY, value); else localStorage.removeItem(USER_KEY); }
  async function registerForEvent(event) {
    if (!selectedUser) { setToast("Select a student account before reserving a pass."); return; }
    const capacity = capacityFor(event);
    if (!capacity || capacity.left <= 0) { setToast("This event is full or its seat count is unavailable."); return; }
    setPending(String(event.id));
    try { await api("/api/registrations", { method: "POST", body: JSON.stringify({ user_id: selectedUser, event_id: event.id }) }); setToast("Your RSVP is confirmed."); setRefreshKey((key) => key + 1); }
    catch (submitError) { setToast(submitError.message); }
    finally { setPending(""); }
  }

  const studentUsers = users.filter((user) => user.role === "student");
  const roleUsers = users.filter((user) => user.role === role);
  const viewProps = { events, users, selectedUser, loading, error, onRefresh: () => setRefreshKey((key) => key + 1) };
  return <><Header role={role} onRole={changeRole} user={selectedUser} users={roleUsers} onUser={changeUser} connection={connection} />{role === "student" ? <StudentView {...viewProps} registrations={registrations} registeredIds={registeredIds} onRegister={registerForEvent} pending={pending} /> : role === "organizer" ? <OrganizerView {...viewProps} users={users} selectedEventId={selectedEvent?.id || ""} onEvent={setSelectedEventId} roster={roster} rosterLoading={rosterLoading} /> : <AdminView {...viewProps} users={users} />}{toast && <div className="toast-message" role="status">{toast}</div>}</>;
}

export default App;
