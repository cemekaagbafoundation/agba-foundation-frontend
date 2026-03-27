'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

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
      padding: '0.9rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    }}>
      <Link href="/" style={{ color: '#c9911a', fontWeight: 'bold', fontSize: '1rem', lineHeight: 1.3 }}>
        Chief Emeka Agba<br />
        <span style={{ fontSize: '0.75rem', color: '#7a9e7a', fontWeight: 'normal' }}>Foundation</span>
      </Link>

      {/* Desktop */}
      <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {links.map(l => (
          <Link key={l.href} href={l.href}
            style={{ color: '#c8dcc8', fontSize: '0.85rem', transition: 'color 0.2s' }}
            onMouseOver={e => e.target.style.color = '#c9911a'}
            onMouseOut={e => e.target.style.color = '#c8dcc8'}>
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}