'use client'
import { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import Navbar from '../../components/Navbar'
import Link from 'next/link'

function StatCard({ label, value, sub }) {
  return (
    <div style={{
      background: '#0d2a0d',
      border: '1px solid #1e4a1e',
      borderRadius: '12px',
      padding: '1.5rem',
      marginBottom: '1rem',
    }}>
      <div style={{ color: '#d4a017', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
        {label}
      </div>
      <div style={{ color: '#fff', fontSize: '1.8rem', fontWeight: '700' }}>
        {value}
      </div>
      {sub && <div style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.3rem' }}>{sub}</div>}
    </div>
  )
}

export default function Transparency() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [pulse, setPulse] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/transparency`)
      setData(res.data)
      setLastUpdated(new Date())
      setPulse(true)
      setTimeout(() => setPulse(false), 800)
    } catch {}
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 15000)
    return () => clearInterval(interval)
  }, [fetchData])

  const fmt = (n) => Number(n || 0).toLocaleString()
  const fmtNGN = (n) => `₦${Number(n || 0).toLocaleString()}`

  const timeAgo = (date) => {
    if (!date) return ''
    const secs = Math.floor((new Date() - date) / 1000)
    if (secs < 10) return 'just now'
    if (secs < 60) return `${secs}s ago`
    return `${Math.floor(secs / 60)}m ago`
  }

  return (
    <>
      <Navbar />
      <section style={{ minHeight: '100vh', background: '#091509', padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: '660px', margin: '0 auto' }}>
          <Link href="/" style={{ color: '#d4a017', fontSize: '0.9rem', display: 'inline-block', marginBottom: '1.5rem' }}>
            ← Back to Home
          </Link>

          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ color: '#fff', fontSize: '2rem', marginBottom: '0.5rem' }}>
              Transparency &amp; Impact
            </h1>
            <p style={{ color: '#888', lineHeight: 1.7 }}>
              We are committed to full accountability. This page shows donations, impact progress, and public trust indicators. It updates automatically every 15 seconds.
            </p>
          </div>

          {/* Live indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
            <div style={{
              width: '10px', height: '10px', borderRadius: '50%',
              background: pulse ? '#4ade80' : '#22c55e',
              boxShadow: pulse ? '0 0 10px #4ade80' : 'none',
              transition: 'all 0.4s ease',
            }} />
            <span style={{ color: '#555', fontSize: '0.85rem' }}>
              Live · {lastUpdated ? `Updated ${timeAgo(lastUpdated)}` : 'Connecting...'}
            </span>
          </div>

          {loading && (
            <p style={{ color: '#555', textAlign: 'center', padding: '3rem' }}>Loading data...</p>
          )}

          {data && (
            <>
              {/* Donation stats */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ background: '#0d2a0d', border: '1px solid #1e4a1e', borderRadius: '12px', padding: '1.5rem' }}>
                  <div style={{ color: '#d4a017', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Total Donations</div>
                  <div style={{ color: '#fff', fontSize: '1.6rem', fontWeight: '700' }}>{fmtNGN(data.total_donations)}</div>
                </div>
                <div style={{ background: '#0d2a0d', border: '1px solid #1e4a1e', borderRadius: '12px', padding: '1.5rem' }}>
                  <div style={{ color: '#d4a017', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Total Donors</div>
                  <div style={{ color: '#fff', fontSize: '1.6rem', fontWeight: '700' }}>{fmt(data.total_donors)}</div>
                </div>
              </div>

              <StatCard
                label="Funds Utilized"
                value={fmtNGN(data.funds_utilized)}
                sub="Deployed into active programs and beneficiary support"
              />

              {/* Impact tracker */}
              <div style={{ background: '#0d2a0d', border: '1px solid #1e4a1e', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem' }}>
                <div style={{ color: '#d4a017', fontWeight: '600', marginBottom: '1.2rem', fontSize: '0.95rem' }}>
                  Impact Tracker
                </div>
                {[
                  { label: 'Youths Trained', value: fmt(data.youths_trained) },
                  { label: 'Programs Completed', value: fmt(data.programs_completed) },
                  { label: 'Jobs Created', value: fmt(data.jobs_created) },
                ].map(item => (
                  <div key={item.label} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.8rem 0',
                    borderBottom: '1px solid #1a3a1a',
                  }}>
                    <span style={{ color: '#ccc' }}>{item.label}</span>
                    <span style={{ color: '#d4a017', fontWeight: 'bold', fontSize: '1.2rem' }}>{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Live donations feed */}
              <div style={{ background: '#0d2a0d', border: '1px solid #1e4a1e', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ color: '#d4a017', fontWeight: '600', marginBottom: '1rem', fontSize: '0.95rem' }}>
                  Live Donations Feed
                </div>
                {data.live_feed.length === 0 ? (
                  <p style={{ color: '#555', fontSize: '0.9rem' }}>No donations recorded yet. Be the first!</p>
                ) : (
                  data.live_feed.map((d, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.7rem 0',
                      borderBottom: i < data.live_feed.length - 1 ? '1px solid #1a3a1a' : 'none',
                    }}>
                      <div>
                        <span style={{ color: '#ccc', fontSize: '0.95rem' }}>{d.name || 'Anonymous'}</span>
                        <div style={{ color: '#555', fontSize: '0.75rem' }}>
                          {new Date(d.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                      <span style={{ color: '#d4a017', fontWeight: 'bold' }}>{fmtNGN(d.amount)}</span>
                    </div>
                  ))
                )}
              </div>

              <div style={{ textAlign: 'center' }}>
                <Link href="/donate" style={{
                  background: '#d4a017',
                  color: '#050f05',
                  padding: '0.9rem 2.5rem',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  display: 'inline-block',
                }}>
                  Support This Work →
                </Link>
              </div>
            </>
          )}

          <p style={{ color: '#333', fontSize: '0.78rem', textAlign: 'center', marginTop: '3rem' }}>
            Public accountability page · Auto-refreshes every 15 seconds · Chief Emeka Agba Foundation
          </p>
        </div>
      </section>
    </>
  )
}