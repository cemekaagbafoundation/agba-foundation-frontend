'use client'
import { useState } from 'react'
import axios from 'axios'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')
  const [isError, setIsError] = useState(false)

  const subscribe = async () => {
    if (!email) return
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/newsletter`, { email })
      setMsg('Subscribed successfully!'); setIsError(false); setEmail('')
    } catch (err) {
      setMsg(err.response?.data?.error || 'Something went wrong.'); setIsError(true)
    }
  }

  return (
    <section style={{ padding: '5rem 3rem', background: '#061209', borderTop: '1px solid #1a4a20', textAlign: 'center' }}>
      <p style={{ color: '#c9911a', letterSpacing: '3px', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Stay Connected</p>
      <h2 style={{ color: '#f0f0f0', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', marginBottom: '1rem' }}>Get Our Newsletter</h2>
      <p style={{ color: '#7a9e7a', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
        Receive updates on programs, impact stories, and opportunities directly in your inbox.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && subscribe()}
          placeholder="Enter your email address"
          style={{ padding: '0.9rem 1.2rem', borderRadius: '6px', border: '1px solid #1a4a20', background: '#0f2d16', color: '#f0f0f0', width: '300px', fontSize: '1rem', outline: 'none' }} />
        <button onClick={subscribe}
          style={{ background: '#c9911a', color: '#061209', padding: '0.9rem 2rem', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
          Subscribe
        </button>
      </div>
      {msg && <p style={{ marginTop: '1.2rem', color: isError ? '#f87171' : '#4ade80', fontSize: '0.95rem' }}>{msg}</p>}
    </section>
  )
}