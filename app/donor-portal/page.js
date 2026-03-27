import Navbar from '../../components/Navbar'
import Link from 'next/link'

export default function DonorPortal() {
  return (
    <>
      <Navbar />
      <section style={{ minHeight: '100vh', background: '#091509', padding: '5rem 2rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ maxWidth: '700px', textAlign: 'center' }}>
          <p style={{ color: '#d4a017', letterSpacing: '3px', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Investor &amp; Partner Portal
          </p>
          <h1 style={{ color: '#fff', fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '1.5rem', lineHeight: 1.2 }}>
            Partner With the Foundation
          </h1>
          <p style={{ color: '#888', lineHeight: 1.9, fontSize: '1.05rem', marginBottom: '3rem' }}>
            We welcome institutional donors, corporate partners, and impact investors who share our vision for Nigerian youth empowerment. Partner with us to fund training centers, sponsor program cohorts, or co-create initiatives that create lasting change.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
            {[
              { icon: '🎯', title: 'Program Sponsorship', desc: 'Fund a full training cohort' },
              { icon: '🏢', title: 'Corporate CSR', desc: 'Align your brand with impact' },
              { icon: '📊', title: 'Impact Reports', desc: 'Full transparency on fund use' },
            ].map(item => (
              <div key={item.title} style={{ background: '#0d1f0d', border: '1px solid #1e4a1e', borderRadius: '10px', padding: '1.5rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{item.icon}</div>
                <h3 style={{ color: '#d4a017', marginBottom: '0.4rem', fontSize: '1rem' }}>{item.title}</h3>
                <p style={{ color: '#888', fontSize: '0.9rem' }}>{item.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/donate" style={{
              background: '#d4a017', color: '#050f05',
              padding: '1rem 2.5rem', borderRadius: '8px',
              fontWeight: 'bold', fontSize: '1rem',
            }}>
              Make a Donation
            </Link>
            <Link href="/transparency" style={{
              border: '2px solid #d4a017', color: '#d4a017',
              padding: '1rem 2.5rem', borderRadius: '8px',
              fontWeight: 'bold', fontSize: '1rem',
            }}>
              View Transparency Report
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}