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
        // Correct endpoint for specialized uploads
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

  // --- REFINED UPLOAD HELPER ---
  const uploadToGallery = async (file) => {
    const fd = new FormData()
    fd.append('image', file)
    const res = await axios.post(`${API}/api/gallery/upload`, fd, {
      headers: { 
        'x-admin-token': localStorage.getItem('adminToken'), 
        'Content-Type': 'multipart/form-data' 
      }
    })
    return res.data.image_url
  }

  const handleGalleryUpload = async () => {
    if (!imageFile) return
    try {
      await uploadToGallery(imageFile)
      const res = await axios.get(`${API}/api/gallery`)
      setGallery(res.data)
      setUploadMsg('Uploaded!'); setTimeout(() => setUploadMsg(''), 3000)
    } catch (err) {
      setUploadMsg('Failed: ' + (err.response?.data?.error || err.message))
    }
  }

  // --- ACTIONS ---
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
    if (!confirm('Delete this application?')) return
    try {
      await axios.delete(`${API}/api/apply/${id}`, { headers: getHeaders() })
      setApplications(applications.filter(a => a.id !== id))
    } catch (err) { console.error(err) }
  }

  const saveProgram = async () => {
    try {
      let image_url = editingProgram?.image_url || ''
      if (programFile) image_url = await uploadToGallery(programFile)
      
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
      if (partnerFile) logo_url = await uploadToGallery(partnerFile)
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

  // --- UI RENDER (Rest of original UI remains) ---
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
          <h1 style={{ color: '#c9911a', fontSize: '1.4rem' }}>Admin Dashboard</h1>
          <button onClick={() => { localStorage.removeItem('adminToken'); router.push('/admin') }} style={btnGhost}>Logout</button>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {tabs.map(t => <button key={t} style={tabBtn(t)} onClick={() => setTab(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>)}
        </div>

        {/* --- TABS --- */}
        {tab === 'applications' && (
          <div>
            <h2 style={{ color: '#c9911a', marginBottom: '1.5rem' }}>Applications</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
                <thead><tr style={{ borderBottom: '1px solid #1a4a20' }}>{['Name', 'Email', 'Phone', 'Program', 'Date', ''].map(h => <th key={h} style={{ textAlign: 'left', padding: '0.5rem' }}>{h}</th>)}</tr></thead>
                <tbody>{applications.map(a => (
                  <tr key={a.id} style={{ borderBottom: '1px solid #0d1f0d' }}>
                    <td style={{ padding: '0.5rem' }}>{a.full_name}</td>
                    <td style={{ padding: '0.5rem' }}>{a.email}</td>
                    <td style={{ padding: '0.5rem' }}>{a.phone}</td>
                    <td style={{ padding: '0.5rem' }}>{a.program}</td>
                    <td style={{ padding: '0.5rem' }}>{new Date(a.created_at).toLocaleDateString()}</td>
                    <td style={{ padding: '0.5rem' }}><button style={btnRed} onClick={() => deleteApplication(a.id)}>🗑</button></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'gallery' && (
          <div>
            <h2 style={{ color: '#c9911a', marginBottom: '1.5rem' }}>Gallery</h2>
            <input type="file" onChange={e => setImageFile(e.target.files[0])} style={{ marginBottom: '1rem', display: 'block' }} />
            <button style={btn} onClick={handleGalleryUpload}>Upload</button>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
              {gallery.map(img => (
                <div key={img.id} style={{ position: 'relative' }}>
                  <img src={img.image_url} style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                  <button onClick={() => deleteGallery(img.id)} style={{ position: 'absolute', top: 0, right: 0, background: 'red', border: 'none', color: 'white', cursor: 'pointer' }}>✕</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'programs' && (
          <div>
            <h2 style={{ color: '#c9911a', marginBottom: '1.5rem' }}>Programs</h2>
            <input style={{ ...inp, width: '100%', marginBottom: '0.5rem' }} placeholder="Name" value={programForm.name} onChange={e => setProgramForm({ ...programForm, name: e.target.value })} />
            <textarea style={{ ...inp, width: '100%', marginBottom: '0.5rem' }} placeholder="Desc" value={programForm.description} onChange={e => setProgramForm({ ...programForm, description: e.target.value })} />
            <input type="file" onChange={e => setProgramFile(e.target.files[0])} style={{ marginBottom: '1rem', display: 'block' }} />
            <button style={btn} onClick={saveProgram}>Save Program</button>
          </div>
        )}

        {tab === 'partners' && (
          <div>
            <h2 style={{ color: '#c9911a', marginBottom: '1.5rem' }}>Partners</h2>
            <input style={{ ...inp, width: '100%', marginBottom: '0.5rem' }} placeholder="Name" value={partnerForm.name} onChange={e => setPartnerForm({ ...partnerForm, name: e.target.value })} />
            <input type="file" onChange={e => setPartnerFile(e.target.files[0])} style={{ marginBottom: '1rem', display: 'block' }} />
            <button style={btn} onClick={savePartner}>Add Partner</button>
          </div>
        )}

        {tab === 'content' && (
          <div>
            <h2 style={{ color: '#c9911a', marginBottom: '1.5rem' }}>Content & Hero Images</h2>
            <HeroImageUpload section="logo" label="Logo" hint="Navbar Logo" />
            <HeroImageUpload section="main_hero" label="Main Hero" hint="Homepage Banner" />
            <HeroImageUpload section="about_hero" label="Founder Portrait" hint="About Section" />
          </div>
        )}

        {tab === 'impact' && (
          <div>
            <h2 style={{ color: '#c9911a', marginBottom: '1.5rem' }}>Impact Stats</h2>
            <input type="number" style={{ ...inp, width: '100%', marginBottom: '1rem' }} value={stats.youths_trained} onChange={e => setStats({ ...stats, youths_trained: e.target.value })} />
            <button style={btn} onClick={saveStats}>Save Stats</button>
          </div>
        )}
      </div>
    </section>
  )
}