import { useEffect, useMemo, useState } from 'react'
import { supabase } from './supabase'

const colors = {
  bg: '#060606',
  card: '#111111',
  gold: '#c89b3c',
  goldSoft: '#d7b567',
  text: '#f3e3b2',
  muted: 'rgba(243,227,178,0.75)',
  border: 'rgba(200,161,80,0.22)',
}

const wrap = {
  minHeight: '100vh',
  background: colors.bg,
  color: colors.text,
  fontFamily: 'Georgia, Times New Roman, serif',
}

const container = {
  maxWidth: 1200,
  margin: '0 auto',
  padding: '24px',
}

const card = {
  background: colors.card,
  border: `1px solid ${colors.border}`,
  borderRadius: '24px',
  padding: '24px',
}

const input = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: '14px',
  border: `1px solid ${colors.border}`,
  background: '#0d0d0d',
  color: colors.text,
  boxSizing: 'border-box',
}

const primaryBtn = {
  background: colors.gold,
  color: '#111',
  border: `1px solid ${colors.gold}`,
  borderRadius: '14px',
  padding: '14px 18px',
  fontWeight: 700,
  cursor: 'pointer',
}

const secondaryBtn = {
  background: 'transparent',
  color: colors.text,
  border: `1px solid ${colors.border}`,
  borderRadius: '14px',
  padding: '14px 18px',
  fontWeight: 700,
  cursor: 'pointer',
}

const sectionLabel = {
  fontSize: 12,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: colors.goldSoft,
}

const feeCities = ['Charlotte', 'Clemmons', 'Summerfield', 'Browns Summit', 'Denton', 'Badin Lake']

export default function App() {
  const [view, setView] = useState('site')
  const [session, setSession] = useState(null)
  const [adminEmail, setAdminEmail] = useState('MarkieGay175@gmail.com')
  const [adminPassword, setAdminPassword] = useState('')
  const [loginMessage, setLoginMessage] = useState('')

  const [service, setService] = useState('weekly')
  const [sqft, setSqft] = useState('1500')
  const [hours, setHours] = useState('3')
  const [city, setCity] = useState('Trinity')
  const [propertyType, setPropertyType] = useState('owner')

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [submitMessage, setSubmitMessage] = useState('')

  const [leads, setLeads] = useState([])
  const [loadingLeads, setLoadingLeads] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session) fetchLeads()
  }, [session])

  async function fetchLeads() {
    setLoadingLeads(true)
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setLeads(data || [])
    setLoadingLeads(false)
  }

  const quote = useMemo(() => {
    const numericSqft = Number(sqft) || 0
    const numericHours = Number(hours) || 0
    const normalizedSqft = Math.max(numericSqft, 1000)
    const travelFee = feeCities.includes(city) ? 50 : 0

    if (service === 'weekly') {
      return {
        title: 'Weekly Residential Cleaning',
        amount: normalizedSqft * 0.15 + travelFee,
      }
    }
    if (service === 'biweekly') {
      return {
        title: 'Bi-Weekly Residential Cleaning',
        amount: normalizedSqft * 0.2 + travelFee,
      }
    }
    if (service === 'commercial') {
      return {
        title: 'Commercial Clean',
        amount: normalizedSqft * 0.25 + travelFee,
      }
    }
    if (service === 'deep') {
      return {
        title: 'First-Time Deep Clean',
        amount: numericHours * 75 + travelFee,
      }
    }
    if (service === 'move') {
      const rate = propertyType === 'agent' ? 85 : 100
      return {
        title: 'Move-In / Move-Out Cleaning',
        amount: numericHours * rate + travelFee,
      }
    }
    if (service === 'junk') {
      return {
        title: 'Junk Removal Clean',
        amount: numericHours * 125 + travelFee,
      }
    }
    if (service === 'hazard') {
      return {
        title: 'Hazard Clean',
        amount: numericHours * 150 + travelFee,
      }
    }
    return {
      title: 'Carpet Cleaning',
      amount: numericHours * 50 + travelFee,
    }
  }, [service, sqft, hours, city, propertyType])

  async function saveLead() {
    setSubmitMessage('')

    if (!name.trim() || !phone.trim()) {
      setSubmitMessage('Name and phone are required.')
      return
    }

    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || null,
      city,
      service: quote.title,
      quote: quote.amount,
      notes: notes.trim() || null,
      status: 'new',
    }

    const { error } = await supabase.from('leads').insert(payload)

    if (error) {
      setSubmitMessage(error.message)
      return
    }

    setSubmitMessage('Lead submitted successfully.')
    setName('')
    setPhone('')
    setEmail('')
    setNotes('')
  }

  async function login() {
    setLoginMessage('')
    const { error } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword,
    })

    if (error) {
      setLoginMessage(error.message)
      return
    }

    setView('admin')
    setAdminPassword('')
  }

  async function logout() {
    await supabase.auth.signOut()
    setView('site')
  }

  async function updateStatus(id, status) {
    const { error } = await supabase.from('leads').update({ status }).eq('id', id)
    if (!error) fetchLeads()
  }

  const headerButton = (active) => ({
    ...(active ? primaryBtn : secondaryBtn),
  })

  return (
    <div style={wrap}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${colors.border}`,
          zIndex: 10,
        }}
      >
        <div
          style={{
            ...container,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <div>
            <div style={{ fontSize: 34 }}>F&amp;G Services</div>
            <div style={{ color: colors.goldSoft, fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              Website + CRM
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button style={headerButton(view === 'site')} onClick={() => setView('site')}>
              Website
            </button>
            <button style={headerButton(view === 'admin')} onClick={() => setView('admin')}>
              Admin
            </button>
            {session && (
              <button style={secondaryBtn} onClick={logout}>
                Log Out
              </button>
            )}
          </div>
        </div>
      </div>

      {view === 'site' && (
        <div style={container}>
          <section style={{ padding: '36px 0' }}>
            <div style={{ ...card, background: 'linear-gradient(180deg,#0b0b0b 0%,#101010 100%)' }}>
              <div style={sectionLabel}>Local Cleaning Service • Greensboro Market</div>
              <h1 style={{ fontSize: 'clamp(44px, 8vw, 78px)', lineHeight: 0.98, margin: '16px 0' }}>
                Fresh Starts.
                <br />
                Flawless Spaces.
              </h1>
              <p style={{ maxWidth: 700, color: colors.muted, fontSize: 20, lineHeight: 1.7 }}>
                Quiet, detailed residential and specialty cleaning based in Trinity, North Carolina.
              </p>
            </div>
          </section>

          <section style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))' }}>
            <div style={card}>
              <div style={sectionLabel}>Instant Quote Builder</div>
              <h2 style={{ marginTop: 8 }}>Get a quote</h2>

              <div style={{ display: 'grid', gap: 14 }}>
                <div>
                  <label style={sectionLabel}>Service</label>
                  <select style={input} value={service} onChange={(e) => setService(e.target.value)}>
                    <option value="weekly">Weekly Cleaning</option>
                    <option value="biweekly">Bi-Weekly Cleaning</option>
                    <option value="commercial">Commercial Clean</option>
                    <option value="deep">First-Time Deep Clean</option>
                    <option value="move">Move-In / Move-Out</option>
                    <option value="junk">Junk Removal Clean</option>
                    <option value="hazard">Hazard Clean</option>
                    <option value="carpet">Carpet Cleaning</option>
                  </select>
                </div>

                {(service === 'weekly' || service === 'biweekly' || service === 'commercial') && (
                  <div>
                    <label style={sectionLabel}>Square Footage</label>
                    <input style={input} value={sqft} onChange={(e) => setSqft(e.target.value)} />
                  </div>
                )}

                {(service === 'deep' || service === 'move' || service === 'junk' || service === 'hazard' || service === 'carpet') && (
                  <div>
                    <label style={sectionLabel}>Estimated Hours</label>
                    <input style={input} value={hours} onChange={(e) => setHours(e.target.value)} />
                  </div>
                )}

                {service === 'move' && (
                  <div>
                    <label style={sectionLabel}>Client Type</label>
                    <select style={input} value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
                      <option value="owner">Private Residential Owner</option>
                      <option value="agent">Real Estate Agent</option>
                    </select>
                  </div>
                )}

                <div>
                  <label style={sectionLabel}>City</label>
                  <select style={input} value={city} onChange={(e) => setCity(e.target.value)}>
                    {[
                      'Trinity',
                      'Greensboro',
                      'High Point',
                      'Archdale',
                      'Thomasville',
                      'Charlotte',
                      'Clemmons',
                      'Summerfield',
                      'Browns Summit',
                      'Denton',
                      'Badin Lake',
                    ].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={sectionLabel}>Customer Name</label>
                  <input style={input} value={name} onChange={(e) => setName(e.target.value)} />
                </div>

                <div>
                  <label style={sectionLabel}>Phone</label>
                  <input style={input} value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>

                <div>
                  <label style={sectionLabel}>Email</label>
                  <input style={input} value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div>
                  <label style={sectionLabel}>Notes</label>
                  <textarea style={{ ...input, minHeight: 110 }} value={notes} onChange={(e) => setNotes(e.target.value)} />
                </div>

                <div style={{ ...card, padding: 18 }}>
                  <div style={sectionLabel}>Estimated Quote</div>
                  <div style={{ fontSize: 24 }}>{quote.title}</div>
                  <div style={{ fontSize: 42, marginTop: 8 }}>${quote.amount.toFixed(2)}</div>
                  <div style={{ marginTop: 16 }}>
                    <button style={primaryBtn} onClick={saveLead}>
                      Submit Lead
                    </button>
                  </div>
                  {submitMessage && <p style={{ marginTop: 12, color: colors.goldSoft }}>{submitMessage}</p>}
                </div>
              </div>
            </div>

            <div style={card}>
              <div style={sectionLabel}>Services + Add-ons</div>
              <h2 style={{ marginTop: 8 }}>Pricing highlights</h2>
              <ul style={{ color: colors.muted, lineHeight: 1.9, paddingLeft: 20 }}>
                <li>Weekly: $0.15/SF</li>
                <li>Bi-Weekly: $0.20/SF</li>
                <li>Commercial: $0.25/SF</li>
                <li>Deep Clean: $75/hr</li>
                <li>Move-In / Move-Out: $85/hr agents · $100/hr owners</li>
                <li>Junk Removal: $125/hr</li>
                <li>Hazard Cleans: $150/hr</li>
                <li>Carpet Cleaning: $50/hr</li>
                <li>Oven Cleaning: $35</li>
                <li>Fridge: $40</li>
                <li>Dishes: $25</li>
                <li>Laundry: $15 per load</li>
                <li>Ceiling Fans: $15, included on deep cleans</li>
                <li>Windows: $25, included on deep cleans</li>
                <li>Baseboards included on every clean</li>
              </ul>
            </div>
          </section>
        </div>
      )}

      {view === 'admin' && !session && (
        <div style={container}>
          <section style={{ padding: '36px 0' }}>
            <div style={{ ...card, maxWidth: 560, margin: '0 auto' }}>
              <div style={sectionLabel}>Admin Login</div>
              <h2 style={{ marginTop: 8 }}>Sign in</h2>

              <div style={{ display: 'grid', gap: 14 }}>
                <div>
                  <label style={sectionLabel}>Email</label>
                  <input style={input} value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} />
                </div>
                <div>
                  <label style={sectionLabel}>Password</label>
                  <input type="password" style={input} value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} />
                </div>
                <button style={primaryBtn} onClick={login}>
                  Log In
                </button>
                {loginMessage && <p style={{ color: colors.goldSoft }}>{loginMessage}</p>}
              </div>
            </div>
          </section>
        </div>
      )}

      {view === 'admin' && session && (
        <div style={container}>
          <section style={{ padding: '36px 0' }}>
            <div style={card}>
              <div style={sectionLabel}>Admin Dashboard</div>
              <h2 style={{ marginTop: 8 }}>Leads</h2>
              {loadingLeads ? (
                <p>Loading leads...</p>
              ) : (
                <div style={{ display: 'grid', gap: 16 }}>
                  {leads.map((lead) => (
                    <div key={lead.id} style={{ ...card, padding: 18 }}>
                      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))' }}>
                        <div>
                          <strong>{lead.name}</strong>
                          <div style={{ color: colors.muted, marginTop: 6 }}>{lead.service}</div>
                        </div>
                        <div>{lead.phone}</div>
                        <div>{lead.email || 'No email'}</div>
                        <div>{lead.city}</div>
                        <div>${Number(lead.quote).toFixed(2)}</div>
                        <div>
                          <select
                            style={input}
                            value={lead.status}
                            onChange={(e) => updateStatus(lead.id, e.target.value)}
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="booked">Booked</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>
                      </div>
                      <div style={{ marginTop: 12, color: colors.muted }}>{lead.notes || 'No notes'}</div>
                    </div>
                  ))}
                  {leads.length === 0 && <p>No leads yet.</p>}
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}