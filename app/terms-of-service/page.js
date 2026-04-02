'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from '../../components/Navbar'
import Link from 'next/link'

export default function TermsOfService() {
  const [content, setContent] = useState('Loading...')

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/content`)
      .then(r => {
        const item = r.data.find(c => c.section_name === 'terms_of_service')
        if (item?.content) setContent(item.content)
        else setContent('Terms of service content will be added soon.')
      })
      .catch(() => setContent('Terms of service content will be added soon.'))
  }, [])

  return (
    <>
      <Navbar />
      <section style={{ minHeight: '100vh', background: '#091509', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Link href="/" style={{ color: '#c9911a', fontSize: '0.9rem', display: 'inline-block', marginBottom: '2rem' }}>
            ← Back to Home
          </Link>
          <h1 style={{ color: '#c9911a', fontSize: '2rem', marginBottom: '2rem' }}>Terms of Service</h1>
          <div style={{ color: '#c8dcc8', lineHeight: 1.9, fontSize: '1rem', whiteSpace: 'pre-wrap' }}>
            {content}
          </div>
          <div style={{ marginTop: '3rem', padding: '1.5rem', background: '#0d1f0d', border: '1px solid #1a4a20', borderRadius: '10px' }}>
            <p style={{ color: '#7a9e7a', fontSize: '0.85rem' }}>
              📧 Questions about these terms?{' '}
              <a href="mailto:info@chiefemekaagbafoundation.com" style={{ color: '#c9911a' }}>
                info@chiefemekaagbafoundation.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}