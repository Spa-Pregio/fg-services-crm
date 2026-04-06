import { useState } from "react";
import "./App.css";

export default function App() {
  const [view, setView] = useState("website");

  return (
    <div className="min-h-screen bg-black text-white">
      {/* NAVBAR */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-yellow-600/30">
        <h1 className="text-2xl font-serif gold-text">F&G Services</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setView("website")}
            className="px-4 py-2 rounded-xl bg-yellow-600 text-black font-semibold"
          >
            Website
          </button>
          <button
            onClick={() => setView("admin")}
            className="px-4 py-2 rounded-xl border border-yellow-600"
          >
            Admin
          </button>
        </div>
      </div>

      {view === "website" ? <Website /> : <Admin />}
    </div>
  );
}

function Website() {
  return (
    <div>
      {/* HERO */}
      <section className="text-center py-24 px-6 bg-gradient-to-b from-black to-neutral-900">
        <h2 className="text-5xl md:text-6xl font-serif gold-text mb-6">
          Fresh Starts. Flawless Spaces.
        </h2>
        <p className="text-gray-300 max-w-xl mx-auto mb-8">
          Quiet, detailed residential and commercial cleaning based in North Carolina.
        </p>
        <button className="bg-yellow-600 text-black px-6 py-3 rounded-xl font-semibold">
          Get a Quote
        </button>
      </section>

      {/* SERVICES */}
      <section className="grid md:grid-cols-3 gap-6 px-6 py-16">
        <ServiceCard title="Residential Cleaning" desc="Weekly, Bi-Weekly, Deep Cleans" />
        <ServiceCard title="Commercial Cleaning" desc="$0.25 per square foot" />
        <ServiceCard title="Move In / Out" desc="Moving Made Easier" />
      </section>

      {/* ADD ONS */}
      <section className="px-6 py-16 border-t border-yellow-600/20">
        <h3 className="text-3xl font-serif gold-text mb-6 text-center">
          Add-On Services
        </h3>
        <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto text-gray-300">
          <p>Oven Cleaning — $35</p>
          <p>Fridge Cleaning — $40</p>
          <p>Dishes — $25</p>
          <p>Laundry — $15/load</p>
          <p>Ceiling Fans — $15 (Included in Deep Clean)</p>
          <p>Windows — $25 (Included in Deep Clean)</p>
          <p className="col-span-2 text-yellow-500">Baseboards included on every clean</p>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-20 bg-neutral-900">
        <h3 className="text-4xl font-serif gold-text mb-4">
          Let Us Handle The Dirty Work
        </h3>
        <button className="bg-yellow-600 text-black px-8 py-3 rounded-xl font-semibold">
          Submit Request
        </button>
      </section>
    </div>
  );
}

function ServiceCard({ title, desc }) {
  return (
    <div className="border border-yellow-600/20 rounded-2xl p-6 bg-black/60 backdrop-blur-sm">
      <h4 className="text-xl font-serif gold-text mb-2">{title}</h4>
      <p className="text-gray-400">{desc}</p>
    </div>
  );
}

function Admin() {
  return (
    <div className="p-10">
      <h2 className="text-3xl font-serif gold-text mb-6">Admin Dashboard</h2>
      <p className="text-gray-400">Leads will appear here from Supabase.</p>
    </div>
  );
}

/* ADD THIS TO App.css */
/*
.gold-text {
  background: linear-gradient(90deg, #d4af37, #f5e6b3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
*/
