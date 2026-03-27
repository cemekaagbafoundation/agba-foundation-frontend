'use client'
import { useState } from 'react'
import axios from 'axios'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [msg, setMsg] = useState('')
  const [isError, setIsError] = useState(false)

  const send = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, form)
      setMsg('Message sent successfully!'); setIsError(false)
      setForm({ name: '', email: '', message: '' })
    } catch { setMsg('Failed to send. Please try again.'); setIsError(true) }
  }

  const inp = { padding: '0.9rem 1rem', borderRadius: '8px', border: '1px solid #1a4a20', background: '#0f2d16', color: '#f0f0f0', width: '100%', fontSize: '1rem', marginBottom: '1rem', outline: 'none' }

  return (
    <section id="contact" style={{ padding: '5rem 3rem', background: '#0a1f0f', borderTop: '1px solid #1a4a20' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
        <p style={{ color: '#c9911a', letterSpacing: '3px', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.5rem', textAlign: 'center' }}>Reach Us</p>
        <h2 style={{ color: '#f0f0f0', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', marginBottom: '0.5rem', textAlign: 'center' }}>Contact Us</h2>
        <p style={{ color: '#7a9e7a', textAlign: 'center', marginBottom: '2.5rem', fontSize: '0.9rem' }}>
          📧 info@chiefemekaagbafoundation.com &nbsp;|&nbsp; 📞 +2348101866548
        </p>
        <input style={inp} placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input style={inp} placeholder="Email Address" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <textarea style={{ ...inp, minHeight: '140px', resize: 'vertical' }} placeholder="Your message..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
        <button onClick={send} style={{ width: '100%', background: '#c9911a', color: '#061209', padding: '1rem', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
          Send Message
        </button>
        {msg && <p style={{ marginTop: '1rem', color: isError ? '#f87171' : '#4ade80', textAlign: 'center' }}>{msg}</p>}
      </div>
    </section>
  )
}