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
  const [gateway, setGateway] = useState('firstchekout')
  const [form, setForm] = useState({ name: '', email: '', amount: '', currency: 'NGN' })
  const [msg, setMsg] = useState('')
  const [msgType, setMsgType] = useState('success')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState('')

  const copyAcct = (acct, label) => {
    navigator.clipboard.writeText(acct)
    setCopied(label); setTimeout(() => setCopied(''), 2000)
  }

  const generateRef = () => `CEA_${Date.now()}_${Math.random().toString(36).substr(2, 8).toUpperCase()}`

  const payWithFirstChekout = async () => {
    if (!form.email || !form.amount) {
      setMsg('Please enter your email and amount.'); setMsgType('error'); return
    }

    const nameParts = (form.name || 'Anonymous Donor').split(' ')
    const firstname = nameParts[0]
    const lastname = nameParts.slice(1).join(' ') || 'Donor'
    const reference = generateRef()
    const isLive = process.env.NEXT_PUBLIC_FIRSTCHEKOUT_LIVE === 'true'

    setLoading(true)

    // Save pending donation first
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/donations/initiate-payment`, {
        name: form.name,
        email: form.email,
        amount: Number(form.amount),
        reference,
        gateway: 'firstchekout'
      })
    } catch (e) {
      console.log('Pre-save failed, continuing...')
    }

    // Dynamically import to avoid SSR issues
    const FirstChekout = (await import('firstchekout')).default

    const txn = {
      live: isLive,
      ref: reference,
      amount: Number(form.amount),
      customer: {
        firstname,
        lastname,
        email: form.email,
        id: form.email,
      },
      meta: {
        foundation: 'Chief Emeka Agba Foundation',
        purpose: 'Donation'
      },
      publicKey: process.env.NEXT_PUBLIC_FIRSTCHEKOUT_PUBLIC_KEY,
      description: 'Donation to Chief Emeka Agba Foundation - Street to Skill Initiative',
      currency: form.currency,
      options: ['CARD', 'QR', 'USSD', 'BANK_TRANSFER'],
      callback: async (response) => {
        console.log('FirstChekout response:', response)
        setLoading(false)
        if (response && (response.status === 'successful' || response.success === true)) {
          // Verify with backend
          try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/firstbank/verify-payment`, {
              reference: response.ref || reference
            })
          } catch (e) {
            console.log('Verification error, webhook will handle it')
          }
          setMsg('✅ Thank you! Your donation of ₦' + Number(form.amount).toLocaleString() + ' has been received.')
          setMsgType('success')
          setForm({ name: '', email: '', amount: '', currency: 'NGN' })
        } else {
          setMsg('❌ Payment was not completed. Please try again.')
          setMsgType('error')
        }
      },
      onClose: () => {
        setLoading(false)
        console.log('Payment window closed')
      }
    }

    try {
      FirstChekout.initiateTransaction(txn)
    } catch (err) {
      setLoading(false)
      setMsg('Error loading payment. Please try again.'); setMsgType('error')
    }
  }

  const payWithPaystack = async () => {
    if (!form.email || !form.amount) {
      setMsg('Please enter your email and amount.'); setMsgType('error'); return
    }
    setLoading(true)
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/donations/initiate-payment`,
        { name: form.name, email: form.email, amount: Number(form.amount) }
      )
      window.location.href = res.data.authorization_url
    } catch (err) {
      setMsg(err.response?.data?.error || 'Error initiating payment.'); setMsgType('error')
    }
    setLoading(false)
  }

  const inp = {
    padding: '0.9rem 1rem', borderRadius: '8px',
    border: '1px solid #1a4a20', background: '#0d1f0d',
    color: '#fff', width: '100%', fontSize: '1rem',
    marginBottom: '1rem', outline: 'none',
  }

  return (
    <>
      <Navbar />
      <section style={{ minHeight: '100vh', background: '#091509', padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <Link href="/" style={{ color: '#c9911a', fontSize: '0.9rem', display: 'inline-block', marginBottom: '1.5rem' }}>
            ← Back to Home
          </Link>

          <div style={{ background: '#0d1f0d', padding: '2.5rem', borderRadius: '14px', border: '1px solid #1a4a20', marginBottom: '2rem' }}>
            <h1 style={{ color: '#c9911a', fontSize: '1.8rem', marginBottom: '0.5rem' }}>Make a Donation</h1>
            <p style={{ color: '#7a9e7a', marginBottom: '2rem', fontSize: '0.95rem' }}>
              Your contribution empowers Nigerian youths with skills and opportunity.
            </p>

            {/* Gateway selector */}
            <p style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '0.8rem' }}>Select payment method:</p>
            <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '1.5rem' }}>
              {[
                { id: 'firstchekout', label: '🏦 FirstChekout', sub: 'First Bank Gateway' },
                { id: 'paystack', label: '💳 Paystack', sub: 'Cards & Bank Transfer' },
              ].map(g => (
                <button key={g.id} onClick={() => setGateway(g.id)} style={{
                  flex: 1, padding: '0.9rem', borderRadius: '8px', cursor: 'pointer',
                  border: gateway === g.id ? '2px solid #c9911a' : '1px solid #1a4a20',
                  background: gateway === g.id ? 'rgba(201,145,26,0.1)' : 'transparent',
                  color: gateway === g.id ? '#c9911a' : '#7a9e7a',
                  textAlign: 'left', transition: 'all 0.2s',
                }}>
                  <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{g.label}</div>
                  <div style={{ fontSize: '0.75rem', marginTop: '0.2rem', opacity: 0.8 }}>{g.sub}</div>
                </button>
              ))}
            </div>

            {/* Quick amounts */}
            <p style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '0.8rem' }}>Quick amounts (₦):</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.2rem' }}>
              {AMOUNTS.map(a => (
                <button key={a} onClick={() => setForm({ ...form, amount: a })} style={{
                  background: form.amount === a ? '#c9911a' : 'transparent',
                  color: form.amount === a ? '#061209' : '#c9911a',
                  border: '1px solid #c9911a', borderRadius: '6px',
                  padding: '0.4rem 0.9rem', cursor: 'pointer',
                  fontWeight: 'bold', fontSize: '0.85rem',
                }}>
                  ₦{a.toLocaleString()}
                </button>
              ))}
            </div>

            <input style={inp} placeholder="Your Name (optional)" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} />
            <input style={inp} placeholder="Email Address *" type="email" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} />
            <input style={inp} placeholder="Amount in NGN *" type="number" value={form.amount}
              onChange={e => setForm({ ...form, amount: e.target.value })} />

            <button
              onClick={gateway === 'firstchekout' ? payWithFirstChekout : payWithPaystack}
              disabled={loading}
              style={{
                width: '100%', padding: '1rem', border: 'none', borderRadius: '8px',
                background: loading ? '#6a5010' : '#c9911a',
                color: '#061209', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '1rem', marginBottom: '1rem',
              }}>
              {loading ? 'Processing...' : gateway === 'firstchekout' ? '🏦 Pay with FirstChekout' : '💳 Pay with Paystack'}
            </button>

            {msg && (
              <div style={{
                padding: '1rem', borderRadius: '8px', textAlign: 'center',
                background: msgType === 'success' ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)',
                border: `1px solid ${msgType === 'success' ? '#4ade80' : '#f87171'}`,
                color: msgType === 'success' ? '#4ade80' : '#f87171',
                fontSize: '0.95rem', lineHeight: 1.6,
              }}>
                {msg}
              </div>
            )}

            <p style={{ color: '#3a5a3a', fontSize: '0.78rem', textAlign: 'center', marginTop: '1rem' }}>
              🔒 All payments are secured and encrypted by First Bank of Nigeria
            </p>
          </div>

          {/* Bank Transfer */}
          <div style={{ background: '#0d1f0d', padding: '2.5rem', borderRadius: '14px', border: '1px solid #1a4a20' }}>
            <h2 style={{ color: '#c9911a', fontSize: '1.3rem', marginBottom: '0.5rem' }}>Bank Transfer</h2>
            <p style={{ color: '#7a9e7a', fontSize: '0.9rem', marginBottom: '2rem' }}>
              Transfer directly to any account below. Send proof to{' '}
              <a href="mailto:info@chiefemekaagbafoundation.com" style={{ color: '#c9911a' }}>
                info@chiefemekaagbafoundation.com
              </a>
            </p>

            <div style={{ padding: '1rem', background: '#091509', borderRadius: '8px', border: '1px solid #1a4a20', marginBottom: '0.8rem' }}>
              <div style={{ color: '#c9911a', fontSize: '0.78rem', marginBottom: '0.2rem' }}>ACCOUNT NAME</div>
              <div style={{ color: '#fff', fontWeight: 'bold' }}>Chief Emeka Agba Foundation</div>
            </div>

            <div style={{ padding: '1rem', background: '#091509', borderRadius: '8px', border: '1px solid #1a4a20', marginBottom: '0.8rem' }}>
              <div style={{ color: '#c9911a', fontSize: '0.78rem', marginBottom: '0.2rem' }}>BANK NAME</div>
              <div style={{ color: '#fff', fontWeight: 'bold' }}>First Bank of Nigeria PLC</div>
            </div>

            {BANK_DETAILS.map(b => (
              <div key={b.currency} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#091509', borderRadius: '8px', border: '1px solid #1a4a20', marginBottom: '0.8rem' }}>
                <div>
                  <div style={{ color: '#c9911a', fontSize: '0.78rem', marginBottom: '0.2rem' }}>{b.currency}</div>
                  <div style={{ color: '#fff', fontWeight: 'bold', letterSpacing: '1px' }}>{b.account}</div>
                </div>
                <button onClick={() => copyAcct(b.account, b.currency)} style={{
                  background: copied === b.currency ? '#1e4a1e' : 'transparent',
                  color: copied === b.currency ? '#4ade80' : '#c9911a',
                  border: '1px solid #c9911a', borderRadius: '6px',
                  padding: '0.4rem 0.8rem', cursor: 'pointer', fontSize: '0.8rem',
                }}>
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