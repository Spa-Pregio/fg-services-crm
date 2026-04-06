import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import logo from "./assets/logo.png";
import heroImg from "./assets/hero.png";
import "./App.css";

export default function App() {
  const [view, setView] = useState("website");
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  return (
    <div className="app">
      <Nav view={view} setView={setView} setShowQuoteForm={setShowQuoteForm} />
      {view === "website" ? <Website setShowQuoteForm={setShowQuoteForm} /> : <Admin />}
      {showQuoteForm && <QuoteModal onClose={() => setShowQuoteForm(false)} />}
    </div>
  );
}

function Nav({ view, setView, setShowQuoteForm }) {
  return (
    <nav className="nav">
      <div className="nav-logo">
        <img src={logo} alt="F&G Services" className="nav-logo-img" />
        <span className="nav-logo-text">F&amp;G Services</span>
      </div>
      <div className="nav-links">
        <span className="nav-link" onClick={() => { setView("website"); setShowQuoteForm(false); }}>Services</span>
        <span className="nav-link" onClick={() => { setView("website"); setTimeout(() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" }), 100); }}>Pricing</span>
        <button className="nav-cta" onClick={() => { setView("website"); setShowQuoteForm(true); }}>Get a Quote</button>
        <div className="view-toggle">
          <button className={"toggle-btn " + (view === "website" ? "active" : "inactive")} onClick={() => setView("website")}>Client</button>
          <button className={"toggle-btn " + (view === "admin" ? "active" : "inactive")} onClick={() => setView("admin")}>Admin</button>
        </div>
      </div>
    </nav>
  );
}

function Website({ setShowQuoteForm }) {
  return (
    <main>
      <Hero setShowQuoteForm={setShowQuoteForm} />
      <Ticker />
      <Services />
      <PhotoBand />
      <AddOns />
      <CtaBand setShowQuoteForm={setShowQuoteForm} />
      <Footer />
    </main>
  );
}

function Hero({ setShowQuoteForm }) {
  return (
    <section className="hero">
      <div className="hero-left">
        <div className="hero-rule" />
        <p className="hero-tag">Residential &amp; Commercial · North Carolina</p>
        <h1 className="hero-h1">Fresh Starts.<br /><em>Flawless</em> Spaces.</h1>
        <p className="hero-sub">Quiet, detail-oriented cleaning for homes and businesses that deserve more than ordinary.</p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={() => setShowQuoteForm(true)}>Request a Quote</button>
          <button className="btn-ghost" onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}>View Pricing →</button>
        </div>
      </div>
      <div className="hero-right">
        <img src={heroImg} alt="Clean luxury interior" className="hero-img" />
        <div className="hero-overlay" />
        <div className="hero-badge">
          <span className="hero-badge-num">100%</span>
          <span className="hero-badge-label">Satisfaction Guaranteed</span>
        </div>
      </div>
    </section>
  );
}

function Ticker() {
  const items = ["Residential Cleaning","Commercial Spaces","Move In / Out","Deep Cleans","Add-On Services","Baseboards on Every Visit","North Carolina"];
  return (
    <div className="ticker">
      {items.map((item, i) => (
        <span key={i} className="ticker-group">
          <span className="ticker-item">{item}</span>
          {i < items.length - 1 && <span className="ticker-sep" />}
        </span>
      ))}
    </div>
  );
}

function Services() {
  const svcs = [
    { num: "01", title: "Residential Cleaning", desc: "Weekly, bi-weekly, and deep clean packages tailored to your home. Baseboards included on every visit — no exceptions.", price: "Weekly · Bi-Weekly · One-Time" },
    { num: "02", title: "Commercial Cleaning", desc: "Straightforward, transparent pricing for offices, studios, and commercial spaces — so you always know what to expect.", price: "$0.25 / square foot" },
    { num: "03", title: "Move In / Move Out", desc: "A thorough top-to-bottom clean so every transition begins — or ends — on exactly the right note.", price: "Moving Made Easier" },
  ];
  return (
    <section className="services">
      <p className="section-kicker">What We Offer</p>
      <h2 className="section-h2">Our <em>Services</em></h2>
      <div className="services-grid">
        {svcs.map((s) => (
          <div className="svc-card" key={s.num}>
            <span className="svc-num">{s.num}</span>
            <h3 className="svc-title">{s.title}</h3>
            <p className="svc-desc">{s.desc}</p>
            <p className="svc-price">{s.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function PhotoBand() {
  return (
    <div className="photo-band">
      <div className="photo-cell"><img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80&fit=crop" alt="Kitchen" /><span className="photo-caption">Residential</span></div>
      <div className="photo-cell"><img src="https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=500&q=80&fit=crop" alt="Bathroom" /><span className="photo-caption">Deep Clean</span></div>
      <div className="photo-cell"><img src="https://images.unsplash.com/photo-1563453392212-326f5e854473?w=500&q=80&fit=crop" alt="Office" /><span className="photo-caption">Commercial</span></div>
    </div>
  );
}

function AddOns() {
  const addons = [
    { name: "Oven Cleaning", price: "$35" },
    { name: "Fridge Cleaning", price: "$40" },
    { name: "Dishes", price: "$25" },
    { name: "Laundry", price: "$15 / load" },
    { name: "Ceiling Fans", price: "$15", note: "incl. in Deep Clean" },
    { name: "Windows", price: "$25", note: "incl. in Deep Clean" },
  ];
  return (
    <section className="addons" id="pricing">
      <div className="addons-inner">
        <p className="section-kicker">Extras</p>
        <h2 className="section-h2">Add-On <em>Services</em></h2>
        <div className="addons-grid">
          {addons.map((a, i) => (
            <div className="addon-row" key={i}>
              <span className="addon-name">{a.name}{a.note && <span className="addon-incl"> — {a.note}</span>}</span>
              <span className="addon-price">{a.price}</span>
            </div>
          ))}
          <div className="addon-note">✦ Baseboards are included on every single clean — always.</div>
        </div>
      </div>
    </section>
  );
}

function CtaBand({ setShowQuoteForm }) {
  return (
    <section className="cta-band">
      <h2 className="cta-h2">Let Us Handle<br />The Dirty Work.</h2>
      <p className="cta-sub">Serving homes and businesses across North Carolina.</p>
      <button className="btn-primary" onClick={() => setShowQuoteForm(true)}>Submit a Request</button>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-left">
        <img src={logo} alt="F&G Services" className="footer-logo" />
        <span className="footer-name">F&amp;G Services · North Carolina</span>
      </div>
      <span className="footer-tag">Est. in the business of clean</span>
    </footer>
  );
}

/* ── QUOTE MODAL ── */
// Matches Supabase leads table exactly:
// id, created_at, name, phone, email, city, service, quote (numeric), notes, status

const SERVICE_OPTIONS = [
  "Residential — Weekly",
  "Residential — Bi-Weekly",
  "Residential — One-Time Deep Clean",
  "Commercial Cleaning",
  "Move In / Move Out",
  "Other / Multiple Services",
];

function QuoteModal({ onClose }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    service: "",
    quote: "",
    notes: "",
  });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    const { error } = await supabase.from("leads").insert([{
      name:    form.name,
      email:   form.email,
      phone:   form.phone   || null,
      city:    form.city    || null,
      service: form.service,
      quote:   form.quote   ? parseFloat(form.quote) : null,
      notes:   form.notes   || null,
      status:  "new",
    }]);
    if (error) {
      console.error(error);
      setStatus("error");
    } else {
      setStatus("success");
    }
  };

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>

        {status === "success" ? (
          <div className="modal-success">
            <div className="modal-success-icon">✦</div>
            <h3>Request Received</h3>
            <p>Thank you, {form.name.split(" ")[0]}. We'll be in touch shortly.</p>
            <button className="btn-primary" onClick={onClose}>Close</button>
          </div>
        ) : (
          <>
            <div className="modal-header">
              <p className="section-kicker">Get Started</p>
              <h2 className="modal-title">Request a <em>Quote</em></h2>
            </div>
            <form className="modal-form" onSubmit={handleSubmit}>

              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Jane Smith" required />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="jane@email.com" required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone</label>
                  <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="(555) 000-0000" />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input name="city" value={form.city} onChange={handleChange} placeholder="Greensboro, NC" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Service Type *</label>
                  <select name="service" value={form.service} onChange={handleChange} required>
                    <option value="">Select a service…</option>
                    {SERVICE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Estimated Sq. Ft. / Quote</label>
                  <input name="quote" type="number" min="0" value={form.quote} onChange={handleChange} placeholder="e.g. 1500" />
                </div>
              </div>

              <div className="form-group full">
                <label>Notes / Special Requests</label>
                <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Frequency, access instructions, pets, anything we should know…" rows={4} />
              </div>

              {status === "error" && (
                <p className="form-error">Something went wrong. Please try again or call us directly.</p>
              )}

              <button className="btn-primary btn-submit" type="submit" disabled={status === "loading"}>
                {status === "loading" ? "Sending…" : "Submit Request"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

/* ── ADMIN ── */
const STATUS_COLORS = {
  new:       "#C9A84C",
  contacted: "#6B9FD4",
  booked:    "#6BBD8A",
  closed:    "#666",
};

function Admin() {
  const [leads, setLeads]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]  = useState("all");

  const fetchLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setLeads(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchLeads(); }, []);

  const updateStatus = async (id, newStatus) => {
    await supabase.from("leads").update({ status: newStatus }).eq("id", id);
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, status: newStatus } : l));
  };

  const filtered = filter === "all" ? leads : leads.filter((l) => l.status === filter);
  const counts   = leads.reduce((acc, l) => { acc[l.status] = (acc[l.status] || 0) + 1; return acc; }, {});

  return (
    <div className="admin">
      <div className="admin-header">
        <div>
          <h2 className="admin-title">Admin Dashboard</h2>
          <p className="admin-sub">Quote requests from the website</p>
        </div>
        <button className="btn-refresh" onClick={fetchLeads}>↻ Refresh</button>
      </div>

      {/* STAT CARDS */}
      <div className="admin-stats">
        {[
          { label: "Total Leads",  value: leads.length },
          { label: "New",          value: counts.new       || 0, color: STATUS_COLORS.new },
          { label: "Contacted",    value: counts.contacted  || 0, color: STATUS_COLORS.contacted },
          { label: "Booked",       value: counts.booked     || 0, color: STATUS_COLORS.booked },
        ].map((s) => (
          <div className="stat-card" key={s.label}>
            <span className="stat-value" style={s.color ? { color: s.color } : {}}>{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* FILTERS */}
      <div className="admin-filters">
        {["all","new","contacted","booked","closed"].map((f) => (
          <button key={f} className={"filter-btn " + (filter === f ? "filter-active" : "")} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f !== "all" && counts[f] ? ` (${counts[f]})` : ""}
          </button>
        ))}
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="admin-loading">Loading leads…</div>
      ) : filtered.length === 0 ? (
        <div className="admin-empty">
          <strong>No leads yet</strong>
          <p>{filter === "all" ? "Quote requests will appear here once submitted." : `No ${filter} leads at this time.`}</p>
        </div>
      ) : (
        <div className="leads-table-wrap">
          <table className="leads-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Contact</th>
                <th>City</th>
                <th>Service</th>
                <th>Quote / Sq Ft</th>
                <th>Notes</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr key={lead.id}>
                  <td className="td-date">
                    {new Date(lead.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="td-name">{lead.name}</td>
                  <td className="td-contact">
                    <a href={`mailto:${lead.email}`}>{lead.email}</a>
                    {lead.phone && <span className="td-phone">{lead.phone}</span>}
                  </td>
                  <td className="td-city">{lead.city || <span className="empty-cell">—</span>}</td>
                  <td className="td-service">{lead.service}</td>
                  <td className="td-quote">
                    {lead.quote != null ? lead.quote.toLocaleString() : <span className="empty-cell">—</span>}
                  </td>
                  <td className="td-notes">{lead.notes || <span className="empty-cell">—</span>}</td>
                  <td className="td-status">
                    <select
                      className="status-select"
                      value={lead.status}
                      style={{ color: STATUS_COLORS[lead.status] || "#888" }}
                      onChange={(e) => updateStatus(lead.id, e.target.value)}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="booked">Booked</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
