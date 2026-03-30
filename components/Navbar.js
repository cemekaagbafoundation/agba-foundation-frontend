'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Navbar() {
  const [logoUrl, setLogoUrl] = useState('')

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/hero-images`)
      .then(r => {
        const logo = r.data.find(h => h.section === 'logo')
        if (logo?.image_url) setLogoUrl(logo.image_url)
      }).catch(() => {})
  }, [])

  const links = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/#about' },
    { label: 'Programs', href: '/#programs' },
    { label: 'Apply', href: '/apply' },
    { label: 'Donate', href: '/donate' },
    { label: 'Transparency', href: '/transparency' },
    { label: 'Investor Portal', href: '/donor-portal' },
    { label: 'Contact', href: '/#contact' },
  ]

  return (
    <nav style={{
      background: '#061209',
      borderBottom: '1px solid #1a4a20',
      padding: '0.7rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        {logoUrl ? (
          <img src={logoUrl} alt="Logo" style={{ height: '40px', width: '40px', objectFit: 'contain', borderRadius: '50%' }} />
        ) : (
          <div style={{ width: '36px', height: '36px', background: '#c9911a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#061209', fontWeight: 'bold', fontSize: '0.8rem' }}>CEA</div>
        )}
        <div>
          <div style={{ color: '#c9911a', fontWeight: 'bold', fontSize: '0.95rem', lineHeight: 1.2 }}>Chief Emeka Agba</div>
          <div style={{ color: '#7a9e7a', fontSize: '0.7rem' }}>Foundation</div>
        </div>
      </Link>

      <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {links.map(l => (
          <Link key={l.href} href={l.href} style={{ color: '#c8dcc8', fontSize: '0.82rem' }}>
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}