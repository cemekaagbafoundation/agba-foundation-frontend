'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function About() {
  const [aboutHero, setAboutHero] = useState({ image_url: '', title: 'Chief Emeka Agba' })
  const [writeup, setWriteup] = useState('')

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/hero-images`)
      .then(r => {
        const about = r.data.find(h => h.section === 'about_hero')
        if (about) setAboutHero(about)
      }).catch(() => {})

    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/content`)
      .then(r => {
        const item = r.data.find(c => c.section_name === 'about')
        if (item) setWriteup(item.content)
      }).catch(() => {})
  }, [])

  return (
    <section id="about" style={{ padding: '4rem 3rem', background: '#061209', borderTop: '1px solid #1a4a20' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <p style={{ color: '#c9911a', letterSpacing: '3px', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.5rem', textAlign: 'center' }}>Who We Are</p>
        <h2 style={{ color: '#f0f0f0', fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', marginBottom: '2.5rem', textAlign: 'center' }}>About the Foundation</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
          <div>
            <p style={{ color: '#c8dcc8', lineHeight: 1.9, fontSize: '1rem', whiteSpace: 'pre-wrap' }}>
              {writeup || 'The Chief Emeka Agba Foundation is dedicated to youth empowerment across Nigeria. We provide free digital skills training, entrepreneurship education, and agricultural programs.'}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{ width: '100%', maxWidth: '280px', aspectRatio: '3/4', borderRadius: '12px', overflow: 'hidden', background: '#0f2d16', border: '1px solid #1a4a20' }}>
              {aboutHero.image_url ? (
                <img src={aboutHero.image_url} alt={aboutHero.title} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a4a20', fontSize: '0.85rem', textAlign: 'center', padding: '1rem' }}>
                  Portrait image will appear here
                </div>
              )}
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#f0f0f0', fontWeight: 'bold', fontSize: '1rem' }}>
                {aboutHero.title || 'Chief Emeka Agba'}
              </div>
              <div style={{ color: '#c9911a', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                Founder — Chief Emeka Agba Foundation
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}