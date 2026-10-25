import './globals.css'

export const metadata = {
  title: 'Chief Emeka Agba Foundation',
  description: 'Empowering Nigerian Youths Through Skills and Opportunity',
icons: {
  icon: [
    { url: '/favicon.ico', sizes: 'any' },
    { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
    { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
    { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
  ],
  apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ background: '#091509', color: '#e0e0e0' }}>
        {children}
      </body>
    </html>
  )
}