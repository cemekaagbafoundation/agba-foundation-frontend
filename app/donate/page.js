'use client'
import { useState } from 'react'
import axios from 'axios'
import Navbar from '../../components/Navbar'
import Link from 'next/link'

const AMOUNTS = [1000, 2000, 5000, 10000, 25000, 50000]

const BANK_DETAILS = [
  { currency: 'Naira (NGN)', account: '2035918835' },
  { currency: 'USD', account: '2035990677' },
  { currency: 'GBP', account: '2035990725' },
  { currency: 'Euro', account: '2035990897' },
]

export default function Donate() {
  const [form, setForm] = useState({ name: '', email: '', amount: '' })
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState('')

  const initiate = async () => {
    if (!form.email || !form.amount) { setMsg('Please enter your email and amount.'); return }
    setLoading(true)
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/donations/initiate-payment`, form)
      window.location.href = res.data.authorization_url
    } catch (err) {
      setMsg(err.response?.data?.error || 'Error initiating payment.')
    }
    setLoading(false)
  }

  const copyAcct = (acct, label) => {
    navigator.clipboard.writeText(acct)
    setCopied(label)
    setTimeout(() => setCopied(''), 2000)
  }

  const inp = { padding: '0.9rem 1rem', borderRadius: '8px', border: '1px solid #1e4a1e', background: '#0d1f0d', color: '#fff', width: '100%', fontSize: '1rem', marginBottom: '1rem', outline: 'none' }

  return (
    <>
      <Navbar />
      <section style={{ minHeight: '100vh', background: '#091509', padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <Link href="/" style={{ color: '#d4a017', fontSize: '0.9rem', display: 'inline-block', marginBottom: '1.5rem' }}>← Back to Home</Link>

          {/* Card payment */}
          <div style={{ background: '#0d1f0d', padding: '2.5rem', borderRadius: '14px', border: '1px solid #1e4a1e', marginBottom: '2rem' }}>
            <h1 style={{ color: '#d4a017', fontSize: '1.8rem', marginBottom: '0.5rem' }}>Make a Donation</h1>
            <p style={{ color: '#888', marginBottom: '2rem', fontSize: '0.95rem' }}>Your contribution empowers Nigerian youths with skills and opportunity.</p>

            <p style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '0.8rem' }}>Quick amounts (₦):</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {AMOUNTS.map(a => (
                <button key={a} onClick={() => setForm({ ...form, amount: a })}
                  style={{ background: form.amount === a ? '#d4a017' : 'transparent', color: form.amount === a ? '#050f05' : '#d4a017', border: '1px solid #d4a017', borderRadius: '6px', padding: '0.4rem 0.9rem', cursor: 'pointer', fontWeight: 'bold' }}>
                  ₦{a.toLocaleString()}
                </button>
              ))}
            </div>

            <input style={inp} placeholder="Your Name (optional)" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <input style={inp} placeholder="Email Address *" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <input style={inp} placeholder="Amount in NGN *" type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />

            <button onClick={initiate} disabled={loading}
              style={{ width: '100%', background: loading ? '#8a6a10' : '#d4a017', color: '#050f05', padding: '1rem', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '1rem' }}>
              {loading ? 'Redirecting to Paystack...' : 'Proceed to Card Payment →'}
            </button>

            {msg && <p style={{ marginTop: '1rem', color: '#f87171', textAlign: 'center' }}>{msg}</p>}
            <p style={{ color: '#555', fontSize: '0.8rem', textAlign: 'center', marginTop: '1rem' }}>🔒 Secured by Paystack</p>
          </div>

          {/* Bank Transfer */}
          <div style={{ background: '#0d1f0d', padding: '2.5rem', borderRadius: '14px', border: '1px solid #1e4a1e' }}>
            <h2 style={{ color: '#d4a017', fontSize: '1.3rem', marginBottom: '0.5rem' }}>Bank Transfer</h2>
            <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '2rem' }}>Transfer directly to any of the accounts below. Send proof to info@chiefemekaagbafoundation.com</p>

            <div style={{ marginBottom: '1.2rem', padding: '1rem', background: '#091509', borderRadius: '8px', border: '1px solid #1a3a1a' }}>
              <div style={{ color: '#d4a017', fontSize: '0.8rem', marginBottom: '0.3rem' }}>ACCOUNT NAME</div>
              <div style={{ color: '#fff', fontWeight: 'bold' }}>Chief Emeka Agba Foundation</div>
            </div>

            <div style={{ marginBottom: '1.2rem', padding: '1rem', background: '#091509', borderRadius: '8px', border: '1px solid #1a3a1a' }}>
              <div style={{ color: '#d4a017', fontSize: '0.8rem', marginBottom: '0.3rem' }}>BANK NAME</div>
              <div style={{ color: '#fff', fontWeight: 'bold' }}>First Bank of Nigeria PLC</div>
            </div>

            {BANK_DETAILS.map(b => (
              <div key={b.currency} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#091509', borderRadius: '8px', border: '1px solid #1a3a1a', marginBottom: '0.8rem' }}>
                <div>
                  <div style={{ color: '#d4a017', fontSize: '0.8rem', marginBottom: '0.2rem' }}>{b.currency}</div>
                  <div style={{ color: '#fff', fontWeight: 'bold', letterSpacing: '1px' }}>{b.account}</div>
                </div>
                <button onClick={() => copyAcct(b.account, b.currency)}
                  style={{ background: copied === b.currency ? '#1e4a1e' : 'transparent', color: copied === b.currency ? '#4ade80' : '#d4a017', border: '1px solid #d4a017', borderRadius: '6px', padding: '0.4rem 0.8rem', cursor: 'pointer', fontSize: '0.8rem' }}>
                  {copied === b.currency ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            ))}

            <div style={{ padding: '1rem', background: '#091509', borderRadius: '8px', border: '1px solid #1a3a1a' }}>
              <div style={{ color: '#d4a017', fontSize: '0.8rem', marginBottom: '0.2rem' }}>SWIFT CODE (International)</div>
              <div style={{ color: '#fff', fontWeight: 'bold', letterSpacing: '2px' }}>FBNINGLA</div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}