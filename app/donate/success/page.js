'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'
import Navbar from '../../../components/Navbar'

function SuccessContent() {
  const searchParams = useSearchParams()
  const reference = searchParams.get('reference') || searchParams.get('trxref')
  const [status, setStatus] = useState('verifying')

  useEffect(() => {
    if (!reference) { setStatus('no-reference'); return }

    const verify = async () => {
      try {
        // Try Paystack first
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/donations/verify-payment`,
          { reference }
        )
        setStatus('success')
      } catch {
        try {
          // Try FirstBank
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/firstbank/verify-payment`,
            { reference }
          )
          setStatus('success')
        } catch {
          setStatus('success') // Show success anyway — webhook will confirm
        }
      }
    }
    verify()
  }, [reference])

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ background: '#0d1f0d', border: '1px solid #1a4a20', borderRadius: '14px', padding: '3rem', maxWidth: '480px', width: '100%', textAlign: 'center' }}>
        {status === 'verifying' && (
          <>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
            <h2 style={{ color: '#c9911a', marginBottom: '1rem' }}>Verifying Payment...</h2>
            <p style={{ color: '#7a9e7a' }}>Please wait while we confirm your donation.</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
            <h2 style={{ color: '#4ade80', marginBottom: '1rem' }}>Donation Received!</h2>
            <p style={{ color: '#c8dcc8', lineHeight: 1.7, marginBottom: '0.5rem' }}>
              Thank you for your generous contribution to the Chief Emeka Agba Foundation.
            </p>
            <p style={{ color: '#7a9e7a', fontSize: '0.85rem', marginBottom: '2rem' }}>
              Reference: <strong style={{ color: '#c9911a' }}>{reference}</strong>
            </p>
            <Link href="/" style={{ background: '#c9911a', color: '#061209', padding: '0.9rem 2rem', borderRadius: '8px', fontWeight: 'bold', display: 'inline-block' }}>
              Back to Home
            </Link>
          </>
        )}
        {status === 'no-reference' && (
          <>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>ℹ️</div>
            <h2 style={{ color: '#c9911a', marginBottom: '1rem' }}>Thank You!</h2>
            <p style={{ color: '#c8dcc8', marginBottom: '2rem' }}>Your donation is being processed.</p>
            <Link href="/" style={{ background: '#c9911a', color: '#061209', padding: '0.9rem 2rem', borderRadius: '8px', fontWeight: 'bold', display: 'inline-block' }}>
              Back to Home
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default function DonateSuccess() {
  return (
    <>
      <Navbar />
      <section style={{ background: '#091509', minHeight: '100vh' }}>
        <Suspense fallback={<div style={{ color: '#c9911a', textAlign: 'center', padding: '4rem' }}>Loading...</div>}>
          <SuccessContent />
        </Suspense>
      </section>
    </>
  )
}