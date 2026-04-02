import Link from 'next/link'
import Navbar from '../../../components/Navbar'

export default function DonateFailed() {
  return (
    <>
      <Navbar />
      <section style={{ minHeight: '100vh', background: '#091509', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ background: '#0d1f0d', border: '1px solid #1a4a20', borderRadius: '14px', padding: '3rem', maxWidth: '480px', width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
          <h2 style={{ color: '#f87171', marginBottom: '1rem' }}>Payment Not Completed</h2>
          <p style={{ color: '#c8dcc8', lineHeight: 1.7, marginBottom: '2rem' }}>
            Your payment was cancelled or could not be processed. No charges were made.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/donate" style={{ background: '#c9911a', color: '#061209', padding: '0.9rem 2rem', borderRadius: '8px', fontWeight: 'bold' }}>
              Try Again
            </Link>
            <Link href="/" style={{ border: '1px solid #1a4a20', color: '#7a9e7a', padding: '0.9rem 2rem', borderRadius: '8px' }}>
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}