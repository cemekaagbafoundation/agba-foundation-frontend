export default function About() {
  return (
    <section id="about" style={{ padding: '5rem 3rem', background: '#061209', borderTop: '1px solid #1a4a20' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <p style={{ color: '#c9911a', letterSpacing: '3px', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.5rem', textAlign: 'center' }}>Who We Are</p>
        <h2 style={{ color: '#f0f0f0', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: '3rem', textAlign: 'center' }}>About the Foundation</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
          <div>
            <p style={{ color: '#c8dcc8', lineHeight: 1.9, fontSize: '1.05rem', marginBottom: '1.5rem' }}>
              The Chief Emeka Agba Foundation is dedicated to youth empowerment across Nigeria. We provide free digital skills training, entrepreneurship education, and agricultural programs to equip young Nigerians with the tools they need to build sustainable livelihoods.
            </p>
            <p style={{ color: '#7a9e7a', lineHeight: 1.9, fontSize: '1rem' }}>
              Through our Street to Skill Initiative, we reach the most vulnerable young people, giving them access to world-class training, mentorship networks, and job placement support regardless of background.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '100%', maxWidth: '300px', aspectRatio: '3/4',
              borderRadius: '12px', overflow: 'hidden',
              background: '#0f2d16', border: '1px solid #1a4a20',
            }}>
              <img src="/founder.jpg" alt="Chief Emeka Agba"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                onError={e => e.target.style.display = 'none'} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#f0f0f0', fontWeight: 'bold', fontSize: '1.05rem' }}>Chief Emeka Agba</div>
              <div style={{ color: '#c9911a', fontSize: '0.85rem', marginTop: '0.3rem' }}>Founder — Chief Emeka Agba Foundation</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}