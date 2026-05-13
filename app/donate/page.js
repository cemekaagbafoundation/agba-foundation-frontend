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

const generateRef = () =>
  'CEA_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8).toUpperCase()

export default function Donate() {
  const [form, setForm] = useState({ name: '', email: '', amount: '', currency: 'NGN' })
  const [msg, setMsg] = useState('')
  const [msgType, setMsgType] = useState('success')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState('')

  const copyAcct = (acct, label) => {
    navigator.clipboard.writeText(acct)
    setCopied(label)
    setTimeout(() => setCopied(''), 2000)
  }

  const payWithFirstChekout = async () => {
    if (!form.email || !form.amount) {
      setMsg('Please enter your email and amount.')
      setMsgType('error')
      return
    }

    const reference = generateRef()
    const nameParts = (form.name || 'Anonymous Donor').trim().split(' ')
    setLoading(true)
    setMsg('')

    // Save pending donation to backend
    try {
      await axios.post(
        process.env.NEXT_PUBLIC_API_URL + '/api/firstbank/save-donation',
        {
          name: form.name || 'Anonymous',
          email: form.email,
          amount: Number(form.amount) * 100,
          reference,
          currency: form.currency,
        }
      )
    } catch (e) {
      console.warn('Pre-save failed (non-blocking):', e.message)
    }

    // Dynamically import — browser only, avoids SSR crash
    let FBNCheckout
    try {
      const mod = await import('firstchekout')
      FBNCheckout = mod.default || mod
      console.log('FBNCheckout loaded, keys:', Object.keys(FBNCheckout))
    } catch (e) {
      setLoading(false)
      setMsg('Payment SDK failed to load. Please use bank transfer below.')
      setMsgType('error')
      return
    }

    // Transaction object — matches sample payload structure exactly
    const txn = {
      live: false,
      ref: reference,
      amount: Number(form.amount) * 100,
      customer: {
        firstname: nameParts[0],
        lastname: nameParts.slice(1).join(' ') || 'Donor',
        email: form.email,
        id: form.email,
      },
      fees: [],
      paymentAlias: 'Chief-EA-F',
      meta: { foundation: 'Chief Emeka Agba Foundation' },
      publicKey: process.env.NEXT_PUBLIC_FIRSTCHEKOUT_PUBLIC_KEY,
      description: 'Donation to Chief Emeka Agba Foundation',
      currency: form.currency,
      options: ['CARD', 'QR', 'WALLET', 'PAYATTITUE'],
      callback: async (response) => {
        console.log('FirstChekout callback:', JSON.stringify(response))
        setLoading(false)
        const status = (response && (response.status || response.transactionStatus || '')).toString()
        const isSuccess =
          status === 'successful' || status === 'SUCCESS' ||
          status === 'success' || status === 'SUCCESSFUL' ||
          status === '00' || response.success === true
        if (isSuccess) {
          setMsg('Thank you! Your donation of ₦' + Number(form.amount).toLocaleString() + ' has been received.')
          setMsgType('success')
          setForm({ name: '', email: '', amount: '', currency: 'NGN' })
          try {
            await axios.post(
              process.env.NEXT_PUBLIC_API_URL + '/api/firstbank/verify-payment',
              { reference }
            )
          } catch (e) {
            console.warn('Verify call failed:', e.message)
          }
        } else {
          setMsg('Payment was not completed. Please try again or use bank transfer below.')
          setMsgType('error')
        }
      },
      onClose: () => {
        setLoading(false)
        console.log('FirstChekout popup closed')
      },
    }

    // ✅ Correct URLs from First Bank documentation
    const addressUrl = {
      BaseFrame: 'https://paymentcheckoutui-qa.azurewebsites.net',
      InitiatePaymentURI: 'https://payment-checkout-dev.azurewebsites.net/api/v2/transactions/initiate',
    }

    console.log('Launching FirstChekout popup...')
    console.log('Ref:', reference, '| Amount:', form.amount, '| Email:', form.email)
 console.log(txn)
    try {
      if (typeof FBNCheckout.initiateTransactionAsync === 'function') {
        await FBNCheckout.initiateTransactionAsync(txn, addressUrl)
      } else if (typeof FBNCheckout.initiateTransaction === 'function') {
        FBNCheckout.initiateTransaction(txn)
        setLoading(false)
      } else {
        throw new Error('No valid method on FBNCheckout. Keys: ' + Object.keys(FBNCheckout).join(', '))
      }
    } catch (err) {
      console.error('FBNCheckout launch error:', err)
      setLoading(false)
      setMsg('Payment popup failed. Please use bank transfer below.')
      setMsgType('error')
    }
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

            <p style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '0.8rem' }}>Quick amounts (₦):</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.2rem' }}>
              {AMOUNTS.map(a => (
                <button key={a} onClick={() => setForm({ ...form, amount: a })} style={{
                  background: form.amount === a ? '#c9911a' : 'transparent',
                  color: form.amount === a ? '#061209' : '#c9911a',
                  border: '1px solid #c9911a', borderRadius: '6px',
                  padding: '0.4rem 0.9rem', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem',
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
              onClick={payWithFirstChekout}
              disabled={loading}
              style={{
                width: '100%', padding: '1rem', border: 'none', borderRadius: '8px',
                background: loading ? '#6a5010' : '#c9911a',
                color: '#061209', fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer', fontSize: '1rem', marginBottom: '1rem',
              }}>
              {loading ? 'Processing...' : '🏦 Pay with FirstChekout'}
            </button>

            {msg && (
              <div style={{
                padding: '1rem', borderRadius: '8px', textAlign: 'center',
                background: msgType === 'success' ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)',
                border: '1px solid ' + (msgType === 'success' ? '#4ade80' : '#f87171'),
                color: msgType === 'success' ? '#4ade80' : '#f87171',
                fontSize: '0.95rem', lineHeight: 1.6,
              }}>
                {msg}
              </div>
            )}

            <p style={{ color: '#3a5a3a', fontSize: '0.78rem', textAlign: 'center', marginTop: '1rem' }}>
              🔒 Secured by First Bank of Nigeria
            </p>
          </div>

          <div style={{ background: '#0d1f0d', padding: '2.5rem', borderRadius: '14px', border: '1px solid #1a4a20' }}>
            <h2 style={{ color: '#c9911a', fontSize: '1.3rem', marginBottom: '0.5rem' }}>Bank Transfer</h2>
            <p style={{ color: '#7a9e7a', fontSize: '0.9rem', marginBottom: '2rem' }}>
              Transfer directly. Send proof to{' '}
              <a href="mailto:info@chiefemekaagbafoundation.com" style={{ color: '#c9911a' }}>
                info@chiefemekaagbafoundation.com
              </a>
            </p>

            {[
              { label: 'ACCOUNT NAME', value: 'Chief Emeka Agba Foundation' },
              { label: 'BANK NAME', value: 'First Bank of Nigeria PLC' },
            ].map(item => (
              <div key={item.label} style={{ padding: '1rem', background: '#091509', borderRadius: '8px', border: '1px solid #1a4a20', marginBottom: '0.8rem' }}>
                <div style={{ color: '#c9911a', fontSize: '0.78rem', marginBottom: '0.2rem' }}>{item.label}</div>
                <div style={{ color: '#fff', fontWeight: 'bold' }}>{item.value}</div>
              </div>
            ))}

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
