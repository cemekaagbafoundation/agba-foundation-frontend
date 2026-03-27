'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Gallery() {
  const [images, setImages] = useState([])
  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/gallery`).then(r => setImages(r.data)).catch(() => {})
  }, [])

  return (
    <section style={{ padding: '5rem 3rem', background: '#0a1f0f', borderTop: '1px solid #1a4a20' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <p style={{ color: '#c9911a', letterSpacing: '3px', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.5rem', textAlign: 'center' }}>Moments</p>
        <h2 style={{ color: '#f0f0f0', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: '2.5rem', textAlign: 'center' }}>Photo Gallery</h2>
        {images.length === 0
          ? <p style={{ color: '#7a9e7a', textAlign: 'center' }}>No images uploaded yet.</p>
          : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
              {images.map(img => (
                <div key={img.id} style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid #1a4a20', aspectRatio: '1' }}>
                  <img src={img.image_url} alt="Gallery" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
              ))}
            </div>
        }
      </div>
    </section>
  )
}