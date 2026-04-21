import { useState } from "react";
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

export default function App() {
  const [showQuoteForm, setShowQuoteForm] = useState(false);

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

function Header({ onQuote }) {
  return (
    <header className="header">
      <div className="container header-inner">
        <div className="brand">
          <img
            src="/F_G_Services_Elegant_Banner_Design.png"
            alt="F&G Services"
            style={{ height: "52px", width: "auto" }}
          />
        </div>
        <nav className="nav">
          <a href="#services">Services</a>
          <a href="#about">About</a>
          <a href="#pricing">Pricing</a>
          <a href="#why">Why Us</a>
          <button className="btn btn-gold" onClick={onQuote}>
            Get a Quote
          </button>
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
        <h1>
          Fresh Starts. <span>Flawless Spaces.</span>
        </h1>
        <p className="hero-copy">
          Elevated cleaning, organization, and junk removal services for busy
          households, polished businesses, and clients who want more than basic.
        </p>
        <div className="hero-actions">
          <button className="btn btn-gold" onClick={onQuote}>
            Request a Quote
          </button>
          <a className="btn btn-outline" href="#services">
            View Services
          </a>
        </div>
      </div>
    </section>
  );
}

function Services() {
  const services = [
    {
      title: "Residential Cleaning",
      text: "Recurring or one-time cleaning tailored to your home and lifestyle. We work around your schedule.",
    },
    {
      title: "Deep Cleaning",
      text: "A detail-focused reset for kitchens, bathrooms, floors, and high-touch surfaces. Nothing gets skipped.",
    },
    {
      title: "Move In / Move Out",
      text: "A clean, fresh start for transitions, leases, and real-estate turnover. Leave the old place spotless.",
    },
    {
      title: "Commercial Cleaning",
      text: "Professional cleaning for offices, suites, and small business spaces. A clean workspace is a productive one.",
    },
    {
      title: "Airbnb / Turnover",
      text: "Fast, guest-ready turnover service to keep your property presentation sharp between every stay.",
    },
    {
      title: "Home Organization",
      text: "Closets, pantries, kitchens, garages — we bring order to the spaces that stress you out most.",
    },
    {
      title: "Laundry Service",
      text: "Wash, dry, fold, and put away — handled during your clean so you come home to a fully refreshed home.",
    },
    {
      title: "Junk Removal",
      text: "Moving out and leaving things behind? We haul it all away — furniture, debris, and everything in between.",
    },
    {
      title: "Custom Requests",
      text: "Need something specific? We tailor service to your space, your priorities, and your timeline.",
    },
  ];

  return (
    <section id="services" className="section">
      <div className="container">
        <p className="section-label">Services</p>
        <h2 className="section-title">What We Offer</h2>
        <p className="section-copy" style={{ marginBottom: "8px" }}>
          From weekly maintenance to full move-out cleanouts — F&amp;G Services
          handles it all with the same care and attention every time.
        </p>
        <div className="grid cards-3" style={{ marginTop: "36px" }}>
          {services.map((service) => (
            <article className="card" key={service.title}>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
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
          that need it most. You leave for the day and come home to a house that
          feels brand new.
        </p>
        <ul className="check-list bundle-checklist">
          <li>Full top-to-bottom clean</li>
          <li>Laundry washed, dried &amp; folded</li>
          <li>Organization of up to 2 spaces</li>
          <li>Custom pricing based on your home</li>
        </ul>
        <button
          className="btn btn-gold"
          onClick={onQuote}
          style={{ marginTop: "36px" }}
        >
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
              F&amp;G Services was built on something simple: a belief that a
              clean space changes everything. It clears your mind, lifts your
              mood, and gives you room to breathe.
            </p>
            <p className="section-copy" style={{ marginBottom: "20px" }}>
              Markie has been doing this work for years — not because she had
              to, but because she genuinely takes pride in leaving every space
              better than she found it. Now, alongside her fiancé Farlow,
              F&amp;G Services is growing into something bigger: a family-owned
              business rooted right here in the Triad, built on trust, and
              committed to a flawless result every single time.
            </p>
            <p className="section-copy">
              When you book with us, you're not just hiring a cleaning service.
              You're inviting people who care into your space — and we don't
              take that lightly.
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
              <span className="stat-label">
                Greensboro · High Point · Trinity · Randleman
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const addOns = [
    ["Oven Cleaning", "$35"],
    ["Fridge Cleaning", "$40"],
    ["Dishes", "$25"],
    ["Laundry (per load)", "$15"],
    ["Windows", "$25"],
    ["Ceiling Fans", "$15"],
    ["Home Organization", "From $75"],
    ["Junk Removal", "Custom Quote"],
  ];

  return (
    <section id="pricing" className="section section-dark">
      <div className="container pricing-wrap">
        <div>
          <p className="section-label">Pricing</p>
          <h2 className="section-title light">Simple &amp; Transparent</h2>
          <p className="section-copy light-copy">
            Final pricing depends on square footage, condition, frequency, and
            service type. Request a quote for a custom estimate — we respond
            quickly.
          </p>
          <div className="price-panel">
            <div className="price-row">
              <span>Commercial Cleaning</span>
              <strong>$0.25 / sq ft</strong>
            </div>
            <div className="price-row">
              <span>Residential (Recurring)</span>
              <strong>Custom Quote</strong>
            </div>
            <div className="price-row">
              <span>Deep Cleaning</span>
              <strong>Custom Quote</strong>
            </div>
            <div className="price-row">
              <span>Move In / Move Out</span>
              <strong>Custom Quote</strong>
            </div>
            <div className="price-row">
              <span>The Full Reset Bundle</span>
              <strong>Custom Quote</strong>
            </div>
          </div>
        </div>
        <div className="addons-panel">
          <h3>Add-On Services</h3>
          <div className="addons-list">
            {addOns.map(([name, price]) => (
              <div className="price-row" key={name}>
                <span>{name}</span>
                <strong>{price}</strong>
              </div>
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
            We believe a clean space should feel peaceful, fresh, and
            professionally cared for. Our approach combines consistency,
            discretion, and genuine attention to detail — every single visit.
          </p>
        </div>
        <div className="soft-card">
          <ul className="check-list">
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
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
          <p>
            Request your quote and let F&amp;G Services do the rest. We serve
            Greensboro, High Point, Trinity, Randleman, and surrounding areas.
          </p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn btn-gold" onClick={onQuote}>
              Start My Quote
            </button>
            <a className="btn btn-outline" href="tel:3368588821">
              Call 336-858-8821
            </a>
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
            <a href="tel:3368588821" style={{ color: "var(--gold)" }}>
              336-858-8821
            </a>
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
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    service: "",
    quote: "",
    notes: "",
  });
  const [status, setStatus] = useState("idle");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    const { error } = await supabase.from("leads").insert([
      {
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        city: form.city || null,
        service: form.service,
        quote: form.quote ? parseFloat(form.quote) : null,
        notes: form.notes || null,
        status: "new",
      },
    ]);

    if (error) {
      console.error(error);
      setStatus("error");
      return;
    }

    setStatus("success");
  };

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <button className="modal-close" onClick={onClose}>×</button>

        {status === "success" ? (
          <div className="success-state">
            <h3>Quote Request Received</h3>
            <p>
              Thanks, {form.name.split(" ")[0] || "there"} — we'll be in touch
              soon. You can also reach us directly at{" "}
              <a href="tel:3368588821" style={{ color: "var(--gold)" }}>
                336-858-8821
              </a>
              .
            </p>
            <button className="btn btn-gold" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <>
            <p className="section-label">Get Started</p>
            <h2 className="modal-title">Request a Quote</h2>
            <form className="quote-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="field">
                  <label>Full Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} required />
                </div>
                <div className="field">
                  <label>Email *</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} required />
                </div>
                <div className="field">
                  <label>Phone</label>
                  <input name="phone" value={form.phone} onChange={handleChange} />
                </div>
                <div className="field">
                  <label>City</label>
                  <input name="city" value={form.city} onChange={handleChange} />
                </div>
                <div className="field field-full">
                  <label>Service *</label>
                  <select name="service" value={form.service} onChange={handleChange} required>
                    <option value="">Select a service</option>
                    {SERVICE_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="field field-full">
                  <label>Estimated Sq Ft / Budget</label>
                  <input
                    name="quote"
                    type="number"
                    min="0"
                    value={form.quote}
                    onChange={handleChange}
                    placeholder="Optional"
                  />
                </div>
                <div className="field field-full">
                  <label>Notes</label>
                  <textarea
                    name="notes"
                    rows="4"
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="Tell us about your space, timing, or special requests"
                  />
                </div>
              </div>

              {status === "error" && (
                <p className="error-text">Something went wrong. Please try again.</p>
              )}

              <button
                className="btn btn-gold btn-full"
                type="submit"
                disabled={status === "loading"}
              >
                {status === "loading" ? "Sending..." : "Submit Request"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
