'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

const API = process.env.NEXT_PUBLIC_API_URL

function HeroImageUpload({ section, label, hint }) {
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState('')
  const [currentImg, setCurrentImg] = useState('')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    axios.get(`${API}/api/hero-images`)
      .then(r => {
        const item = r.data.find(h => h.section === section)
        if (item) {
          setCurrentImg(item.image_url || '')
          setTitle(item.title || '')
        }
      }).catch(() => {})
  }, [])

  const save = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      let image_url = currentImg

      if (file) {
        const fd = new FormData()
        fd.append('image', file)
        if (title) fd.append('title', title)
        const res = await axios.post(
          `${API}/api/hero-images/upload/${section}`,
          fd,
          { headers: { 'x-admin-token': token, 'Content-Type': 'multipart/form-data' } }
        )
        image_url = res.data.image_url
        setCurrentImg(image_url)
      } else {
        await axios.put(
          `${API}/api/hero-images/${section}`,
          { image_url, title },
          { headers: { 'x-admin-token': token } }
        )
      }
      setMsg('Saved!'); setTimeout(() => setMsg(''), 3000)
    } catch (err) {
      setMsg('Error: ' + (err.response?.data?.error || err.message))
    }
  }

  const inp2 = {
    padding: '0.7rem', borderRadius: '7px', border: '1px solid #1a4a20',
    background: '#061209', color: '#fff', fontSize: '0.9rem', outline: 'none',
    width: '100%', marginBottom: '0.8rem', display: 'block'
  }

  return (
    <div style={{ background: '#0d1f0d', border: '1px solid #1a4a20', borderRadius: '10px', padding: '1.2rem', marginBottom: '1rem' }}>
      <label style={{ color: '#c9911a', fontSize: '0.85rem', display: 'block', marginBottom: '0.2rem', fontWeight: 'bold' }}>{label}</label>
      <p style={{ color: '#7a9e7a', fontSize: '0.78rem', marginBottom: '0.8rem' }}>{hint}</p>
      {currentImg && (
        <img src={currentImg} alt={label} style={{ height: '80px', objectFit: 'contain', marginBottom: '0.8rem', borderRadius: '6px', display: 'block', border: '1px solid #1a4a20' }} />
      )}
      <input style={inp2} placeholder={`Title / Name for ${label}`} value={title} onChange={e => setTitle(e.target.value)} />
      <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} style={{ color: '#c8dcc8', marginBottom: '0.8rem', display: 'block' }} />
      <button onClick={save} style={{ background: '#c9911a', color: '#061209', border: 'none', borderRadius: '7px', padding: '0.6rem 1.2rem', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' }}>
        💾 Save {label}
      </button>
      {msg && <span style={{ color: msg.startsWith('Error') ? '#f87171' : '#4ade80', marginLeft: '1rem', fontSize: '0.85rem' }}>{msg}</span>}
    </div>
  )
}

export default function Dashboard() {
  const router = useRouter()
  const [tab, setTab] = useState('applications')

  const [applications, setApplications] = useState([])
  const [filteredApps, setFilteredApps] = useState([])
  const [newsletters, setNewsletters] = useState([])
  const [donations, setDonations] = useState([])
  const [messages, setMessages] = useState([])
  const [filteredMsgs, setFilteredMsgs] = useState([])
  const [gallery, setGallery] = useState([])
  const [programs, setPrograms] = useState([])
  const [partners, setPartners] = useState([])
  const [content, setContent] = useState({})

  const [appSearch, setAppSearch] = useState('')
  const [appFilterCountry, setAppFilterCountry] = useState('')
  const [appFilterSex, setAppFilterSex] = useState('')
  const [appFilterProgram, setAppFilterProgram] = useState('')
  const [appFilterDate, setAppFilterDate] = useState('')

  const [msgSearch, setMsgSearch] = useState('')
  const [msgFilterDate, setMsgFilterDate] = useState('')

  const [imageFile, setImageFile] = useState(null)
  const [uploadMsg, setUploadMsg] = useState('')
  const [stats, setStats] = useState({ youths_trained: 0, programs_completed: 0, jobs_created: 0, funds_utilized: 0 })
  const [statsMsg, setStatsMsg] = useState('')
  const [contentEdits, setContentEdits] = useState({})
  const [contentMsg, setContentMsg] = useState('')
  const [copied, setCopied] = useState('')

  const [programForm, setProgramForm] = useState({ name: '', description: '' })
  const [programFile, setProgramFile] = useState(null)
  const [programMsg, setProgramMsg] = useState('')
  const [editingProgram, setEditingProgram] = useState(null)

  const [partnerForm, setPartnerForm] = useState({ name: '', website: '', type: 'partner' })
  const [partnerFile, setPartnerFile] = useState(null)
  const [partnerMsg, setPartnerMsg] = useState('')

  const getHeaders = () => ({ 'x-admin-token': localStorage.getItem('adminToken') })

  useEffect(() => {
    const t = localStorage.getItem('adminToken')
      || sessionStorage.getItem('adminToken')
      || document.cookie.split('; ').find(r => r.startsWith('adminToken='))?.split('=')[1]
    if (!t) { router.push('/admin'); return }
    loadAll(t)
  }, [])

  const loadAll = async (t) => {
    const h = { 'x-admin-token': t || localStorage.getItem('adminToken') }
    const safe = (p) => p.catch(() => ({ data: [] }))
    const [appsRes, newsRes, donaRes, msgsRes, galRes, progRes, transRes, contentRes, partRes] = await Promise.all([
      safe(axios.get(`${API}/api/apply`, { headers: h })),
      safe(axios.get(`${API}/api/newsletter`, { headers: h })),
      safe(axios.get(`${API}/api/donations`, { headers: h })),
      safe(axios.get(`${API}/api/contact`, { headers: h })),
      safe(axios.get(`${API}/api/gallery`)),
      safe(axios.get(`${API}/api/programs`)),
      safe(axios.get(`${API}/api/transparency`)),
      safe(axios.get(`${API}/api/content`)),
      safe(axios.get(`${API}/api/partners`)),
    ])
    setApplications(appsRes.data || [])
    setFilteredApps(appsRes.data || [])
    setNewsletters(newsRes.data || [])
    setDonations(donaRes.data || [])
    setMessages(msgsRes.data || [])
    setFilteredMsgs(msgsRes.data || [])
    setGallery(galRes.data || [])
    setPrograms(progRes.data || [])
    setPartners(partRes.data || [])
    if (transRes.data) {
      setStats({
        youths_trained: transRes.data.youths_trained || 0,
        programs_completed: transRes.data.programs_completed || 0,
        jobs_created: transRes.data.jobs_created || 0,
        funds_utilized: transRes.data.funds_utilized || 0,
      })
    }
    if (Array.isArray(contentRes.data)) {
      const map = {}
      contentRes.data.forEach(c => { map[c.section_name] = { id: c.id, value: c.content } })
      setContent(map)
      setContentEdits(Object.fromEntries(Object.entries(map).map(([k, v]) => [k, v.value])))
    }
  }

  useEffect(() => {
    let result = [...applications]
    if (appSearch) {
      const q = appSearch.toLowerCase()
      result = result.filter(a =>
        a.full_name?.toLowerCase().includes(q) ||
        a.email?.toLowerCase().includes(q) ||
        a.phone?.toLowerCase().includes(q)
      )
    }
    if (appFilterCountry) result = result.filter(a => a.country === appFilterCountry)
    if (appFilterSex) result = result.filter(a => a.sex === appFilterSex)
    if (appFilterProgram) result = result.filter(a => a.program === appFilterProgram)
    if (appFilterDate) result = result.filter(a => a.created_at?.startsWith(appFilterDate))
    setFilteredApps(result)
  }, [appSearch, appFilterCountry, appFilterSex, appFilterProgram, appFilterDate, applications])

  useEffect(() => {
    let result = [...messages]
    if (msgSearch) {
      const q = msgSearch.toLowerCase()
      result = result.filter(m => m.name?.toLowerCase().includes(q) || m.email?.toLowerCase().includes(q))
    }
    if (msgFilterDate) result = result.filter(m => m.created_at?.startsWith(msgFilterDate))
    setFilteredMsgs(result)
  }, [msgSearch, msgFilterDate, messages])

  const copyText = (text, label) => {
    navigator.clipboard.writeText(text)
    setCopied(label); setTimeout(() => setCopied(''), 2000)
  }

  const saveContent = async (key) => {
    const item = content[key]
    if (!item) return
    try {
      await axios.put(`${API}/api/content/${item.id}`, { content: contentEdits[key] }, { headers: getHeaders() })
      setContentMsg(`${key} saved!`); setTimeout(() => setContentMsg(''), 3000)
    } catch (err) {
      setContentMsg('Error: ' + (err.response?.data?.error || err.message))
    }
  }

  const saveStats = async () => {
    try {
      await axios.put(`${API}/api/transparency/stats`, stats, { headers: getHeaders() })
      setStatsMsg('Stats saved!'); setTimeout(() => setStatsMsg(''), 3000)
    } catch (err) {
      setStatsMsg('Error: ' + (err.response?.data?.error || err.message))
    }
  }

  const uploadFile = async (file) => {
    const fd = new FormData()
    fd.append('image', file)
    const res = await axios.post(`${API}/api/gallery/upload`, fd, {
      headers: { 'x-admin-token': localStorage.getItem('adminToken'), 'Content-Type': 'multipart/form-data' }
    })
    return res.data.image_url
  }

  const uploadGallery = async () => {
    if (!imageFile) return
    try {
      await uploadFile(imageFile)
      const res = await axios.get(`${API}/api/gallery`)
      setGallery(res.data)
      setUploadMsg('Uploaded!'); setTimeout(() => setUploadMsg(''), 3000)
    } catch (err) {
      setUploadMsg('Failed: ' + (err.response?.data?.error || err.message))
    }
  }

  const deleteGallery = async (id) => {
    try {
      await axios.delete(`${API}/api/gallery/${id}`, { headers: getHeaders() })
      setGallery(gallery.filter(g => g.id !== id))
    } catch (err) { console.error(err) }
  }

  const deleteNewsletter = async (id) => {
    try {
      await axios.delete(`${API}/api/newsletter/${id}`, { headers: getHeaders() })
      setNewsletters(newsletters.filter(n => n.id !== id))
    } catch (err) { console.error(err) }
  }

  const deleteApplication = async (id) => {
    if (!confirm('Delete this application? This cannot be undone.')) return
    try {
      await axios.delete(`${API}/api/apply/${id}`, { headers: getHeaders() })
      setApplications(applications.filter(a => a.id !== id))
      setFilteredApps(filteredApps.filter(a => a.id !== id))
    } catch (err) { console.error(err) }
  }

  const saveProgram = async () => {
    try {
      let image_url = editingProgram?.image_url || ''
      if (programFile) image_url = await uploadFile(programFile)
      if (editingProgram) {
        await axios.put(`${API}/api/programs/${editingProgram.id}`, { ...programForm, image_url }, { headers: getHeaders() })
      } else {
        await axios.post(`${API}/api/programs`, { ...programForm, image_url }, { headers: getHeaders() })
      }
      const res = await axios.get(`${API}/api/programs`)
      setPrograms(res.data)
      setProgramForm({ name: '', description: '' }); setProgramFile(null); setEditingProgram(null)
      setProgramMsg('Saved!'); setTimeout(() => setProgramMsg(''), 3000)
    } catch (err) { setProgramMsg('Error: ' + (err.response?.data?.error || err.message)) }
  }

  const deleteProgram = async (id) => {
    if (!confirm('Delete this program?')) return
    try {
      await axios.delete(`${API}/api/programs/${id}`, { headers: getHeaders() })
      setPrograms(programs.filter(p => p.id !== id))
    } catch (err) { console.error(err) }
  }

  const savePartner = async () => {
    try {
      let logo_url = ''
      if (partnerFile) logo_url = await uploadFile(partnerFile)
      await axios.post(`${API}/api/partners`, { ...partnerForm, logo_url }, { headers: getHeaders() })
      const res = await axios.get(`${API}/api/partners`)
      setPartners(res.data)
      setPartnerForm({ name: '', website: '', type: 'partner' }); setPartnerFile(null)
      setPartnerMsg('Partner added!'); setTimeout(() => setPartnerMsg(''), 3000)
    } catch (err) { setPartnerMsg('Error: ' + (err.response?.data?.error || err.message)) }
  }

  const deletePartner = async (id) => {
    try {
      await axios.delete(`${API}/api/partners/${id}`, { headers: getHeaders() })
      setPartners(partners.filter(p => p.id !== id))
    } catch (err) { console.error(err) }
  }

  const tabs = ['applications', 'messages', 'newsletter', 'donations', 'gallery', 'programs', 'partners', 'content', 'impact']
  const tabBtn = (t) => ({
    padding: '0.55rem 1rem', border: '1px solid #1a4a20', borderRadius: '6px', cursor: 'pointer',
    background: tab === t ? '#c9911a' : '#0d1f0d',
    color: tab === t ? '#061209' : '#aaa',
    fontWeight: tab === t ? 'bold' : 'normal', fontSize: '0.82rem',
  })
  const inp = { padding: '0.75rem', borderRadius: '7px', border: '1px solid #1a4a20', background: '#061209', color: '#fff', fontSize: '0.9rem', outline: 'none' }
  const btn = { background: '#c9911a', color: '#061209', border: 'none', borderRadius: '7px', padding: '0.6rem 1.2rem', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' }
  const btnGhost = { background: 'transparent', color: '#c9911a', border: '1px solid #c9911a', borderRadius: '7px', padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.82rem' }
  const btnRed = { background: 'transparent', color: '#f87171', border: '1px solid #f87171', borderRadius: '7px', padding: '0.4rem 0.8rem', cursor: 'pointer', fontSize: '0.78rem' }
  const uniqueVals = (arr, key) => [...new Set(arr.map(a => a[key]).filter(Boolean))]

  return (
    <section style={{ minHeight: '100vh', background: '#061209', color: '#c8dcc8', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h1 style={{ color: '#c9911a', fontSize: '1.4rem' }}>Admin Dashboard — Chief Emeka Agba Foundation</h1>
          <button onClick={() => { localStorage.removeItem('adminToken'); sessionStorage.removeItem('adminToken'); router.push('/admin') }}
            style={{ ...btnGhost, color: '#7a9e7a', borderColor: '#1a4a20' }}>Logout</button>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {tabs.map(t => <button key={t} style={tabBtn(t)} onClick={() => setTab(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>)}
        </div>

        {/* ══ APPLICATIONS ══ */}
        {tab === 'applications' && (
          <div>
            <h2 style={{ color: '#c9911a', marginBottom: '1.5rem' }}>Applications ({filteredApps.length} of {applications.length})</h2>
            <div style={{ background: '#0d1f0d', border: '1px solid #1a4a20', borderRadius: '10px', padding: '1.2rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.8rem', marginBottom: '0.8rem' }}>
                <input style={{ ...inp, width: '100%' }} placeholder="🔍 Search name, email, phone" value={appSearch} onChange={e => setAppSearch(e.target.value)} />
                <select style={{ ...inp, width: '100%' }} value={appFilterCountry} onChange={e => setAppFilterCountry(e.target.value)}>
                  <option value="">All Countries</option>
                  {uniqueVals(applications, 'country').map(v => <option key={v}>{v}</option>)}
                </select>
                <select style={{ ...inp, width: '100%' }} value={appFilterSex} onChange={e => setAppFilterSex(e.target.value)}>
                  <option value="">All Sexes</option>
                  <option>Male</option><option>Female</option><option>Prefer not to say</option>
                </select>
                <select style={{ ...inp, width: '100%' }} value={appFilterProgram} onChange={e => setAppFilterProgram(e.target.value)}>
                  <option value="">All Programs</option>
                  {uniqueVals(applications, 'program').map(v => <option key={v}>{v}</option>)}
                </select>
                <input style={{ ...inp, width: '100%', colorScheme: 'dark' }} type="date" value={appFilterDate} onChange={e => setAppFilterDate(e.target.value)} />
                <button style={btnGhost} onClick={() => { setAppSearch(''); setAppFilterCountry(''); setAppFilterSex(''); setAppFilterProgram(''); setAppFilterDate('') }}>Clear</button>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button style={btn} onClick={() => copyText(applications.map(a => a.email).join(','), 'all-emails')}>
                  {copied === 'all-emails' ? '✓ Copied' : `Copy All Emails (${applications.length})`}
                </button>
                <button style={btnGhost} onClick={() => copyText(applications.map(a => a.phone).join(','), 'all-phones')}>
                  {copied === 'all-phones' ? '✓ Copied' : `Copy All Phones (${applications.length})`}
                </button>
                {filteredApps.length < applications.length && <>
                  <button style={btn} onClick={() => copyText(filteredApps.map(a => a.email).join(','), 'sel-emails')}>
                    {copied === 'sel-emails' ? '✓ Copied' : `Copy Selected (${filteredApps.length})`}
                  </button>
                </>}
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #1a4a20' }}>
                    {['Name', 'Email', 'Phone', 'Program', 'Country', 'Sex', 'Date', ''].map((col, i) => (
                      <th key={i} style={{ padding: '0.7rem 0.5rem', color: '#c9911a', textAlign: 'left', whiteSpace: 'nowrap' }}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredApps.map(a => (
                    <tr key={a.id} style={{ borderBottom: '1px solid #0d1f0d' }}>
                      <td style={{ padding: '0.7rem 0.5rem', whiteSpace: 'nowrap' }}>{a.full_name}</td>
                      <td style={{ padding: '0.7rem 0.5rem' }}>{a.email}</td>
                      <td style={{ padding: '0.7rem 0.5rem', whiteSpace: 'nowrap' }}>{a.phone}</td>
                      <td style={{ padding: '0.7rem 0.5rem' }}>{a.program}</td>
                      <td style={{ padding: '0.7rem 0.5rem' }}>{a.country}</td>
                      <td style={{ padding: '0.7rem 0.5rem' }}>{a.sex}</td>
                      <td style={{ padding: '0.7rem 0.5rem', color: '#7a9e7a', whiteSpace: 'nowrap' }}>{new Date(a.created_at).toLocaleDateString()}</td>
                      <td style={{ padding: '0.7rem 0.5rem' }}>
                        <button style={btnRed} onClick={() => deleteApplication(a.id)}>🗑</button>
                      </td>
                    </tr>
                  ))}
                  {filteredApps.length === 0 && (
                    <tr><td colSpan={8} style={{ padding: '2rem', color: '#7a9e7a', textAlign: 'center' }}>No results</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══ MESSAGES ══ */}
        {tab === 'messages' && (
          <div>
            <h2 style={{ color: '#c9911a', marginBottom: '1.5rem' }}>Messages ({filteredMsgs.length} of {messages.length})</h2>
            <div style={{ background: '#0d1f0d', border: '1px solid #1a4a20', borderRadius: '10px', padding: '1.2rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.8rem', marginBottom: '0.8rem' }}>
                <input style={{ ...inp, width: '100%' }} placeholder="🔍 Search name or email" value={msgSearch} onChange={e => setMsgSearch(e.target.value)} />
                <input style={{ ...inp, width: '100%', colorScheme: 'dark' }} type="date" value={msgFilterDate} onChange={e => setMsgFilterDate(e.target.value)} />
                <button style={btnGhost} onClick={() => { setMsgSearch(''); setMsgFilterDate('') }}>Clear</button>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button style={btn} onClick={() => copyText(messages.map(m => m.email).join(','), 'all-msg-emails')}>
                  {copied === 'all-msg-emails' ? '✓ Copied' : `Copy All Emails (${messages.length})`}
                </button>
                {filteredMsgs.length < messages.length && (
                  <button style={btn} onClick={() => copyText(filteredMsgs.map(m => m.email).join(','), 'sel-msg-emails')}>
                    {copied === 'sel-msg-emails' ? '✓ Copied' : `Copy Selected (${filteredMsgs.length})`}
                  </button>
                )}
              </div>
            </div>
            {filteredMsgs.map(m => (
              <div key={m.id} style={{ background: '#0d1f0d', border: '1px solid #1a4a20', borderRadius: '10px', padding: '1.2rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <span style={{ fontWeight: 'bold', color: '#f0f0f0' }}>{m.name}</span>
                    <span style={{ color: '#7a9e7a', fontSize: '0.85rem', marginLeft: '0.8rem' }}>{m.email}</span>
                  </div>
                  <span style={{ color: '#7a9e7a', fontSize: '0.8rem' }}>{new Date(m.created_at).toLocaleDateString()}</span>
                </div>
                <p style={{ color: '#c8dcc8', lineHeight: 1.7, fontSize: '0.95rem' }}>{m.message}</p>
              </div>
            ))}
            {filteredMsgs.length === 0 && <p style={{ color: '#7a9e7a' }}>No messages found.</p>}
          </div>
        )}

        {/* ══ NEWSLETTER ══ */}
        {tab === 'newsletter' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.8rem' }}>
              <h2 style={{ color: '#c9911a' }}>Subscribers ({newsletters.length})</h2>
              <button style={btn} onClick={() => copyText(newsletters.map(n => n.email).join(','), 'news')}>
                {copied === 'news' ? '✓ Copied' : 'Copy All Emails'}
              </button>
            </div>
            {newsletters.map(n => (
              <div key={n.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.7rem 0', borderBottom: '1px solid #0d1f0d', fontSize: '0.9rem' }}>
                <span>{n.email}</span>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span style={{ color: '#7a9e7a', fontSize: '0.8rem' }}>{new Date(n.created_at).toLocaleDateString()}</span>
                  <button style={btnRed} onClick={() => deleteNewsletter(n.id)}>🗑 Delete</button>
                </div>
              </div>
            ))}
            {newsletters.length === 0 && <p style={{ color: '#7a9e7a' }}>No subscribers yet.</p>}
          </div>
        )}

        {/* ══ DONATIONS ══ */}
        {tab === 'donations' && (
          <div>
            <h2 style={{ color: '#c9911a', marginBottom: '1.5rem' }}>Donations ({donations.length})</h2>
            {donations.map(d => (
              <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #0d1f0d', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div style={{ fontWeight: '600', color: '#f0f0f0' }}>{d.name || 'Anonymous'}</div>
                  <div style={{ color: '#7a9e7a', fontSize: '0.85rem' }}>{d.email} · {new Date(d.created_at).toLocaleDateString()}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#c9911a', fontWeight: 'bold' }}>₦{Number(d.amount).toLocaleString()}</div>
                  <span style={{ fontSize: '0.78rem', color: d.status === 'success' ? '#4ade80' : '#f87171', background: d.status === 'success' ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)', padding: '2px 8px', borderRadius: '20px' }}>{d.status}</span>
                </div>
              </div>
            ))}
            {donations.length === 0 && <p style={{ color: '#7a9e7a' }}>No donations yet.</p>}
          </div>
        )}

        {/* ══ GALLERY ══ */}
        {tab === 'gallery' && (
          <div>
            <h2 style={{ color: '#c9911a', marginBottom: '0.3rem' }}>Photo Gallery</h2>
            <p style={{ color: '#7a9e7a', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Only photos uploaded here appear in the public gallery. Hero images, logo and portraits are managed under the <strong style={{ color: '#c9911a' }}>Content</strong> tab.
            </p>
            <div style={{ background: '#0d1f0d', border: '1px solid #1a4a20', borderRadius: '10px', padding: '1.5rem', marginBottom: '2rem' }}>
              <p style={{ color: '#7a9e7a', marginBottom: '1rem', fontSize: '0.9rem' }}>Upload new gallery photo:</p>
              <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} style={{ color: '#c8dcc8', marginBottom: '1rem', display: 'block' }} />
              <button style={btn} onClick={uploadGallery}>Upload to Gallery</button>
              {uploadMsg && <span style={{ color: uploadMsg.startsWith('Failed') ? '#f87171' : '#4ade80', marginLeft: '1rem', fontSize: '0.9rem' }}>{uploadMsg}</span>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
              {gallery.map(img => (
                <div key={img.id} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid #1a4a20' }}>
                  <img src={img.image_url} alt="Gallery" style={{ width: '100%', height: '130px', objectFit: 'cover' }} />
                  <button onClick={() => deleteGallery(img.id)} style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(200,0,0,0.9)', color: '#fff', border: 'none', borderRadius: '50%', width: 26, height: 26, cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                </div>
              ))}
              {gallery.length === 0 && <p style={{ color: '#7a9e7a' }}>No gallery photos yet.</p>}
            </div>
          </div>
        )}

        {/* ══ PROGRAMS ══ */}
        {tab === 'programs' && (
          <div>
            <h2 style={{ color: '#c9911a', marginBottom: '1.5rem' }}>Programs Management</h2>
            <div style={{ background: '#0d1f0d', border: '1px solid #1a4a20', borderRadius: '10px', padding: '1.5rem', marginBottom: '2rem' }}>
              <h3 style={{ color: '#f0f0f0', marginBottom: '1rem' }}>{editingProgram ? 'Edit Program' : 'Add New Program'}</h3>
              <input style={{ ...inp, width: '100%', marginBottom: '0.8rem', display: 'block' }} placeholder="Program Name" value={programForm.name} onChange={e => setProgramForm({ ...programForm, name: e.target.value })} />
              <textarea style={{ ...inp, width: '100%', minHeight: '80px', marginBottom: '0.8rem', display: 'block', resize: 'vertical' }} placeholder="Program Description" value={programForm.description} onChange={e => setProgramForm({ ...programForm, description: e.target.value })} />
              <label style={{ color: '#7a9e7a', fontSize: '0.85rem', display: 'block', marginBottom: '0.4rem' }}>Program Image:</label>
              <input type="file" accept="image/*" onChange={e => setProgramFile(e.target.files[0])} style={{ color: '#c8dcc8', marginBottom: '1rem', display: 'block' }} />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button style={btn} onClick={saveProgram}>💾 {editingProgram ? 'Save Changes' : 'Add Program'}</button>
                {editingProgram && <button style={btnGhost} onClick={() => { setEditingProgram(null); setProgramForm({ name: '', description: '' }) }}>Cancel</button>}
              </div>
              {programMsg && <span style={{ color: programMsg.startsWith('Error') ? '#f87171' : '#4ade80', marginTop: '0.5rem', display: 'block' }}>{programMsg}</span>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
              {programs.map(p => (
                <div key={p.id} style={{ background: '#0d1f0d', border: '1px solid #1a4a20', borderRadius: '10px', overflow: 'hidden' }}>
                  {p.image_url && <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '120px', objectFit: 'cover' }} />}
                  <div style={{ padding: '1rem' }}>
                    <div style={{ color: '#f0f0f0', fontWeight: 'bold', marginBottom: '0.4rem' }}>{p.name}</div>
                    <div style={{ color: '#7a9e7a', fontSize: '0.85rem', marginBottom: '1rem' }}>{p.description}</div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button style={btnGhost} onClick={() => { setEditingProgram(p); setProgramForm({ name: p.name, description: p.description }) }}>✏️ Edit</button>
                      <button style={btnRed} onClick={() => deleteProgram(p.id)}>🗑 Delete</button>
                    </div>
                  </div>
                </div>
              ))}
              {programs.length === 0 && <p style={{ color: '#7a9e7a' }}>No programs yet.</p>}
            </div>
          </div>
        )}

        {/* ══ PARTNERS ══ */}
        {tab === 'partners' && (
          <div>
            <h2 style={{ color: '#c9911a', marginBottom: '0.5rem' }}>Strategic Partners & Sponsors</h2>
            <p style={{ color: '#7a9e7a', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              📧 <a href="mailto:partners@chiefemekaagbafoundation.com" style={{ color: '#c9911a' }}>partners@chiefemekaagbafoundation.com</a>
            </p>
            <div style={{ background: '#0d1f0d', border: '1px solid #1a4a20', borderRadius: '10px', padding: '1.5rem', marginBottom: '2rem' }}>
              <h3 style={{ color: '#f0f0f0', marginBottom: '1rem' }}>Add Partner / Sponsor</h3>
              <input style={{ ...inp, width: '100%', marginBottom: '0.8rem', display: 'block' }} placeholder="Organisation Name" value={partnerForm.name} onChange={e => setPartnerForm({ ...partnerForm, name: e.target.value })} />
              <input style={{ ...inp, width: '100%', marginBottom: '0.8rem', display: 'block' }} placeholder="Website URL (optional)" value={partnerForm.website} onChange={e => setPartnerForm({ ...partnerForm, website: e.target.value })} />
              <select style={{ ...inp, width: '100%', marginBottom: '0.8rem', display: 'block' }} value={partnerForm.type} onChange={e => setPartnerForm({ ...partnerForm, type: e.target.value })}>
                <option value="partner">Strategic Partner</option>
                <option value="sponsor">Sponsor</option>
                <option value="csr">Corporate CSR</option>
              </select>
              <label style={{ color: '#7a9e7a', fontSize: '0.85rem', display: 'block', marginBottom: '0.4rem' }}>Logo Image:</label>
              <input type="file" accept="image/*" onChange={e => setPartnerFile(e.target.files[0])} style={{ color: '#c8dcc8', marginBottom: '1rem', display: 'block' }} />
              <button style={btn} onClick={savePartner}>💾 Add Partner</button>
              {partnerMsg && <span style={{ color: partnerMsg.startsWith('Error') ? '#f87171' : '#4ade80', marginLeft: '1rem' }}>{partnerMsg}</span>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
              {partners.map(p => (
                <div key={p.id} style={{ background: '#0d1f0d', border: '1px solid #1a4a20', borderRadius: '10px', padding: '1rem' }}>
                  {p.logo_url && <img src={p.logo_url} alt={p.name} style={{ height: '60px', objectFit: 'contain', marginBottom: '0.5rem', display: 'block' }} />}
                  <div style={{ color: '#f0f0f0', fontWeight: 'bold' }}>{p.name}</div>
                  <div style={{ color: '#c9911a', fontSize: '0.78rem', textTransform: 'uppercase', margin: '0.3rem 0' }}>{p.type}</div>
                  {p.website && <a href={p.website} target="_blank" style={{ color: '#7a9e7a', fontSize: '0.8rem', display: 'block', marginBottom: '0.5rem' }}>{p.website}</a>}
                  <button style={btnRed} onClick={() => deletePartner(p.id)}>🗑 Delete</button>
                </div>
              ))}
              {partners.length === 0 && <p style={{ color: '#7a9e7a' }}>No partners yet.</p>}
            </div>
          </div>
        )}

        {/* ══ CONTENT ══ */}
        {tab === 'content' && (
          <div>
            <h2 style={{ color: '#c9911a', marginBottom: '0.5rem' }}>Content Management</h2>
            <p style={{ color: '#7a9e7a', fontSize: '0.9rem', marginBottom: '2rem' }}>Edit text content and manage all section images.</p>
            {contentMsg && <p style={{ color: contentMsg.startsWith('Error') ? '#f87171' : '#4ade80', marginBottom: '1rem' }}>{contentMsg}</p>}

            {[
              { key: 'hero', label: 'Hero Tagline' },
              { key: 'about', label: 'About Writeup' },
              { key: 'impact_writeup', label: 'Project Impact Writeup' },
              { key: 'youtube_url', label: 'YouTube Embed URL' },
              { key: 'privacy_policy', label: 'Privacy Policy' },
              { key: 'terms_of_service', label: 'Terms of Service' },
              { key: 'strategic_partners', label: 'Partners Section Note' },
            ].map(item => (
              <div key={item.key} style={{ background: '#0d1f0d', border: '1px solid #1a4a20', borderRadius: '10px', padding: '1.2rem', marginBottom: '1rem' }}>
                <label style={{ color: '#c9911a', fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>{item.label}</label>
                <textarea
                  style={{ ...inp, width: '100%', minHeight: item.key.includes('policy') || item.key.includes('service') ? '150px' : '70px', resize: 'vertical', display: 'block', marginBottom: '0.8rem' }}
                  value={contentEdits[item.key] || ''}
                  onChange={e => setContentEdits({ ...contentEdits, [item.key]: e.target.value })}
                />
                <button style={btn} onClick={() => saveContent(item.key)}>💾 Save {item.label}</button>
              </div>
            ))}

            <div style={{ borderTop: '1px solid #1a4a20', paddingTop: '1.5rem', marginTop: '1.5rem', marginBottom: '1rem' }}>
              <h3 style={{ color: '#c9911a', marginBottom: '1.5rem' }}>Image & Logo Management</h3>
              <p style={{ color: '#7a9e7a', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                These images appear only in their designated sections — they do NOT appear in the photo gallery.
              </p>
            </div>

            <HeroImageUpload section="logo" label="Foundation Logo" hint="Appears in the Navbar beside the foundation name" />
            <HeroImageUpload section="main_hero" label="Main Hero Image" hint="Large image on the homepage hero section (right side)" />
            <HeroImageUpload section="about_hero" label="Founder Portrait (About Section)" hint="Portrait photo in the About section — add founder name in Title field" />
            <HeroImageUpload section="transformation_hero" label="Youth Transformation City Image" hint="Image in the Chief Emeka Agba Youth Transformation City section" />

            {contentEdits['youtube_url'] && (
              <div style={{ background: '#0d1f0d', border: '1px solid #1a4a20', borderRadius: '10px', padding: '1.2rem', marginTop: '1rem' }}>
                <label style={{ color: '#c9911a', fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>YouTube Preview</label>
                <div style={{ borderRadius: '8px', overflow: 'hidden', aspectRatio: '16/9' }}>
                  <iframe src={contentEdits['youtube_url']} width="100%" height="100%" frameBorder="0" allowFullScreen />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ IMPACT ══ */}
        {tab === 'impact' && (
          <div style={{ maxWidth: '500px' }}>
            <h2 style={{ color: '#c9911a', marginBottom: '0.5rem' }}>Impact Stats — Transparency Page</h2>
            <p style={{ color: '#7a9e7a', fontSize: '0.9rem', marginBottom: '2rem' }}>These numbers show publicly on the Transparency page and update within 15 seconds.</p>
            {[
              { key: 'youths_trained', label: 'Youths Trained' },
              { key: 'programs_completed', label: 'Programs Completed' },
              { key: 'jobs_created', label: 'Jobs Created' },
              { key: 'funds_utilized', label: 'Funds Utilized (₦)' },
            ].map(field => (
              <div key={field.key} style={{ marginBottom: '1rem' }}>
                <label style={{ color: '#7a9e7a', fontSize: '0.85rem', display: 'block', marginBottom: '0.3rem' }}>{field.label}</label>
                <input type="number" style={{ ...inp, width: '100%' }} value={stats[field.key]} onChange={e => setStats({ ...stats, [field.key]: e.target.value })} />
              </div>
            ))}
            <button style={btn} onClick={saveStats}>💾 Save Stats</button>
            {statsMsg && <span style={{ color: statsMsg.startsWith('Error') ? '#f87171' : '#4ade80', marginLeft: '1rem' }}>{statsMsg}</span>}
          </div>
        )}

      </div>
    </section>
  )
}