'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Hero() {
  const [heroData, setHeroData] = useState({ image_url: '', title: '' })
  const [tagline, setTagline] = useState('')

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/hero-images`)
      .then(r => {
        const hero = r.data.find(h => h.section === 'main_hero')
        if (hero) setHeroData(hero)
      }).catch(() => {})

    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/content`)
      .then(r => {
        const item = r.data.find(c => c.section_name === 'hero')
        if (item) setTagline(item.content)
      }).catch(() => {})
  }, [])

  return (
    <section style={{
      background: 'linear-gradient(150deg, #061209 0%, #0a1f0f 40%, #0f2d16 100%)',
      minHeight: '85vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '2rem',
      alignItems: 'center',
      padding: '3rem 3rem',
    }}>
      <div>
        <p style={{ color: '#c9911a', letterSpacing: '3px', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.8rem' }}>
          Street To Skill Initiative
        </p>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 3.5rem)', color: '#ffffff', marginBottom: '1rem', lineHeight: 1.2, fontWeight: '700' }}>
          Chief Emeka Agba<br />
          <span style={{ color: '#c9911a' }}>Foundation</span>
        </h1>
        <p style={{ color: '#c8dcc8', fontSize: '1rem', marginBottom: '0.8rem', lineHeight: 1.7 }}>
          {tagline || 'Transforming vulnerable youths into skilled professionals and entrepreneurs.'}
        </p>
        <p style={{ color: '#7a9e7a', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.7 }}>
          Through the Street to Skill Initiative, we reach the most vulnerable young Nigerians and equip them with world-class training, mentorship, and job placement support.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/apply" style={{ background: '#c9911a', color: '#061209', padding: '0.9rem 2rem', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.95rem' }}>
            Apply for Training
          </Link>
          <Link href="/donate" style={{ border: '2px solid #c9911a', color: '#c9911a', padding: '0.9rem 2rem', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.95rem' }}>
            Make a Donation
          </Link>
        </div>
      </div>

      <div style={{ width: '100%', aspectRatio: '4/3', borderRadius: '14px', overflow: 'hidden', background: '#0f2d16', border: '1px solid #1a4a20' }}>
        {heroData.image_url ? (
          <img src={heroData.image_url} alt="Foundation" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a4a20', fontSize: '0.9rem' }}>
            Hero image will appear here
          </div>
        )}
      </div>
    </section>
  )
}