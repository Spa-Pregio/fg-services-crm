import { useState } from "react";
import { supabase } from "./supabase";
import "./App.css";

const SERVICE_OPTIONS = [
  "Residential Cleaning",
  "Deep Cleaning",
  "Move In / Move Out",
  "Commercial Cleaning",
  "Airbnb / Turnover Cleaning",
  "Custom Request",
];

export default function App() {
  const [showQuoteForm, setShowQuoteForm] = useState(false);

  return (
    <div className="site-shell">
      <Header onQuote={() => setShowQuoteForm(true)} />
      <Hero onQuote={() => setShowQuoteForm(true)} />
      <Services />
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
          <div className="brand-mark">F&amp;G</div>
          <div>
            <div className="brand-name">F&amp;G Services</div>
            <div className="brand-sub">Luxury Cleaning Services</div>
          </div>
        </div>

        <nav className="nav">
          <a href="#services">Services</a>
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
        <p className="eyebrow">Residential & Commercial • North Carolina</p>
        <h1>
          Fresh Starts. <span>Flawless Spaces.</span>
        </h1>
        <p className="hero-copy">
          Elevated cleaning services designed for busy households, polished
          businesses, and clients who want more than basic.
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
      text: "Recurring or one-time cleaning tailored to your home and lifestyle.",
    },
    {
      title: "Deep Cleaning",
      text: "A detail-focused reset for kitchens, bathrooms, floors, and high-touch surfaces.",
    },
    {
      title: "Move In / Move Out",
      text: "A clean, fresh start for transitions, leases, and real-estate turnover.",
    },
    {
      title: "Commercial Cleaning",
      text: "Professional cleaning for offices, suites, and small business spaces.",
    },
    {
      title: "Airbnb / Turnover",
      text: "Fast, guest-ready turnover service to keep your property presentation sharp.",
    },
    {
      title: "Custom Requests",
      text: "Need something specific? We can tailor service to your space and priorities.",
    },
  ];

  return (
    <section id="services" className="section">
      <div className="container">
        <p className="section-label">Services</p>
        <h2 className="section-title">What We Offer</h2>
        <div className="grid cards-3">
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

function Pricing() {
  const addOns = [
    ["Oven Cleaning", "$35"],
    ["Fridge Cleaning", "$40"],
    ["Dishes", "$25"],
    ["Laundry", "$15 / load"],
    ["Windows", "$25"],
    ["Ceiling Fans", "$15"],
  ];

  return (
    <section id="pricing" className="section section-dark">
      <div className="container pricing-wrap">
        <div>
          <p className="section-label">Pricing</p>
          <h2 className="section-title light">Simple & Transparent</h2>
          <p className="section-copy light-copy">
            Final pricing depends on square footage, condition, frequency, and
            service type. Request a quote for a custom estimate.
          </p>

          <div className="price-panel">
            <div className="price-row">
              <span>Commercial Cleaning</span>
              <strong>$0.25 / sq ft</strong>
            </div>
            <div className="price-row">
              <span>Recurring Residential</span>
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
    "Reliable and detail-focused",
    "Professional, polished presentation",
    "Flexible residential and commercial service",
    "Designed for repeat clients and referrals",
  ];

  return (
    <section id="why" className="section">
      <div className="container why-wrap">
        <div>
          <p className="section-label">Why F&G</p>
          <h2 className="section-title">Clean That Feels Elevated</h2>
          <p className="section-copy">
            We believe a clean space should feel peaceful, fresh, and
            professionally cared for. Our approach combines consistency,
            discretion, and attention to detail.
          </p>
        </div>

        <div className="card soft-card">
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
      <div className="container cta-inner">
        <h2>Ready for a cleaner, calmer space?</h2>
        <p>Request your quote and let F&amp;G Services do the rest.</p>
        <button className="btn btn-gold" onClick={onQuote}>
          Start My Quote
        </button>
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
          <p>Luxury Cleaning Services • North Carolina</p>
        </div>
        <div className="footer-links">
          <a href="#services">Services</a>
          <a href="#pricing">Pricing</a>
          <a href="#why">Why Us</a>
        </div>
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
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        {status === "success" ? (
          <div className="success-state">
            <h3>Quote Request Received</h3>
            <p>Thanks, {form.name.split(" ")[0] || "there"} — we’ll be in touch soon.</p>
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
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="field">
                  <label>Email *</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="field">
                  <label>Phone</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="field">
                  <label>City</label>
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                  />
                </div>

                <div className="field field-full">
                  <label>Service *</label>
                  <select
                    name="service"
                    value={form.service}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a service</option>
                    {SERVICE_OPTIONS.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
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
                <p className="error-text">
                  Something went wrong. Please try again.
                </p>
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
