'use client'
import { useState } from 'react'
import axios from 'axios'
import Navbar from '../../components/Navbar'
import Link from 'next/link'

const NGN_AMOUNTS = [1000, 2000, 5000, 10000, 25000, 50000]
const USD_AMOUNTS = [5, 10, 25, 50, 100, 250]

const BANK_DETAILS = [
  { currency: 'Naira (NGN)', account: '2035918835' },
  { currency: 'USD', account: '2035990677' },
  { currency: 'GBP', account: '2035990725' },
  { currency: 'Euro', account: '2035990897' },
]

const generateRef = () =>
  'CEA_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8).toUpperCase()

export default function Donate() {
  const [tab, setTab] = useState('ngn') // 'ngn' | 'usd'
  const [ngnForm, setNgnForm] = useState({ name: '', email: '', amount: '' })
  const [usdForm, setUsdForm] = useState({ name: '', email: '', amount: '' })
  const [msg, setMsg] = useState('')
  const [msgType, setMsgType] = useState('success')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState('')

  const copyAcct = (acct, label) => {
    navigator.clipboard.writeText(acct)
    setCopied(label)
    setTimeout(() => setCopied(''), 2000)
  }

  // ── NGN via FirstChekout ──────────────────────────────────────
  const payWithFirstChekout = async () => {
    if (!ngnForm.email || !ngnForm.amount) {
      setMsg('Please enter your email and amount.'); setMsgType('error'); return
    }
    const reference = generateRef()
    const nameParts = (ngnForm.name || 'Anonymous Donor').trim().split(' ')
    setLoading(true); setMsg('')

    try {
      await axios.post(process.env.NEXT_PUBLIC_API_URL + '/api/firstbank/save-donation', {
        name: ngnForm.name || 'Anonymous',
        email: ngnForm.email,
        amount: Number(ngnForm.amount),
        reference,
        currency: 'NGN',
      })
    } catch (e) { console.warn('Pre-save failed:', e.message) }

    let FBNCheckout
    try {
      const mod = await import('firstchekout')
      FBNCheckout = mod.default || mod
    } catch (e) {
      setLoading(false)
      setMsg('Payment SDK failed to load. Please use bank transfer below.')
      setMsgType('error'); return
    }

    const txn = {
      live: true,
      ref: reference,
      amount: Number(ngnForm.amount),
      customer: {
        firstname: nameParts[0],
        lastname: nameParts.slice(1).join(' ') || 'Donor',
        email: ngnForm.email,
        id: ngnForm.email,
      },
      fees: [],
      paymentAlias: 'Chief-EA-F',
      meta: { foundation: 'Chief Emeka Agba Foundation', currency: 'NGN' },
      publicKey: process.env.NEXT_PUBLIC_FIRSTCHEKOUT_PUBLIC_KEY,
      description: 'Donation to Chief Emeka Agba Foundation (NGN)',
      currency: 'NGN',
      options: ['CARD', 'QR', 'WALLET', 'PAYATTITUE'],
      callback: async (response) => {
        setLoading(false)
        const status = (response && (response.event || response.status || response.transactionStatus || '')).toString()
        const isSuccess =
          status === 'successful' || status === 'SUCCESS' ||
          status === 'success' || status === 'SUCCESSFUL' ||
          status === '00' || response.success === true
        if (isSuccess) {
          setMsg('Thank you! Your NGN donation of ₦' + Number(ngnForm.amount).toLocaleString() + ' has been received.')
          setMsgType('success')
          setNgnForm({ name: '', email: '', amount: '' })
        } else {
          setMsg('Payment was not completed. Please try again or use bank transfer below.')
          setMsgType('error')
        }
      },
      onClose: () => { setLoading(false) },
    }

    const addressUrl = {
      BaseFrame: 'https://checkout.firstchekout.com',
      InitiatePaymentURI: 'https://www.firstchekout.com/chekoutframeapi/api/v2/transactions/initiate',
    }

    try {
      if (typeof FBNCheckout.initiateTransactionAsync === 'function') {
        await FBNCheckout.initiateTransactionAsync(txn, addressUrl)
      } else if (typeof FBNCheckout.initiateTransaction === 'function') {
        FBNCheckout.initiateTransaction(txn); setLoading(false)
      } else {
        throw new Error('No valid method on FBNCheckout')
      }
    } catch (err) {
      setLoading(false)
      setMsg('Payment popup failed. Please use bank transfer below.')
      setMsgType('error')
    }
  }

  // ── USD via Paystack ──────────────────────────────────────────
  const payWithPaystack = async () => {
    if (!usdForm.email || !usdForm.amount) {
      setMsg('Please enter your email and amount.'); setMsgType('error'); return
    }
    const reference = generateRef()
    setLoading(true); setMsg('')

    try {
      await axios.post(process.env.NEXT_PUBLIC_API_URL + '/api/paystack/save-donation', {
        name: usdForm.name || 'Anonymous',
        email: usdForm.email,
        amount: Number(usdForm.amount),
        reference,
        currency: 'USD',
      })
    } catch (e) { console.warn('Pre-save failed:', e.message) }

    // Load Paystack inline script dynamically
    const amountInCents = Math.round(Number(usdForm.amount) * 100)

    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email: usdForm.email,
      amount: amountInCents,
      currency: 'USD',
      ref: reference,
      metadata: {
        custom_fields: [
          { display_name: 'Donor Name', variable_name: 'donor_name', value: usdForm.name || 'Anonymous' },
          { display_name: 'Foundation', variable_name: 'foundation', value: 'Chief Emeka Agba Foundation' },
          { display_name: 'Currency', variable_name: 'currency', value: 'USD' },
        ]
      },
      callback: async (response) => {
        setLoading(false)
        if (response.status === 'success') {
          // Verify with backend
          try {
            await axios.post(process.env.NEXT_PUBLIC_API_URL + '/api/paystack/verify-payment', { reference })
          } catch (e) { console.warn('Verify failed:', e.message) }
          setMsg('Thank you! Your USD donation of $' + Number(usdForm.amount).toLocaleString() + ' has been received.')
          setMsgType('success')
          setUsdForm({ name: '', email: '', amount: '' })
        } else {
          setMsg('Payment was not completed. Please try again or use bank transfer below.')
          setMsgType('error')
        }
      },
      onClose: () => { setLoading(false) },
    })
    handler.openIframe()
  }

  // Ensure Paystack script is loaded
  const loadPaystackScript = () => {
    return new Promise((resolve) => {
      if (window.PaystackPop) { resolve(); return }
      const script = document.createElement('script')
      script.src = 'https://js.paystack.co/v1/inline.js'
      script.onload = resolve
      document.body.appendChild(script)
    })
  }

  const handleUSDPay = async () => {
    await loadPaystackScript()
    payWithPaystack()
  }

  const inp = {
    padding: '0.9rem 1rem', borderRadius: '8px',
    border: '1px solid #1a4a20', background: '#0d1f0d',
    color: '#fff', width: '100%', fontSize: '1rem',
    marginBottom: '1rem', outline: 'none',
  }

  const tabBtn = (t) => ({
    flex: 1, padding: '0.8rem', border: '1px solid #1a4a20',
    borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold',
    fontSize: '0.95rem', transition: 'all 0.2s',
    background: tab === t ? '#c9911a' : 'transparent',
    color: tab === t ? '#061209' : '#c9911a',
  })

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

            {/* Currency Tab Selector */}
            <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '2rem' }}>
              <button style={tabBtn('ngn')} onClick={() => { setTab('ngn'); setMsg('') }}>
                🏦 Donate in NGN
              </button>
              <button style={tabBtn('usd')} onClick={() => { setTab('usd'); setMsg('') }}>
                💵 Donate in USD
              </button>
            </div>

            {/* ── NGN Tab ── */}
            {tab === 'ngn' && (
              <>
                <p style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '0.8rem' }}>Quick amounts (₦):</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.2rem' }}>
                  {NGN_AMOUNTS.map(a => (
                    <button key={a} onClick={() => setNgnForm({ ...ngnForm, amount: a })} style={{
                      background: ngnForm.amount === a ? '#c9911a' : 'transparent',
                      color: ngnForm.amount === a ? '#061209' : '#c9911a',
                      border: '1px solid #c9911a', borderRadius: '6px',
                      padding: '0.4rem 0.9rem', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem',
                    }}>
                      ₦{a.toLocaleString()}
                    </button>
                  ))}
                </div>
                <input style={inp} placeholder="Your Name (optional)" value={ngnForm.name}
                  onChange={e => setNgnForm({ ...ngnForm, name: e.target.value })} />
                <input style={inp} placeholder="Email Address *" type="email" value={ngnForm.email}
                  onChange={e => setNgnForm({ ...ngnForm, email: e.target.value })} />
                <input style={inp} placeholder="Amount in NGN (₦) *" type="number" value={ngnForm.amount}
                  onChange={e => setNgnForm({ ...ngnForm, amount: e.target.value })} />
                <button onClick={payWithFirstChekout} disabled={loading} style={{
                  width: '100%', padding: '1rem', border: 'none', borderRadius: '8px',
                  background: loading ? '#6a5010' : '#c9911a', color: '#061209',
                  fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '1rem', marginBottom: '1rem',
                }}>
                  {loading ? 'Processing...' : '🏦 Pay with First Bank (NGN)'}
                </button>
                <p style={{ color: '#3a5a3a', fontSize: '0.78rem', textAlign: 'center' }}>
                  🔒 Secured by First Bank of Nigeria · Currency: NGN
                </p>
              </>
            )}

            {/* ── USD Tab ── */}
            {tab === 'usd' && (
              <>
                <p style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '0.8rem' }}>Quick amounts ($):</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.2rem' }}>
                  {USD_AMOUNTS.map(a => (
                    <button key={a} onClick={() => setUsdForm({ ...usdForm, amount: a })} style={{
                      background: usdForm.amount === a ? '#c9911a' : 'transparent',
                      color: usdForm.amount === a ? '#061209' : '#c9911a',
                      border: '1px solid #c9911a', borderRadius: '6px',
                      padding: '0.4rem 0.9rem', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem',
                    }}>
                      ${a}
                    </button>
                  ))}
                </div>
                <input style={inp} placeholder="Your Name (optional)" value={usdForm.name}
                  onChange={e => setUsdForm({ ...usdForm, name: e.target.value })} />
                <input style={inp} placeholder="Email Address *" type="email" value={usdForm.email}
                  onChange={e => setUsdForm({ ...usdForm, email: e.target.value })} />
                <input style={inp} placeholder="Amount in USD ($) *" type="number" value={usdForm.amount}
                  onChange={e => setUsdForm({ ...usdForm, amount: e.target.value })} />
                <button onClick={handleUSDPay} disabled={loading} style={{
                  width: '100%', padding: '1rem', border: 'none', borderRadius: '8px',
                  background: loading ? '#6a5010' : '#1a6b3a', color: '#fff',
                  fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '1rem', marginBottom: '1rem',
                }}>
                  {loading ? 'Processing...' : '💵 Pay with Paystack (USD)'}
                </button>
                <p style={{ color: '#3a5a3a', fontSize: '0.78rem', textAlign: 'center' }}>
                  🔒 Secured by Paystack · Currency: USD
                </p>
              </>
            )}

            {msg && (
              <div style={{
                padding: '1rem', borderRadius: '8px', textAlign: 'center', marginTop: '1rem',
                background: msgType === 'success' ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)',
                border: '1px solid ' + (msgType === 'success' ? '#4ade80' : '#f87171'),
                color: msgType === 'success' ? '#4ade80' : '#f87171',
                fontSize: '0.95rem', lineHeight: 1.6,
              }}>
                {msg}
              </div>
            )}
          </div>

          {/* Bank Transfer Section */}
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
