'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import axios from 'axios'

function ResetForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const [tokenValid, setTokenValid] = useState(null)
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [msg, setMsg] = useState('')
  const [isError, setIsError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!token) { setTokenValid(false); return }
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-token?token=${token}`)
      .then(r => setTokenValid(r.data.valid))
      .catch(() => setTokenValid(false))
  }, [token])

  const reset = async () => {
    if (!newPassword || newPassword.length < 6) {
      setMsg('Password must be at least 6 characters.'); setIsError(true); return
    }
    if (newPassword !== confirm) {
      setMsg('Passwords do not match.'); setIsError(true); return
    }
    setLoading(true)
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`, { token, newPassword })
      setDone(true); setMsg(''); setIsError(false)
    } catch (err) {
      setMsg(err.response?.data?.error || 'Reset failed.'); setIsError(true)
    }
    setLoading(false)
  }

  const box = { background: '#0f2d16', border: '1px solid #1a4a20', borderRadius: '14px', padding: '2.5rem', width: '100%', maxWidth: '420px' }
  const inp = { width: '100%', padding: '0.9rem 1rem', borderRadius: '8px', border: '1px solid #1a4a20', background: '#061209', color: '#f0f0f0', fontSize: '1rem', marginBottom: '1rem', outline: 'none' }
  const btn = { width: '100%', background: '#c9911a', color: '#061209', padding: '1rem', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }

  return (
    <section style={{ minHeight: '100vh', background: '#061209', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
      <div style={box}>
        <h2 style={{ color: '#c9911a', textAlign: 'center', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Reset Password</h2>
        <p style={{ color: '#7a9e7a', textAlign: 'center', fontSize: '0.85rem', marginBottom: '2rem' }}>Chief Emeka Agba Foundation</p>

        {tokenValid === null && <p style={{ color: '#7a9e7a', textAlign: 'center' }}>Verifying link...</p>}

        {tokenValid === false && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#f87171', fontSize: '2rem', marginBottom: '1rem' }}>✕</div>
            <p style={{ color: '#f87171', marginBottom: '1.5rem' }}>This reset link is invalid or has expired.</p>
            <button onClick={() => router.push('/admin')} style={btn}>Back to Login</button>
          </div>
        )}

        {tokenValid === true && !done && (
          <>
            <input type="password" placeholder="New Password (min 6 chars)" value={newPassword}
              onChange={e => setNewPassword(e.target.value)} style={inp} />
            <input type="password" placeholder="Confirm New Password" value={confirm}
              onChange={e => setConfirm(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && reset()}
              style={inp} />
            {msg && <p style={{ color: isError ? '#f87171' : '#4ade80', fontSize: '0.85rem', marginBottom: '0.8rem' }}>{msg}</p>}
            <button onClick={reset} disabled={loading} style={{ ...btn, background: loading ? '#8a6a10' : '#c9911a' }}>
              {loading ? 'Resetting...' : 'Set New Password'}
            </button>
          </>
        )}

        {done && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#4ade80', fontSize: '2rem', marginBottom: '1rem' }}>✓</div>
            <p style={{ color: '#c8dcc8', lineHeight: 1.7, marginBottom: '0.5rem' }}>Password reset successful!</p>
            <p style={{ color: '#7a9e7a', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Check your email for the new password, then update <strong style={{ color: '#c9911a' }}>ADMIN_SECRET</strong> in Railway.</p>
            <button onClick={() => router.push('/admin')} style={btn}>Go to Login</button>
          </div>
        )}
      </div>
    </section>
  )
}

export default function ResetPassword() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#061209', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7a9e7a' }}>Loading...</div>}>
      <ResetForm />
    </Suspense>
  )
}