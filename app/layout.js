import './globals.css'

export const metadata = {
  title: 'Chief Emeka Agba Foundation',
  description: 'Empowering Nigerian Youths Through Skills and Opportunity',
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