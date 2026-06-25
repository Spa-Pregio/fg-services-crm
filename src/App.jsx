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
  const isAdmin = window.location.pathname === "/admin" || window.location.hash === "#admin";

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
                    {["Name", "Service", "Source", "City", "Phone", "Date", "Status", "Actions"].map(h => (
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
                      <td style={{ padding: "14px 16px", color: "#d8b36a", whiteSpace: "nowrap" }}>{lead.source || "—"}</td>
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
              ["Source", selected.source || "website"],
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
            <QuoteBuilder lead={selected} />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Public Site ─────────────────────────────────────
// ─── F&G services & pricing — single source of truth ──────────────
// This ONE list feeds both the website Pricing section AND the quote-builder
// dropdown, so the prices can never disagree. Change a price here and it
// updates in both places. Fields:
//   price:   number used to auto-fill the quote builder (null = no preset, just type it)
//   display: how the price reads on the website (only when it's not a plain "$X")
//   unit:    optional note shown in the quote dropdown (e.g. priced per sq ft)
const MAIN_SERVICES = [
  { name: "Commercial Cleaning", price: 0.25, display: "$0.25 / sq ft", unit: "per sq ft" },
  { name: "Residential (Recurring)", price: null, display: "Custom Quote" },
  { name: "Deep Cleaning", price: null, display: "Custom Quote" },
  { name: "Move In / Move Out", price: null, display: "Custom Quote" },
  { name: "The Full Reset Bundle", price: null, display: "Custom Quote" },
];

const ADDON_SERVICES = [
  { name: "Oven Cleaning", price: 35 },
  { name: "Fridge Cleaning", price: 40 },
  { name: "Dishes", price: 25 },
  { name: "Laundry (per load)", price: 15 },
  { name: "Windows", price: 25 },
  { name: "Ceiling Fans", price: 15 },
  { name: "Home Organization", price: 75, display: "From $75" },
  { name: "Junk Removal", price: null, display: "Custom Quote" },
];

// How a price reads on the website
const priceLabel = (s) => s.display || ("$" + s.price);

// Both lists power the quote-builder dropdown, with prices preset where we have them.
const SERVICE_CATALOG = [...MAIN_SERVICES, ...ADDON_SERVICES].map(s => ({
  name: s.unit ? `${s.name} (${s.unit})` : s.name,
  price: s.price == null ? "" : s.price,
}));

function QuoteBuilder({ lead }) {
  const [items, setItems] = useState([{ id: 1, description: "", qty: 1, unitPrice: "" }]);
  const [frequency, setFrequency] = useState("one-time");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [history, setHistory] = useState([]);
  const [showBuilder, setShowBuilder] = useState(false);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    setItems([{ id: 1, description: "", qty: 1, unitPrice: "" }]);
    setFrequency("one-time");
    setMessage("");
    setStatus("idle");
    setShowBuilder(false);
    setDiscount(lead.source?.startsWith("hanger") ? 30 : lead.source?.startsWith("referral") ? 25 : 0);
    fetchHistory();
  }, [lead.id]);

  const fetchHistory = async () => {
    const { data } = await supabase
      .from("quotes")
      .select("*")
      .eq("lead_id", String(lead.id))
      .order("created_at", { ascending: false });
    setHistory(data || []);
  };

  const addItem = () => setItems(prev => [...prev, { id: Date.now(), description: "", qty: 1, unitPrice: "" }]);
  const removeItem = (id) => setItems(prev => prev.length > 1 ? prev.filter(i => i.id !== id) : prev);
  const updateItem = (id, field, value) => setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));

  // Used by the description field: sets the text, and if the chosen text matches
  // a service that has a default price (and the line's price is still empty),
  // auto-fills that price. She can always type over it.
  const handleDescription = (id, value) => {
    const match = SERVICE_CATALOG.find(s => s.name === value);
    setItems(prev => prev.map(i => {
      if (i.id !== id) return i;
      const next = { ...i, description: value };
      if (match && match.price !== "" && (i.unitPrice === "" || i.unitPrice == null)) {
        next.unitPrice = match.price;
      }
      return next;
    }));
  };

  const lineTotal = (it) => (Number(it.qty) || 1) * (Number(it.unitPrice) || 0);
  const subtotal = items.reduce((sum, it) => sum + lineTotal(it), 0);
  const discountNum = Math.min(Number(discount) || 0, subtotal);
  const total = Math.max(0, subtotal - discountNum);
  const money = (n) => "$" + (Number(n) || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const FREQ = [["one-time", "One-time"], ["weekly", "Weekly"], ["biweekly", "Every 2 wks"], ["monthly", "Monthly"]];
  const recurring = frequency !== "one-time";
  const canSend = !!lead.email && total > 0 && items.some(i => i.description.trim());

  const sendQuote = async () => {
    if (!canSend) return;
    setStatus("sending");
    const cleanItems = items
      .filter(i => i.description.trim() || Number(i.unitPrice) > 0)
      .map(i => ({ description: i.description.trim(), qty: Number(i.qty) || 1, unitPrice: Number(i.unitPrice) || 0 }));

    if (discountNum > 0) {
      const label = lead.source?.startsWith("hanger") ? "Neighbor discount (door hanger)"
        : lead.source?.startsWith("referral") ? "Referral discount"
        : "Discount";
      cleanItems.push({ description: label, qty: 1, unitPrice: -discountNum });
    }

    const quote = {
      lead_id: String(lead.id), customer_name: lead.name, customer_email: lead.email,
      line_items: cleanItems, frequency, subtotal, total,
      message: message.trim() || null, status: "sent",
    };

    const { error: dbError } = await supabase.from("quotes").insert([quote]);
    if (dbError) { console.error("Save quote failed:", dbError); setStatus("error"); return; }

    try {
      await supabase.functions.invoke("send-customer-quote", { body: quote });
    } catch (err) {
      console.error("Quote email failed:", err);
    }

    setStatus("sent");
    fetchHistory();
  };

  const inputStyle = { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "8px", color: "#f6f2ea", padding: "8px 10px", fontSize: "13px", width: "100%", boxSizing: "border-box" };

  return (
    <div style={{ marginTop: "24px", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ color: "#d8b36a", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>Quotes</p>
        {!showBuilder && (
          <button onClick={() => setShowBuilder(true)} style={{ background: "rgba(216,179,106,0.15)", border: "1px solid rgba(216,179,106,0.3)", color: "#d8b36a", borderRadius: "8px", padding: "6px 12px", cursor: "pointer", fontSize: "12px" }}>+ New Quote</button>
        )}
      </div>

      {history.length > 0 && (
        <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "6px" }}>
          {history.map(h => (
            <div key={h.id} style={{ display: "flex", justifyContent: "space-between", background: "rgba(255,255,255,0.04)", borderRadius: "8px", padding: "8px 12px", fontSize: "12px" }}>
              <span style={{ color: "#cfc7b8" }}>{new Date(h.created_at).toLocaleDateString()} · {h.frequency === "one-time" ? "One-time" : h.frequency}</span>
              <span style={{ color: "#f6f2ea", fontWeight: 600 }}>{money(h.total)}{h.frequency !== "one-time" ? "/visit" : ""}</span>
            </div>
          ))}
        </div>
      )}

      {showBuilder && (
        <div style={{ marginTop: "14px" }}>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
            {FREQ.map(([val, label]) => (
              <button key={val} onClick={() => setFrequency(val)} style={{ background: frequency === val ? "rgba(216,179,106,0.2)" : "transparent", color: frequency === val ? "#d8b36a" : "#cfc7b8", border: "1px solid " + (frequency === val ? "#d8b36a" : "rgba(255,255,255,0.15)"), borderRadius: "999px", padding: "5px 12px", cursor: "pointer", fontSize: "12px" }}>{label}</button>
            ))}
          </div>

          <datalist id="fg-service-options">
            {SERVICE_CATALOG.map(s => <option key={s.name} value={s.name} />)}
          </datalist>
          {items.map((it) => (
            <div key={it.id} style={{ display: "flex", gap: "6px", marginBottom: "8px", alignItems: "center" }}>
              <input list="fg-service-options" placeholder="Pick a service or type your own" value={it.description} onChange={e => handleDescription(it.id, e.target.value)} style={{ ...inputStyle, flex: 1 }} />
              <input type="number" min="1" placeholder="Qty" value={it.qty} onChange={e => updateItem(it.id, "qty", e.target.value)} style={{ ...inputStyle, width: "52px" }} />
              <input type="number" min="0" step="0.01" placeholder="Price" value={it.unitPrice} onChange={e => updateItem(it.id, "unitPrice", e.target.value)} style={{ ...inputStyle, width: "82px" }} />
              <button onClick={() => removeItem(it.id)} style={{ background: "transparent", border: 0, color: "#888", cursor: "pointer", fontSize: "18px", padding: "0 4px" }}>×</button>
            </div>
          ))}
          <button onClick={addItem} style={{ background: "transparent", border: "1px dashed rgba(255,255,255,0.2)", color: "#cfc7b8", borderRadius: "8px", padding: "6px", cursor: "pointer", fontSize: "12px", width: "100%", marginBottom: "12px" }}>+ Add line</button>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", marginBottom: "12px", paddingTop: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0" }}>
              <span style={{ color: "#cfc7b8", fontSize: "13px" }}>Subtotal</span>
              <span style={{ color: "#cfc7b8", fontSize: "13px" }}>{money(subtotal)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0" }}>
              <span style={{ color: "#cfc7b8", fontSize: "13px" }}>
                Discount{lead.source?.startsWith("hanger") ? " (door hanger)" : lead.source?.startsWith("referral") ? " (referral)" : ""}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ color: "#cfc7b8", fontSize: "13px" }}>−$</span>
                <input type="number" min="0" step="1" value={discount} onChange={e => setDiscount(e.target.value)}
                  style={{ ...inputStyle, width: "70px", padding: "4px 8px", textAlign: "right" }} />
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0 0", borderTop: "1px solid rgba(255,255,255,0.08)", marginTop: "4px" }}>
              <span style={{ color: "#d8b36a", fontSize: "14px", fontWeight: 600 }}>{recurring ? "Total per visit" : "Total"}</span>
              <span style={{ color: "#d8b36a", fontSize: "16px", fontWeight: 700 }}>{money(total)}</span>
            </div>
          </div>

          <textarea placeholder="Optional note to the customer..." value={message} onChange={e => setMessage(e.target.value)} rows={2} style={{ ...inputStyle, resize: "vertical", marginBottom: "12px", fontFamily: "inherit" }} />

          {status === "sent" ? (
            <p style={{ color: "#50c878", fontSize: "13px", textAlign: "center", margin: "8px 0" }}>✓ Quote sent to {lead.email}</p>
          ) : (
            <button onClick={sendQuote} disabled={!canSend || status === "sending"} className="btn btn-gold" style={{ width: "100%", fontSize: "14px", opacity: canSend && status !== "sending" ? 1 : 0.5, cursor: canSend ? "pointer" : "not-allowed" }}>
              {status === "sending" ? "Sending..." : "Send Quote to Customer"}
            </button>
          )}
          {status === "error" && <p style={{ color: "#ff6b6b", fontSize: "12px", textAlign: "center", margin: "8px 0 0" }}>Couldn't save the quote — try again.</p>}
          {!lead.email && <p style={{ color: "#ff6b6b", fontSize: "12px", textAlign: "center", margin: "8px 0 0" }}>This lead has no email on file.</p>}
        </div>
      )}
    </div>
  );
}

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
            {MAIN_SERVICES.map((s) => (
              <div className="price-row" key={s.name}><span>{s.name}</span><strong>{priceLabel(s)}</strong></div>
            ))}
          </div>
        </div>
        <div className="addons-panel">
          <h3>Add-On Services</h3>
          <div className="addons-list">
            {ADDON_SERVICES.map((s) => (
              <div className="price-row" key={s.name}><span>{s.name}</span><strong>{priceLabel(s)}</strong></div>
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

    const params = new URLSearchParams(window.location.search);
    const source = params.get("src") || params.get("ref") || "website";

    const lead = {
      name: form.name, email: form.email,
      phone: form.phone || null, city: form.city || null,
      service: form.service, quote: form.quote ? parseFloat(form.quote) : null,
      notes: form.notes || null, status: "new",
      source,
    };

    // 1. Save the lead to Supabase (powers the /admin dashboard)
    const { error: dbError } = await supabase.from("leads").insert([lead]);
    if (dbError) console.error("Supabase insert failed:", dbError);

    // 2. Email F&G Services via the send-quote-email edge function (Resend)
    try {
      await supabase.functions.invoke("send-quote-email", { body: lead });
    } catch (err) {
      console.error("Quote notification email failed:", err);
    }

    // Lead is saved even if the email hiccups, so success tracks the save
    setStatus(dbError ? "error" : "success");
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
