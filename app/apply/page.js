'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from '../../components/Navbar'
import Link from 'next/link'

const COUNTRIES = [
  'Nigeria', 'Ghana', 'Kenya', 'South Africa', 'Cameroon', 'Ethiopia',
  'Egypt', 'Tanzania', 'Uganda', 'Senegal', 'Ivory Coast', 'Rwanda',
  'United Kingdom', 'United States', 'Canada', 'Germany', 'France',
  'Other'
]

export default function Apply() {
  const [programs, setPrograms] = useState([])
  const [form, setForm] = useState({
    full_name: '', dob: '', country: '', state: '',
    email: '', phone: '', sex: '', program: ''
  })
  const [msg, setMsg] = useState('')
  const [isError, setIsError] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/programs`)
      .then(r => setPrograms(r.data))
      .catch(() => {})
  }, [])

  const submit = async () => {
    setSubmitting(true)
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/apply`, form)
      setMsg('Application submitted successfully! We will contact you soon.')
      setIsError(false)
      setForm({ full_name: '', dob: '', country: '', state: '', email: '', phone: '', sex: '', program: '' })
    } catch (err) {
      setMsg(err.response?.data?.error || 'Error submitting. Please fill all fields and try again.')
      setIsError(true)
    }
    setSubmitting(false)
  }

  const inp = {
    padding: '0.9rem 1rem',
    borderRadius: '8px',
    border: '1px solid #1e4a1e',
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
        <div style={{ maxWidth: '580px', margin: '0 auto' }}>
          <Link href="/" style={{ color: '#d4a017', fontSize: '0.9rem', display: 'inline-block', marginBottom: '1.5rem' }}>
            ← Back to Home
          </Link>
          <h1 style={{ color: '#d4a017', fontSize: '2rem', marginBottom: '0.5rem' }}>Apply for a Program</h1>
          <p style={{ color: '#888', marginBottom: '2rem' }}>Fill in all fields below. Our team will review and contact you.</p>

          <input style={inp} placeholder="Full Name" value={form.full_name}
            onChange={e => setForm({ ...form, full_name: e.target.value })} />

          <label style={{ color: '#888', fontSize: '0.85rem', display: 'block', marginBottom: '0.4rem' }}>Date of Birth</label>
          <input style={{ ...inp, colorScheme: 'dark' }} type="date" value={form.dob}
            onChange={e => setForm({ ...form, dob: e.target.value })} />

          <select style={inp} value={form.country} onChange={e => setForm({ ...form, country: e.target.value })}>
            <option value="">Select Country</option>
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <input style={inp} placeholder="State / Province" value={form.state}
            onChange={e => setForm({ ...form, state: e.target.value })} />

          <input style={inp} placeholder="Email Address" type="email" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })} />

          <input style={inp} placeholder="Phone Number (e.g. +2348012345678)" value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })} />

          <select style={inp} value={form.sex} onChange={e => setForm({ ...form, sex: e.target.value })}>
            <option value="">Select Sex</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>

          <select style={inp} value={form.program} onChange={e => setForm({ ...form, program: e.target.value })}>
            <option value="">Select Training Program</option>
            {programs.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
          </select>

          <button
            onClick={submit}
            disabled={submitting}
            style={{
              width: '100%',
              background: submitting ? '#8a6a10' : '#d4a017',
              color: '#050f05',
              padding: '1rem',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: submitting ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
            }}>
            {submitting ? 'Submitting...' : 'Submit Application'}
          </button>

          {msg && (
            <p style={{ marginTop: '1rem', color: isError ? '#f87171' : '#4ade80', textAlign: 'center', lineHeight: 1.6 }}>
              {msg}
            </p>
          )}
        </div>
      </section>
    </>
  )
}