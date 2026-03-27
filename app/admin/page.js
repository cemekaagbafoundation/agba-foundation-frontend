'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function AdminLogin() {
  const [mode, setMode] = useState('login') // login | forgot | sent
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const login = () => {
    if (!password) { setError('Enter your admin password'); return }
    localStorage.setItem('adminToken', password)
    router.push('/admin/dashboard')
  }

  const sendReset = async () => {
    setLoading(true)
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`, {
        email: 'C.emekaagbafoundation@gmail.com'
      })
      setMode('sent')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send reset email')
    }
    setLoading(false)
  }

  const box = { background: '#0d1f0d', border: '1px solid #1e4a1e', borderRadius: '14px', padding: '2.5rem', width: '100%', maxWidth: '400px' }
  const inp = { width: '100%', padding: '0.9rem 1rem', borderRadius: '8px', border: '1px solid #1e4a1e', background: '#091509', color: '#fff', fontSize: '1rem', marginBottom: '1rem', outline: 'none' }
  const btn = { width: '100%', background: '#d4a017', color: '#050f05', padding: '1rem', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }

  return (
    <section style={{ minHeight: '100vh', background: '#050f05', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
      <div style={box}>
        <h2 style={{ color: '#d4a017', textAlign: 'center', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Admin Portal</h2>
        <p style={{ color: '#555', textAlign: 'center', fontSize: '0.85rem', marginBottom: '2rem' }}>Chief Emeka Agba Foundation</p>

        {mode === 'login' && (
          <>
            <input type="password" placeholder="Admin Password" value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && login()}
              style={inp} />
            {error && <p style={{ color: '#f87171', fontSize: '0.85rem', marginBottom: '0.8rem' }}>{error}</p>}
            <button onClick={login} style={btn}>Login</button>
            <button onClick={() => { setMode('forgot'); setError('') }}
              style={{ width: '100%', background: 'transparent', color: '#d4a017', border: 'none', cursor: 'pointer', marginTop: '1rem', fontSize: '0.9rem' }}>
              Forgot Password?
            </button>
          </>
        )}

        {mode === 'forgot' && (
          <>
            <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              A password reset link will be sent to:<br />
              <strong style={{ color: '#d4a017' }}>C.emekaagbafoundation@gmail.com</strong>
            </p>
            {error && <p style={{ color: '#f87171', fontSize: '0.85rem', marginBottom: '0.8rem' }}>{error}</p>}
            <button onClick={sendReset} disabled={loading} style={{ ...btn, background: loading ? '#8a6a10' : '#d4a017' }}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <button onClick={() => setMode('login')}
              style={{ width: '100%', background: 'transparent', color: '#555', border: 'none', cursor: 'pointer', marginTop: '1rem', fontSize: '0.9rem' }}>
              ← Back to Login
            </button>
          </>
        )}

        {mode === 'sent' && (
          <>
            <div style={{ textAlign: 'center', color: '#4ade80', fontSize: '2rem', marginBottom: '1rem' }}>✓</div>
            <p style={{ color: '#aaa', textAlign: 'center', lineHeight: 1.7 }}>
              Reset link sent to <strong style={{ color: '#d4a017' }}>C.emekaagbafoundation@gmail.com</strong>. Check your inbox and follow the link.
            </p>
            <button onClick={() => setMode('login')}
              style={{ ...btn, marginTop: '1.5rem' }}>
              Back to Login
            </button>
          </>
        )}
      </div>
    </section>
  )
}