'use client'
import Link from 'next/link'

export default function Hero() {
  return (
    <section style={{
      background: 'linear-gradient(150deg, #061209 0%, #0a1f0f 40%, #0f2d16 100%)',
      minHeight: '92vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '3rem',
      alignItems: 'center',
      padding: '5rem 3rem',
    }}>
      <div>
        <p style={{ color: '#c9911a', letterSpacing: '3px', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '1rem' }}>
          Street To Skill Initiative
        </p>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.8rem)', color: '#f0f0f0', marginBottom: '1.5rem', lineHeight: 1.2, fontWeight: '700' }}>
          Chief Emeka Agba<br />
          <span style={{ color: '#c9911a' }}>Foundation</span>
        </h1>
        <p style={{ color: '#c8dcc8', fontSize: '1.05rem', marginBottom: '1rem', lineHeight: 1.8 }}>
          Transforming vulnerable youths into skilled professionals and entrepreneurs.
        </p>
        <p style={{ color: '#7a9e7a', fontSize: '0.95rem', marginBottom: '2.5rem', lineHeight: 1.7 }}>
          Through the Street to Skill Initiative, we reach the most vulnerable young Nigerians and equip them with world-class training, mentorship, and job placement support.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/apply" style={{
            background: '#c9911a', color: '#061209',
            padding: '1rem 2.5rem', borderRadius: '6px',
            fontWeight: 'bold', fontSize: '1rem',
          }}>Apply for Training</Link>
          <Link href="/donate" style={{
            border: '2px solid #c9911a', color: '#c9911a',
            padding: '1rem 2.5rem', borderRadius: '6px',
            fontWeight: 'bold', fontSize: '1rem',
          }}>Make a Donation</Link>
        </div>
      </div>

      {/* Hero image */}
      <div style={{
        width: '100%', aspectRatio: '4/3',
        borderRadius: '16px', overflow: 'hidden',
        background: '#0f2d16', border: '1px solid #1a4a20',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <img src="/hero1.jpg" alt="Foundation"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}/>
      </div>
    </section>
  )
}