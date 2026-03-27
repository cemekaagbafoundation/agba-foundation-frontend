'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'

export default function Programs() {
  const [programs, setPrograms] = useState([])
  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/programs`).then(r => setPrograms(r.data)).catch(() => {})
  }, [])

  return (
    <section id="programs" style={{ padding: '5rem 3rem', background: '#0a1f0f', borderTop: '1px solid #1a4a20' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <p style={{ color: '#c9911a', letterSpacing: '3px', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.5rem', textAlign: 'center' }}>What We Offer</p>
        <h2 style={{ color: '#f0f0f0', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: '3rem', textAlign: 'center' }}>Our Programs</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
          {programs.map(p => (
            <div key={p.id}
              style={{ background: '#0f2d16', border: '1px solid #1a4a20', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.3s, transform 0.2s' }}
              onMouseOver={e => { e.currentTarget.style.borderColor = '#c9911a'; e.currentTarget.style.transform = 'translateY(-4px)' }}
              onMouseOut={e => { e.currentTarget.style.borderColor = '#1a4a20'; e.currentTarget.style.transform = 'translateY(0)' }}>
              <div style={{ width: '100%', aspectRatio: '16/9', background: '#061209', overflow: 'hidden' }}>
                {p.image_url
                  ? <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a4a20', fontSize: '2rem' }}>📋</div>
                }
              </div>
              <div style={{ padding: '1.2rem' }}>
                <h3 style={{ color: '#f0f0f0', marginBottom: '0.5rem', fontSize: '0.95rem', lineHeight: 1.4 }}>{p.name}</h3>
                <p style={{ color: '#7a9e7a', fontSize: '0.82rem', lineHeight: 1.6 }}>{p.description}</p>
              </div>
            </div>
          ))}
          {programs.length === 0 && <p style={{ color: '#7a9e7a', gridColumn: '1/-1', textAlign: 'center' }}>Programs loading...</p>}
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link href="/apply" style={{ background: '#c9911a', color: '#061209', padding: '0.9rem 2.5rem', borderRadius: '6px', fontWeight: 'bold', fontSize: '1rem' }}>
            Apply for a Program
          </Link>
        </div>
      </div>
    </section>
  )
}