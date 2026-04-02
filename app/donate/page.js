'use client'
import { useState } from 'react'
import axios from 'axios'
import Navbar from '../../components/Navbar'
import Link from 'next/link'

const AMOUNTS = [1000, 2000, 5000, 10000, 25000, 50000]
const CURRENCIES = ['NGN', 'USD', 'GBP', 'EUR']

const BANK_DETAILS = [
  { currency: 'Naira (NGN)', account: '2035918835' },
  { currency: 'USD', account: '2035990677' },
  { currency: 'GBP', account: '2035990725' },
  { currency: 'Euro', account: '2035990897' },
]

export default function Donate() {
  const [gateway, setGateway] = useState('paystack')
  const [form, setForm] = useState({ name: '', email: '', amount: '', currency: 'NGN' })
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState('')

  const copyAcct = (acct, label) => {
    navigator.clipboard.writeText(acct)
    setCopied(label); setTimeout(() => setCopied(''), 2000)
  }

  const initiate = async () => {
    if (!form.email || !form.amount) {
      setMsg('Please enter your email and amount.')
      return
    }
    setLoading(true)
    setMsg('')
    try {
      const endpoint = gateway === 'firstbank'
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/firstbank/initiate-payment`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/donations/initiate-payment`

      const res = await axios.post(endpoint, form)

      const redirectUrl = res.data.authorization_url
        || res.data.payment_url
        || res.data.redirectUrl

      if (redirectUrl) {
        window.location.href = redirectUrl
      } else {
        setMsg('Payment initiated. Reference: ' + (res.data.reference || 'N/A'))
      }
    } catch (err) {
      setMsg(err.response?.data?.error || 'Error initiating payment. Please try again.')
    }
    setLoading(false)
  }

  const inp = {
    padding: '0.9rem 1rem',
    borderRadius: '8px',
    border: '1px solid #1a4a20',
    background: '#0d1f0d',
    color: '#fff',
    width: '100%',
    fontSize: '1rem',
    marginBottom: '1rem',
    outline: 'none',
  }

  return (
    <>
      <Navbar />
      <section style={{ minHeight: '100vh', background: '#091509', padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <Link href="/" style={{ color: '#c9911a', fontSize: '0.9rem', display: 'inline-block', marginBottom: '1.5rem' }}>
            ← Back to Home
          </Link>

          {/* Gateway selector */}
          <div style={{ background: '#0d1f0d', padding: '2.5rem', borderRadius: '14px', border: '1px solid #1a4a20', marginBottom: '2rem' }}>
            <h1 style={{ color: '#c9911a', fontSize: '1.8rem', marginBottom: '0.5rem' }}>Make a Donation</h1>
            <p style={{ color: '#7a9e7a', marginBottom: '2rem', fontSize: '0.95rem' }}>
              Your contribution empowers Nigerian youths with skills and opportunity.
            </p>

            {/* Payment method toggle */}
            <p style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '0.8rem' }}>Select payment method:</p>
            <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              {[
                { id: 'paystack', label: '💳 Paystack', sub: 'Cards, Bank Transfer' },
                { id: 'firstbank', label: '🏦 First Bank', sub: 'Direct Bank Payment' },
              ].map(g => (
                <button
                  key={g.id}
                  onClick={() => setGateway(g.id)}
                  style={{
                    flex: 1,
                    padding: '0.9rem',
                    borderRadius: '8px',
                    border: gateway === g.id ? '2px solid #c9911a' : '1px solid #1a4a20',
                    background: gateway === g.id ? 'rgba(201,145,26,0.1)' : 'transparent',
                    color: gateway === g.id ? '#c9911a' : '#7a9e7a',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                  }}>
                  <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{g.label}</div>
                  <div style={{ fontSize: '0.78rem', marginTop: '0.2rem', opacity: 0.8 }}>{g.sub}</div>
                </button>
              ))}
            </div>

            {/* First Bank notice */}
            {gateway === 'firstbank' && (
              <div style={{ background: 'rgba(201,145,26,0.08)', border: '1px solid rgba(201,145,26,0.3)', borderRadius: '8px', padding: '0.9rem', marginBottom: '1.2rem', fontSize: '0.85rem', color: '#c9911a' }}>
                🏦 First Bank direct payment integration coming soon. Currently in sandbox testing phase.
              </div>
            )}

            {/* Quick amounts */}
            <p style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '0.8rem' }}>Quick amounts:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.2rem' }}>
              {AMOUNTS.map(a => (
                <button key={a}
                  onClick={() => setForm({ ...form, amount: a })}
                  style={{
                    background: form.amount === a ? '#c9911a' : 'transparent',
                    color: form.amount === a ? '#061209' : '#c9911a',
                    border: '1px solid #c9911a',
                    borderRadius: '6px',
                    padding: '0.4rem 0.9rem',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '0.85rem',
                  }}>
                  ₦{a.toLocaleString()}
                </button>
              ))}
            </div>

            <input style={inp} placeholder="Your Name (optional)" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} />
            <input style={inp} placeholder="Email Address *" type="email" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} />
            <input style={inp} placeholder="Amount *" type="number" value={form.amount}
              onChange={e => setForm({ ...form, amount: e.target.value })} />

            {/* Currency selector — shown for FirstBank */}
            {gateway === 'firstbank' && (
              <select style={inp} value={form.currency}
                onChange={e => setForm({ ...form, currency: e.target.value })}>
                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            )}

            <button
              onClick={initiate}
              disabled={loading}
              style={{
                width: '100%',
                background: loading ? '#6a5010' : '#c9911a',
                color: '#061209',
                padding: '1rem',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                marginBottom: '1rem',
              }}>
              {loading
                ? 'Redirecting...'
                : gateway === 'firstbank'
                  ? '🏦 Pay with First Bank →'
                  : '💳 Proceed to Paystack →'
              }
            </button>

            {msg && (
              <p style={{ color: msg.includes('Error') || msg.includes('error') ? '#f87171' : '#4ade80', textAlign: 'center', fontSize: '0.95rem' }}>
                {msg}
              </p>
            )}

            <p style={{ color: '#3a5a3a', fontSize: '0.78rem', textAlign: 'center', marginTop: '0.5rem' }}>
              🔒 All payments are secured and encrypted
            </p>
          </div>

          {/* Bank Transfer section */}
          <div style={{ background: '#0d1f0d', padding: '2.5rem', borderRadius: '14px', border: '1px solid #1a4a20' }}>
            <h2 style={{ color: '#c9911a', fontSize: '1.3rem', marginBottom: '0.5rem' }}>Bank Transfer</h2>
            <p style={{ color: '#7a9e7a', fontSize: '0.9rem', marginBottom: '2rem' }}>
              Transfer directly to any account below. Send proof to{' '}
              <a href="mailto:info@chiefemekaagbafoundation.com" style={{ color: '#c9911a' }}>
                info@chiefemekaagbafoundation.com
              </a>
            </p>

            <div style={{ marginBottom: '1.2rem', padding: '1rem', background: '#091509', borderRadius: '8px', border: '1px solid #1a4a20' }}>
              <div style={{ color: '#c9911a', fontSize: '0.78rem', marginBottom: '0.3rem' }}>ACCOUNT NAME</div>
              <div style={{ color: '#fff', fontWeight: 'bold' }}>Chief Emeka Agba Foundation</div>
            </div>

            <div style={{ marginBottom: '1.2rem', padding: '1rem', background: '#091509', borderRadius: '8px', border: '1px solid #1a4a20' }}>
              <div style={{ color: '#c9911a', fontSize: '0.78rem', marginBottom: '0.3rem' }}>BANK NAME</div>
              <div style={{ color: '#fff', fontWeight: 'bold' }}>First Bank of Nigeria PLC</div>
            </div>

            {BANK_DETAILS.map(b => (
              <div key={b.currency} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#091509', borderRadius: '8px', border: '1px solid #1a4a20', marginBottom: '0.8rem' }}>
                <div>
                  <div style={{ color: '#c9911a', fontSize: '0.78rem', marginBottom: '0.2rem' }}>{b.currency}</div>
                  <div style={{ color: '#fff', fontWeight: 'bold', letterSpacing: '1px' }}>{b.account}</div>
                </div>
                <button onClick={() => copyAcct(b.account, b.currency)}
                  style={{ background: copied === b.currency ? '#1e4a1e' : 'transparent', color: copied === b.currency ? '#4ade80' : '#c9911a', border: '1px solid #c9911a', borderRadius: '6px', padding: '0.4rem 0.8rem', cursor: 'pointer', fontSize: '0.8rem' }}>
                  {copied === b.currency ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            ))}

            <div style={{ padding: '1rem', background: '#091509', borderRadius: '8px', border: '1px solid #1a4a20' }}>
              <div style={{ color: '#c9911a', fontSize: '0.78rem', marginBottom: '0.2rem' }}>SWIFT CODE (International)</div>
              <div style={{ color: '#fff', fontWeight: 'bold', letterSpacing: '2px' }}>FBNINGLA</div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}