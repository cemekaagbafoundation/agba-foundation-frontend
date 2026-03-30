'use client'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import About from '../components/About'
import Programs from '../components/Programs'
import TransformationCity from '../components/TransformationCity'
import VideoSection from '../components/VideoSection'
import Gallery from '../components/Gallery'
import Newsletter from '../components/Newsletter'
import Contact from '../components/Contact'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Programs />
      <TransformationCity />
      <VideoSection />
      <Gallery />
      <Newsletter />
      <Contact />

      <footer style={{ background: '#061209', borderTop: '1px solid #1a4a20', padding: '3rem 2rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <div style={{ color: '#c9911a', fontWeight: 'bold', marginBottom: '0.8rem', fontSize: '1rem' }}>Chief Emeka Agba Foundation</div>
              <div style={{ color: '#7a9e7a', fontSize: '0.85rem', lineHeight: 1.8 }}>
                <div>📧 info@chiefemekaagbafoundation.com</div>
                <div>📞 +2348101866548</div>
              </div>
            </div>
            <div>
              <div style={{ color: '#c9911a', fontWeight: 'bold', marginBottom: '0.8rem' }}>Quick Links</div>
              {[
                { label: 'Apply for Training', href: '/apply' },
                { label: 'Make a Donation', href: '/donate' },
                { label: 'Transparency Report', href: '/transparency' },
                { label: 'Investor Portal', href: '/donor-portal' },
              ].map(l => (
                <a key={l.href} href={l.href} style={{ display: 'block', color: '#7a9e7a', fontSize: '0.85rem', marginBottom: '0.4rem' }}>{l.label}</a>
              ))}
            </div>
            <div>
              <div style={{ color: '#c9911a', fontWeight: 'bold', marginBottom: '0.8rem' }}>Partners & Sponsors</div>
              <p style={{ color: '#7a9e7a', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '0.5rem' }}>
                Interested in partnering?{' '}
                <a href="/donor-portal" style={{ color: '#c9911a' }}>Visit our Investor Portal</a>{' '}
                to explore sponsorship and CSR opportunities.
              </p>
              <div style={{ color: '#7a9e7a', fontSize: '0.85rem' }}>
                📧 <a href="mailto:partners@chiefemekaagbafoundation.com" style={{ color: '#c9911a' }}>partners@chiefemekaagbafoundation.com</a>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #1a4a20', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
            <p style={{ color: '#3a5a3a', fontSize: '0.8rem' }}>© {new Date().getFullYear()} Chief Emeka Agba Foundation. All rights reserved.</p>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <a href="/privacy-policy" style={{ color: '#3a5a3a', fontSize: '0.8rem' }}>Privacy Policy</a>
              <a href="/terms-of-service" style={{ color: '#3a5a3a', fontSize: '0.8rem' }}>Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}