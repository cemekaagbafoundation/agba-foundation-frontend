'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'

const FACILITIES = [
  'Youth Rehabilitation Centre',
  'Technical & Vocational Institute',
  'ICT & Digital Skills Academy',
  'Agricultural Training Farm',
  'Entrepreneurship & Innovation Lab',
  'Students Accommodation',
  'Medical & Counselling Centre',
  'Conference & Training Halls',
  'Sports & Recreation Facilities',
]

export default function TransformationCity() {
  const [heroData, setHeroData] = useState({ image_url: '', title: 'Chief Emeka Agba Youth Transformation City' })

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/hero-images`)
      .then(r => {
        const t = r.data.find(h => h.section === 'transformation_hero')
        if (t) setHeroData(t)
      }).catch(() => {})
  }, [])

  return (
    <section style={{ padding: '4rem 3rem', background: '#0a1f0f', borderTop: '1px solid #1a4a20' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <p style={{ color: '#c9911a', letterSpacing: '3px', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.5rem', textAlign: 'center' }}>
          Our Vision
        </p>
        <h2 style={{ color: '#f0f0f0', fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', marginBottom: '2.5rem', textAlign: 'center', lineHeight: 1.3 }}>
          Chief Emeka Agba Youth<br />
          <span style={{ color: '#c9911a' }}>Transformation City</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
          {/* Facilities list */}
          <div>
            {FACILITIES.map((f, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                padding: '0.7rem 0',
                borderBottom: '1px solid #1a4a20',
              }}>
                <div style={{ width: '8px', height: '8px', background: '#c9911a', borderRadius: '50%', flexShrink: 0 }} />
                <span style={{ color: '#c8dcc8', fontSize: '0.95rem' }}>{f}</span>
              </div>
            ))}
          </div>

          {/* Hero image + title */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <div style={{
              width: '100%',
              aspectRatio: '4/3',
              borderRadius: '12px',
              overflow: 'hidden',
              background: '#0f2d16',
              border: '1px solid #1a4a20',
            }}>
              {heroData.image_url ? (
                <img src={heroData.image_url} alt={heroData.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a4a20', fontSize: '0.85rem', textAlign: 'center', padding: '1rem' }}>
                  City image will appear here
                </div>
              )}
            </div>
            <div style={{ textAlign: 'center', color: '#c9911a', fontSize: '0.9rem', fontWeight: 'bold' }}>
              {heroData.title || 'Chief Emeka Agba Youth Transformation City'}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}