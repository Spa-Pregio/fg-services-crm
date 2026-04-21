import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import "./App.css";

const SERVICE_OPTIONS = [
  "Residential Cleaning",
  "Deep Cleaning",
  "Move In / Move Out",
  "Commercial Cleaning",
  "Airbnb / Turnover Cleaning",
  "Home Organization",
  "Laundry Service",
  "Junk Removal",
  "The Full Reset (Bundle)",
  "Custom Request",
];

const STATUS_OPTIONS = ["new", "contacted", "booked", "closed"];

const STATUS_COLORS = {
  new: { bg: "rgba(216,179,106,0.15)", color: "#d8b36a", label: "New" },
  contacted: { bg: "rgba(100,160,255,0.15)", color: "#64a0ff", label: "Contacted" },
  booked: { bg: "rgba(80,200,120,0.15)", color: "#50c878", label: "Booked" },
  closed: { bg: "rgba(150,150,150,0.15)", color: "#999", label: "Closed" },
};

export default function App() {
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const isAdmin = window.location.pathname === "/admin";

  if (isAdmin) return <AdminApp />;

  return (
    <div className="site-shell">
      <Header onQuote={() => setShowQuoteForm(true)} />
      <Hero onQuote={() => setShowQuoteForm(true)} />
      <Services />
      <Bundle onQuote={() => setShowQuoteForm(true)} />
      <About />
      <Pricing />
      <WhyChooseUs />
      <CTA onQuote={() => setShowQuoteForm(true)} />
      <Footer />
      {showQuoteForm && <QuoteModal onClose={() => setShowQuoteForm(false)} />}
    </div>
  );
}

// ─── Admin App ───────────────────────────────────────
function AdminApp() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <AdminLoader />;
  if (!session) return <AdminLogin />;
  return <AdminDashboard session={session} />;
}

function AdminLoader() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f1014" }}>
      <p style={{ color: "#d8b36a", fontFamily: "Georgia, serif", fontSize: "1.2rem" }}>Loading...</p>
    </div>
  );
}

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError("Invalid email or password. Please try again.");
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f1014", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "400px", background: "#151821", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "24px", padding: "40px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <img src="/fg-logo.png" alt="F&G Services" style={{ width: "180px", mixBlendMode: "lighten", marginBottom: "16px" }} />
          <p style={{ color: "#cfc7b8", fontSize: "14px", margin: 0 }}>Admin Dashboard</p>
        </div>
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="field">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="markiegay175@gmail.com" />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
          </div>
          {error && <p style={{ color: "#ff8f8f", fontSize: "13px", margin: 0 }}>{error}</p>}
          <button className="btn btn-gold btn-full" type="submit" disabled={loading} style={{ marginTop: "8px" }}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

function AdminDashboard({ session }) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  useEffect(() => { fetchLeads(); }, []);

  const fetchLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setLeads(data || []);
    setLoading(false);
  };

  const updateStatus = async (id, status) => {
    await supabase.from("leads").update({ status }).eq("id", id);
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    if (selected?.id === id) setSelected(prev => ({ ...prev, status }));
  };

  const deleteLead = async (id) => {
    if (!confirm("Delete this lead?")) return;
    await supabase.from("leads").delete().eq("id", id);
    setLeads(prev => prev.filter(l => l.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const handleSignOut = () => supabase.auth.signOut();

  const filtered = filter === "all" ? leads : leads.filter(l => l.status === filter);

  const counts = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s] = leads.filter(l => l.status === s).length;
    return acc;
  }, {});

  return (
    <div style={{ minHeight: "100vh", background: "#0f1014", color: "#f6f2ea" }}>
      {/* Header */}
      <div style={{ background: "rgba(15,16,20,0.95)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "16px 0", position: "sticky", top: 0, zIndex: 30 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <img src="/fg-logo.png" alt="F&G Services" style={{ width: "120px", mixBlendMode: "lighten" }} />
            <span style={{ color: "#d8b36a", fontSize: "13px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Admin</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span style={{ fontSize: "13px", color: "#cfc7b8" }}>{session.user.email}</span>
            <button onClick={handleSignOut} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "#cfc7b8", borderRadius: "999px", padding: "8px 16px", cursor: "pointer", fontSize: "13px" }}>
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "16px", marginBottom: "32px" }}>
          {[
            { label: "Total Leads", value: leads.length, color: "#d8b36a" },
            { label: "New", value: counts.new || 0, color: "#d8b36a" },
            { label: "Contacted", value: counts.contacted || 0, color: "#64a0ff" },
            { label: "Booked", value: counts.booked || 0, color: "#50c878" },
            { label: "Closed", value: counts.closed || 0, color: "#999" },
          ].map(stat => (
            <div key={stat.label} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "20px" }}>
              <p style={{ fontSize: "12px", color: "#cfc7b8", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.08em" }}>{stat.label}</p>
              <p style={{ fontSize: "28px", fontFamily: "Georgia, serif", color: stat.color, margin: 0 }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
          {["all", ...STATUS_OPTIONS].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              background: filter === f ? "#d8b36a" : "rgba(255,255,255,0.05)",
              color: filter === f ? "#111" : "#cfc7b8",
              border: "1px solid " + (filter === f ? "#d8b36a" : "rgba(255,255,255,0.1)"),
              borderRadius: "999px", padding: "8px 18px", cursor: "pointer", fontSize: "13px", fontWeight: 600, textTransform: "capitalize"
            }}>
              {f === "all" ? `All (${leads.length})` : `${STATUS_COLORS[f].label} (${counts[f] || 0})`}
            </button>
          ))}
        </div>

        {/* Leads table */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", overflow: "hidden" }}>
          {loading ? (
            <p style={{ textAlign: "center", padding: "48px", color: "#cfc7b8" }}>Loading leads...</p>
          ) : filtered.length === 0 ? (
            <p style={{ textAlign: "center", padding: "48px", color: "#cfc7b8" }}>No leads yet.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    {["Name", "Service", "City", "Phone", "Date", "Status", "Actions"].map(h => (
                      <th key={h} style={{ padding: "14px 16px", textAlign: "left", color: "#cfc7b8", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(lead => (
                    <tr key={lead.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", cursor: "pointer" }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ fontWeight: 600, color: "#f6f2ea" }}>{lead.name}</div>
                        <div style={{ fontSize: "12px", color: "#cfc7b8" }}>{lead.email}</div>
                      </td>
                      <td style={{ padding: "14px 16px", color: "#cfc7b8" }}>{lead.service}</td>
                      <td style={{ padding: "14px 16px", color: "#cfc7b8" }}>{lead.city || "—"}</td>
                      <td style={{ padding: "14px 16px", color: "#cfc7b8" }}>{lead.phone || "—"}</td>
                      <td style={{ padding: "14px 16px", color: "#cfc7b8", whiteSpace: "nowrap" }}>
                        {new Date(lead.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <select
                          value={lead.status || "new"}
                          onChange={e => { e.stopPropagation(); updateStatus(lead.id, e.target.value); }}
                          style={{
                            background: STATUS_COLORS[lead.status || "new"].bg,
                            color: STATUS_COLORS[lead.status || "new"].color,
                            border: "1px solid " + STATUS_COLORS[lead.status || "new"].color,
                            borderRadius: "999px", padding: "4px 12px", fontSize: "12px", fontWeight: 600, cursor: "pointer"
                          }}
                        >
                          {STATUS_OPTIONS.map(s => (
                            <option key={s} value={s} style={{ background: "#151821", color: "#f6f2ea" }}>
                              {STATUS_COLORS[s].label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button onClick={() => setSelected(lead)} style={{ background: "rgba(216,179,106,0.15)", border: "1px solid rgba(216,179,106,0.3)", color: "#d8b36a", borderRadius: "8px", padding: "6px 12px", cursor: "pointer", fontSize: "12px" }}>
                            View
                          </button>
                          <button onClick={() => deleteLead(lead.id)} style={{ background: "rgba(255,100,100,0.1)", border: "1px solid rgba(255,100,100,0.3)", color: "#ff6464", borderRadius: "8px", padding: "6px 12px", cursor: "pointer", fontSize: "12px" }}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Lead detail modal */}
      {selected && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "24px" }}
          onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div style={{ background: "#151821", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "24px", padding: "36px", width: "100%", maxWidth: "500px", position: "relative", maxHeight: "90vh", overflowY: "auto" }}>
            <button onClick={() => setSelected(null)} style={{ position: "absolute", top: "14px", right: "14px", background: "rgba(255,255,255,0.08)", border: 0, color: "white", width: "36px", height: "36px", borderRadius: "50%", cursor: "pointer", fontSize: "18px" }}>×</button>
            <p style={{ color: "#d8b36a", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 8px" }}>Lead Details</p>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: "1.8rem", margin: "0 0 24px", color: "#f6f2ea" }}>{selected.name}</h2>
            {[
              ["Email", selected.email],
              ["Phone", selected.phone || "Not provided"],
              ["City", selected.city || "Not provided"],
              ["Service", selected.service],
              ["Sq Ft / Budget", selected.quote || "Not provided"],
              ["Submitted", new Date(selected.created_at).toLocaleString()],
            ].map(([label, value]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ color: "#cfc7b8", fontSize: "13px" }}>{label}</span>
                <span style={{ color: "#f6f2ea", fontSize: "13px", textAlign: "right", maxWidth: "60%" }}>{value}</span>
              </div>
            ))}
            {selected.notes && (
              <div style={{ marginTop: "16px", background: "rgba(255,255,255,0.04)", borderRadius: "12px", padding: "16px" }}>
                <p style={{ color: "#cfc7b8", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 8px" }}>Notes</p>
                <p style={{ color: "#f6f2ea", fontSize: "14px", lineHeight: 1.6, margin: 0 }}>{selected.notes}</p>
              </div>
            )}
            <div style={{ marginTop: "24px" }}>
              <p style={{ color: "#cfc7b8", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 10px" }}>Update Status</p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {STATUS_OPTIONS.map(s => (
                  <button key={s} onClick={() => updateStatus(selected.id, s)} style={{
                    background: selected.status === s ? STATUS_COLORS[s].bg : "transparent",
                    color: STATUS_COLORS[s].color,
                    border: "1px solid " + STATUS_COLORS[s].color,
                    borderRadius: "999px", padding: "8px 16px", cursor: "pointer", fontSize: "13px", fontWeight: 600
                  }}>
                    {STATUS_COLORS[s].label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginTop: "16px", display: "flex", gap: "10px" }}>
              <a href={`mailto:${selected.email}`} className="btn btn-gold" style={{ flex: 1, textAlign: "center", fontSize: "14px" }}>
                Email Client
              </a>
              {selected.phone && (
                <a href={`tel:${selected.phone}`} className="btn btn-outline" style={{ flex: 1, textAlign: "center", fontSize: "14px" }}>
                  Call Client
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Public Site ─────────────────────────────────────
function Header({ onQuote }) {
  return (
    <header className="header">
      <div className="container header-inner">
        <div className="brand">
          <img src="/fg-logo.png" alt="F&G Services" style={{ height: "auto", width: "220px", mixBlendMode: "lighten" }} />
        </div>
        <nav className="nav">
          <a href="#services">Services</a>
          <a href="#about">About</a>
          <a href="#pricing">Pricing</a>
          <a href="#why">Why Us</a>
          <button className="btn btn-gold" onClick={onQuote}>Get a Quote</button>
        </nav>
      </div>
    </header>
  );
}

function Hero({ onQuote }) {
  return (
    <section className="hero">
      <div className="hero-overlay" />
      <div className="container hero-inner">
        <p className="eyebrow">Residential &amp; Commercial · The Triad, NC</p>
        <h1>Fresh Starts. <span>Flawless Spaces.</span></h1>
        <p className="hero-copy">
          Elevated cleaning, organization, and junk removal services for busy
          households, polished businesses, and clients who want more than basic.
        </p>
        <div className="hero-actions">
          <button className="btn btn-gold" onClick={onQuote}>Request a Quote</button>
          <a className="btn btn-outline" href="#services">View Services</a>
        </div>
      </div>
    </section>
  );
}

function Services() {
  const services = [
    { title: "Residential Cleaning", text: "Recurring or one-time cleaning tailored to your home and lifestyle. We work around your schedule." },
    { title: "Deep Cleaning", text: "A detail-focused reset for kitchens, bathrooms, floors, and high-touch surfaces. Nothing gets skipped." },
    { title: "Move In / Move Out", text: "A clean, fresh start for transitions, leases, and real-estate turnover. Leave the old place spotless." },
    { title: "Commercial Cleaning", text: "Professional cleaning for offices, suites, and small business spaces. A clean workspace is a productive one." },
    { title: "Airbnb / Turnover", text: "Fast, guest-ready turnover service to keep your property presentation sharp between every stay." },
    { title: "Home Organization", text: "Closets, pantries, kitchens, garages — we bring order to the spaces that stress you out most." },
    { title: "Laundry Service", text: "Wash, dry, fold, and put away — handled during your clean so you come home to a fully refreshed home." },
    { title: "Junk Removal", text: "Moving out and leaving things behind? We haul it all away — furniture, debris, and everything in between." },
    { title: "Custom Requests", text: "Need something specific? We tailor service to your space, your priorities, and your timeline." },
  ];

  return (
    <section id="services" className="section">
      <div className="container">
        <p className="section-label">Services</p>
        <h2 className="section-title">What We Offer</h2>
        <p className="section-copy" style={{ marginBottom: "8px" }}>
          From weekly maintenance to full move-out cleanouts — F&amp;G Services handles it all with the same care and attention every time.
        </p>
        <div className="grid cards-3" style={{ marginTop: "36px" }}>
          {services.map(s => (
            <article className="card" key={s.title}>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Bundle({ onQuote }) {
  return (
    <section className="section section-dark">
      <div className="container">
        <p className="section-label">Signature Package</p>
        <h2 className="section-title light">The Full Reset</h2>
        <p className="section-copy light-copy" style={{ margin: "0 auto 32px" }}>
          Our most popular offering — a complete home refresh in a single visit.
          We clean top to bottom, tackle the laundry, and organize the spaces
          that need it most. You leave for the day and come home to a house that feels brand new.
        </p>
        <ul className="check-list bundle-checklist">
          <li>Full top-to-bottom clean</li>
          <li>Laundry washed, dried &amp; folded</li>
          <li>Organization of up to 2 spaces</li>
          <li>Custom pricing based on your home</li>
        </ul>
        <button className="btn btn-gold" onClick={onQuote} style={{ marginTop: "36px" }}>
          Book The Full Reset
        </button>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <div className="about-wrap">
          <div className="about-text">
            <p className="section-label">Our Story</p>
            <h2 className="section-title">Built on Trust. Driven by Pride.</h2>
            <p className="section-copy" style={{ marginBottom: "20px" }}>
              F&amp;G Services was built on something simple: a belief that a clean space changes everything. It clears your mind, lifts your mood, and gives you room to breathe.
            </p>
            <p className="section-copy" style={{ marginBottom: "20px" }}>
              Markie has been doing this work for years — not because she had to, but because she genuinely takes pride in leaving every space better than she found it. Now, alongside her fiancé Farlow, F&amp;G Services is growing into something bigger: a family-owned business rooted right here in the Triad, built on trust, and committed to a flawless result every single time.
            </p>
            <p className="section-copy">
              When you book with us, you're not just hiring a cleaning service. You're inviting people who care into your space — and we don't take that lightly.
            </p>
          </div>
          <div className="about-card soft-card">
            <div className="about-stat">
              <span className="stat-number">Years</span>
              <span className="stat-label">of hands-on experience</span>
            </div>
            <div className="about-divider" />
            <div className="about-stat">
              <span className="stat-number">Family</span>
              <span className="stat-label">owned &amp; operated</span>
            </div>
            <div className="about-divider" />
            <div className="about-stat">
              <span className="stat-number">Triad</span>
              <span className="stat-label">Greensboro · High Point · Trinity · Randleman</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const addOns = [
    ["Oven Cleaning", "$35"], ["Fridge Cleaning", "$40"], ["Dishes", "$25"],
    ["Laundry (per load)", "$15"], ["Windows", "$25"], ["Ceiling Fans", "$15"],
    ["Home Organization", "From $75"], ["Junk Removal", "Custom Quote"],
  ];

  return (
    <section id="pricing" className="section section-dark">
      <div className="container pricing-wrap">
        <div>
          <p className="section-label">Pricing</p>
          <h2 className="section-title light">Simple &amp; Transparent</h2>
          <p className="section-copy light-copy">
            Final pricing depends on square footage, condition, frequency, and service type. Request a quote for a custom estimate — we respond quickly.
          </p>
          <div className="price-panel">
            {[
              ["Commercial Cleaning", "$0.25 / sq ft"],
              ["Residential (Recurring)", "Custom Quote"],
              ["Deep Cleaning", "Custom Quote"],
              ["Move In / Move Out", "Custom Quote"],
              ["The Full Reset Bundle", "Custom Quote"],
            ].map(([name, price]) => (
              <div className="price-row" key={name}><span>{name}</span><strong>{price}</strong></div>
            ))}
          </div>
        </div>
        <div className="addons-panel">
          <h3>Add-On Services</h3>
          <div className="addons-list">
            {addOns.map(([name, price]) => (
              <div className="price-row" key={name}><span>{name}</span><strong>{price}</strong></div>
            ))}
          </div>
          <p className="addons-note">Baseboards included on every clean.</p>
        </div>
      </div>
    </section>
  );
}

function WhyChooseUs() {
  const items = [
    "Years of trusted, hands-on experience",
    "Family-owned — we treat your home like our own",
    "Reliable, detail-focused, and always professional",
    "Flexible residential, commercial, and specialty services",
    "Locally rooted in the Triad community",
    "Designed for repeat clients and referrals",
  ];

  return (
    <section id="why" className="section">
      <div className="container why-wrap">
        <div>
          <p className="section-label">Why F&amp;G</p>
          <h2 className="section-title">Clean That Feels Elevated</h2>
          <p className="section-copy">
            We believe a clean space should feel peaceful, fresh, and professionally cared for. Our approach combines consistency, discretion, and genuine attention to detail — every single visit.
          </p>
        </div>
        <div className="soft-card">
          <ul className="check-list">
            {items.map(item => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}

function CTA({ onQuote }) {
  return (
    <section className="cta">
      <div className="container">
        <div className="cta-inner">
          <h2>Ready for a cleaner, calmer space?</h2>
          <p>Request your quote and let F&amp;G Services do the rest. We serve Greensboro, High Point, Trinity, Randleman, and surrounding areas.</p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn btn-gold" onClick={onQuote}>Start My Quote</button>
            <a className="btn btn-outline" href="tel:3368588821">Call 336-858-8821</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <strong>F&amp;G Services</strong>
          <p>Luxury Cleaning Services · The Triad, North Carolina</p>
          <p style={{ marginTop: "6px" }}>
            <a href="tel:3368588821" style={{ color: "var(--gold)" }}>336-858-8821</a>
          </p>
        </div>
        <div className="footer-links">
          <a href="#services">Services</a>
          <a href="#about">About</a>
          <a href="#pricing">Pricing</a>
          <a href="#why">Why Us</a>
        </div>
      </div>
      <div className="container" style={{ marginTop: "24px", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "20px" }}>
        <p style={{ fontSize: "12px", color: "var(--muted)", textAlign: "center" }}>
          © {new Date().getFullYear()} F&amp;G Services · Fresh Starts. Flawless Spaces. · Serving the Triad with pride.
        </p>
      </div>
    </footer>
  );
}

function QuoteModal({ onClose }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", city: "", service: "", quote: "", notes: "" });
  const [status, setStatus] = useState("idle");

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    const { error } = await supabase.from("leads").insert([{
      name: form.name, email: form.email,
      phone: form.phone || null, city: form.city || null,
      service: form.service, quote: form.quote ? parseFloat(form.quote) : null,
      notes: form.notes || null, status: "new",
    }]);
    if (error) { console.error(error); setStatus("error"); return; }
    setStatus("success");
  };

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>×</button>
        {status === "success" ? (
          <div className="success-state">
            <h3>Quote Request Received</h3>
            <p>Thanks, {form.name.split(" ")[0] || "there"} — we'll be in touch soon. You can also reach us at{" "}
              <a href="tel:3368588821" style={{ color: "var(--gold)" }}>336-858-8821</a>.
            </p>
            <button className="btn btn-gold" onClick={onClose}>Close</button>
          </div>
        ) : (
          <>
            <p className="section-label">Get Started</p>
            <h2 className="modal-title">Request a Quote</h2>
            <form className="quote-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="field"><label>Full Name *</label><input name="name" value={form.name} onChange={handleChange} required /></div>
                <div className="field"><label>Email *</label><input name="email" type="email" value={form.email} onChange={handleChange} required /></div>
                <div className="field"><label>Phone</label><input name="phone" value={form.phone} onChange={handleChange} /></div>
                <div className="field"><label>City</label><input name="city" value={form.city} onChange={handleChange} /></div>
                <div className="field field-full">
                  <label>Service *</label>
                  <select name="service" value={form.service} onChange={handleChange} required>
                    <option value="">Select a service</option>
                    {SERVICE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="field field-full">
                  <label>Estimated Sq Ft / Budget</label>
                  <input name="quote" type="number" min="0" value={form.quote} onChange={handleChange} placeholder="Optional" />
                </div>
                <div className="field field-full">
                  <label>Notes</label>
                  <textarea name="notes" rows="4" value={form.notes} onChange={handleChange} placeholder="Tell us about your space, timing, or special requests" />
                </div>
              </div>
              {status === "error" && <p className="error-text">Something went wrong. Please try again.</p>}
              <button className="btn btn-gold btn-full" type="submit" disabled={status === "loading"}>
                {status === "loading" ? "Sending..." : "Submit Request"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
