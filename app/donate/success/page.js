'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'
import Navbar from '../../../components/Navbar'

function SuccessContent() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState('verifying')
  const reference = searchParams.get('reference') || searchParams.get('ref')

  useEffect(() => {
    if (!reference) {
      setStatus('missing')
      return
    }
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/api/firstbank/verify-payment`, { reference })
      .then(() => setStatus('success'))
      .catch(() => setStatus('failed'))
  }, [reference])

  return (
    <div style={{
      background: '#0d1f0d', padding: '3rem', borderRadius: '14px',
      border: '1px solid #1a4a20', textAlign: 'center',
      maxWidth: '480px', width: '100%',
    }}>
      {status === 'verifying' && (
        <p style={{ color: '#c8dcc8', fontSize: '1rem' }}>⏳ Verifying your payment...</p>
      )}
      {status === 'success' && (
        <>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
          <h1 style={{ color: '#c9911a', marginBottom: '0.5rem' }}>Thank You!</h1>
          <p style={{ color: '#c8dcc8', marginBottom: '2rem' }}>
            Your donation has been received. You are empowering Nigerian youths with skills and opportunity.
          </p>
          <Link href="/" style={{
            background: '#c9911a', color: '#061209',
            padding: '0.8rem 2rem', borderRadius: '8px',
            fontWeight: 'bold', textDecoration: 'none', display: 'inline-block',
          }}>
            Back to Home
          </Link>
        </>
      )}
      {(status === 'failed' || status === 'missing') && (
        <>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h1 style={{ color: '#f87171', marginBottom: '0.5rem' }}>Payment Issue</h1>
          <p style={{ color: '#c8dcc8', marginBottom: '2rem' }}>
            We could not confirm your payment. Please contact us if you were charged.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/donate" style={{
              background: '#c9911a', color: '#061209',
              padding: '0.8rem 2rem', borderRadius: '8px',
              fontWeight: 'bold', textDecoration: 'none', display: 'inline-block',
            }}>
              Try Again
            </Link>
            <a href="mailto:info@chiefemekaagbafoundation.com" style={{
              background: 'transparent', color: '#c9911a',
              padding: '0.8rem 2rem', borderRadius: '8px',
              fontWeight: 'bold', textDecoration: 'none', display: 'inline-block',
              border: '1px solid #c9911a',
            }}>
              Contact Us
            </a>
          </div>
        </>
      )}
    </div>
  )
}

export default function DonateSuccess() {
  return (
    <>
      <Navbar />
      <section style={{
        minHeight: '100vh', background: '#091509',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '2rem',
      }}>
        <Suspense fallback={<p style={{ color: '#c8dcc8' }}>Loading...</p>}>
          <SuccessContent />
        </Suspense>
      </section>
    </>
  )
}
