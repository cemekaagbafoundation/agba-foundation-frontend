'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function VideoSection() {
  const [url, setUrl] = useState('https://www.youtube.com/embed/dQw4w9WgXcQ')
  const [writeup, setWriteup] = useState('Watch how the Chief Emeka Agba Foundation is transforming lives across Nigeria through our landmark programs and initiatives.')

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/content`).then(r => {
      const yt = r.data.find(c => c.section_name === 'youtube_url')
      const wu = r.data.find(c => c.section_name === 'impact_writeup')
      if (yt) setUrl(yt.content)
      if (wu) setWriteup(wu.content)
    }).catch(() => {})
  }, [])

  return (
    <section style={{ padding: '5rem 3rem', background: '#061209', borderTop: '1px solid #1a4a20' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <p style={{ color: '#c9911a', letterSpacing: '3px', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.5rem', textAlign: 'center' }}>See Our Work</p>
        <h2 style={{ color: '#f0f0f0', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: '3rem', textAlign: 'center' }}>Project Impact</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: '14px', overflow: 'hidden', border: '1px solid #1a4a20' }}>
            <iframe src={url} title="Impact Video" frameBorder="0" allowFullScreen
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
          </div>
          <div>
            <h3 style={{ color: '#c9911a', fontSize: '1.2rem', marginBottom: '1.2rem', lineHeight: 1.4 }}>
              Chief Emeka Agba Youths Transformation City
            </h3>
            <p style={{ color: '#c8dcc8', lineHeight: 1.9, fontSize: '1rem' }}>{writeup}</p>
          </div>
        </div>
      </div>
    </section>
  )
}